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

  switch (true) {

    // contextual menu
    case msg.request === 'updateContextMenu':

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
    case msg.request === 'analytics':

      if (msg.enabled) {

        localStorage.setItem('analytics', 'true');

        sendResponse({enabled: true});

      } else if (!msg.enabled) {

        localStorage.setItem('analytics', 'false');

        sendResponse({enabled: false});
      }
      break;

    // block sellers
    case msg.request === 'getBlockedSellers':

      let blockList = JSON.parse(localStorage.getItem('blockList'));

      sendResponse({blockList: blockList});
      break;

    // filter by country
    case msg.request === 'filterByCountry':

      let filterByCountry = JSON.parse(localStorage.getItem('filterByCountry'));

      sendResponse({filterByCountry: filterByCountry});
      break;

    // filter by conditions
    case msg.request === 'getHideItems':

      let itemCondition = JSON.parse(localStorage.getItem('itemCondition'));

      sendResponse({itemCondition: itemCondition});
      break;

    // Readability
    case msg.request === 'getReadability':

      let readability = JSON.parse(localStorage.getItem('readability'));

      sendResponse({readability: readability});
      break;

    // Seller Rep
    case msg.request === 'getSellerRep':

      let sellerRep = JSON.parse(localStorage.getItem('sellerRep'));

      sendResponse({sellerRep: sellerRep});
      break;
  }
});
