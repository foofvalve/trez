TODO:

- write supertests
- implement ALL filters
- implement 'Show Test Details'
- /GET trend data for trend graph
- custom jasmine reporter to post to
  * must get the build identifier
  * must get the hostname


DONE:
- Dates - sort it out
- GET - all results based on filter [testsuite, build, execution datetime range]
- GET - all test summary grouped by test suite
- GET - all tests summary grouped by outcome
- Test data - lots of it
- Auth headers - basic
- check for dupes
- Trim incoming data
- proper exception handling
- format date in repsonse [raw, formatted]
- refactor to use baseTestResults
=> step by step filters
=> FILTER doc.meta[*].build == [@build] && LOWER(doc.project) == @project && DATE_ISO8601(doc.execution) >= DATE_ISO8601(@from) && DATE_ISO8601(doc.execution) <= DATE_ISO8601(@to)
- Tart up
- change /post[execution] to be nice iso 
- generate loads of data => 2000 tests, 50 test suites, 15 days