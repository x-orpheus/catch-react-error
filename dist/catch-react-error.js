"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _DefaultErrorBoundary = _interopRequireDefault(
  require("./components/DefaultErrorBoundary")
);

var _index = require("./util/index");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

var catchreacterror = function catchreacterror() {
  var Boundary =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : _DefaultErrorBoundary["default"];
  return function(InnerComponent) {
    if (Boundary && !Boundary.prototype.isReactComponent) {
      console.warn(
        "The ".concat(Boundary, " component is not a react component")
      );
      Boundary = _DefaultErrorBoundary["default"];
    }

    if (
      Boundary &&
      !(
        Boundary.prototype.componentDidCatch ||
        Boundary.prototype.getDerivedStateFromError
      )
    ) {
      console.warn(
        "".concat(
          Boundary,
          " doesn't has componentDidCatch or getDerivedStateFromError"
        )
      );
      Boundary = _DefaultErrorBoundary["default"];
    }

    if ((0, _index.isComponentClass)(InnerComponent)) {
      if ((0, _index.is_server)()) {
        var originalRender = InnerComponent.prototype.render;

        InnerComponent.prototype.render = function() {
          try {
            return originalRender.apply(this, arguments);
          } catch (error) {
            console.error(error);
            return React.createElement("div", null, "Something is Wrong");
          }
        };
      }

      var WrapperComponent =
        /*#__PURE__*/
        (function(_Component) {
          _inherits(WrapperComponent, _Component);

          function WrapperComponent() {
            _classCallCheck(this, WrapperComponent);

            return _possibleConstructorReturn(
              this,
              _getPrototypeOf(WrapperComponent).apply(this, arguments)
            );
          }

          _createClass(WrapperComponent, [
            {
              key: "render",
              value: function render() {
                var forwardedRef = this.props.forwardedRef;
                return React.createElement(
                  Boundary,
                  null,
                  (0, _index.isComponentClass)(InnerComponent)
                    ? React.createElement(
                        InnerComponent,
                        _extends({}, this.props, {
                          ref: forwardedRef
                        })
                      )
                    : React.createElement(InnerComponent, this.props)
                );
              }
            }
          ]);

          return WrapperComponent;
        })(React.Component);

      return (0, React.forwardRef)(function(props, ref) {
        return React.createElement(
          WrapperComponent,
          _extends(
            {
              forwardedRef: ref
            },
            props
          )
        );
      });
    } else {
      if ((0, _index.is_server)()) {
        var originalFun = InnerComponent;

        InnerComponent = function InnerComponent() {
          try {
            return originalFun.apply(null, arguments);
          } catch (error) {
            console.error(error);
            return React.createElement("div", null, "Something is Wrong");
          }
        };
      }

      return function(props) {
        return React.createElement(
          Boundary,
          null,
          React.createElement(InnerComponent, props)
        );
      };
    }
  };
};

var _default = catchreacterror;
exports["default"] = _default;
