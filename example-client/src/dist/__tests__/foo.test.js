'use strict';

var _foo = require('../foo');

test('basic', function() {
    expect((0, _foo.sum)()).toBe(0);
});
test('basic again', function() {
    expect((0, _foo.sum)(1, 2)).toBe(3);
});
