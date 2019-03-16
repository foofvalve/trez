var writeFile = require('write');
const fileChecker = require('../lib').fileExists;
const defaultTo =  require('../lib').setDefault;
const _ = require('lodash');

module.exports = {
  generateHtml(data, trend) {
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
              <h2 class="title is-2">Summary - Build: ${_.get(data[0], 'build_number[0].build','unknown')}</h2>
              <a class="button is-success">${_.get(data[0], 'stat_summary.passed', 0)} | Passed</a>
              <a class="button is-danger">${_.get(data[0], 'stat_summary.failed', 0)} | Failed</a>
              <a class="button is-info">${_.get(data[0], 'stat_summary.failed', 0) + _.get(data[0], 'stat_summary.passed', 0)} | Total</a>
              <hr/>
            </div>
            <hr/>
            <div class="columns">
              <div class="column is-one-third">
                <div class="box">              
                    <table class="table">
                    <tr>
                      <th>Test Suite</th>
                      <th>Outcome</th>
                      <th></th>
                    </tr>
                      ${data[0].suite_summary.map(x=> `<tr><td>${x.testsuite}</td><td>${x.outcome}</td><td>${x.count}</td></tr>`).join('')}          
                  </table>
                </div>
              
              </div> 
              <div class="column">
                <div class="box">               
                  <table class="table">
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
              <div class="box">              
                <table class="table">
                  <tr>
                    <th>Test Suite</th>
                    <th>Failure</th>
                    <th></th>
                  </tr>
                    ${data[0].test_failures.map(x=> `<tr><td>${x.testSuite}</td><td>${x.message}</td><td>${x.stacktrace}</td></tr>`).join('')}          
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
  sytleOutcome(outcome) {
    if(outcome.toLowerCase() == 'passed' ) {
      return '<span class="icon has-text-success"><i class="fas fa-check-circle"></i></span>';
    } else if(outcome.toLowerCase() == 'failed' ) {
      return '<span class="icon has-text-danger"><i class="fas fa-times-circle"></i></span>';
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