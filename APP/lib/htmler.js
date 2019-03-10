var writeFile = require('write');
const fileChecker = require('../lib').fileExists;
const defaultTo =  require('../lib').setDefault;

module.exports = {
  generateHtml(data, trend, saveLocation) {
// TODO: check if savelocation is valid folder
/*
    if (!fileChecker(saveLocation)) {
      return {
        result: false,
        message: `Invalid save location [${saveLocation}]`
      };
    }
*/
    var html = '';
    if (data != [{}] && data[0].stat_summary != undefined) {
      html = `
      <!doctype html>
      <html lang="en">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css">
          <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
      </head>
        <body>
          <div class="container is-fluid">
            <div class="notification">
              <h2 class="title is-2">Summary - Build: ${defaultTo(data[0].test_details[0].meta[0].build, '-')}</h2>
              <a class="button is-success">${defaultTo(data[0].stat_summary.Passed, 0)} | Passed</a>
              <a class="button is-danger">${defaultTo(data[0].stat_summary.Failed, 0)} | Failed</a>
              <a class="button is-info">${defaultTo(data[0].stat_summary.Failed, 0) + defaultTo(data[0].stat_summary.Passed, 0)} | Total</a>
              <hr/>
            </div>
            <br />
            <hr/>
            <div>
              <span>Test Suites</span>
                <table class="table">
                <tr>
                  <th>Suite</th>
                  <th>Outcome</th>
                  <th>Count</th>
                </tr>
                  ${data[0].suite_summary.map(x=> `<tr><td>${x.testsuite}</td><td>${x.outcome}</td><td>${x.count}</td></tr>`).join('')}          
              </table>
            </div>
      
            <div>
              <span>Tests</span>
                <table class="table">
                  <tr>
                    <th>Test</th>
                    <th>Duration</th>
                    <th>Outcome</th>
                  </tr>
                    ${data[0].test_details.map(x=> `<tr><td>${x.testSuite} - ${x.testName}</td><td>${x.duration}</td><td>${x.outcome}</td></tr>`).join('')}          
                </table>
            </div>      
  
            <div>
              <span>Trend</span>
                <table class="table">
                  <tr>
                    <th>Test</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                  </tr>
                    ${trend.map(x=> `<tr><td>${x.test_name}</td><td>${x.a}</td><td>${x.b}</td><td>${x.c}</td><td>${x.d}</td><td>${x.e}</td><td>${x.f}</td><td>${x.g}</td></tr>`).join('')}          
                </table>
            </div>              
      
            <div>
              <span>Tests</span>
                <table>
                  <tr>
                    <th>Test</th>
                    <th>Outcome</th>
                  </tr>
                    ${data[0].tests_results.map(x=> `<tr><td>${x.test_suite} - ${x.test_name}</td><td>${x.outcome}</td></tr>`).join('')}          
                </table>
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
      
    //console.log(html);
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