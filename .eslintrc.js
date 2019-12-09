const eslintrc = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-escape': 0,
    'no-unused-vars': 0,
    'comma-dangle': [2, 'always-multiline'],
    'no-restricted-globals': 0,
    'import/no-unresolved': 0,
    'space-before-function-paren': 2,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  globals: {
    Window: 'readonly',
  },
};

module.exports = eslintrc;
