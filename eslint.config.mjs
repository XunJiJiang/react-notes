import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import _import from 'eslint-plugin-import';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintTs from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const includeFiles = (files, ...configs) => {
  return configs.map((config) => {
    const _files = config.files ?? [...files];
    return {
      ...config,
      files: _files
    };
  });
};

export default [
  {
    ignores: ['**/.eslintrc.cjs', 'node_modules', 'dist']
  },
  // 对 ts 文件进行检查
  ...eslintTs.config(
    ...includeFiles(
      ['**/*.ts', '**/*.tsx'],
      ...fixupConfigRules(
        compat.extends(
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
          'plugin:react-hooks/recommended',
          'plugin:react/recommended',
          'plugin:prettier/recommended'
        )
      )
    ),
    {
      plugins: {
        'eslint-plugin-react': react,
        import: fixupPluginRules(_import),
        'react-refresh': reactRefresh,
        'eslint-plugin-prettier': prettier
      },

      languageOptions: {
        globals: {
          ...globals.browser
        },

        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',

        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      },

      settings: {
        react: {
          version: 'detect'
        },

        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx']
        },

        'import/resolver': {
          vite: {
            viteConfig: {
              resolve: {
                alias: {
                  '@': path.resolve(__dirname, 'src'),
                  '@components': path.resolve(__dirname, 'src/components'),
                  '@utils': path.resolve(__dirname, 'src/utils'),
                  '@pages': path.resolve(__dirname, 'src/pages'),
                  '@img': path.resolve(__dirname, 'src/assets/images'),
                  '@type': path.resolve(__dirname, 'src/types')
                }
              }
            }
          },

          typescript: {
            alwaysTryTypes: true
          }
        }
      },

      rules: {
        'react-refresh/only-export-components': [
          'warn',
          {
            allowConstantExport: true
          }
        ],

        'import/no-unresolved': 'error',

        // 'prettier/prettier': [
        //   'error',
        //   {
        //     singleQuote: true
        //   }
        // ],

        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off'
      }
    }
  ),
  // 对 js 文件进行检查
  ...includeFiles(
    ['**/*.js', '**/*.jsx', '**/*.mjs'],
    ...fixupConfigRules(
      compat.extends('eslint:recommended', 'plugin:prettier/recommended')
    ),
    {
      plugins: {
        import: fixupPluginRules(_import),
        'eslint-plugin-prettier': prettier
      },
      languageOptions: {
        globals: { ...globals.node },
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    }
  )
];
