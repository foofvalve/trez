'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;
const errors = require('@arangodb').errors;
const testResults = db._collection('testResults');
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const aql = require('@arangodb').aql;
const lib = require('./lib');
const Results = require('./results.model');
const simpleAuth = require('./lib/simple.auth');

module.context.use(router);

const resultSchema = joi.object().required().keys({
  testName: joi.string().required(),
  testSuite: joi.string().required(),
  execution: joi.number().required(),
  outcome: joi.string().regex(/[fF]ailed|[wW]arning|[Pp]assed|[Ss]kipped|[Ii]nconclusive/).required(),
  project: joi.string().required(),
  execution: joi.number().optional(),
  testType: joi.string().required()
}).unknown(); // allow additional attributes


router.post('/results', function (req, res) {
  if(simpleAuth.verify(req.headers.authorization)) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      doc.created = Date.now();
      const meta = testResults.save(doc);
      data.push(Object.assign(doc, meta));
    }
    res.send(multiple ? data : data[0]);
  } else {
    res.status(401).send(['Unauthorized']);
  }
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

  if(simpleAuth.verify(req.headers.authorization)) {
    const options = {
      project: lib.setDefault(req.queryParams.project, 'IQ'),
      from: lib.setDefault(req.queryParams.from, 'date now -1 day'),
      to: lib.setDefault(req.queryParams.to, 'date now '),
      show_details: lib.setDefault(req.queryParams.show_details, false),
      build: lib.setDefault(req.queryParams.build, null)
    };

    const resultsData = Results.getResults(options);
    console.log(resultsData)
    if (resultsData != undefined || resultsData.length != 0) {
      res.status(200).send(resultsData);
    } else {
      res.status(404).send('Not Found');    
    }    
  } else {
    res.status(401).send('Unauthorized');
  }    
}, 'getStacks')
  //.queryParam('userObjectId', Users.objectIdSchema, 'User object id that is making the request')
  //.queryParam('page', pageSchema, 'Page number, default 1')
  //.queryParam('pagesize', pagesizeSchema, 'Page size, default 20')
  //.queryParam('order', orderSchema, 'Sort order of stack number, default \'asc\'')
  //.queryParam('state', Stacks.searchStateSchema, 'Stack state, default \'\'')
  .response(joi.object(), 'The Results.')
  .response(401, joi.object(), 'Unauthorized')
  .response(403, joi.object(), 'Forbidden')
  .response(404, joi.object(), 'Not Found')
  .summary('Get all results')
  .description('Retrieve all results that match the provide filters');
