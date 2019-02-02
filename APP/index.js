'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;
const errors = require('@arangodb').errors;
const testResults = db._collection('testResults');
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

module.context.use(router);

const resultSchema = joi.object().required().keys({
  testName: joi.string().required(),
  testSuite: joi.string().required(),
  execution: joi.date().iso(),
  outcome: joi.string().regex(/[wW]arning|[Pp]assed|[Ss]kipped|[Ii]nconclusive/)
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