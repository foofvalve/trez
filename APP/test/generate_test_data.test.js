const request = require('supertest');
const expect = require('chai').expect;
const moment = require('moment');

const auth = {
  username: 'autotest',
  password: '^HCBc#mdCSgGh2}'
};

describe('POST /results', function(done) {
  var payLoad = [];
  var testName = '';

  beforeEach(function() {
    var numberTests = 2000;
    var numberTestSuites = 46;
    var tests = [];
    var testSuites = [];
    var numberOfDays = 15;
    var outcome = ['Passed', 'Failed'];

    for (var i = 0; i <= numberTestSuites; i++) {
      var suiteName = Math.random().toString(36).substring(7);
      testSuites.push(`Suite ${suiteName} ${i}`)
    }

    for (var i = 0; i <= numberTests; i++) {
      var testName = `Test ${Math.random().toString(36).substring(7)} ${i}`;
      var randomTestSuite = testSuites[Math.floor(Math.random() * testSuites.length)];
      tests.push({
        testName: testName, testSuite: randomTestSuite
      })
    }    

    var payLoad = [];
    for(var i=0; i <= numberOfDays; i++) {
      var d = moment().add(-1 * i, 'day').toISOString(); 
      console.log('d =>', d)
      for(var test of tests) {
        console.log('test => ', test);
        var result = outcome[Math.floor(Math.random() * outcome.length)]

        payLoad.push(
          {
            "testName": test.testName,
            "testSuite": test.testSuite,
            "execution": d,
            "outcome": result,
            "project": "IQ",
            "message": result === 'Failed' ? 'Yo' : '',
            "stacktrace": result === 'Failed' ? "Error: Expected Song({  }) to equal 'nope'.\n    at <Jasmine>\n    at UserContext.<anonymous> (C:\\Users\\ryanr\\OneDrive\\dev\\spec\\jasmine_examples\\PlayerSpec.js:36:43)\n    at <Jasmine>" : '',        
            "testType": "ui",
            "duration": randomNumber(15, 120),
                    "meta": [
                     {
                        "build": `2018.12.01.${i}`,
            "iqEnv": "iq_onprem1",
            "host": "DESKTOP-9BNEQME"}]
          }
        );  
      }

    }

    //console.log('done', tests)
    //console.log('done', testSuites)
    console.log('payload => ', payLoad);
  });


  var randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  it('makes lots of data - blah', function(done) {

  })

  xit('makes lots of data', function(done) {

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