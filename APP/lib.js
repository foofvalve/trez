const moment = require('moment');
const fs =  require('fs');

module.exports = {

  setDefault(value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    } else {
      return value.trim();
    }
  },
  setFromDate(possibleDate) {
    var fromDateish = moment(possibleDate);
    if (fromDateish.isValid()) {
      return fromDateish.format('YYYY-MM-DD');
    } else {
      return moment().add(-1, 'day').format('YYYY-MM-DD');
    }
  },
  setToDate(possibleDate) {
    var toDateish = moment(possibleDate);
    if (toDateish.isValid()) {
      return toDateish.format('YYYY-MM-DD');
    } else {
      return moment().format('YYYY-MM-DD');
    }
  },
  fileExists(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  }
};