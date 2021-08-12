const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const sass = require('node-sass');
const webpack = require('webpack');

const config = './js/popup/configuration-pages/';
const deps = './js/extension/dependencies/';
const features = './js/extension/features/';

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
    // popup.js
    './js/popup/popup-logic/popup': './js/popup/popup-logic/popup.js',
    // background.js
    './js/extension/background': './js/extension/background.js',
    // dependencies
    [deps + 'analytics']: `${deps}analytics.js`,
    [deps + 'update-exchange-rates']: `${deps}update-exchange-rates.js`,
    [deps + 'options']: `${deps}options.js`,
    [deps + 'resource-library']: `${deps}resource-library.js`,
    [deps + 'runtime-messages']: `${deps}runtime-messages.js`,
    [deps + 'tests/unit-tests']: `${deps}tests/unit-tests.js`,
    // features files
    // Adding A Feature: Step 3
    [features + 'average-price']: `${features}average-price.js`,
    [features + 'better-collection-ui']: `${features}better-collection-ui.js`,
    [features + 'block-buyers']: `${features}block-buyers.js`,
    [features + 'block-sellers']: `${features}block-sellers.js`,
    [features + 'blurry-image-fix']: `${features}blurry-image-fix.js`,
    /* [features + 'contextual-menu-search']: <-- Special case: transpiling breaks stuff so needs to be copied via CopyWebpackPlugin below */
    [features + 'confirm-before-removing-react']: `${features}confirm-before-removing-react.js`,
    [features + 'confirm-before-removing']: `${features}confirm-before-removing.js`,
    [features + 'currency-converter']: `${features}currency-converter.js`,
    [features + 'demand-index-react']: `${features}demand-index-react.js`,
    [features + 'demand-index']: `${features}demand-index.js`,
    [features + 'demand-index-marketplace']: `${features}demand-index-marketplace.js`,
    [features + 'editing-notepad']: `${features}editing-notepad.js`,
    [features + 'everlasting-collection-notes']: `${features}everlasting-collection-notes.js`,
    [features + 'everlasting-collection-ratings']: `${features}everlasting-collection-ratings.js`,
    [features + 'everlasting-collection-sm-med']: `${features}everlasting-collection-sm-med.js`,
    [features + 'everlasting-marketplace-release-page']: `${features}everlasting-marketplace-release-page.js`,
    [features + 'everlasting-marketplace']: `${features}everlasting-marketplace.js`,
    [features + 'favorite-sellers']: `${features}favorite-sellers.js`,
    [features + 'feedback-notifier']: `${features}feedback-notifier.js`,
    [features + 'filter-media-condition']: `${features}filter-media-condition.js`,
    [features + 'filter-monitor']: `${features}filter-monitor.js`,
    [features + 'filter-prices']: `${features}filter-prices.js`,
    [features + 'filter-shipping-country']: `${features}filter-shipping-country.js`,
    [features + 'filter-sleeve-condition']: `${features}filter-sleeve-condition.js`,
    [features + 'filter-unavailable']: `${features}filter-unavailable.js`,
    [features + 'friend-counter']: `${features}friend-counter.js`,
    [features + 'force-dashboard']: `${features}force-dashboard.js`,
    [features + 'highlight-comments']: `${features}highlight-comments.js`,
    [features + 'inventory-ratings']: `${features}inventory-ratings.js`,
    [features + 'inventory-scanner']: `${features}inventory-scanner.js`,
    [features + 'links-in-new-tabs']: `${features}links-in-new-tabs.js`,
    [features + 'marketplace-highlights']: `${features}marketplace-highlights.js`,
    [features + 'notes-counter-react']: `${features}notes-counter-react.js`,
    [features + 'notes-counter']: `${features}notes-counter.js`,
    [features + 'quick-search-react']: `${features}quick-search-react.js`,
    [features + 'quick-search']: `${features}quick-search.js`,
    [features + 'random-item-react']: `${features}random-item-react.js`,
    [features + 'random-item']: `${features}random-item.js`,
    [features + 'rating-percent-react']: `${features}rating-percent-react.js`,
    [features + 'rating-percent']: `${features}rating-percent.js`,
    [features + 'relative-sold-date-react']: `${features}relative-sold-date-react.js`,
    [features + 'relative-sold-date']: `${features}relative-sold-date.js`,
    [features + 'release-durations-react']: `${features}release-durations-react.js`,
    [features + 'release-durations']: `${features}release-durations.js`,
    [features + 'release-history-legend']: `${features}release-history-legend.js`,
    [features + 'release-ratings']: `${features}release-ratings.js`,
    [features + 'release-scanner']: `${features}release-scanner.js`,
    [features + 'remove-from-wantlist']: `${features}remove-from-wantlist.js`,
    [features + 'seller-rep']: `${features}seller-rep.js`,
    [features + 'show-sellers-in-cart']: `${features}show-sellers-in-cart.js`,
    [features + 'sort-explore-lists']: `${features}sort-explore-lists.js`,
    [features + 'sort-marketplace-lists']: `${features}sort-marketplace-lists.js`,
    [features + 'sort-personal-lists']: `${features}sort-personal-lists.js`,
    [features + 'suggested-prices-release-page']: `${features}suggested-prices-release-page.js`,
    [features + 'suggested-prices-single']: `${features}suggested-prices-single.js`,
    [features + 'text-format-shortcuts-react']: `${features}text-format-shortcuts-react.js`,
    [features + 'text-format-shortcuts']: `${features}text-format-shortcuts.js`,
    [features + 'show-actual-dates-react']: `${features}show-actual-dates-react.js`,
    [features + 'show-actual-dates']: `${features}show-actual-dates.js`,
    [features + 'toggle-baoi-fields']: `${features}toggle-baoi-fields.js`,
    [features + 'toggle-dark-theme']: `${features}toggle-dark-theme.js`,
    [features + 'toggle-filter-shipping-country-css']: `${features}toggle-filter-shipping-country-css.js`,
    [features + 'toggle-highlights']: `${features}toggle-highlights.js`,
    [features + 'toggle-min-max-columns']: `${features}toggle-min-max-columns.js`,
    [features + 'toggle-youtube-playlists']: `${features}toggle-youtube-playlists.js`,
    [features + 'tracklist-readability-react']: `${features}tracklist-readability-react.js`,
    [features + 'tracklist-readability']: `${features}tracklist-readability.js`,
    [features + 'tweak-discriminators-react']: `${features}tweak-discriminators-react.js`,
    [features + 'tweak-discriminators']: `${features}tweak-discriminators.js`,
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
        query: {
          plugins: ['transform-async-to-generator'],
          presets: ['es2016']
        },
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
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
  new webpack.DefinePlugin({
    __ANALYTICS__: analytics,
    __DEV__: development
  }),
  // move all this stuff into the /dist folder
  new CopyWebpackPlugin([
    { from: 'manifest.json', to: 'manifest.json' },
    { from: 'html', to: 'html' },
    // CSS assets
    { from: 'css/dark-theme.scss', to: 'css/dark-theme.css',
      transform(content, path) {
        let result = sass.renderSync({ file: path });
        return result.css.toString();
      }
    },
    { from: 'css', to: 'css', ignore: ['*.scss'] },
    { from: 'img', to: 'img' },
    // contextual menu searching
    { from: 'js/extension/features/contextual-menu-search.js', to: 'js/extension/features/contextual-menu-search.js' }
  ]),
 ]
};
