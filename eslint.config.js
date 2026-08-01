const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: ['**/dist', 'implementations'],
  },
  {
    ...importPlugin.flatConfigs.typescript,
    languageOptions: {
      parser: typescriptEslintParser,
    },
    plugins: {
      ...importPlugin.flatConfigs.typescript.plugins,
      '@typescript-eslint': typescriptEslintPlugin,
    },
  },
];
