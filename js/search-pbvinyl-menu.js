// Search PbVinyl
function searchPbVinyl(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://www.pbvinyl.com/search?q=' + encodeStr});
}

// Create context menu
chrome.contextMenus.create({

  title: 'Search for "%s" on PBVinyl',
  contexts: ['selection'],
  onclick: searchPbVinyl
});
