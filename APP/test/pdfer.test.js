var pdfer = require('../lib/pdfer')

describe('pdfer', function() {
  var testData = {};

  beforeEach(function() {
    testData = require('../test/fixtures/htmler.test.data.json');
    htmler.generateHtml(testData, USER_TEMP_DIR);
  });

  it('generates pdf file', function() {
    var htmlFile = '';

    pdfer.generatePdf(htmlFile);

    // expect
  });    
});