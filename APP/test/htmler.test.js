var htmler = require('../lib/htmler')

describe('htmler', function() {
  var testData = {};

  beforeEach(function() {
    testData = require('../test/fixtures/htmler.test.data.json');
  });

  it('generates html file', function() {
    htmler.generateHtml(testData, '');
    // expect ...
  });  

  it('generates pdf file', function() {

  });    
});