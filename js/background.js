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

var
    collectionUi,
    darkTheme,
    elems = [],
    fragment,
    highlightCss,
    highlightScript,
    initElems = [],
    initFragment,
    jQ,
    prefs = {},
    releaseDurations,
    releaseHistoryScript,
    sortExploreScript,
    sortMarketplaceScript,
    sortPersonalListsScript;

function appendFragment() {

  fragment = document.createDocumentFragment();

  elems.forEach(function(elm) {

    fragment.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(fragment.cloneNode(true));
}


chrome.storage.sync.get('prefs', function(result) {

  if (!result.prefs) {

    prefs = {
      darkTheme: true,
      highlightMedia: true,
      sortButtons: true,
      releaseDurations: true,
      collectionUi: true,
      useBandcamp: true,
      useBoomkat: true,
      useClone: true,
      useDeejay: true,
      useDiscogs: true,
      useGramaphone: true,
      useHalcyon: true,
      useHardwax: true,
      useInsound: true,
      useJuno: true,
      useOye: true,
      usePbvinyl: true
      };

    chrome.storage.sync.set({prefs: prefs}, function() {

      console.log('Preferences created.');
    });
  }

  // jQuery
  jQ = document.createElement('script');

  jQ.type = 'text/javascript';

  jQ.async = true;

  jQ.src = chrome.extension.getURL('js/jquery/jquery-min.js');

  initElems.push(jQ);


  // Create dark theme css element...
  darkTheme = document.createElement('link');

  darkTheme.rel = 'stylesheet';

  darkTheme.type = 'text/css';

  darkTheme.href = chrome.extension.getURL('css/dark-theme.css');

  darkTheme.id = 'darkThemeCss';

  if (!result.prefs.darkTheme) {

    darkTheme.setAttribute('disabled', true);
  }

  initElems.push(darkTheme);


  // Append jQuery and dark-theme css
  initFragment = document.createDocumentFragment();

  initElems.forEach(function(elm) {

    initFragment.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(initFragment.cloneNode(true));

  /**
   * Create document fragment with preferences
   */

  if (result.prefs.highlightMedia) {

    // apply-highlights.js
    highlightScript = document.createElement('script');

    highlightScript.type = 'text/javascript';

    highlightScript.src = chrome.extension.getURL('js/apply-highlights.js');

    elems.push(highlightScript);


    // marketplace-highlights.css
    highlightCss = document.createElement('link');

    highlightCss.rel = 'stylesheet';

    highlightCss.type = 'text/css';

    highlightCss.href = chrome.extension.getURL('css/marketplace-highlights.css');

    highlightCss.id = 'mediaHighLightsCss';

    elems.push(highlightCss);
  }

  if (result.prefs.sortButtons) {

    // sort-explore-lists.js
    sortExploreScript = document.createElement('script');

    sortExploreScript.type = 'text/javascript';

    sortExploreScript.src = chrome.extension.getURL('js/sort-explore-lists.js');

    elems.push(sortExploreScript);


    // sort-marketplace-lists.js
    sortMarketplaceScript = document.createElement('script');

    sortMarketplaceScript.type = 'text/javascript';

    sortMarketplaceScript.src = chrome.extension.getURL('js/sort-marketplace-lists.js');

    elems.push(sortMarketplaceScript);


    // sort-personal-lists.js
    sortPersonalListsScript = document.createElement('script');

    sortPersonalListsScript.type = 'text/javascript';

    sortPersonalListsScript.src = chrome.extension.getURL('js/sort-personal-lists.js');

    elems.push(sortPersonalListsScript);
  }

  if (result.prefs.darkTheme) {

    releaseHistoryScript = document.createElement('script');

    releaseHistoryScript.type = 'text/javascript';

    releaseHistoryScript.src = chrome.extension.getURL('js/release-history-legend.js');

    elems.push(releaseHistoryScript);
  }

  if (result.prefs.releaseDurations) {

    releaseDurations = document.createElement('script');

    releaseDurations.type = 'text/javascript';

    releaseDurations.src = chrome.extension.getURL('js/release-durations.js');

    elems.push(releaseDurations);
  }

  if (result.prefs.collectionUi) {

    collectionUi = document.createElement('script');

    collectionUi.type = 'text/javascript';

    collectionUi.src = chrome.extension.getURL('js/better-collection-ui.js');

    elems.push(collectionUi);
  }

  /**
   * Contextual menu options
   */

  if (result.prefs.useBandcamp) {

    chrome.runtime.sendMessage({
      fn: 'searchBandcamp',
      id: 'bandcamp',
      method: 'create',
      name: 'Bandcamp',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useBoomkat) {

    chrome.runtime.sendMessage({
      fn: 'searchBoomkat',
      id: 'boomkat',
      method: 'create',
      name: 'Boomkat',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useClone) {

    chrome.runtime.sendMessage({
      fn: 'searchClone',
      id: 'clone',
      method: 'create',
      name: 'Clone',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useDeejay) {

    chrome.runtime.sendMessage({
      fn: 'searchDeeJay',
      id: 'deejay',
      method: 'create',
      name: 'DeeJay',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useDiscogs) {

    chrome.runtime.sendMessage({
      fn: 'searchDiscogs',
      id: 'discogs',
      method: 'create',
      name: 'Discogs',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useGramaphone) {

    chrome.runtime.sendMessage({
      fn: 'searchGramaphone',
      id: 'gramaphone',
      method: 'create',
      name: 'Gramaphone',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useHalcyon) {

    chrome.runtime.sendMessage({
      fn: 'searchHalcyon',
      id: 'halcyon',
      method: 'create',
      name: 'Halcyon',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useHardwax) {

    chrome.runtime.sendMessage({
      fn: 'searchHardwax',
      id: 'hardwax',
      method: 'create',
      name: 'Hardwax',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useInsound) {

    chrome.runtime.sendMessage({
      fn: 'searchInsound',
      id: 'insound',
      method: 'create',
      name: 'InSound',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useJuno) {

    chrome.runtime.sendMessage({
      fn: 'searchJuno',
      id: 'juno',
      method: 'create',
      name: 'Juno',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useOye) {

    chrome.runtime.sendMessage({
      fn: 'searchOye',
      id: 'oye',
      method: 'create',
      name: 'Oye',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.usePbvinyl) {

    chrome.runtime.sendMessage({
      fn: 'searchPbvinyl',
      id: 'pbvinyl',
      method: 'create',
      name: 'PBVinyl',
      request: 'updateContextMenu'
    });
  }

  setTimeout(function() {

    appendFragment(result);

  }, 100);
});


// Install/update notifications
if (typeof chrome.runtime.onInstalled !== 'undefined') {

  chrome.runtime.onInstalled.addListener(function(details) {

    var
        previousVersion,
        thisVersion;

    if (details.reason === 'install') {

      console.log('Welcome to the pleasure dome!');

      chrome.storage.sync.set({didUpdate: false}, function() {});

    } else if (details.reason === 'update') {

      previousVersion = details.previousVersion;

      thisVersion = chrome.runtime.getManifest().version;

      // Don't show update notice on patches
      if (thisVersion.substr(0, 3) > previousVersion.substr(0, 3)) {

        chrome.browserAction.setBadgeText({text: ' '});

        chrome.browserAction.setBadgeBackgroundColor({color: '#4cb749'});

        chrome.storage.sync.set({didUpdate: true}, function() {});
      }
    }
  });
}
