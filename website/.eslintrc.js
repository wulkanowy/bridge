module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/prefer-default-export': ['warn'],
    "prefer-destructuring": ["error", {
      "array": false,
      "object": true
    }]
  },
  overrides: [
    {
      files: './src/graphql/generated.ts',
      rules: {
        'max-len': ['off']
      },
    },
    {
      files: '**/*.vue',
      rules: {
        'class-methods-use-this': ['off']
      }
    }
  ],
};
