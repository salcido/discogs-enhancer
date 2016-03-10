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

//TODO add bandcamp


// Contextual menu listener
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  var fn = window[msg.fn];

  if (msg.request === 'updateContextMenu' && msg.method === 'remove') {

    chrome.contextMenus.remove(msg.id);
  }

  if (msg.request === 'updateContextMenu' && msg.method === 'create') {

    chrome.contextMenus.create({
      id: msg.id,
      title: 'Search for "%s" on ' + msg.name,
      contexts: ['selection'],
      onclick: fn
    });
  }
});
