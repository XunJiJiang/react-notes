const path = require('path');

module.exports = {
  root: true,
  plugins: ['import'],
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    'import',
    'react-refresh',
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'import/no-unresolved': 'error',
    'prettier/prettier': ['error', { singleQuote: true }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off'
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
        // 从 <root>@types 读取类型定义
        alwaysTryTypes: true
      }
    }
  }
};
