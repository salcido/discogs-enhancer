var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
// var webpack = require('webpack');

module.exports = {
  entry: './js/popup/popup-logic/popup.js',
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
  // new webpack.optimize.UglifyJsPlugin(),
  new CopyWebpackPlugin([
    { from: 'manifest.json', to: 'manifest.json' },
    { from: 'html', to: 'html' },
    { from: 'css', to: 'css' },
    { from: 'img', to: 'img' },
    // DOM-side of extension functionality
    { from: 'js/extension', to: 'js/extension' },
    // Configuration settings pages
    { from: 'js/popup/configuration-pages/about.js', to: 'js/popup/configuration-pages/about.js' },
    { from: 'js/popup/configuration-pages/blocked-sellers.js', to: 'js/popup/configuration-pages/blocked-sellers.js' },
    { from: 'js/popup/configuration-pages/readability.js', to: 'js/popup/configuration-pages/readability.js' }
  ])
 ]
};
