"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.is_server = is_server;
exports.isComponentClass = isComponentClass;
exports.isReactMemo = isReactMemo;
exports["default"] = void 0;

function is_server() {
  if (typeof window !== "undefined" && window.document) {
    return false; // web browser
  } else if (
    typeof navigator != "undefined" &&
    navigator.product == "ReactNative"
  ) {
    return false; // ReactNative https://github.com/facebook/react-native/issues/1331#issuecomment-183903948
  } else {
    return true; // node.js
  }
}

function isComponentClass(Component) {
  return Component.prototype && Component.prototype.render;
}

function isReactMemo(Component) {
  return typeof Component !== "function" && !!Component["$$typeof"];
}

var _default = {
  is_server: is_server,
  isComponentClass: isComponentClass
};
exports["default"] = _default;
