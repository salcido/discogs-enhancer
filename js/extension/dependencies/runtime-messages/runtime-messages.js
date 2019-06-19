/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  let fn = window[msg.fn];

  switch (msg.request) {

    // contextual menu
    case 'updateContextMenu':

      if (msg.method === 'create') {

        chrome.contextMenus.create({
          contexts: ['selection'],
          id: msg.id,
          onclick: fn,
          title: 'Search for "%s" on ' + msg.name
        });

      } else if (msg.method === 'remove') {

        chrome.contextMenus.remove(msg.id);
      }
      break;

    // analytics
    case 'analytics':

      if (msg.enabled) {

        localStorage.setItem('analytics', 'true');
        sendResponse({ enabled: true });

      } else {

        localStorage.setItem('analytics', 'false');
        sendResponse({ enabled: false });
      }
      break;

    // user preferences
    case 'userPreferences': {
      let userPreferences = {
        blockList: localStorage.getItem('blockList'),
        countryList: localStorage.getItem('countryList'),
        discriminators: localStorage.getItem('discriminators'),
        favoriteList: localStorage.getItem('favoriteList'),
        inventoryRatings: localStorage.getItem('inventoryRatings'),
        mediaCondition: localStorage.getItem('mediaCondition'),
        readability: localStorage.getItem('readability'),
        sellerRep: localStorage.getItem('sellerRep'),
        sellerRepColor: localStorage.getItem('sellerRepColor'),
        sleeveCondition: localStorage.getItem('sleeveCondition'),
        usDateFormat: localStorage.getItem('usDateFormat'),
      };

      for ( let p in userPreferences ) {
        userPreferences[p] = JSON.parse(userPreferences[p]);
      }

      sendResponse({ userPreferences });
      break;
    }
  }
});
