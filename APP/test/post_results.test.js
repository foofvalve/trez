const request = require('supertest');
const expect = require('chai').expect;
const joi = require('joi');
const conf = require('../lib/conf');

const auth = {
  username: 'autotest',
  password: '^HCBc#mdCSgGh2}'
};

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
      .expect(200, done)

    request(conf.BASE_URL)
      .post('/results')
      .auth(conf.USERNAME, conf.PASSWORD)
      .send(payLoad)
      .set('Accept', 'application/json')
      .expect(200, done)      
  });     

  it('response adheres to the schema', function(done) {

    const expectedSchema = joi.object().required().keys({
      testName: joi.string().required(),
      testSuite: joi.string().required(),
      execution: joi.number().required()
    }) 

    request(conf.BASE_URL)
      .post('/results')
      .auth(conf.USERNAME, conf.PASSWORD)
      .send(payLoad)
      .set('Accept', 'application/json')
      .expect(200, done)
   
  });      
});