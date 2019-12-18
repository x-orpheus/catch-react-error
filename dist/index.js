"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports["default"] = void 0;

var _catchReactError = _interopRequireDefault(require("./catch-react-error"));

var _DefaultErrorBoundary = require("./components/DefaultErrorBoundary");

Object.keys(_DefaultErrorBoundary).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DefaultErrorBoundary[key];
    }
  });
});

var _propsInterface = require("./interface/propsInterface");

Object.keys(_propsInterface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _propsInterface[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _catchReactError["default"];
exports["default"] = _default;