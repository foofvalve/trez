var writeFile = require('write');

module.exports = {
  generateHtml(data, trend, saveLocation) {
    var html = `
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
          <div>
            <span>Summary</span>
            <div>Passed: ${data[0].stat_summary.Passed}</div>
            <div>Failed: ${data[0].stat_summary.Failed}</div>
            <div>Total: ${data[0].stat_summary.Failed + data[0].stat_summary.Passed}</div>
            <hr/>
            <div>Build: ${data[0].test_details[0].meta[0].build}</div>
            <div>IQ Env: ${data[0].test_details[0].meta[0].iqEnv}</div>
            <div>Host: ${data[0].test_details[0].meta[0].host}</div>
          </div>
          <br />
          <hr/>
          <div>
            <span>Test Suites</span>
            <table>
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
              <table>
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
              <table>
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
    
    //console.log(html);

    writeFile(saveLocation, html, function(err) {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log('Generated => ', saveLocation);
        return true;
      }
    });
  }
};