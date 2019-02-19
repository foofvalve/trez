TODO:

- write supertests
- implement ALL filters
- implement 'Show Test Details'
- refactor to use baseTestResults
=> step by step filters
=> FILTER doc.meta[*].build == [@build] && LOWER(doc.project) == @project && DATE_ISO8601(doc.execution) >= DATE_ISO8601(@from) && DATE_ISO8601(doc.execution) <= DATE_ISO8601(@to)
- data for trend graph
- Tart up


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