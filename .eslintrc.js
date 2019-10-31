module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
            jsx: true,
        },
        useJSXTextNode: true,
        project: './tsconfig.json',
        extraFileExtensions: ['.ts', '.tsx'],
    },
};
