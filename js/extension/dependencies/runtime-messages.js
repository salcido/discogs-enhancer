/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

import { ContextMenuOption } from '../../shared/constants.js'

chrome.contextMenus.onClicked.addListener((info) => contextMenuClicked(info))

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  switch (msg.request) {
    // contextual menu
    case 'updateContextMenu':
      if (msg.method === 'create') {
        chrome.contextMenus.create({
          contexts: ['selection'],
          id: msg.id,
          title: 'Search for "%s" on ' + msg.name
        });
      } else if (msg.method === 'remove') {
        chrome.contextMenus.remove(msg.id);
      } break;
  }
});

function contextMenuClicked(info) {
  const selectionText = info.selectionText;
  switch (info.menuItemId) {
    case ContextMenuOption.allDay.id:
      contextMenuSearch(selectionText, ContextMenuOption.allDay.url); break;
    case ContextMenuOption.bandcamp.id:
      contextMenuSearch(selectionText, ContextMenuOption.bandcamp.url); break;
    case ContextMenuOption.beatport.id:
      contextMenuSearch(selectionText, ContextMenuOption.beatport.url); break;
    case ContextMenuOption.boomkat.id:
      contextMenuSearch(selectionText, ContextMenuOption.boomkat.url); break;
    case ContextMenuOption.clone.id:
      contextMenuSearch(selectionText, ContextMenuOption.clone.url); break;
    case ContextMenuOption.deeJay.id:
      contextMenuSearch(selectionText, ContextMenuOption.deeJay.url); break;
    case ContextMenuOption.discogs.id:
      contextMenuSearch(selectionText, ContextMenuOption.discogs.url); break;
    case ContextMenuOption.earcave.id:
      contextMenuSearch(selectionText, ContextMenuOption.earcave.url); break;
    case ContextMenuOption.gramaphone.id:
      contextMenuSearch(selectionText, ContextMenuOption.gramaphone.url); break;
    case ContextMenuOption.hardwax.id:
      contextMenuSearch(selectionText, ContextMenuOption.hardwax.url); break;
    case ContextMenuOption.juno.id:
      contextMenuSearch(selectionText, ContextMenuOption.juno.url); break;
    case ContextMenuOption.oye.id:
      contextMenuSearch(selectionText, ContextMenuOption.oye.url); break;
    case ContextMenuOption.phonica.id:
      contextMenuSearch(selectionText, ContextMenuOption.phonica.url); break;
    case ContextMenuOption.rateYourMusic.id:
      contextMenuSearch(selectionText, ContextMenuOption.rateYourMusic.url); break;
    case ContextMenuOption.redEye.id:
      contextMenuSearch(selectionText, ContextMenuOption.redEye.url); break;
    case ContextMenuOption.rushHour.id:
      contextMenuSearch(selectionText, ContextMenuOption.rushHour.url); break;
    case ContextMenuOption.sotu.id:
      contextMenuSearch(selectionText, ContextMenuOption.sotu.url); break;
    case ContextMenuOption.youTube.id:
      contextMenuSearch(selectionText, ContextMenuOption.youTube.url); break;
  }
}

function contextMenuSearch(selectionText, url) {
  const encodedStr = encodeURIComponent(selectionText);

  chrome.tabs.create({ url: url + encodedStr });
}

chrome.storage.sync.get('prefs', result => {
  if (!result || !result.prefs) {
    const prefs = {
      absoluteDate: false,
      averagePrice: false,
      baoiFields: false,
      blockBuyers: false,
      blockSellers: true,
      blurryImageFix: false,
      confirmBeforeRemoving: false,
      collectionUi: false,
      commentScanner: false,
      converter: true,
      darkTheme: false,
      demandIndex: false,
      editingNotepad: false,
      everlastingCollection: false,
      everlastingMarket: true,
      favoriteSellers: true,
      feedback: false,
      filterMediaCondition: false,
      filterMediaConditionValue: null,
      filterPrices: false,
      filterShippingCountry: false,
      filterSleeveCondition: false,
      filterSleeveConditionValue: null,
      filterUnavailable: false,
      forceDashboard: true,
      formatShortcuts: true,
      hideMinMaxColumns: false,
      highlightMedia: true,
      inventoryRatings: false,
      inventoryScanner: false,
      notesCount: true,
      quickSearch: false,
      randomItem: false,
      ratingPercent: false,
      readability: false,
      relativeSoldDate: false,
      releaseScanner: false,
      releaseDurations: true,
      releaseRatings: false,
      removeFromWantlist: false,
      sellerItemsInCart: false,
      sellerRep: false,
      sortButtons: true,
      suggestedPrices: false,
      tweakDiscrims: false,
      userCurrency: null,
      ytPlaylists: false,
      useAllDay: false,
      useBandcamp: false,
      useBeatport: false,
      useBoomkat: false,
      useClone: false,
      useDeejay: false,
      useDiscogs: true,
      useEarcave: false,
      useGramaphone: false,
      useHardwax: false,
      useJuno: false,
      useOye: false,
      usePhonica: false,
      useRateYourMusic: false,
      useRedeye: false,
      useRushhour: false,
      useSotu: false,
      useYoutube: false
    };

    chrome.storage.sync.set({ prefs: prefs }, () => console.log('Preferences created.'));
  }
});