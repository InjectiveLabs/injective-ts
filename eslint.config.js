import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import noEnumRule from './scripts/eslint-rules/no-enum.js'

export default [
  // Ignore patterns
  {
    ignores: [
      'proto/**',
      'protoV2/**',
      '**/*.d.ts',
      '**/dist/**',
      'deprecated/**',
      'node_modules/**',
      '.rollup.cache/**',
      'bundle-analysis/dist/**',
    ],
  },
  // Base configuration for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
      perfectionist: perfectionist,
      prettier: prettier,
      custom: {
        rules: {
          'no-enum': noEnumRule,
        },
      },
    },
    rules: {
      // Enforce type-only imports where appropriate
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      // Enforce type-only exports where appropriate
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: false,
        },
      ],
      // Prevent type import side effects
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // Disable the base import/no-duplicates rule as it conflicts with type imports
      'import/no-duplicates': 'off',
      // Enhanced import sorting with more granular groups
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
            'type',
            'internal-type',
            ['parent-type', 'sibling-type', 'index-type'],
          ],
          newlinesBetween: 'ignore',
          internalPattern: ['^@/', '^~/', '^#'],
        },
      ],
      // Sort named imports alphabetically by line length
      'perfectionist/sort-named-imports': [
        'error',
        { type: 'line-length', order: 'asc' },
      ],
      // Sort exports alphabetically by line length
      'perfectionist/sort-exports': [
        'error',
        { type: 'line-length', order: 'asc' },
      ],
      // Allow .js extensions in TypeScript files (for ESM compatibility)
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      // Allow unused vars that start with underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Allow console in development
      'no-console': 'warn',
      // Allow any type (useful for complex types)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable prefer-destructuring for object properties (too strict for this codebase)
      'prefer-destructuring': 'off',
      // Disable prefer-default-export (not suitable for library code)
      'import/prefer-default-export': 'off',
      // Disable no-use-before-define for TypeScript (TypeScript handles this better)
      'no-console': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      // Custom rule to discourage enums in favor of type + const pattern
      'custom/no-enum': 'error',
      // Enforce spacing inside object/type brackets
      'object-curly-spacing': ['error', 'always'],
      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  // Base configuration for JavaScript files
  {
    files: ['**/*.{js,jsx,cjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  // Base configuration for CommonJS files
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
    },
    plugins: {
      import: importPlugin,
      perfectionist: perfectionist,
      prettier: prettier,
    },
    rules: {
      // Enhanced import sorting
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
            'type',
            'internal-type',
            ['parent-type', 'sibling-type', 'index-type'],
          ],
          newlinesBetween: 'ignore',
          internalPattern: ['^@/', '^~/', '^#'],
        },
      ],
      'perfectionist/sort-named-imports': [
        'error',
        { type: 'line-length', order: 'asc' },
      ],
      'perfectionist/sort-exports': [
        'error',
        { type: 'line-length', order: 'asc' },
      ],
      // Allow console in development
      'no-console': 'warn',
      // Disable prefer-destructuring for object properties (too strict for this codebase)
      'prefer-destructuring': 'off',
      // Disable prefer-default-export (not suitable for library code)
      'import/prefer-default-export': 'off',
      // Disable no-use-before-define for JavaScript
      'no-use-before-define': 'off',
      // Enforce spacing inside object brackets
      'object-curly-spacing': ['error', 'always'],
      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  // Test files configuration
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js', '**/*.spec.js'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  // Prettier config to disable conflicting rules
  prettierConfig,
]
