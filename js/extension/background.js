/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This is the background service worker. It handles update badge notifications
 * and adding / removing contextual menu items.
 *
 */

// ========================================================
// Install/Update Notifications
// ========================================================
chrome.runtime.onInstalled.addListener((details) => {

  let previousVersion,
      thisVersion;

    if (details.reason === 'install') {

    console.log('Welcome to the pleasuredome!');

    chrome.storage.sync.set({ didUpdate: false }, function() {});

    } else if (details.reason === 'update') {

    // - Don't show an update notice on patches -
    previousVersion = details.previousVersion.split('.');

    thisVersion = chrome.runtime.getManifest().version.split('.');

    if ( Number(thisVersion[0]) > Number(previousVersion[0]) ||
        Number(thisVersion[1]) > Number(previousVersion[1]) ) {

      chrome.action.setBadgeText({text: ' '});

      chrome.action.setBadgeBackgroundColor({color: '#4cb749'});

      chrome.storage.sync.set({ didUpdate: true }, function() {});
    }

    // Instantiate Contextual Menu Options
    updateContextMenus();
  }
})

// ========================================================
// Contextual Menus
// ========================================================
/**
 * Creates a context menu in Chrome
 * @param {string} name - The name that is displayed in the context menu
 */
function createContextMenu(name) {

  let id = name.split(' ').join('').toLowerCase();

  chrome.contextMenus.create({
    contexts: ['selection'],
    id: id,
    title: 'Search for "%s" on ' + name
  });
}

/**
 * Creates a context menu in Chrome
 * @param {string} name - The name that will be displayed in the context menu
 */
function createContextMenu(name) {

  let id = name.split(' ').join('').toLowerCase();

  chrome.contextMenus.create({
    contexts: ['selection'],
    id: id,
    title: 'Search for "%s" on ' + name
  });
}

/**
 * Creates contextual menus based on the user's saved preferences
 * @returns {undefined}
 */
function updateContextMenus() {
  chrome.storage.sync.get('prefs', ({ prefs }) => {
    // Put Discogs first...
    if (prefs.useDiscogs) {
      createContextMenu('Discogs');
    }

    // Then the remaining stores in alphabetical order
    if (prefs.useAllDay) {
      createContextMenu('All Day');
    }

    if (prefs.useBandcamp) {
      createContextMenu('Bandcamp');
    }

    if (prefs.useBeatport) {
      createContextMenu('Beatport');
    }

    if (prefs.useBoomkat) {
      createContextMenu('Boomkat');
    }

    if (prefs.useClone) {
      createContextMenu('Clone');
    }

    if (prefs.useDeejay) {
      createContextMenu('DeeJay');
    }

    if (prefs.useEarcave) {
      createContextMenu('Earcave');
    }

    if (prefs.useGramaphone) {
      createContextMenu('Gramaphone');
    }

    if (prefs.useHardwax) {
      createContextMenu('Hardwax');
    }

    if (prefs.useJuno) {
      createContextMenu('Juno');
    }

    if (prefs.useOye) {
      createContextMenu('Oye');
    }

    if (prefs.usePhonica) {
      createContextMenu('Phonica');
    }

    if (prefs.useRateYourMusic) {
      createContextMenu('Rate Your Music');
    }

    if (prefs.useRedeye) {
      createContextMenu('Red Eye');
    }

    if (prefs.useRushhour) {
      createContextMenu('Rush Hour');
    }

    if (prefs.useSotu) {
      createContextMenu('SOTU');
    }

    if (prefs.useYoutube) {
      createContextMenu('YouTube');
    }
  })
}

// ========================================================
// Contextual Menu Add / Remove
// ========================================================
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    chrome.contextMenus.removeAll();
    updateContextMenus();
    if (msg.request === 'updateContextMenu') {

    }
  });
})
