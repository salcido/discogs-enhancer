/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  let fn = window[msg.fn];

  // contextual menu
  if (msg.request === 'updateContextMenu') {

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
  }

  // analytics
  if (msg.request === 'analytics') {

    if (msg.enabled) {

      localStorage.setItem('analytics', 'true');

      sendResponse({enabled: true});

    } else if (!msg.enabled) {

      localStorage.setItem('analytics', 'false');

      sendResponse({enabled: false});
    }
  }

  // block sellers
  if (msg.request === 'getBlockedSellers') {

    let blockList = JSON.parse(localStorage.getItem('blockList'));

    sendResponse({blockList: blockList});
  }
});
