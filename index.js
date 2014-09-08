'use strict';

//====================================================================

var Bluebird = require('bluebird');
var logSymbols = require('log-symbols');

//====================================================================

var isNumber, isString;
(function (toS) {
  toS = toS.call.bind(toS);
  var _ = function (ref) {
    ref = toS(ref);
    return function (val) {
      return toS(val) === ref;
    };
  };

  isNumber = _(0);
  isString = _('');
})(Object.prototype.toString);

//====================================================================

var prettyFormat = function (value) {
  // Extract real error from Bluebird's wrapper.
  if (value instanceof Bluebird.OperationalError) {
    value = value.cause;
  }

  if (isString(value)) {
    return value;
  }

  if (value instanceof Error) {
    return value.message +'\n'+ value.stack;
  }

  return JSON.stringify(value, null, 2);
};

var onSuccess = function (value) {
    if (value !== undefined) {
      console.log(prettyFormat(value));
    }

    process.exit(0);
};

var onError = function (error) {
    console.error(logSymbols.error, prettyFormat(error));

    process.exit(1);
};

//====================================================================

module.exports = function (fn) {
  return Bluebird.try(fn, [process.argv.slice(2)]).then(
    onSuccess,
    onError
  );
};
