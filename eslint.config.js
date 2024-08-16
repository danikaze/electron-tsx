import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    // ignores on its own object acts as a global ignore
    // (affecting any other configuration ^^)
    ignores: ['.git/', 'out/', 'coverage/', '.eslintcache', 'node_modules/'],
  },
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // note that tsconfig requires `{ allowJs: true }`
        // so it includes `this eslint.config.js`
        project: './tsconfig.json',
      },
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
      '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
      /*
       * Forbids importing the un-typed IPC.
       * Use the ones in src/ipc instead.
       */
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'electron',
              importNames: ['ipcMain', 'ipcRenderer'],
              message: 'Use the imports from @/ipc instead',
            },
          ],
          patterns: [
            {
              group: ['*i18next*'],
              message: 'Please use the provided utils/i18n instead',
            },
          ],
        },
      ],

      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],

      // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/naming-convention.md
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
        },
        // destructured variables come from other places so no format is enforced
        {
          selector: 'variable',
          modifiers: ['destructured'],
          format: null,
        },
        // imports also come from other places so no format is enforced
        {
          selector: 'import',
          format: null,
        },
        // Constants can also be camelCase apart from UPPER_CASE
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE', 'camelCase'],
        },
        // functions defined as constants should have the same format as functions
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase', 'PascalCase'],
        },
        // functions can be:
        // - regular functions (camelCase)
        // - functional components (PascalCase)
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // type definitions (class, interface, typeAlias, enum, typeParameter)
        // should be PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // each member of an enum (const-like) should be UPPER_CASE
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
        {
          // Ignore properties that require quotes
          selector: [
            'classProperty',
            'objectLiteralProperty',
            'typeProperty',
            'classMethod',
            'objectLiteralMethod',
            'typeMethod',
            'accessor',
            'enumMember',
          ],
          format: null,
          modifiers: ['requiresQuotes'],
        },
      ],
    },
  },
];
