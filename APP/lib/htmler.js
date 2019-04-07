var writeFile = require('write');
const fileChecker = require('../lib').fileExists;
const defaultTo =  require('../lib').setDefault;
const _ = require('lodash');

module.exports = {
  generateHtml(data, trend) {
    var html = '';
    if (data != [{}] && data[0].stat_summary != undefined) {
      html = `
      <!doctype html>
      <html lang="en">
      <head>
      </head>
        <body>
          <div style="width:650px;font:normal 10px Verdana, Arial, sans-serif;">
            <div>
              <h1><b>Summary - Build: ${_.get(data[0], 'build_number[0].build','unknown')}</b></h1>
              <span>${_.get(data[0], 'stat_summary.passed', 0)} | Passed</span>
              <span>${_.get(data[0], 'stat_summary.failed', 0)} | Failed</span>
              <span>${_.get(data[0], 'stat_summary.failed', 0) + _.get(data[0], 'stat_summary.passed', 0)} | Total</span>              
            </div>
            <hr/>
            <div>
              <div>
                <div>              
                    <table>
                    <tr>
                      <th>Test Suite</th>
                      <th>Outcome</th>
                      <th></th>
                    </tr>
                      ${data[0].suite_summary.map(x=> `<tr><td>${x.testsuite}</td><td>${x.outcome}</td><td>${x.count}</td></tr>`).join('')}          
                  </table>
                </div>              
              </div> 
              <hr/>
              <div>
                <div>               
                  <table>
                    <tr>
                      <th>Trend</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                    </tr>
                      ${trend.map(x=> `<tr><td>${x.test_name}</td><td>${this.sytleOutcome(x.a)}</td><td>${this.sytleOutcome(x.b)}</td><td>${this.sytleOutcome(x.c)}</td><td>${this.sytleOutcome(x.d)}</td><td>${this.sytleOutcome(x.e)}</td><td>${this.sytleOutcome(x.f)}</td><td>${this.sytleOutcome(x.g)}</td></tr>`).join('')}          
                  </table>
                </div>  
              </div>
              <hr/>
              <div>              
                <table>
                  <tr>
                    <th>Test Suite</th>
                    <th>Failure</th>
                    <th></th>
                  </tr>
                    ${data[0].test_failures.map(x=> `<tr><td>${x.testSuite}</td><td>${x.message}</td><td></td></tr>`).join('')}          
                </table>
              </div>  
            </div>              
          </div>
        </body>
      </html>
      `
    } else {
      html = `
      <html>
      <head>
        <style>
        body {
            height: 842px;
            width: 595px;
            /* to centre page on screen*/
            margin-left: auto;
            margin-right: auto;
        }
        </style>
      </head>
        <body>
          <div>
            <span>No Results ¯\_(ツ)_/¯</span> 
          </div>
        </body>
      </html>
      `
    }
      
    return html; 
    //console.log(html);
    /*
    try {
      writeFile(saveLocation, html, function (err) {
        if (err) {
          throw (err);
        } 
      });

      return {
        result: true,
        message: `Html created [${saveLocation}]`
      };
    } catch {
      return {
        result: false,
        message: `Failed to create [${saveLocation}]`
      };
    }
    */
  },
  generateBasicHtml(data) {
    var html = '';
    console.log('data[0].suite_summary.length =>', data[0].suite_summary.length);
    if (data != [{}]  && data[0].stat_summary != undefined && data[0].stat_summary != {} && data[0].suite_summary.length != 0) {
      html = `
      <!doctype html>
      <html lang="en">
      <head>
      </head>
        <body>
          <div>
            <div>
              <p style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 12px 25px 2px 25px;"><b >Summary - Build: ${_.get(data[0], 'build_number[0].build','unknown')}</b></p>
              <p style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 400; line-height: 2px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 1px 25px 1px 25px;">✅ | ${_.get(data[0], 'stat_summary.passed', 0)}  </p>
              <p style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 400; line-height: 2px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 1px 25px 1px 25px;">❌ | ${_.get(data[0], 'stat_summary.failed', 0)} </p>                           
            </div>
            <hr/>
            ${this.renderTestResult(data[0])}
            <div>
              <hr/>              
              <div>              
                <table>
                  <tr>                    
                    <th style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 12px 25px 2px 25px;">Failures</th>                    
                  </tr>
                    ${data[0].test_failures.map(x=> `<tr><td><p style="width:600;font-weight: bold;font:normal 12px Verdana, Arial, sans-serif;">${x.testSuite}</p><p style="width:600;font:normal 10px Verdana, Arial, sans-serif;">${x.message}</p><p><pre style="width:800;background: #efefef;font:normal 10px Verdana, Arial, sans-serif;">${x.stacktrace}</pre></p></td></tr><hr />`).join('')}          
                </table>
              </div>  
            </div>              
          </div>
        </body>
      </html>
      `
    } else {
      html = `No Results`
    }
      
    return html; 
  },  
  renderTestResult(data) {
    allTestSuites = data.tests_results.map(n => n.test_suite);
    var testSuites = Array.from(new Set(allTestSuites));
    var testSuiteStyle = 'style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 12px 25px 2px 25px;"';
    var html = '';

    testSuites.forEach(testSuite => {
      html += `<table cellpadding="0" cellspacing="0" border="0"><tr><td ${testSuiteStyle}>${testSuite}</td></tr></table>`

      html += '<table>';
      var tests = data.tests_results.filter(n => n.test_suite == testSuite)
      tests.forEach(test => {
        html += `<tr><td style="width:10;font:normal 10px Verdana, Arial, sans-serif;padding: 1px 2px 2px 12px;">${this.sytleOutcome(test.outcome)}</td><td style="width:590;font:normal 10px Verdana, Arial, sans-serif;">${test.test_name}</td></tr>`        
      });
      html += '</table>';
    });

    return html;
  },
  sytleOutcome(outcome) {
    if(outcome.toLowerCase() == 'passed' ) {
      return '<span><p>✅</p></span>';
    } else if(outcome.toLowerCase() == 'failed' ) {
      return '<span><p>❌</p></span>';
    } else {
      return '<span class="icon"><i class="fas"></i></span>'
    }    
  },
  meh() {
    var testSuites = n[0].suite_summary.map(x => x.testsuite)
    var unique = testSuites.filter( this.onlyUnique );
    var k = unique.map(function(x) {
      return {suitename: x, passed:0,failed:0}
    })  

    n[0].suite_summary.map(function(x) {
      if(x.outcome == 'Failed')
        return {testsuite: x.testsuite, failed: x.count}
      else 
        return {testsuite: x.testsuite, passed: x.count}
    })

  },
  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }
};