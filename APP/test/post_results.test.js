const request = require('supertest');
const expect = require('chai').expect;

const auth = {
  username: 'autotest',
  password: '^HCBc#mdCSgGh2}'
};

describe('POST /results', function(done) {
  it('responds with 200 when a valid payload is provided', function(done) {
    var testName = Math.random().toString(36).substring(7);
    var payLoad = [
      {
        "testName": `Fake date agn ${testName}`,
        "testSuite": "Login",
        "execution": 1549668389983,
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

    request('http://localhost:8529/_db/cupboard/faux_app')
      .post('/results')
      .auth(auth.username, auth.password)
      .send(payLoad)
      .set('Accept', 'application/json')
      .expect(function(res) {
        expect(res.body.success).to.be.equal(true);
      })
      .expect(200, done)
  });   
});