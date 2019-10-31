'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
var _exportNames = {};
exports['default'] = void 0;

var _catchReactError = _interopRequireDefault(require('./catch-react-error'));

var _Errorboundary = require('./components/csr/Errorboundary');

Object.keys(_Errorboundary).forEach(function(key) {
    if (key === 'default' || key === '__esModule') return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _Errorboundary[key];
        },
    });
});

var _Errorboundary2 = require('./components/ssr/Errorboundary');

Object.keys(_Errorboundary2).forEach(function(key) {
    if (key === 'default' || key === '__esModule') return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _Errorboundary2[key];
        },
    });
});

var _propsInterface = require('./interface/propsInterface');

Object.keys(_propsInterface).forEach(function(key) {
    if (key === 'default' || key === '__esModule') return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _propsInterface[key];
        },
    });
});

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var _default = _catchReactError['default'];
exports['default'] = _default;
