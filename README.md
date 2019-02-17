TODO:

- write supertests
- implement ALL filters
  - Dates - sort it out
```FOR doc IN coll
    FILTER doc.date >= "2015-05-15" AND doc.date < "2015-05-16"
    RETURN doc

  - implement 'Show Test Details'

- data for trend graph
- Tart up


DONE:

- GET - all results based on filter [testsuite, build, execution datetime range]
- GET - all test summary grouped by test suite
- GET - all tests summary grouped by outcome
- Test data - lots of it
- Auth headers - basic
- check for dupes
- Trim incoming data
- proper exception handling
- format date in repsonse [raw, formatted]