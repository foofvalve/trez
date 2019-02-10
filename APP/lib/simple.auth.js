var AUTH = 'autotest:^HCBc#mdCSgGh2}';
var Buffer = require('buffer').Buffer;

module.exports = {
  verify(auth) {
    var check = 'Basic ' + new Buffer(AUTH).toString('base64');
    if (auth === check) {
        return true;
    } else {
        return false;
    }
  }
};