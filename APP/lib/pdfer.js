var pdf = require('html-pdf');
const fs = require('fs');

module.exports = {
  generatePdf(pathToHtmlFile) {
    var html = fs.readFileSync(pathToHtmlFile, 'utf8');
    var pdfFile = pathToHtmlFile.replace('.html','.pdf')
    var options = { format: 'A3', orientation: 'landscape' };

    pdf.create(html).toFile(pdfFile, function(err, res) {
      if (err) {
        return err;
      } else {
        console.log('Generated => ', pdfFile);
        return true;
      }
    });
  }
}