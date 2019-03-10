var pdf = require('html-pdf');
const fs = require('fs');
const fileChecker = require('../lib').fileExists;

module.exports = {
  generatePdf(pathToHtmlFile) {
    //if (!fileChecker(pathToHtmlFile)) {
    //  return {
    //    result: false,
    //    message: `Unable to find html file [${pathToHtmlFile}]`
    //  };
    //}

    var html = fs.readFileSync(pathToHtmlFile, 'utf8');
    var pdfFile = pathToHtmlFile.replace('.html', '.pdf')
    var options = {
      format: 'A4',
      orientation: 'portrait',
      type: 'png',
      zoomFactor: 4
    };

    try {
      pdf.create(html, options).toFile(pdfFile, function (err, res) {
        if (err) {
          throw err;
        } 
      });

      return {
        result: true,
        message: `Pdf created [${pathToHtmlFile}]`
      };
    } catch {
      return {
        result: false,
        message: `Failed to create [${pathToHtmlFile}]`
      };
    }
  }
}