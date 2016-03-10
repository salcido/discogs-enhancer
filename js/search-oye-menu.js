// Search Oye
function searchOye(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://oye-records.com/list.php?skey=' + encodeStr});
}



// Create context menu
chrome.contextMenus.create({

  title: 'Search for "%s" on Oye Records',
  contexts: ['selection'],
  onclick: searchOye
});
