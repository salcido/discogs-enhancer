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
    // Popup-related / configuration pages CSS assets
    { from: 'css/popup/about.css', to: 'css/popup/about.css' },
    { from: 'css/popup/popup-block-sellers.css', to: 'css/popup/popup-block-sellers.css' },
    { from: 'css/popup/popup-readability.css', to: 'css/popup/popup-readability.css' },
    { from: 'css/popup/toggle-style.css', to: 'css/popup/toggle-style.css' },
    // DOM-side injected CSS assets
    { from: 'css/blocked-seller.css', to: 'css/blocked-seller.css'},
    { from: 'css/currency-converter.css', to: 'css/currency-converter.css'},
    { from: 'css/dark-theme.css', to: 'css/dark-theme.css'},
    { from: 'css/edit-release.css', to: 'css/edit-release.css' },
    { from: 'css/everlasting-marketplace.css', to: 'css/everlasting-marketplace.css'},
    { from: 'css/feedback-notifier.css', to: 'css/feedback-notifier.css'},
    { from: 'css/filter-by-country.css', to: 'css/filter-by-country.css'},
    { from: 'css/marketplace-highlights.css', to: 'css/marketplace-highlights.css'},
    { from: 'css/suggested-prices.css', to: 'css/suggested-prices.css'},
    { from: 'css/text-format-shortcuts.css', to: 'css/text-format-shortcuts.css'},
    { from: 'img', to: 'img' },
    // DOM-side extension functionality
    { from: 'js/extension', to: 'js/extension' },
    // Configuration settings JS assets
    { from: 'js/popup/configuration-pages/about.js', to: 'js/popup/configuration-pages/about.js' },
    { from: 'js/popup/configuration-pages/blocked-sellers.js', to: 'js/popup/configuration-pages/blocked-sellers.js' },
    { from: 'js/popup/configuration-pages/readability.js', to: 'js/popup/configuration-pages/readability.js' }
  ])
 ]
};
