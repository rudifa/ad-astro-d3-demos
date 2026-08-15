import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

const sharedGlobals = {
  customElements: 'readonly',
  alert: 'readonly',
  FileReader: 'readonly',
  CustomEvent: 'readonly',
};

export default [
  { ignores: ['.vercel'] },
  js.configs.recommended,
  ...astro.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        ...sharedGlobals,
      },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...sharedGlobals,
      },
    },
  },
];
