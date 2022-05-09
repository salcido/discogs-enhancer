const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const sass = require('sass');
const webpack = require('webpack');

const config = './js/popup/configuration-pages/';

let analytics,
    development;

let setupAnalytics = function() {
  switch (process.env.NODE_ENV) {
    case 'production':
      analytics = true;
      development = false;
      break;
    case 'development':
      analytics = false;
      development = true;
      break;
    default:
      analytics = false;
      development = true;
      break;
  }
};

setupAnalytics();

module.exports = {
  entry: {
    './js/popup/popup-logic/popup': './js/popup/popup-logic/popup.js',
    // popup configs
    [config + 'blocked-sellers']: `${config}blocked-sellers.js`,
    [config + 'favorite-sellers']: `${config}favorite-sellers.js`,
    [config + 'filter-shipping-country']: `${config}filter-shipping-country.js`,
    [config + 'learn']: `${config}learn.js`,
    [config + 'readability']: `${config}readability.js`,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
       test: /\.(png|jpg|gif|svg)$/,
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
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
  new webpack.DefinePlugin({
    __ANALYTICS__: analytics,
    __DEV__: development
  }),
  // move all this stuff into the /dist folder
  new CopyWebpackPlugin({
    patterns: [
      { from: 'html', to: 'html' },
      { from: 'img', to: 'img' },
      { from: 'js/extension', to: 'js/extension' },
      { from: 'manifest.json', to: 'manifest.json' },
      // CSS assets
      { from: 'css/dark-theme.scss', to: 'css/dark-theme.css',
        transform(content, path) {
          let result = sass.renderSync({ file: path });
          return result.css.toString();
        }
      },
      { from: 'css/new-release-page-fixes.scss', to: 'css/new-release-page-fixes.css',
        transform(content, path) {
          let result = sass.renderSync({ file: path });
          return result.css.toString();
        }
      },
      {
        from: 'css',
        to: 'css',
        globOptions: {
          ignore: ['**/*.scss']
        }
      }
    ]
  }),
 ]
};
