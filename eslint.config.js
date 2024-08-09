// TODO: Enable ESM import/export
const tsParser = require('@typescript-eslint/parser');

module.exports = [{
  files: [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
  ],
  languageOptions: {
    parser: tsParser,
  },
  rules: {
    /*
     * Forbids importing the un-typed IPC.
     * Use the ones in src/ipc instead.
     */
    'no-restricted-imports': [
      'error',
      {
        paths: [{
          name: 'electron',
          importNames: ['ipcMain', 'ipcRenderer'],
          message: "Use the imports from @/ipc instead"
        }]
      },
    ],
  },
}];
