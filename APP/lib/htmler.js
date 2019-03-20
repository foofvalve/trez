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
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Test Automation Results</title>
      
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      
      <style type="text/css">
      @media screen and (max-width:600px) {
        h1 {
          font-size: 32px !important;
          line-height: 32px !important;
        }
      }
      @media only screen and (max-width: 480px) {
        .button-container {
          display: block !important;
          width: 100% !important;
          margin-bottom: 10px;
        }
        .button-spacer {
          display: none !important;
        }
      }
      </style></head>
        <body style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #eeeeee; height: 100%; margin: 0; padding: 0; width: 100%;" bgcolor="#eeeeee">
          <div>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-collapse: collapse; max-width: 600px; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            <tr>
              <td bgcolor="#ffffff" align="left" class="font-stack font-color" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0px 25px 0px 25px;">
                <p style="margin: 0;">Howdy</p>
              </td>
            </tr>
            <tr>
            <td bgcolor="#ffffff" align="left" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0px 25px 20px 25px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-collapse: collapse; border-left: solid 3px #006DCB; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                <tr>
                  <td bgcolor="#f7f7f7" align="left" class="font-stack font-color body-text" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 12px 25px 2px 25px;">
                    <p style="margin: 0; font-weight: 700;"><b>Summary - Build: ${_.get(data[0], 'build_number[0].build','unknown')}</b></p>
                  </td>
                </tr>    
                <tr>
                  <td bgcolor="#f7f7f7" align="left" class="font-stack font-color body-text" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 2px 25px 12px 25px;">
                    <p style="margin: 0;">${_.get(data[0], 'stat_summary.passed', 0)} | Passed</p>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f7f7f7" align="left" class="font-stack font-color body-text" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 2px 25px 12px 25px;">
                    <p style="margin: 0;">${_.get(data[0], 'stat_summary.failed', 0)} | Failed</p>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f7f7f7" align="left" class="font-stack font-color body-text" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 2px 25px 12px 25px;">
                    <p style="margin: 0;">${_.get(data[0], 'stat_summary.failed', 0) + _.get(data[0], 'stat_summary.passed', 0)} | Total</p>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>      
          </table>
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
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-collapse: collapse; max-width: 600px; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                  <tr>
                    <th align="left" valign="top" bgcolor="#e40000" style="font-family: 'Ciutadella-Regular', Arial, Helvetica, sans-serif; font-size: 24px; mso-line-height-rule: exactly;  color: #ffffff;">Failures</th>                    
                  </tr>
                    ${data[0].test_failures.map(x=> `
                    <tr>
                      <td bgcolor="#ffffff" align="left" class="font-stack font-color body-text" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #1c1c1c; font-family: Roboto, 'Helvetica Neue', HelveticaNeue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0px 25px 20px 25px;">
                        <p style="margin: 0;">
                          <span><b>${x.testSuite} - ${x.testName}</b></span>
                          <div>${x.message}</div>
                        </p>
                      </td>
                    </tr>`).join('')}          
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
      return '<span><p>✅</p></span>';
    } else if(outcome.toLowerCase() == 'failed' ) {
      return '<span><p>❌</p></span>';
    } else {
      return '<span><i></i></span>'
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