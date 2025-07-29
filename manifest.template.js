const pkg = require('./package.json');

module.exports = (env) => {
  const firefox = env === 'firefox';
  return {
    manifest_version: 3,
    name: 'Discogs Enhancer',
    short_name: 'Discogs Enhancer',
    description: 'Enhance your Discogs experience with dark themes, seller tools, price comparisons, currency conversion, powerful filters, and more!',
    version: pkg.version,
    author: 'Matthew Salcido',
    homepage_url: 'https://www.discogs-enhancer.com',
    action: {
      default_icon: {
        16: 'img/icon_16.png',
        32: 'img/icon_32.png',
        48: 'img/icon_48.png',
        128: 'img/icon_128.png'
      },
      default_title: 'Discogs Enhancer',
      default_popup: 'html/popup.html'
    },
    content_scripts: [
      {
        matches: ['*://*.discogs.com/*'],
        js: ['js/extension/user-preferences.js'],
        css: ['css/dark-theme.css'],
        run_at: 'document_start'
      }
    ],
    permissions: [
      'activeTab',
      'contextMenus',
      'scripting',
      'storage'
    ],
    icons: {
      16: 'img/icon_16.png',
      32: 'img/icon_32.png',
      48: 'img/icon_48.png',
      128: 'img/icon_128.png'
    },
    web_accessible_resources: [
      {
        resources: [
          'css/*',
          'js/extension/dependencies/*',
          'js/extension/features/*'
        ],
        matches: ['*://*.discogs.com/*']
      }
    ],
    // Firefox Specific
    ...(firefox ? {
      background: {
        scripts: [
          'js/extension/background.js'
        ],
      },
      browser_specific_settings: {
        gecko: {
          id: '{190dbc44-5dee-4ad4-86e9-a38d7a2d1c61}',
        },
      },
      host_permissions: [
        '*://*.discogs.com/*'
      ],
    // Chrome Specific
    } : {
      background: {
        service_worker: 'js/extension/background.js',
      },
      minimum_chrome_version: '88',
    }),
  };
};
