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
        sendResponse({enabled: true});

      } else {

        localStorage.setItem('analytics', 'false');
        sendResponse({enabled: false});
      }
      break;

    // block sellers
    case 'getBlockedSellers': {

      let blockList = JSON.parse(localStorage.getItem('blockList'));

      sendResponse({blockList: blockList});
      break;
    }

    // favorite sellers
    case 'getFavoriteSellers': {

      let favoriteList = JSON.parse(localStorage.getItem('favoriteList'));

      sendResponse({favoriteList: favoriteList});
      break;
    }

    // filter by country
    case 'filterByCountry': {

      let filterByCountry = JSON.parse(localStorage.getItem('filterByCountry'));

      sendResponse({filterByCountry: filterByCountry});
      break;
    }

    // filter by conditions
    case 'getConditions': {

      let itemCondition = JSON.parse(localStorage.getItem('itemCondition'));

      sendResponse({itemCondition: itemCondition});
      break;
    }
    // Readability
    case 'getReadability': {

      let readability = JSON.parse(localStorage.getItem('readability'));

      sendResponse({readability: readability});
      break;
    }
    // Seller Rep Percentage
    case 'getSellerRep': {

      let sellerRep = JSON.parse(localStorage.getItem('sellerRep'));

      sendResponse({sellerRep: sellerRep});
      break;
    }
    // Seller Rep Color
    case 'getSellerRepColor': {

      let sellerRepColor = localStorage.getItem('sellerRepColor');

      sendResponse({sellerRepColor: sellerRepColor});
      break;
    }
  }
});
