// Search deejay
function searchDeeJay(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.deejay.de/' + encodeStr});
}
// TODO move these create methods to background.js
// Create context menu
// chrome.contextMenus.create({
//   id: 'deejay',
//   title: 'Search for "%s" on DeeJay',
//   contexts: ['selection'],
//   onclick: searchDeeJay
// });


// Search for stuff on discogs
function searchDiscogs(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.discogs.com/search?q=' + encodeStr});
}
// Create context menu
// chrome.contextMenus.create({
//   id: 'discogs',
//   title: 'Search for "%s" on Discogs',
//   contexts: ['selection'],
//   onclick: searchDiscogs
// });


// Search for stuff on insound
function searchInsound(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.insound.com/catalogsearch/result/?q=' + encodeStr + '&order=relevance&dir=desc'});
}
// Create context menu
// chrome.contextMenus.create({
//   id: 'insound',
//   title: 'Search for "%s" on InSound',
//   contexts: ['selection'],
//   onclick: searchInsound
// });


// Search Juno
function searchJuno(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'http://www.juno.co.uk/search/?q%5Ball%5D%5B%5D=' + encodeStr + ''});
}
// Create context menu
// chrome.contextMenus.create({
//   id: 'juno',
//   title: 'Search for "%s" on Juno',
//   contexts: ['selection'],
//   onclick: searchJuno
// });


// Search Oye
function searchOye(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://oye-records.com/list.php?skey=' + encodeStr});
}
// Create context menu
// chrome.contextMenus.create({
//   id: 'oye',
//   title: 'Search for "%s" on Oye',
//   contexts: ['selection'],
//   onclick: searchOye
// });


// Search PbVinyl
function searchPbvinyl(event) {

  var str = event.selectionText,
      encodeStr = encodeURI(str);

  chrome.tabs.create({url: 'https://www.pbvinyl.com/search?q=' + encodeStr});
}
// Create context menu
// chrome.contextMenus.create({
//   id: 'pbvinyl',
//   title: 'Search for "%s" on PBVinyl',
//   contexts: ['selection'],
//   onclick: searchPbvinyl
// });

//TODO add insound, bandcamp


// Contextual menu listener
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.request === 'updateContextMenu' && msg.method === 'remove') {

      chrome.contextMenus.remove(msg.id);
    }

    if (msg.request === 'updateContextMenu' && msg.method === 'create') {

      switch(msg.id) {
        // TODO use msg object to pass values to a single create method
        case 'deejay':
          chrome.contextMenus.create({
            id: 'deejay',
            title: 'Search for "%s" on DeeJay',
            contexts: ['selection'],
            onclick: searchDeeJay
          });
          break;

        case 'discogs':
          chrome.contextMenus.create({
            id: 'discogs',
            title: 'Search for "%s" on Discogs',
            contexts: ['selection'],
            onclick: searchDiscogs
          });
          break;

        case 'insound':
          chrome.contextMenus.create({
            id: 'insound',
            title: 'Search for "%s" on InSound',
            contexts: ['selection'],
            onclick: searchInsound
          });
          break;

        case 'juno':
          chrome.contextMenus.create({
            id: 'juno',
            title: 'Search for "%s" on Juno',
            contexts: ['selection'],
            onclick: searchJuno
          });
          break;

        case 'oye':
          chrome.contextMenus.create({
            id: 'oye',
            title: 'Search for "%s" on Oye',
            contexts: ['selection'],
            onclick: searchOye
          });
          break;

        case 'pbvinyl':
          chrome.contextMenus.create({
            id: 'pbvinyl',
            title: 'Search for "%s" on PBVinyl',
            contexts: ['selection'],
            onclick: searchPbvinyl
          });
          break;
      }
    }
});
