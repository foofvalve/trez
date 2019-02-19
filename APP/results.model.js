const db = require('@arangodb').db;
const joi = require('joi');

const resultSchema = joi.object().required().keys({
  testName: joi.string().required(),
  testSuite: joi.string().required(),
  execution: joi.number().required(),
  outcome: joi.string().regex(/[fF]ailed|[wW]arning|[Pp]assed|[Ss]kipped|[Ii]nconclusive/).required(),
  project: joi.string().required(),
  execution_nice: joi.number().optional(),
  testType: joi.string().required()
}).unknown(); // allow additional attributes

module.exports = {
  getResults(options) { 
    const q = db._createStatement({
      'query': `
        LET stat_summary = (FOR doc IN testResults
          FILTER doc.meta[*].build == [@build] && LOWER(doc.project) == @project && DATE_ISO8601(doc.execution) >= DATE_ISO8601(@from) && DATE_ISO8601(doc.execution) <= DATE_ISO8601(@to)
          COLLECT outcome = doc.outcome  WITH COUNT INTO count
          RETURN { 
          outcome, 
          count
        })
        
        LET suite_summary = (FOR doc IN testResults
          FILTER doc.meta[*].build == [@build] && LOWER(doc.project) == @project && DATE_ISO8601(doc.execution) >= DATE_ISO8601(@from) && DATE_ISO8601(doc.execution) <= DATE_ISO8601(@to)
          COLLECT testsuite = doc.testSuite, outcome = doc.outcome  WITH COUNT INTO count
          RETURN {  
            testsuite, 
            outcome, 
            count
        })  
        
        LET test_results = (
            FOR u IN testResults
            FILTER u.meta[*].build == [@build] && LOWER(u.project) == @project && DATE_ISO8601(u.execution) >= DATE_ISO8601(@from) && DATE_ISO8601(u.execution) <= DATE_ISO8601(@to)
            RETURN {
                test_suite:u.testSuite, 
                test_name:u.testName, 
                outcome: u.outcome
            }
        )
        
        LET tests_details = (
          FOR doc IN testResults 
          FILTER doc.meta[*].build == [@build] && LOWER(doc.project) == @project && DATE_ISO8601(doc.execution) >= DATE_ISO8601(@from) && DATE_ISO8601(doc.execution) <= DATE_ISO8601(@to)
          RETURN UNSET(doc, "_key", "_id", "_rev"))
        
        RETURN { 
            stat_summary: MERGE(
                FOR u IN stat_summary
                RETURN { [ u.outcome ]: u.count }), 
            suite_summary : suite_summary,
            tests_results: test_results,
            test_details: tests_details
        }  
      `
    });
    q.bind('project', options.project.toLowerCase());
    q.bind('from', options.from);
    q.bind('to', options.to);
    q.bind('build', options.build.toLowerCase());
    //q.bind('show_details', options.show_details);
    
  
    return q.execute().toArray();  
  }
};