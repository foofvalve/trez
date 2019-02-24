const request = require('supertest');
const conf = require('../lib/conf');

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
      .get('/results?project=IQ')      
      .auth(conf.USERNAME, conf.PASSWORD)
      .expect(999, done);
  });  
});