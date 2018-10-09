// third-party libraries
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

// webpack common configuration
const common = require('./webpack.config.common.js');

/**
 * @desc development configuration
 */
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader']
      }
    ]
  }
});
