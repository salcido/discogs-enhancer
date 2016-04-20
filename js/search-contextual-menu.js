/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

function searchBandcamp(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://bandcamp.com/search?q=' + encodeStr});
}

function searchBoomkat(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://boomkat.com/products?q[keywords]=' + encodeStr});
}

function searchClone(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://clone.nl/search/' + encodeStr + '?page=0'});
}

function searchDeeJay(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.deejay.de/' + encodeStr});
}

function searchDiscogs(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.discogs.com/search?q=' + encodeStr});
}

function searchGramaphone(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://webstore.gramaphonerecords.com/search.aspx?find=' + encodeStr});
}

function searchHalcyon(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://halcyontheshop.com/search?q=' + encodeStr});
}

function searchHardwax(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://hardwax.com/?search=' + encodeStr});
}

function searchInsound(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.insound.com/catalogsearch/result/?q=' + encodeStr + '&order=relevance&dir=desc'});
}

function searchJuno(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.juno.co.uk/search/?q%5Ball%5D%5B%5D=' + encodeStr + ''});
}

function searchOye(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://oye-records.com/list.php?skey=' + encodeStr});
}

function searchPbvinyl(event) {

  let str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://www.pbvinyl.com/search?q=' + encodeStr});
}


// Contextual menu listener
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  let fn = window[msg.fn];

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

  if (msg.request === 'analytics') {

    if (msg.enabled) {

      localStorage.setItem('analytics', 'true');

      sendResponse({enabled: 'true'});

    } else if (!msg.enabled) {

      localStorage.setItem('analytics', 'false');

      sendResponse({enabled: 'false'});
    }
  }
});
