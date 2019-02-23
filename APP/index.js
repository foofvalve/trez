'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;
const testResults = db._collection('testResults');
const lib = require('./lib');
const Results = require('./results.model');
const simpleAuth = require('./lib/simple.auth');

module.context.use(router);

router.post('/results', function (req, res) {
  if(simpleAuth.verify(req.headers.authorization)) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    let failures = [];
    for (var doc of body) {
      doc.created = Date.now();
      var niceDate = new Date(doc.execution)
      doc.execution_nice = niceDate.toISOString(); 
      var newDocument = {};
      try{
        newDocument = testResults.save(doc);
      } catch(err) {
        failures.push(Object.assign(doc, newDocument));
        console.log(`err => ${JSON.stringify(err)}`)
        continue;
      }
      
      if(newDocument.hasOwnProperty('_id')) {
        data.push(Object.assign(doc, newDocument));
      } else {
        failures.push(Object.assign(doc, newDocument));
      }      
    }
    
    var result = {
      'success': failures.length === 0 ? true : false,        
      'inserted': {
        'success_count' : data.length,
        'success_list' : data,
      },
      'error': {
        'error_count': failures.length,
        'error_list': failures
      }
    };
      
    res.send(result);     
  } else {
    res.status(401).send(['Unauthorized']);
  }
})
.body(joi.array().items(joi.object(
  Results.resultSchema
)), 'An array of results to be inserted into the database')   
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
      from: lib.setFromDate(req.queryParams.from),
      to: lib.setToDate(req.queryParams.to),
      //show_details: lib.setDefault(req.queryParams.show_details, false),
      build: lib.setDefault(req.queryParams.build, null)
    };
    console.log(`options => ${JSON.stringify(options)}`);
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
