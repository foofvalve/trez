const request = require('supertest');
const auth = {
  username: 'autotest',
  password: '^HCBc#mdCSgGh2}'
};

describe('GET /results', function() {
  it('responds with 401 when the request is unauthenticated', function(done) {
    request('http://localhost:8529/_db/cupboard/faux_app')
      .get('/results?project=MEH')      
      .expect(401, done);
  });

  it('responds with 404 when an invalid route is provided', function(done) {
    request('http://localhost:8529/_db/cupboard/faux_app')
      .get('/resultz?project=MEH')      
      .expect(404, done);
  });

  it('authenticated request responds with 200 when valid parameters are supplied', function(done) {
    request('http://localhost:8529/_db/cupboard/faux_app')
      .get('/results?project=IQ')      
      .auth(auth.username, auth.password)
      .expect(200, done);
  });

  it('response adheres to the results schema', function(done) {
    request('http://localhost:8529/_db/cupboard/faux_app')
      .get('/results?project=IQ')      
      .auth(auth.username, auth.password)
      .expect(200, done);
  });  
});