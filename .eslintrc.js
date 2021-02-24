const common = {
  env: {
    node: true,
    es6: true,
    browser: true,
    'jest/globals': true,
  },
  plugins: ['prettier', 'jest'],
  extends: ['airbnb-base', 'prettier', 'plugin:jest/all'],
  rules: {
    'prettier/prettier': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest/expect-expect': 'off',
    'jest/prefer-expect-assertions': 'off',
    'jest/no-test-return-statement': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
    'no-iterator': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'consistent-return': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
  },
}

module.exports = {
  root: true,
  overrides: [
    {
      /*
      eslint-plugin-markdown only finds javascript code block snippet.
      For specific spec, refer to https://github.com/eslint/eslint-plugin-markdown
      */
      files: ['**/*.js', '**/*.md'],
      ...common,
    },
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      env: common.env,
      plugins: [...common.plugins, '@typescript-eslint'],
      extends: [
        ...common.extends,
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
      ],
      rules: {
        ...common.rules,
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
    },
  ],
}
