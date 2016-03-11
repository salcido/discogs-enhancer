/**
 *
 * DISCOGS ENHANCEMENT SUITE
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 * @discogs: https://www.discogs.com/user/mattsalcido
 *
 */

function searchBandcamp(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://bandcamp.com/search?q=' + encodeStr});
}

function searchBoomkat(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://boomkat.com/products?q[keywords]=' + encodeStr});
}

function searchClone(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://clone.nl/search/' + encodeStr + '?page=0'});
}

function searchDeeJay(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.deejay.de/' + encodeStr});
}

function searchDiscogs(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.discogs.com/search?q=' + encodeStr});
}

function searchGramaphone(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://webstore.gramaphonerecords.com/search.aspx?find=' + encodeStr});
}

function searchHalcyon(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://halcyontheshop.com/search?q=' + encodeStr});
}

function searchHardwax(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://hardwax.com/?search=' + encodeStr});
}

function searchInsound(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.insound.com/catalogsearch/result/?q=' + encodeStr + '&order=relevance&dir=desc'});
}

function searchJuno(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.juno.co.uk/search/?q%5Ball%5D%5B%5D=' + encodeStr + ''});
}

function searchOye(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://oye-records.com/list.php?skey=' + encodeStr});
}

function searchPbvinyl(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://www.pbvinyl.com/search?q=' + encodeStr});
}


// Contextual menu listener
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  var fn = window[msg.fn];

  if (msg.request === 'updateContextMenu' && msg.method === 'create') {

    chrome.contextMenus.create({
      contexts: ['selection'],
      id: msg.id,
      onclick: fn,
      title: 'Search for "%s" on ' + msg.name
    });
  }

  if (msg.request === 'updateContextMenu' && msg.method === 'remove') {

    chrome.contextMenus.remove(msg.id);
  }
});
