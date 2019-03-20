TODO:

-- Misc
 * tart up => skin and icons > maybe graph
 * fix date range filter
 * pivot by buildidentifier
 * loose update requirements
* link to tfs job

- write supertests
- implement ALL filters
- implement 'Show Test Details'



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
- /GET trend data for trend graph - test with smaller data
- update when dupe found,
- add index to
- update setup script
 * include trend data
  * toPdf()
 - results uploader script 
  * ~Fails~ show message when outcome == failed  
 * handle passed AND failed must be shown 0 if null  
 - email senderer
 - custom jasmine reporter to post to
  * must get the build identifier
  * must get the hostname
- foxx reverse proxy  
-- html generator
  * handle nulls
 * merge [Testsuite pass:0, fail:0]
 * add build identifier into the trend table    