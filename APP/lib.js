module.exports = {

  setDefault(value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    } else {
      return value.trim();
    }
  }
};