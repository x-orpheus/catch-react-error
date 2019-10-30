'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = void 0;

var React = _interopRequireWildcard(require('react'));

var _Errorboundary = _interopRequireDefault(
    require('./components/csr/Errorboundary')
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

var EmptyFunc = function EmptyFunc() {
    return 'react component must render something';
};

var FallbackFunc = function FallbackFunc() {
    return React.createElement('div', null, 'loading');
};

var catchreacterror = function catchreacterror() {
    var type =
        arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : 'client';
    var Boundary =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : _Errorboundary['default'];
    return function(traget, key, descriptor) {
        var originalRender = traget.render || EmptyFunc;
        var fallback = traget.fallback || FallbackFunc;

        descriptor.value = function() {
            return React.createElement(
                Boundary,
                {
                    type: type,
                    fallback: fallback,
                },
                originalRender()
            );
        };
    };
};

var _default = catchreacterror;
exports['default'] = _default;
