'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;
const errors = require('@arangodb').errors;
const testResults = db._collection('testResults');
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const aql = require('@arangodb').aql;

module.context.use(router);

const resultSchema = joi.object().required().keys({
  created: joi.number().required(),
  testName: joi.string().required(),
  testSuite: joi.string().required(),
  execution: joi.number().required(),
  outcome: joi.string().regex(/[wW]arning|[Pp]assed|[Ss]kipped|[Ii]nconclusive/).required(),
  project: joi.string().required(),
  execution: joi.number().optional(),
  testType: joi.string().required()
}).unknown(); // allow additional attributes


router.get('/results/:key', function (req, res) {
  try {
    const data = testResults.document(req.pathParams.key);
    res.send(data)
  } catch (e) {
    if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
      throw e;
    }
    res.throw(404, 'The entry does not exist', e);
  }
})
.pathParam('key', joi.string().required(), 'Key of the entry.')
.response(joi.object().required(), 'Entry stored in the collection.')
.summary('Retrieve an entry')
.description('Retrieves an entry from the "testResults" collection by key.');

router.post('/results', function (req, res) {
  const multiple = Array.isArray(req.body);
  const body = multiple ? req.body : [req.body];

  let data = [];
  for (var doc of body) {
    const meta = testResults.save(doc);
    data.push(Object.assign(doc, meta));
  }
  res.send(multiple ? data : data[0]);

})
.body(joi.alternatives().try(
  resultSchema,
  joi.array().items(resultSchema)
), 'Entry or entries to store in the collection.')
.response(joi.alternatives().try(
  joi.object().required(),
  joi.array().items(joi.object().required())
), 'Entry or entries stored in the collection.')
.summary('Store entry or entries')
.description('Store a single entry or multiple entries in the "testResults" collection.');

router.get('/results', function (req, res) {
  
  const keys = db._query(aql`
    FOR entry IN ${testResults}
    RETURN entry._key
  `);
  
/*
  const keys = db._query(
    'FOR entry IN @@coll RETURN entry._key',
    {'@@coll': testResults.name()}
  );*/

  res.send(keys);
})
.response(joi.array().items(
  joi.string().required()
).required(), 'List of entry keys.')
.summary('List entry keys')
.description('Assembles a list of keys of entries in the collection.');



router.get('/resultz/:testSuite', function (req, res) {
 
  const q = db._createStatement({
    'query': `
      FOR doc IN testResults
      FILTER doc.testSuite ==@testSuite
      RETURN doc
    `
  });
  q.bind('testSuite', req.pathParams.testSuite);

  const keys = q.execute().toArray();  

  res.send(keys);
})
.response(joi.array().items(
  joi.string().required()
).required(), 'List of entry keys.')
.summary('List entry keys')
.description('Assembles a list of keys of entries in the collection.');