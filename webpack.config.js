const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
        exclude: /node_modules/,
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
  // Uncomment for maximum minification
  // new webpack.optimize.UglifyJsPlugin(),

  // move all this stuff into the /dist folder
  new CopyWebpackPlugin([
    { from: 'manifest.json', to: 'manifest.json' },
    { from: 'html', to: 'html' },
    // CSS assets
    { from: 'css', to: 'css' },
    { from: 'img', to: 'img' },
    // DOM-side extension functionality
    { from: 'js/extension', to: 'js/extension' },
    // Configuration settings JS assets
    { from: 'js/popup/configuration-pages', to: 'js/popup/configuration-pages' }
  ])
 ]
};
