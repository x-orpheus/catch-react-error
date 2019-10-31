'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports.serverMarkup = serverMarkup;
exports.is_server = is_server;
exports['default'] = void 0;

var React = _interopRequireWildcard(require('react'));

var _server = require('react-dom/server');

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

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function _getPrototypeOf(o) {
              return o.__proto__ || Object.getPrototypeOf(o);
          };
    return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    }
    return self;
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

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function serverMarkup(props) {
    var element = props.children;

    try {
        var staticMarkup = (0, _server.renderToStaticMarkup)(element);
        return React.createElement('div', {
            dangerouslySetInnerHTML: {
                __html: staticMarkup,
            },
        });
    } catch (e) {
        return props.fallback();
    }
}

function is_server() {
    return !(typeof window !== 'undefined' && window.document);
}

var ErrorBoundary =
    /*#__PURE__*/
    (function(_React$Component) {
        _inherits(ErrorBoundary, _React$Component);

        function ErrorBoundary() {
            var _getPrototypeOf2;

            var _this;

            _classCallCheck(this, ErrorBoundary);

            for (
                var _len = arguments.length, args = new Array(_len), _key = 0;
                _key < _len;
                _key++
            ) {
                args[_key] = arguments[_key];
            }

            _this = _possibleConstructorReturn(
                this,
                (_getPrototypeOf2 = _getPrototypeOf(ErrorBoundary)).call.apply(
                    _getPrototypeOf2,
                    [this].concat(args)
                )
            );

            _defineProperty(_assertThisInitialized(_this), 'state', {
                hasError: false,
            });

            return _this;
        }

        _createClass(
            ErrorBoundary,
            [
                {
                    key: 'componentDidCatch',
                    value: function componentDidCatch(err, info) {
                        console.log(err, info);
                    },
                },
                {
                    key: 'render',
                    value: function render() {
                        if (is_server()) {
                            return serverMarkup(this.props);
                        }

                        if (this.state.hasError) {
                            return React.createElement('div', null, 'loading');
                        }

                        return this.props.children;
                    },
                },
            ],
            [
                {
                    key: 'getDerivedStateFromError',
                    value: function getDerivedStateFromError(err) {
                        return {
                            hasError: true,
                        };
                    },
                },
            ]
        );

        return ErrorBoundary;
    })(React.Component);

_defineProperty(ErrorBoundary, 'defaultProps', {
    fallback: function fallback() {
        return React.createElement('div', null, 'loading');
    },
    type: 'client',
});

var _default = ErrorBoundary;
exports['default'] = _default;
