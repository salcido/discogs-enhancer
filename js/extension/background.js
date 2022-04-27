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

chrome.runtime.onInstalled.addListener((details) => {
  // ========================================================
  // Install/Update Notifications
  // ========================================================
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
  }

  // ========================================================
  // Contextual Menu Click Events
  // ========================================================
  chrome.contextMenus.onClicked.addListener((event) => {

    let path,
        suffix = ''

    switch (event.menuItemId) {
      case 'allday':
        path = 'https://www.alldayrecords.com/search?type=product&q='
        break

      case 'bandcamp':
        path = 'https://bandcamp.com/search?q='
        break

      case 'beatport':
        path = 'https://www.beatport.com/search?q='
        break

      case 'boomkat':
        path = 'https://boomkat.com/products?q[keywords]='
        break

      case 'clone':
        path = 'https://clone.nl/search/?instock=1&query='
        break

      case 'deejay':
        path = 'http://www.deejay.de/'
        break

      case 'discogs':
        path = 'http://www.discogs.com/search?q=';
        break

      case 'earcave':
        path = 'https://earcave.com/search?type=product&q=';
        break
      case 'gramaphone':
        path = 'https://gramaphonerecords.com/search?q=';
        break

      case 'hardwax':
        path = 'https://hardwax.com/?search=';
        break

      case 'juno':
        path = 'https://www.juno.co.uk/search/?q%5Ball%5D%5B%5D=';
        break

      case 'oye':
        path = 'https://oye-records.com/search?q=';
        break

      case 'phonica':
        path = 'http://www.phonicarecords.com/search/';
        break

      case 'rateyourmusic':
        path = 'https://rateyourmusic.com/search?searchterm=';
        suffix = '&type=l';
        break

      case 'redeye':
        path = 'https://www.redeyerecords.co.uk/search/?searchType=Artist&keywords=';
        suffix = '&type=l'
        break

      case 'rushhour':
        path = 'http://www.rushhour.nl/search?sort_by=&query=';
        break

      case 'sotu':
        path = 'https://soundsoftheuniverse.com/search/?q=';
        break

      case 'youtube':
        path = 'https://www.youtube.com/results?search_query=';
        break
    }

    let str = event.selectionText,
    encodeStr = encodeURIComponent(str);

    chrome.tabs.create({ url: path + encodeStr + suffix });
  })
})

// ========================================================
// Contextual Menu Add / Remove
// ========================================================
chrome.runtime.onConnect.addListener(function(port) {

  chrome.contextMenus.removeAll()

  port.onMessage.addListener(function(msg) {

    if (msg.request === 'updateContextMenu') {
      if (msg.method === 'create') {

        chrome.contextMenus.create({
          contexts: ['selection'],
          id: msg.id,
          title: 'Search for "%s" on ' + msg.name
        });

      } else if (msg.method === 'remove') {

        chrome.contextMenus.remove(msg.id);
      }
    }
  })
})
