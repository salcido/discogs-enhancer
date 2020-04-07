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

        try {
          // prevent "Cannot create item with duplicate id" errors
          chrome.contextMenus.remove(msg.id);
        } catch (err) {
          () => {};
        }

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

    // user preferences
    case 'userPreferences': {
      let userPreferences = {
        blockList: localStorage.getItem('blockList'),
        countryList: localStorage.getItem('countryList'),
        discriminators: localStorage.getItem('discriminators'),
        favoriteList: localStorage.getItem('favoriteList'),
        filterPrices: localStorage.getItem('filterPrices'),
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
