const request = require('supertest');
const conf = require('../lib/conf');
const joi = require('joi');

describe('GET /results', function() {
  it('responds with 401 when the request is unauthenticated', function(done) {
    request(conf.BASE_URL)
      .get('/results?project=MEH')      
      .expect(401, done);
  });

  it('responds with 404 when an invalid route is provided', function(done) {
    request(conf.BASE_URL)
      .get('/resultz?project=MEH')      
      .expect(404, done);
  });

  it('authenticated request responds with 200 when valid parameters are supplied', function(done) {
    request(conf.BASE_URL)
      .get('/results?project=IQ')      
      .auth(conf.USERNAME, conf.PASSWORD)
      .expect(200, done);
  });

  it('response adheres to the results schema', function(done) {
    request(conf.BASE_URL)
      .get('/results?project=IQ&from=2019-02-20&to=2019-02-21')      
      .auth(conf.USERNAME, conf.PASSWORD)
      .expect(200)
      .expect(function(res) {
        var expectedSchema = {
          stat_summary: joi.object().required(),
          suite_summary: joi.array().required(),
          tests_results: joi.array().required(),
          test_details: joi.object()
        };
  
        const {error, value}  = joi.validate(res.body, expectedSchema);
        
        if(error != null) {
          expect(value).to.be.null;
        }        
      }).end(done); 
  });  
});