// config-overrides.js

const {
  override,
  addWebpackModuleRule,
  addWebpackAlias
} = require('customize-cra');

const path = require("path");

module.exports = override(
  addWebpackModuleRule({
    test: /\.txt$|\.md$/,
    use: 'raw-loader',
  }),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@pages': path.resolve(__dirname, 'src/pages'),
  })
);
