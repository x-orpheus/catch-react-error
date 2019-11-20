(this.webpackJsonpexample = this.webpackJsonpexample || []).push([
    [0],
    [
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function(e, t, r) {
            'use strict';
            Object.defineProperty(t, '__esModule', { value: !0 });
            var n = {};
            t.default = void 0;
            var o,
                a = (o = r(19)) && o.__esModule ? o : { default: o },
                c = r(8);
            Object.keys(c).forEach(function(e) {
                'default' !== e &&
                    '__esModule' !== e &&
                    (Object.prototype.hasOwnProperty.call(n, e) ||
                        Object.defineProperty(t, e, {
                            enumerable: !0,
                            get: function() {
                                return c[e];
                            },
                        }));
            });
            var u = r(9);
            Object.keys(u).forEach(function(e) {
                'default' !== e &&
                    '__esModule' !== e &&
                    (Object.prototype.hasOwnProperty.call(n, e) ||
                        Object.defineProperty(t, e, {
                            enumerable: !0,
                            get: function() {
                                return u[e];
                            },
                        }));
            });
            var i = r(22);
            Object.keys(i).forEach(function(e) {
                'default' !== e &&
                    '__esModule' !== e &&
                    (Object.prototype.hasOwnProperty.call(n, e) ||
                        Object.defineProperty(t, e, {
                            enumerable: !0,
                            get: function() {
                                return i[e];
                            },
                        }));
            });
            var l = a.default;
            t.default = l;
        },
        function(e, t, r) {
            'use strict';
            Object.defineProperty(t, '__esModule', { value: !0 }),
                (t.default = t.CSRErrorBoundary = void 0);
            var n = (function(e) {
                if (e && e.__esModule) return e;
                var t = o();
                if (t && t.has(e)) return t.get(e);
                var r = {};
                if (null != e) {
                    var n =
                        Object.defineProperty &&
                        Object.getOwnPropertyDescriptor;
                    for (var a in e)
                        if (Object.prototype.hasOwnProperty.call(e, a)) {
                            var c = n
                                ? Object.getOwnPropertyDescriptor(e, a)
                                : null;
                            c && (c.get || c.set)
                                ? Object.defineProperty(r, a, c)
                                : (r[a] = e[a]);
                        }
                }
                (r.default = e), t && t.set(e, r);
                return r;
            })(r(0));
            function o() {
                if ('function' !== typeof WeakMap) return null;
                var e = new WeakMap();
                return (
                    (o = function() {
                        return e;
                    }),
                    e
                );
            }
            function a(e) {
                return (a =
                    'function' === typeof Symbol &&
                    'symbol' === typeof Symbol.iterator
                        ? function(e) {
                              return typeof e;
                          }
                        : function(e) {
                              return e &&
                                  'function' === typeof Symbol &&
                                  e.constructor === Symbol &&
                                  e !== Symbol.prototype
                                  ? 'symbol'
                                  : typeof e;
                          })(e);
            }
            function c(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    (n.enumerable = n.enumerable || !1),
                        (n.configurable = !0),
                        'value' in n && (n.writable = !0),
                        Object.defineProperty(e, n.key, n);
                }
            }
            function u(e) {
                return (u = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function(e) {
                          return e.__proto__ || Object.getPrototypeOf(e);
                      })(e);
            }
            function i(e) {
                if (void 0 === e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return e;
            }
            function l(e, t) {
                return (l =
                    Object.setPrototypeOf ||
                    function(e, t) {
                        return (e.__proto__ = t), e;
                    })(e, t);
            }
            function f(e, t, r) {
                return (
                    t in e
                        ? Object.defineProperty(e, t, {
                              value: r,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                          })
                        : (e[t] = r),
                    e
                );
            }
            var p = (function(e) {
                function t() {
                    var e, r, n, o;
                    !(function(e, t) {
                        if (!(e instanceof t))
                            throw new TypeError(
                                'Cannot call a class as a function'
                            );
                    })(this, t);
                    for (
                        var c = arguments.length, l = new Array(c), p = 0;
                        p < c;
                        p++
                    )
                        l[p] = arguments[p];
                    return (
                        (n = this),
                        (r =
                            !(o = (e = u(t)).call.apply(e, [this].concat(l))) ||
                            ('object' !== a(o) && 'function' !== typeof o)
                                ? i(n)
                                : o),
                        f(i(r), 'state', { hasError: !1, err: new Error() }),
                        r
                    );
                }
                var r, n, o;
                return (
                    (function(e, t) {
                        if ('function' !== typeof t && null !== t)
                            throw new TypeError(
                                'Super expression must either be null or a function'
                            );
                        (e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0,
                            },
                        })),
                            t && l(e, t);
                    })(t, e),
                    (r = t),
                    (o = [
                        {
                            key: 'getDerivedStateFromError',
                            value: function(e) {
                                return { hasError: !0, err: e };
                            },
                        },
                    ]),
                    (n = [
                        {
                            key: 'componentDidCatch',
                            value: function(e, t) {
                                console.log(e, t);
                            },
                        },
                        {
                            key: 'render',
                            value: function() {
                                return this.state.hasError
                                    ? this.props.fallback(this.state.err)
                                    : this.props.children;
                            },
                        },
                    ]) && c(r.prototype, n),
                    o && c(r, o),
                    t
                );
            })(n.Component);
            (t.CSRErrorBoundary = p),
                f(p, 'defaultProps', {
                    fallback: function() {
                        return n.createElement(
                            'div',
                            null,
                            'Something went Wrong'
                        );
                    },
                    type: 'client',
                });
            var s = p;
            t.default = s;
        },
        function(e, t, r) {
            'use strict';
            Object.defineProperty(t, '__esModule', { value: !0 }),
                (t.serverMarkup = s),
                (t.is_server = y),
                (t.default = t.SSRErrorBoundary = void 0);
            var n = (function(e) {
                    if (e && e.__esModule) return e;
                    var t = a();
                    if (t && t.has(e)) return t.get(e);
                    var r = {};
                    if (null != e) {
                        var n =
                            Object.defineProperty &&
                            Object.getOwnPropertyDescriptor;
                        for (var o in e)
                            if (Object.prototype.hasOwnProperty.call(e, o)) {
                                var c = n
                                    ? Object.getOwnPropertyDescriptor(e, o)
                                    : null;
                                c && (c.get || c.set)
                                    ? Object.defineProperty(r, o, c)
                                    : (r[o] = e[o]);
                            }
                    }
                    (r.default = e), t && t.set(e, r);
                    return r;
                })(r(0)),
                o = r(20);
            function a() {
                if ('function' !== typeof WeakMap) return null;
                var e = new WeakMap();
                return (
                    (a = function() {
                        return e;
                    }),
                    e
                );
            }
            function c(e) {
                return (c =
                    'function' === typeof Symbol &&
                    'symbol' === typeof Symbol.iterator
                        ? function(e) {
                              return typeof e;
                          }
                        : function(e) {
                              return e &&
                                  'function' === typeof Symbol &&
                                  e.constructor === Symbol &&
                                  e !== Symbol.prototype
                                  ? 'symbol'
                                  : typeof e;
                          })(e);
            }
            function u(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    (n.enumerable = n.enumerable || !1),
                        (n.configurable = !0),
                        'value' in n && (n.writable = !0),
                        Object.defineProperty(e, n.key, n);
                }
            }
            function i(e) {
                return (i = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function(e) {
                          return e.__proto__ || Object.getPrototypeOf(e);
                      })(e);
            }
            function l(e) {
                if (void 0 === e)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return e;
            }
            function f(e, t) {
                return (f =
                    Object.setPrototypeOf ||
                    function(e, t) {
                        return (e.__proto__ = t), e;
                    })(e, t);
            }
            function p(e, t, r) {
                return (
                    t in e
                        ? Object.defineProperty(e, t, {
                              value: r,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                          })
                        : (e[t] = r),
                    e
                );
            }
            function s(e) {
                var t = e.children;
                try {
                    var r = (0, o.renderToStaticMarkup)(t);
                    return n.createElement('div', {
                        dangerouslySetInnerHTML: { __html: r },
                    });
                } catch (a) {
                    return e.fallback();
                }
            }
            function y() {
                return !('undefined' !== typeof window && window.document);
            }
            var d = (function(e) {
                function t() {
                    var e, r, n, o;
                    !(function(e, t) {
                        if (!(e instanceof t))
                            throw new TypeError(
                                'Cannot call a class as a function'
                            );
                    })(this, t);
                    for (
                        var a = arguments.length, u = new Array(a), f = 0;
                        f < a;
                        f++
                    )
                        u[f] = arguments[f];
                    return (
                        (n = this),
                        (r =
                            !(o = (e = i(t)).call.apply(e, [this].concat(u))) ||
                            ('object' !== c(o) && 'function' !== typeof o)
                                ? l(n)
                                : o),
                        p(l(r), 'state', { hasError: !1, err: new Error() }),
                        r
                    );
                }
                var r, n, o;
                return (
                    (function(e, t) {
                        if ('function' !== typeof t && null !== t)
                            throw new TypeError(
                                'Super expression must either be null or a function'
                            );
                        (e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0,
                            },
                        })),
                            t && f(e, t);
                    })(t, e),
                    (r = t),
                    (o = [
                        {
                            key: 'getDerivedStateFromError',
                            value: function(e) {
                                return { hasError: !0, err: e };
                            },
                        },
                    ]),
                    (n = [
                        {
                            key: 'componentDidCatch',
                            value: function(e, t) {
                                console.log(e, t);
                            },
                        },
                        {
                            key: 'render',
                            value: function() {
                                return y()
                                    ? s(this.props)
                                    : this.state.hasError
                                    ? this.props.fallback(this.state.err)
                                    : this.props.children;
                            },
                        },
                    ]) && u(r.prototype, n),
                    o && u(r, o),
                    t
                );
            })(n.Component);
            (t.SSRErrorBoundary = d),
                p(d, 'defaultProps', {
                    fallback: function() {
                        return n.createElement(
                            'div',
                            null,
                            'Something went Wrong'
                        );
                    },
                    type: 'client',
                });
            var b = d;
            t.default = b;
        },
        ,
        ,
        function(e, t, r) {
            e.exports = r.p + 'static/media/logo.25bf045c.svg';
        },
        function(e, t, r) {
            e.exports = r(24);
        },
        ,
        ,
        ,
        ,
        function(e, t, r) {},
        function(e, t, r) {
            'use strict';
            Object.defineProperty(t, '__esModule', { value: !0 }),
                (t.default = void 0);
            var n = (function(e) {
                    if (e && e.__esModule) return e;
                    var t = u();
                    if (t && t.has(e)) return t.get(e);
                    var r = {};
                    if (null != e) {
                        var n =
                            Object.defineProperty &&
                            Object.getOwnPropertyDescriptor;
                        for (var o in e)
                            if (Object.prototype.hasOwnProperty.call(e, o)) {
                                var a = n
                                    ? Object.getOwnPropertyDescriptor(e, o)
                                    : null;
                                a && (a.get || a.set)
                                    ? Object.defineProperty(r, o, a)
                                    : (r[o] = e[o]);
                            }
                    }
                    (r.default = e), t && t.set(e, r);
                    return r;
                })(r(0)),
                o = c(r(8)),
                a = c(r(9));
            function c(e) {
                return e && e.__esModule ? e : { default: e };
            }
            function u() {
                if ('function' !== typeof WeakMap) return null;
                var e = new WeakMap();
                return (
                    (u = function() {
                        return e;
                    }),
                    e
                );
            }
            var i = function() {
                    return 'React component must render something';
                },
                l = function() {
                    return n.createElement('div', null, 'Something went Wrong');
                },
                f = function() {
                    var e =
                            arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : 'client',
                        t = arguments.length > 1 ? arguments[1] : void 0;
                    return (
                        'client' !== e &&
                            'server' !== e &&
                            ((e = 'client'),
                            console.error(
                                "Catch-React-Error: type must be 'client' or 'server',default is 'client'"
                            )),
                        t &&
                            !n.Component.prototype.isPrototypeOf(t.prototype) &&
                            console.error(
                                "Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component. This is likely to cause errors. Change ErrorBoundary to extend React.Component instead."
                            ),
                        t || (t = 'client' === e ? o.default : a.default),
                        function(r, o, a) {
                            var c = r.render || i,
                                u = r.fallback || l;
                            a.value = function() {
                                return n.createElement(
                                    t,
                                    { type: e, fallback: u },
                                    c()
                                );
                            };
                        }
                    );
                };
            t.default = f;
        },
        ,
        ,
        function(e, t, r) {},
        function(e, t, r) {},
        function(e, t, r) {
            'use strict';
            r.r(t);
            var n,
                o,
                a = r(0),
                c = r.n(a),
                u = r(10),
                i = r.n(u),
                l = (r(18), r(1)),
                f = r(2),
                p = r(4),
                s = r(3),
                y = r(5),
                d = r(11),
                b = r(7),
                v = r.n(b),
                h = (c.a.Component, r(12)),
                m = r.n(h);
            r(23);
            var O =
                    ((n = v()('client', b.CSRErrorBoundary)),
                    (o = (function(e) {
                        function t() {
                            var e, r;
                            Object(l.a)(this, t);
                            for (
                                var n = arguments.length,
                                    o = new Array(n),
                                    a = 0;
                                a < n;
                                a++
                            )
                                o[a] = arguments[a];
                            return (
                                ((r = Object(p.a)(
                                    this,
                                    (e = Object(s.a)(t)).call.apply(
                                        e,
                                        [this].concat(o)
                                    )
                                )).fallback = function(e) {
                                    return c.a.createElement(
                                        'div',
                                        null,
                                        '\u81ea\u5b9a\u4e49\u9519\u8bef\u63d0\u793a\u4fe1\u606f'
                                    );
                                }),
                                r
                            );
                        }
                        return (
                            Object(y.a)(t, e),
                            Object(f.a)(t, [
                                {
                                    key: 'render',
                                    value: function() {
                                        return c.a.createElement(g, {
                                            text: 'click me',
                                        });
                                    },
                                },
                            ]),
                            t
                        );
                    })(c.a.Component)),
                    Object(d.a)(
                        o.prototype,
                        'render',
                        [n],
                        Object.getOwnPropertyDescriptor(o.prototype, 'render'),
                        o.prototype
                    ),
                    o),
                g = (function(e) {
                    function t() {
                        return (
                            Object(l.a)(this, t),
                            Object(p.a)(
                                this,
                                Object(s.a)(t).apply(this, arguments)
                            )
                        );
                    }
                    return (
                        Object(y.a)(t, e),
                        Object(f.a)(t, [
                            {
                                key: 'render',
                                value: function() {
                                    return c.a.createElement(
                                        'button',
                                        null,
                                        'click me'
                                    );
                                },
                            },
                            {
                                key: 'componentDidMount',
                                value: function() {
                                    console.log({}.a.b);
                                },
                            },
                        ]),
                        t
                    );
                })(c.a.Component),
                j = function() {
                    return c.a.createElement(
                        'div',
                        { className: 'App' },
                        c.a.createElement(
                            'header',
                            { className: 'App-header' },
                            c.a.createElement('img', {
                                src: m.a,
                                className: 'App-logo',
                                alt: 'logo',
                            }),
                            c.a.createElement(O, null)
                        )
                    );
                };
            Boolean(
                'localhost' === window.location.hostname ||
                    '[::1]' === window.location.hostname ||
                    window.location.hostname.match(
                        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
                    )
            );
            i.a.render(
                c.a.createElement(j, null),
                document.getElementById('root')
            ),
                'serviceWorker' in navigator &&
                    navigator.serviceWorker.ready.then(function(e) {
                        e.unregister();
                    });
        },
    ],
    [[13, 1, 2]],
]);
//# sourceMappingURL=main.8c4d8352.chunk.js.map
