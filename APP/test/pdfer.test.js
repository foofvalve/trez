var pdfer = require('../lib/pdfer');
var htmler = require('../lib/htmler');
const tempDir = require('temp-dir');
const expect = require('chai').expect;

describe('pdfer', function() {
  var testData = {};

  beforeEach(function() {
    testData = require('../test/fixtures/htmler.test.data.json');
    htmler.generateHtml(testData, tempDir + '\\yo.html');
  });

  it('generates pdf file', function() {
    var htmlFile = tempDir + '\\yo.html';

    var result = pdfer.generatePdf('C:\\Users\\ryanr\\AppData\\Local\\Temp\\yo.html');
    expect(result).toBe(true);

    // expect
  });    
});