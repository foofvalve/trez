const request = require('supertest');
const expect = require('chai').expect;
const joi = require('joi');
const conf = require('../lib/conf');

describe('POST /results', function(done) {
  var payLoad = [];
  var testName = '';

  beforeEach(function() {
    testName = Math.random().toString(36).substring(7);
    payLoad = [
      {
        "testName": `Fake date agn ${testName}`,
        "testSuite": "Login",
        "execution": "2019-02-23T07:14",
        "outcome": "Passed",
        "project": "MEH",
        "message": "yo",
        "stacktrace": "Error: Expected Song({  }) to equal 'nope'.\n    at <Jasmine>\n    at UserContext.<anonymous> (C:\\Users\\ryanr\\OneDrive\\dev\\spec\\jasmine_examples\\PlayerSpec.js:36:43)\n    at <Jasmine>",        
        "testType": "ui",
        "duration": 15,
                "meta": [
                 {
                     "build": "2018.12.01.2",
        "iqEnv": "iq_onprem1",
        "host": "DESKTOP-9BNEQME"}]
      }
     ];
  });


  it('responds with 200 when a valid payload is provided', function(done) {

    request(conf.BASE_URL)
      .post('/results')
      .auth(conf.USERNAME, conf.PASSWORD)
      .send(payLoad)
      .set('Accept', 'application/json')
      .expect(function(res) {
        expect(res.body.success).to.be.equal(true);
      })
      .expect(200, done)
  });   

  it('prevents duplicate test results', function(done) {
    request(conf.BASE_URL)
      .post('/results')
      .auth(conf.USERNAME, conf.PASSWORD)
      .send(payLoad)
      .set('Accept', 'application/json')
      .expect(200)

    request(conf.BASE_URL)
      .post('/results')
      .auth(conf.USERNAME, conf.PASSWORD)
      .send(payLoad)
      .set('Accept', 'application/json')
      .expect(200, done)      
  });     

  it('response adheres to the schema', function(done) {
    request(conf.BASE_URL)
      .post('/results')
      .auth(conf.USERNAME, conf.PASSWORD)
      .send(payLoad)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function(res) {
        var testResultSchema = {
          testName: joi.string().required(),
          testSuite: joi.string().required(),
          execution: joi.string().regex(/\d{4}-\d{2}\-\d{2}/).required(),
          outcome: joi.string().regex(/[fF]ailed|[wW]arning|[Pp]assed|[Ss]kipped|[Ii]nconclusive/).required(),
          stacktrace: joi.string().allow('').optional(),
          message: joi.string().allow('').optional(),
          project: joi.string().required(),
          execution_nice: joi.number().optional(),
          duration: joi.number().optional(),
          testType: joi.string().required(),
          meta: joi.array().optional()
        };

        var expectedSchema = {
          success: joi.boolean().required(),
          inserted: joi.object({
            success_count: joi.number().required(),
            success_list: joi.array().required(),
            error: joi.object({
              error_count: joi.number().required(),
              error_list: joi.array()
            }).optional()
          }).required()
        };
  
        const {error, value}  = joi.validate(res.body, expectedSchema);
        
        if(error != null) {
          console.log('', errors);
          expect(value).to.be.null;
        }       
      }).end(done); 
  });      
});

/*
{
    "success": true,
    "inserted": {
        "success_count": 1,
        "success_list": [
            {
                "testName": "Fake ddate afvfalidgnld222",
                "testSuite": "Login",
                "execution": "2019-02-23T07:14",
                "outcome": "Passed",
                "project": "DTE",
                "message": "yo",
                "stacktrace": "Error: Expected Song({  }) to equal 'nope'.\n    at <Jasmine>\n    at UserContext.<anonymous> (C:\\Users\\ryanr\\OneDrive\\dev\\spec\\jasmine_examples\\PlayerSpec.js:36:43)\n    at <Jasmine>",
                "testType": "ui",
                "duration": 15,
                "meta": [
                    {
                        "build": "2019.12.02.2",
                        "iqEnv": "iq_onprem1",
                        "host": "DESKTOP-9BNEQME"
                    }
                ],
                "created": 1551169066314,
                "execution_nice": "2019-02-23T07:14:00.000Z",
                "_id": "testResults/794838579",
                "_key": "794838579",
                "_rev": "_YQhgLkO--_"
            }
        ]
    },
    "error": {
        "error_count": 0,
        "error_list": []
    }
}*/