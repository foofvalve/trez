
describe('htmler', function() {
  var testData = {};

  beforeEach(function() {
    testData = require('../test/fixtures/basi.html.response.json');    
  });

  it('generates html file', function() {
    allTestSuites = testData[0].tests_results.map(n => n.test_suite);
    var testSuites = Array.from(new Set(allTestSuites));
    var testSuiteStyle = 'style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 12px 25px 2px 25px;"';
    var html = '';

    testSuites.forEach(testSuite => {
      html += `<table cellpadding="0" cellspacing="0" border="0"><tr><td ${testSuiteStyle}>${testSuite}</td></tr></table>`

      html += '<table>';
      var tests = testData[0].tests_results.filter(n => n.test_suite == testSuite)
      tests.forEach(test => {
        html += `<tr><td style="width:10;font:normal 10px Verdana, Arial, sans-serif;">${test.outcome}</td><td style="width:590;font:normal 10px Verdana, Arial, sans-serif;">${test.test_name}</td></tr>`
        console.log(`\t ${test.outcome} | ${test.test_name}`)
      });
      html += '</table>';
    });

    console.log(html);
  });  

});