const moment = require('moment');

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
    if(fromDateish.isValid()) {
      console.log(`fromDateish.unix() => ${fromDateish.unix()}`)
      return fromDateish.unix();
    } else {
      console.log(`moment().add(-1, 'day').unix() => ${moment().add(-1, 'day').unix()}`)
      return moment().add(-1, 'day').unix();
    }
  },
  setToDate(possibleDate) {
    var toDateish = moment(possibleDate);
    if(toDateish.isValid()) {
      console.log(`toDateish.unix() => ${toDateish.unix()}`)
      return toDateish.unix();
    } else {
      console.log(`moment().unix() => ${moment().unix()}`)
      return moment().unix();
    }
  }
};