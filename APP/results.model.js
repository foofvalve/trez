const db = require('@arangodb').db;

module.exports = {
  getResults(options) {
    const q = db._createStatement({
      'query': `
        LET stat_summary = (FOR doc IN testResults
          FILTER doc.project == @project
          COLLECT outcome = doc.outcome  WITH COUNT INTO count
          RETURN { 
          outcome, 
          count
        })
        
        LET suite_summary = (FOR doc IN testResults
          FILTER doc.project == @project
          COLLECT testsuite = doc.testSuite, outcome = doc.outcome  WITH COUNT INTO count
          RETURN {  
            testsuite, 
            outcome, 
            count
        })  
        
        LET test_results = (
            FOR u IN testResults
            FILTER u.project == @project
            RETURN {
                test_suite:u.testSuite, 
                test_name:u.testName, 
                outcome: u.outcome
            }
        )
        
        LET tests_details = (
          FOR doc IN testResults 
          FILTER doc.project == @project
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
    q.bind('project', options.project);
  
    return q.execute().toArray();  
  }
};