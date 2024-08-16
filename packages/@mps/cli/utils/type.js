const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);

exports.isFunction = (val) => Object.prototype.toString.call(val) === '[object Function]';

exports.isAsyncFunction = (val) => Object.prototype.toString.call(val) === '[object AsyncFunction]';

exports.isArray = (val) => Array.isArray(val);

exports.isMap = (val) => toTypeString(val) === '[object Map]';

exports.isSet = (val) => toTypeString(val) === '[object Set]';

exports.isDate = (val) => toTypeString(val) === '[object Date]';

exports.isRegExp = (val) => toTypeString(val) === '[object RegExp]';

exports.isFunction = (val) => typeof val === 'function';

exports.isString = (val) => typeof val === 'string';

exports.isSymbol = (val) => typeof val === 'symbol';

exports.isObject = (val) => val !== null && typeof val === 'object';
exports.isPromise = (val) => {
  return (
    (this.isObject(val) || this.isFunction(val)) &&
    this.isFunction(val.then) &&
    this.isFunction(val.catch)
  );
};
