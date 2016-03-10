// Search deejay
function searchDeeJay(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.deejay.de/' + encodeStr});
}

// Create context menu
chrome.contextMenus.create({

  title: 'Search for "%s" on DeeJay',
  contexts: ['selection'],
  onclick: searchDeeJay
});
