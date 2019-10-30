module.exports = {
    env: {
        es6: true,
    },
    extends: 'eslint:recommended',
    rules: {
        indent: ['warn', 4, { SwitchCase: 0 }],
        'no-script-url': 'off',
    },
    plugins: ['react'],
};
