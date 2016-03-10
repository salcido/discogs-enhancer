// Search Juno
function searchJuno(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.juno.co.uk/search/?q%5Ball%5D%5B%5D=' + encodeStr});
}

// Create context menu
chrome.contextMenus.create({

  title: 'Search for "%s" on Juno',
  contexts: ['selection'],
  onclick: searchJuno
});
