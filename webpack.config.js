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
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
       test: /\.(png|jpg|gif)$/,
       use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
  // Don't minify
  // new webpack.optimize.UglifyJsPlugin(),

  // move all this stuff into the /dist folder
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
