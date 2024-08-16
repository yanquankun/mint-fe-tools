exports.isFunction = (v) =>
  Object.prototype.toString.call(v) === '[object Function]' ||
  Object.prototype.toString.call(v) === '[object AsyncFunction]';

exports.isArray = (v) => Array.isArray(v);
