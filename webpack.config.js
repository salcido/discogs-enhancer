var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
//var webpack = require('webpack');

module.exports = {
  entry: './js/popup/popup.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
  //  new webpack.optimize.UglifyJsPlugin()
  new CopyWebpackPlugin([
    { from: 'manifest.json', to: 'manifest.json' },
    { from: 'html', to: 'html' },
    { from: 'css', to: 'css' },
    { from: 'img', to: 'img' },
    { from: 'js/extension', to: 'js/extension' },
    { from: 'js/popup/about.js', to: 'js/popup' },
    { from: 'js/popup/blocked-sellers.js', to: 'js/popup/blocked-sellers.js' },
    { from: 'js/popup/readability.js', to: 'js/popup/readability.js' }
  ])
 ]
};
