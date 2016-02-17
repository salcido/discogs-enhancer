// Search for stuff
function searchDiscogs(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str)
  
  chrome.tabs.create({url: 'http://www.discogs.com/search?q=' + encodeStr});
}



// Create context menu
chrome.contextMenus.create({

  'title': 'Search for %s on Discogs',
  'contexts': ['selection'],
  'onclick': searchDiscogs
});
