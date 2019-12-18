"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sum = void 0;

var sum = function sum() {
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }

  return a.reduce(function (acc, val) {
    return acc + val;
  }, 0);
};

exports.sum = sum;