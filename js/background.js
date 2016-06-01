/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

let
    blockSellers,
    checkForAnalytics,
    collectionUi,
    converter,
    converter_css,
    darkTheme,
    elems = [],
    feedback,
    feedback_css,
    highlightCss,
    highlightScript,
    initElems = [],
    jQ,
    options,
    prefs = {},
    preloader,
    releaseDurations,
    releaseHistoryScript,
    resourceLibrary,
    sortExploreScript,
    sortMarketplaceScript,
    sortPersonalListsScript,
    suggestedPricesSingle,
    suggestedPricesRelease,
    unitTests,
    updateExchangeRates;

function appendFragment(source) {

  let fragment = document.createDocumentFragment();

  source.forEach(function(elm) {

    fragment.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(fragment.cloneNode(true));
}


chrome.storage.sync.get('prefs', function(result) {

  if (!result.prefs) {

    prefs = {
      blockSellers: true,
      collectionUi: true,
      converter: true,
      darkTheme: true,
      feedback: true,
      highlightMedia: true,
      //pieStats: true,
      releaseDurations: true,
      sortButtons: true,
      suggestedPrices: false,
      userCurrency: null,
      useBandcamp: false,
      useBoomkat: false,
      useClone: false,
      useDeejay: false,
      useDiscogs: true,
      useGramaphone: false,
      useHalcyon: false,
      useHardwax: false,
      useInsound: false,
      useJuno: false,
      useOye: false,
      usePbvinyl: false
    };

    chrome.storage.sync.set({prefs: prefs}, function() {

      console.log('Preferences created.');
    });
  }

  // jQuery
  jQ = document.createElement('script');

  jQ.type = 'text/javascript';

  jQ.async = true;

  jQ.className = 'de-init';

  jQ.src = chrome.extension.getURL('js/jquery/jquery-min.js');

  initElems.push(jQ);

  // Create dark theme css element...
  darkTheme = document.createElement('link');

  darkTheme.rel = 'stylesheet';

  darkTheme.type = 'text/css';

  darkTheme.href = chrome.extension.getURL('css/dark-theme.css');

  darkTheme.id = 'darkThemeCss';

  // disable if needed
  if (!result.prefs.darkTheme) { darkTheme.setAttribute('disabled', true); }

  initElems.push(darkTheme);

  // resource-library.js
  resourceLibrary = document.createElement('script');

  resourceLibrary.type = 'text/javascript';

  resourceLibrary.className = 'de-init';

  resourceLibrary.src = chrome.extension.getURL('js/resource-library/resource-library.js');

  initElems.push(resourceLibrary);

  // Stick it in
  appendFragment(initElems);


  /*   User Prefs   */

  if (result.prefs.highlightMedia) {

    // apply-highlights.js
    highlightScript = document.createElement('script');

    highlightScript.type = 'text/javascript';

    highlightScript.src = chrome.extension.getURL('js/apply-highlights.js');

    highlightScript.className = 'de-init';

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

    sortExploreScript.className = 'de-init';

    elems.push(sortExploreScript);

    // sort-marketplace-lists.js
    sortMarketplaceScript = document.createElement('script');

    sortMarketplaceScript.type = 'text/javascript';

    sortMarketplaceScript.src = chrome.extension.getURL('js/sort-marketplace-lists.js');

    sortMarketplaceScript.className = 'de-init';

    elems.push(sortMarketplaceScript);

    // sort-personal-lists.js
    sortPersonalListsScript = document.createElement('script');

    sortPersonalListsScript.type = 'text/javascript';

    sortPersonalListsScript.src = chrome.extension.getURL('js/sort-personal-lists.js');

    sortPersonalListsScript.className = 'de-init';

    elems.push(sortPersonalListsScript);
  }

  if (result.prefs.darkTheme) {

    releaseHistoryScript = document.createElement('script');

    releaseHistoryScript.type = 'text/javascript';

    releaseHistoryScript.src = chrome.extension.getURL('js/release-history-legend.js');

    releaseHistoryScript.className = 'de-init';

    elems.push(releaseHistoryScript);

    // options.js
    options = document.createElement('script');

    options.type = 'text/javascript';

    options.src = chrome.extension.getURL('js/options/options.js');

    options.className = 'de-init';

    elems.push(options);
  }

  if (result.prefs.releaseDurations) {

    releaseDurations = document.createElement('script');

    releaseDurations.type = 'text/javascript';

    releaseDurations.src = chrome.extension.getURL('js/release-durations.js');

    releaseDurations.className = 'de-init';

    elems.push(releaseDurations);
  }

  if (result.prefs.feedback) {

    feedback = document.createElement('script');

    feedback.type = 'text/javascript';

    feedback.src = chrome.extension.getURL('js/feedback-notifier.js');

    feedback.className = 'de-init';

    elems.push(feedback);

    // feedback-notifier.css
    feedback_css = document.createElement('link');

    feedback_css.rel = 'stylesheet';

    feedback_css.type = 'text/css';

    feedback_css.href = chrome.extension.getURL('css/feedback-notifier.css');

    elems.push(feedback_css);
  }

  if (result.prefs.blockSellers) {

    blockSellers = document.createElement('script');

    blockSellers.type = 'text/javascript';

    blockSellers.src = chrome.extension.getURL('js/hide-blocked-sellers.js');

    blockSellers.className = 'de-init';

    elems.push(blockSellers);
  }

  if (result.prefs.collectionUi) {

    collectionUi = document.createElement('script');

    collectionUi.type = 'text/javascript';

    collectionUi.src = chrome.extension.getURL('js/better-collection-ui.js');

    collectionUi.className = 'de-init';

    elems.push(collectionUi);
  }

  if (result.prefs.suggestedPrices) {

    // update-exchange-rates.js
    updateExchangeRates = document.createElement('script');

    updateExchangeRates.type = 'text/javascript';

    updateExchangeRates.src = chrome.extension.getURL('js/exchange-rates/update-exchange-rates.js');

    updateExchangeRates.className = 'de-init';

    elems.push(updateExchangeRates);

    //suggested-prices-release-page.js
    suggestedPricesRelease = document.createElement('script');

    suggestedPricesRelease.type = 'text/javascript';

    suggestedPricesRelease.src = chrome.extension.getURL('js/suggested-prices-release-page.js');

    suggestedPricesRelease.className = 'de-init';

    elems.push(suggestedPricesRelease);

    //suggested-prices-single.js
    suggestedPricesSingle = document.createElement('script');

    suggestedPricesSingle.type = 'text/javascript';

    suggestedPricesSingle.src = chrome.extension.getURL('js/suggested-prices-single.js');

    suggestedPricesSingle.className = 'de-init';

    elems.push(suggestedPricesSingle);

    // Preloader css
    preloader = document.createElement('link');

    preloader.rel = 'stylesheet';

    preloader.type = 'text/css';

    preloader.href = chrome.extension.getURL('css/pre-loader.css');

    preloader.id = 'preloaderCss';

    elems.push(preloader);
  }

  if (result.prefs.converter) {

    // currency-converter.css
    converter_css = document.createElement('link');

    converter_css.rel = 'stylesheet';

    converter_css.type = 'text/css';

    converter_css.href = chrome.extension.getURL('css/currency-converter.css');

    elems.push(converter_css);

    // currency-converter.js
    converter = document.createElement('script');

    converter.type = 'text/javascript';

    converter.className = 'de-init';

    converter.src = chrome.extension.getURL('js/currency-converter.js');

    elems.push(converter);
  }

  // unit-tests.js
  unitTests = document.createElement('script');

  unitTests.type = 'text/javascript';

  unitTests.src = chrome.extension.getURL('js/tests/unit-tests.js');

  unitTests.className = 'de-init';

  elems.push(unitTests);

  /*  Contextual menu options  */

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

  if (result.prefs.userCurrency) {

    localStorage.setItem('userCurrency', result.prefs.userCurrency);
  }

  setTimeout(function() {

    appendFragment(elems);

  }, 100);
});


/*  Install/update notifications  */

if (typeof chrome.runtime.onInstalled !== 'undefined') {

  chrome.runtime.onInstalled.addListener(function(details) {

    let
        previousVersion,
        thisVersion;

    if (details.reason === 'install') {

      console.log('Welcome to the pleasuredome!');

      chrome.storage.sync.set({didUpdate: false}, function() {});

    } else if (details.reason === 'update') {

      previousVersion = details.previousVersion;

      thisVersion = chrome.runtime.getManifest().version;

      /* Don't show update notice on patches */
      if (thisVersion.substr(0, 3) > previousVersion.substr(0, 3)) {

        chrome.browserAction.setBadgeText({text: ' '});

        chrome.browserAction.setBadgeBackgroundColor({color: '#4cb749'});

        chrome.storage.sync.set({didUpdate: true}, function() {});
      }
    }
  });
}

/* Analytics option */

checkForAnalytics = setInterval(function() {

  let analytics = document.getElementById('analytics');

  function toggleAnalytics() {

    let optionsObj = JSON.parse(localStorage.getItem('options'));

    chrome.runtime.sendMessage({request: 'analytics', enabled: analytics.checked}, function(response) {

      optionsObj.analytics = (response.enabled ? true : false);

      optionsObj = JSON.stringify(optionsObj);

      localStorage.setItem('options', optionsObj);
    });
  }

  if (analytics) {

    /* Add event listener */
    analytics.addEventListener('change', toggleAnalytics);

    /* Fire toggleAnalytics once #analytics exists in the DOM */
    toggleAnalytics();

    clearInterval(checkForAnalytics);
  }
}, 1000);


/* Clean up on asile 7! */
window.onload = function() { $('.de-init').remove(); };
