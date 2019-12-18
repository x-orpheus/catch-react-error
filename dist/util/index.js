"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.is_server = is_server;
exports.isComponentClass = isComponentClass;
exports["default"] = void 0;

function is_server() {
  return !(typeof window !== "undefined" && window.document);
}

function isComponentClass(Component) {
  return Component.prototype && Component.prototype.render;
}

var _default = {
  is_server: is_server,
  isComponentClass: isComponentClass
};
exports["default"] = _default;
