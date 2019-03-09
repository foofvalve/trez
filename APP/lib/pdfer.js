var pdf = require('html-pdf');
const fs = require('fs');

module.exports = {
  generatePdf(pathToHtmlFile) {
    var html = fs.readFileSync(pathToHtmlFile, 'utf8');
    var pdfFile = pathToHtmlFile.replace('.html','.pdf')

    pdf.create(html, options).toFile(pdfFile, function(err, res) {
      if (err) {
        return err;
      } else {
        return true;
      }
    });
  }
}