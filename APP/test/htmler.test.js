var htmler = require('../lib/htmler');
const tempDir = require('temp-dir');
const expect = require('chai').expect;

describe('htmler', function() {
  var testData = {};
  var testTrendData = {};

  beforeEach(function() {
    testData = require('../test/fixtures/htmler.test.data.json');
    testTrendData = require('../test/fixtures/htmler.test.trend.data.json');
  });

  it('generates html file', function() {
    var result = htmler.generateHtml(testData, testTrendData, tempDir + '\\estoutput.html');
    expect(result.result).to.equal(true);
    console.log('result => ', result);
  });  
  
  xit('handles empty data', function() {
    testData = [{}];
    var result = htmler.generateHtml(testData, testTrendData, tempDir + '\\emptyestoutput.html');
    console.log('result => ', result)
    expect(result.result).to.equal(true);
  });  
  
  xit('fails when invalid save location is provided', function() {    
    var result = htmler.generateHtml(testData, testTrendData, tempDir + '\-\novalid]\testoutput.html');
    expect(result.result).to.equal(false);
    expect(result.message).to.contain('Invalid save location');    
  });    
});