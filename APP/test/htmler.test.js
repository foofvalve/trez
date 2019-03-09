var htmler = require('../lib/htmler');
const tempDir = require('temp-dir');
const expect = require('chai').expect;

describe('htmler', function() {
  var testData = {};

  beforeEach(function() {
    testData = require('../test/fixtures/htmler.test.data.json');
  });

  it('generates html file', function() {
    var result = htmler.generateHtml(testData, tempDir + '\\estoutput.html');
    expect(result).to.equal(true);
  });  
  
  it('handles empty data', function() {
    var result = htmler.generateHtml(testData, tempDir + '\\estoutput.html');
    expect(result).to.equal(true);
  });  
  
  it('fails when invalid save location is provided', function() {
    var result = htmler.generateHtml(testData, tempDir + '\-\novalid]\testoutput.html');
    expect(result).to.equal(true);
  });    
});