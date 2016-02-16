// Create context menu
var contextMenu = chrome.contextMenus.create({

  "title": "Search for %s on Discogs",
  "contexts": ["selection"],
  "onclick": searchDiscogs
});



// Search for stuff
function searchDiscogs(event, tab) {

  var str = event.selectionText;

  encodeStr = encodeURI(str)
  
  chrome.tabs.create({url: "http://www.discogs.com/search?q=" + encodeStr});
}
