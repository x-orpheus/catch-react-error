'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = void 0;

var React = _interopRequireWildcard(require('react'));

var _Errorboundary = _interopRequireDefault(
    require('./components/Errorboundary')
);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _getRequireWildcardCache() {
    if (typeof WeakMap !== 'function') return null;
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
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    if (obj != null) {
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
    }
    newObj['default'] = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}

function _typeof(obj) {
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj;
        };
    }
    return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
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
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError(
            'Super expression must either be null or a function'
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, writable: true, configurable: true },
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

var FallbackFunc = function FallbackFunc() {
    return React.createElement('div', null, 'Loading');
};

var isClass = function isClass(func) {
    return (
        typeof func === 'function' &&
        /^class\s/.test(Function.prototype.toString.call(func))
    );
};

var isFunction = function isFunction(func) {
    return (
        typeof func === 'function' &&
        !/^class\s/.test(Function.prototype.toString.call(func))
    );
};

var catchreacterror = function catchreacterror() {
    var Boundary =
        arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : _Errorboundary['default'];
    return function(InnerComponent, fb) {
        if (
            Boundary &&
            !React.Component.prototype.isPrototypeOf(Boundary.prototype)
        ) {
            console.warn(
                "Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component.  ErrorBoundary must extends React.Component"
            );
            Boundary = _Errorboundary['default'];
            return;
        }

        var fallback =
            fb ||
            (InnerComponent.prototype && InnerComponent.prototype.fallback) ||
            FallbackFunc;
        return (
            /*#__PURE__*/
            (function(_React$Component) {
                _inherits(_class, _React$Component);

                function _class() {
                    _classCallCheck(this, _class);

                    return _possibleConstructorReturn(
                        this,
                        _getPrototypeOf(_class).apply(this, arguments)
                    );
                }

                _createClass(_class, [
                    {
                        key: 'render',
                        value: function render() {
                            return React.createElement(
                                Boundary,
                                {
                                    fallback: fallback,
                                },
                                React.createElement(InnerComponent, this.props)
                            );
                        },
                    },
                ]);

                return _class;
            })(React.Component)
        );
    };
};

var _default = catchreacterror;
exports['default'] = _default;
