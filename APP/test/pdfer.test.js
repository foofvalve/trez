var pdfer = require('../lib/pdfer');
var htmler = require('../lib/htmler');
const tempDir = require('temp-dir');
const expect = require('chai').expect;

describe('pdfer', function() {
  var testData = {};

  beforeEach(function() {
    testData = require('../test/fixtures/htmler.test.data.json');
    testTrendData = require('../test/fixtures/htmler.test.trend.data.json');
    var result = htmler.generateHtml(testData, testTrendData, tempDir + '\\yo.html');    
  });

  it('generates pdf file', function() {
    var result = pdfer.generatePdf(tempDir + '\\yo.html');
    expect(result.result).to.equal(true);
  });   
  
  it('fails when an invalid html file is provided', function() {
    var htmlFile = tempDir + '\\nope-fail\\yo.html';

    var result = pdfer.generatePdf(htmlFile);
    expect(result.result).to.equal(false);
    expect(result.message).to.contain('Unable to find html file'); 
  }); 
});