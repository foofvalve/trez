const db = require('@arangodb').db;
const joi = require('joi');

const resultSchema = joi.object().required().keys({
  testName: joi.string().required(),
  testSuite: joi.string().required(),
  execution: joi.number().required(),
  outcome: joi.string().regex(/[fF]ailed|[wW]arning|[Pp]assed|[Ss]kipped|[Ii]nconclusive/).required(),
  stacktrace: joi.string().optional(),
  message: joi.string().optional(),
  project: joi.string().required(),
  execution_nice: joi.number().optional(),
  testType: joi.string().required()
}).unknown(); // allow additional attributes

module.exports = {
  getTrend() {
    // get execution date dates for the last 7
    var executionDates = this.getExecutionDates()[0];    
    if(executionDates.length == 0) {
      return [];
    }

    var rez = [];
    for(var i =0; i <= 6; i++){
      if(executionDates[i] != undefined) {
        rez[i] = this.getTestResultsForDate(executionDates[i]);
      } else {
        rez[i] = [];
      }
    }

    // build the matrix
    var summary = [];

    var testCaseNames = this.getTestCaseNames({
      from: executionDates[executionDates.length - 1],
      to: executionDates[0]
    });

    testCaseNames.forEach((testFully) => {
      var test = testFully.full_test
      summary.push({
        "test_name" : test,
        "a": this.getTestOutcome(test, rez[6]),
        "b": this.getTestOutcome(test, rez[5]),
        "c": this.getTestOutcome(test, rez[4]),
        "d": this.getTestOutcome(test, rez[3]),
        "e": this.getTestOutcome(test, rez[2]),
        "f": this.getTestOutcome(test, rez[1]),
        "g": this.getTestOutcome(test, rez[0])
      })
    })

    return summary;
  },
  getTestOutcome(testName, results) {
    var result = results.filter((e) => e.full_qualified == testName);
  
    if (typeof result !== 'undefined' && result.length > 0) {
      return result[0].outcome;
    } else {
      return '';
    }
  },
  getTestResultsForDate(executionDate) { 
    const q = db._createStatement({
      'query': `
      FOR doc in testResults
      FILTER doc.execution_date == @executionDate
      RETURN {
          full_qualified: CONCAT(doc.testSuite," - ", doc.testName),
          outcome: doc.outcome
      }
      `
    });
    q.bind('executionDate', executionDate);
    return q.execute().toArray();  
  },    
  getTestCaseNames(options) { 
    const q = db._createStatement({
      'query': `
      FOR doc in testResults
        SORT CONCAT(doc.testSuite," - ", doc.testName)
        FILTER DATE_ISO8601(doc.execution) >=  DATE_ISO8601(@from) && DATE_ISO8601(doc.execution) <=  DATE_ISO8601(@to)
        RETURN distinct { full_test: CONCAT(doc.testSuite," - ", doc.testName) }
      `
    });
    q.bind('from', options.from);
    q.bind('to', options.to);
    return q.execute().toArray();  
  },   
  getExecutionDates() { 
    const q = db._createStatement({
      'query': `
      LET n = (FOR doc IN testResults
        SORT DATE_ISO8601(doc.execution) desc 
        RETURN DISTINCT doc.execution_date)
    
        LET dates = (FOR k in n LIMIT 7 RETURN k)

        RETURN dates
      `
    });

    return q.execute().toArray();  
  },  
  getResults(options) { 
    console.log(`options => ${JSON.stringify(options)}`);
    
    var filter = `LOWER(doc.project) == @project 
                  && DATE_ISO8601(doc.execution) >= DATE_ISO8601(@from) 
                  && DATE_ISO8601(doc.execution) <= DATE_ISO8601(@to) `;
    if (options.build != null) {
      filter += '&& doc.meta[*].build == [@build]';
    }

    var qStr = `
    LET base_results = (FOR doc IN testResults
      SORT CONCAT(doc.testSuite," - ", doc.testName)
      FILTER ${filter}     
      RETURN doc)

    LET stat_summary = (FOR doc IN base_results          
      COLLECT outcome = doc.outcome  WITH COUNT INTO count
      RETURN { 
      outcome, 
      count
    })
    
    LET suite_summary = (FOR doc IN base_results          
      COLLECT testsuite = doc.testSuite, outcome = doc.outcome  WITH COUNT INTO count
      RETURN {  
        testsuite, 
        outcome, 
        count
    })  
    
    LET test_results = (
        FOR u IN base_results            
        RETURN {
            test_suite:u.testSuite, 
            test_name:u.testName, 
            outcome: u.outcome
        }
    )

    LET failures = (FOR doc IN testResults
        SORT doc.testSuite
        FILTER doc.outcome == 'failed' && ${filter}  
        RETURN {
          testSuite: doc.testSuite
          , testName: doc.testName
          , message: doc.message
          , stacktrace: doc.stacktrace 
        })
    
    LET tests_details = (
      FOR doc IN base_results           
      RETURN UNSET(doc, "_key", "_id", "_rev"))

    LET build_info = (FOR doc IN testResults
      SORT doc.meta[*].build
      FILTER Length(CONCAT(doc.meta[*].build,''))  > 4 && ${filter} 
      RETURN distinct {build: doc.meta[*].build})
    
    RETURN { 
        stat_summary: MERGE(
            FOR u IN stat_summary
            RETURN { [ u.outcome ]: u.count }), 
        suite_summary : suite_summary,
        tests_results: test_results,
        test_details: tests_details,
        test_failures: failures,
        build_number: build_info
    }  
  `
    console.log('query string=> ', qStr)

    const q = db._createStatement({
      'query': qStr
    });
    q.bind('project', options.project.toLowerCase());
    q.bind('from', options.from);
    q.bind('to', options.to);
    if (options.build != null) {
      q.bind('build', options.build.toLowerCase());
    }
    //q.bind('show_details', options.show_details);    
  
    return q.execute().toArray();  
  },  
  getTestResultId(options) { 
    const q = db._createStatement({
      'query': `
      FOR doc IN testResults
      FILTER doc.testName == @testName && doc.testSuite ==@testSuite && doc.execution_date == @execution_date
      RETURN doc
      `
    });
    q.bind('testName', options.testName);
    q.bind('testSuite', options.testSuite);

    var execDate = options.execution.split('T')[0];
    q.bind('execution_date', execDate);
  
    return q.execute().toArray();  
  }
};