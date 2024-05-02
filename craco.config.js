const path = require('path');

module.exports = {
  webpack: {
    // 配置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@img': path.resolve(__dirname, 'src/assets/images'),
    },
    configure: (webpackConfig, { env, paths }) => {
      // 获取到原始的 rules
      webpackConfig.module.rules = [
        ...webpackConfig.module.rules,
        {
          test: /\.(txt|md|markdown)$/i,
          type: 'asset/source',
        },
        {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        },
        // {
        //   test: /\.(png|jpe?g|gif|svg)$/i,
        //   type: 'asset',
        //   parser: {
        //     dataUrlCondition: {
        //       maxSize: 1 * 1024 // 1kb
        //     }
        //   }
        // }
      ];

      return webpackConfig;
    },
  }
}
