const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const sass = require('sass');
const webpack = require('webpack');
const fs = require('fs');
const generateManifest = require('./manifest.template.js');

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

let firefoxENV,
    chromeENV;

let setPlatform = function() {
  switch (process.env.PLATFORM) {
    case 'chrome':
      firefoxENV = false;
      chromeENV = true;
      break;
    case 'firefox':
      firefoxENV = true;
      chromeENV = false;
      break;
    default:
      firefoxENV = false;
      chromeENV = true;
      break;
  }
};

setPlatform();

module.exports = () => {

  let outputDir = 'dist';

  if (process.env.PLATFORM === 'chrome') {
    outputDir = 'chrome-dist';
  } else if (process.env.PLATFORM === 'firefox') {
    outputDir = 'firefox-dist';
  }

  // Ensure output directory exists before rendering manifest
  const outputPath = path.resolve(__dirname, outputDir);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Generate manifest.json
  const manifest = generateManifest(process.env.PLATFORM);
  fs.writeFileSync(
    path.join(outputPath, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  return {
    entry: {
      './js/popup/popup-logic/popup': './js/popup/popup-logic/popup.js',
      // popup configs
      [config + 'backup-restore']: `${config}backup-restore.js`,
      [config + 'blocked-sellers']: `${config}blocked-sellers.js`,
      [config + 'favorite-sellers']: `${config}favorite-sellers.js`,
      [config + 'filter-shipping-country']: `${config}filter-shipping-country.js`,
      [config + 'learn']: `${config}learn.js`,
      [config + 'readability']: `${config}readability.js`,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, outputDir),
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
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __ANALYTICS__: analytics,
        __DEV__: development,
        __FIREFOX__: firefoxENV,
        __CHROME__: chromeENV
      }),
      // move all this stuff into the /dist folder
      new CopyWebpackPlugin({
        patterns: [
          { from: 'html', to: 'html' },
          { from: 'img', to: 'img' },
          { from: 'js/extension', to: 'js/extension' },
          // CSS assets
          {
            from: 'css/dark-theme.scss', to: 'css/dark-theme.css',
            transform(content, filePath) {
              return sass.renderSync({ file: filePath }).css.toString();
            },
          },
          {
            from: 'css/new-release-page-fixes.scss', to: 'css/new-release-page-fixes.css',
            transform(content, filePath) {
              return sass.renderSync({ file: filePath }).css.toString();
            },
          },
          {
            from: 'css/compact-artist.scss', to: 'css/compact-artist.css',
            transform(content, filePath) {
              return sass.renderSync({ file: filePath }).css.toString();
            },
          },
          {
            from: 'css/compact-marketplace.scss', to: 'css/compact-marketplace.css',
            transform(content, filePath) {
              return sass.renderSync({ file: filePath }).css.toString();
            },
          },
          {
            from: 'css',
            to: 'css',
            globOptions: {
              ignore: ['**/*.scss'],
            },
          },
        ],
      }),
    ],
  };
};
