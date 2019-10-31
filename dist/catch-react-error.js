'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = void 0;

var React = _interopRequireWildcard(require('react'));

var _Errorboundary = _interopRequireDefault(
    require('./components/csr/Errorboundary')
);

var _Errorboundary2 = _interopRequireDefault(
    require('./components/ssr/Errorboundary')
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
    return 'React component must render something';
};

var FallbackFunc = function FallbackFunc() {
    return React.createElement('div', null, 'Something went Wrong');
};

var catchreacterror = function catchreacterror() {
    var type =
        arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : 'client';
    var Boundary = arguments.length > 1 ? arguments[1] : undefined;

    if (type !== 'client' && type !== 'server') {
        type = 'client';
        console.error(
            "Catch-React-Error: type must be 'client' or 'server',default is 'client'"
        );
    }

    if (
        Boundary &&
        !React.Component.prototype.isPrototypeOf(Boundary.prototype)
    ) {
        console.error(
            "Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component. This is likely to cause errors. Change ErrorBoundary to extend React.Component instead."
        );
    }

    if (!Boundary) {
        type === 'client'
            ? (Boundary = _Errorboundary['default'])
            : (Boundary = _Errorboundary2['default']);
    }

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
