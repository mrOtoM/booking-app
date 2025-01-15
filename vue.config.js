const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: true,
    host: 'localhost',
  },
  configureWebpack: {
    entry: './src/main.ts',
    plugins: [
      new ESLintPlugin({
        files: 'src/**/*.{js,vue}',
      }),
      new webpack.DefinePlugin({
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  },
});

