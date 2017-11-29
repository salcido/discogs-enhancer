/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

let
    checkForAnalytics,
    darkTheme,
    elems = [],
    filterByCountry_css,
    friendCounter,
    initElems = [],
    jQ,
    prefs = {},
    resourceLibrary;

/**
 * Appends js/css nodes to the DOM
 *
 * @method   appendFragment
 * @param    {Object}       source [The node to be appeneded]
 * @return   {undefined}
 */

function appendFragment(source) {

  let fragment = document.createDocumentFragment();

  source.forEach(elm => {

    fragment.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(fragment.cloneNode(true));
}

/**
 * Get the users preferences or create them if they
 * do not yet exist and setup the extension with the
 * returned preferences object.
 *
 * @method   get
 * @param    {Object} 'prefs'  [The prefs object]
 * @return   {Object}
 */

chrome.storage.sync.get('prefs', function(result) {

  if (!result.prefs) {

    prefs = {
      baoiFields: false,
      blockSellers: true,
      collectionUi: true,
      converter: true,
      darkTheme: false,
      everlastingLabels: false,
      everlastingMarket: true,
      feedback: true,
      filterByCountry: false,
      formatShortcuts: true,
      highlightMedia: true,
      hideMarketplaceItems: null,
      notesCount: true,
      readability: false,
      releaseDurations: true,
      releaseRatings: false,
      sellerRep: false,
      sortButtons: true,
      suggestedPrices: false,
      userCurrency: null,
      //
      useAllDay: false,
      useBandcamp: false,
      useBoomkat: false,
      useClone: false,
      useDecks: false,
      useDeejay: false,
      useDiscogs: true,
      useGramaphone: false,
      useHalcyon: false,
      useHardwax: false,
      useInsound: false,
      useJuno: false,
      useKristina: false,
      useOye: false,
      usePbvinyl: false,
      usePhonica: false,
      useSotu: false,
      useYoutube: false
    };

    chrome.storage.sync.set({prefs: prefs}, function() {

      console.log('Preferences created.');
    });
  }

  // jQuery
  jQ = document.createElement('script');
  jQ.type = 'text/javascript';
  jQ.className = 'de-init';
  jQ.src = chrome.extension.getURL('js/extension/dependencies/jquery/jquery-min.js');

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

  // filter-by-country.css
  filterByCountry_css = document.createElement('link');
  filterByCountry_css.rel = 'stylesheet';
  filterByCountry_css.type = 'text/css';
  filterByCountry_css.href = chrome.extension.getURL('css/filter-by-country.css');
  filterByCountry_css.id = 'filterByCountryCss';

  // disable if needed
  if (!result.prefs.filterByCountry) { filterByCountry_css.setAttribute('disabled', true); }

  initElems.push(filterByCountry_css);

  // resource-library.js
  resourceLibrary = document.createElement('script');
  resourceLibrary.type = 'text/javascript';
  resourceLibrary.className = 'de-init';
  resourceLibrary.src = chrome.extension.getURL('js/extension/dependencies/resource-library/resource-library.js');

  initElems.push(resourceLibrary);

  // Append initial dependencies
  appendFragment(initElems);

  // ========================================================
  // Friend-counter (always enabled)
  // ========================================================

  friendCounter = document.createElement('script');
  friendCounter.type = 'text/javascript';
  friendCounter.className = 'de-init';
  friendCounter.src = chrome.extension.getURL('js/extension/features/friend-counter.js');

  elems.push(friendCounter);

  // ========================================================
  // User Preferences
  // ========================================================

  if (result.prefs.baoiFields) {

    // let baoi_js = document.createElement('script');

    // baoi_js.type = 'text/javascript';
    // baoi_js.src = chrome.extension.getURL('js/extension/features/baoi.js');
    // baoi_js.className = 'de-init';

    // elems.push(baoi_js);

    // edit-release.css
    let baoi_css = document.createElement('link');

    baoi_css.rel = 'stylesheet';
    baoi_css.type = 'text/css';
    baoi_css.href = chrome.extension.getURL('css/edit-release.css');

    elems.push(baoi_css);
  }

  if (result.prefs.blockSellers) {

    let blockSellers = document.createElement('script');

    blockSellers.type = 'text/javascript';
    blockSellers.src = chrome.extension.getURL('js/extension/features/hide-blocked-sellers.js');
    blockSellers.className = 'de-init';

    elems.push(blockSellers);

    // blocked-seller.css
    let blockSellers_css = document.createElement('link');

    blockSellers_css.rel = 'stylesheet';
    blockSellers_css.type = 'text/css';
    blockSellers_css.href = chrome.extension.getURL('css/blocked-seller.css');

    elems.push(blockSellers_css);
  }

  if (result.prefs.collectionUi) {

    // better-collection-ui.js
    let collectionUi = document.createElement('script');

    collectionUi.type = 'text/javascript';
    collectionUi.src = chrome.extension.getURL('js/extension/features/better-collection-ui.js');
    collectionUi.className = 'de-init';

    elems.push(collectionUi);
  }

  if (result.prefs.converter) {

    // currency-converter.css
    let converter_css = document.createElement('link');

    converter_css.rel = 'stylesheet';
    converter_css.type = 'text/css';
    converter_css.href = chrome.extension.getURL('css/currency-converter.css');

    elems.push(converter_css);

    // currency-converter.js
    let converter = document.createElement('script');

    converter.type = 'text/javascript';
    converter.className = 'de-init';
    converter.src = chrome.extension.getURL('js/extension/features/currency-converter.js');

    elems.push(converter);
  }

  if (result.prefs.darkTheme) {

    let releaseHistoryScript = document.createElement('script');

    releaseHistoryScript.type = 'text/javascript';
    releaseHistoryScript.src = chrome.extension.getURL('js/extension/features/release-history-legend.js');
    releaseHistoryScript.className = 'de-init';

    elems.push(releaseHistoryScript);

    // options.js
    let options = document.createElement('script');

    options.type = 'text/javascript';
    options.src = chrome.extension.getURL('js/extension/dependencies/options/options.js');
    options.className = 'de-init';

    elems.push(options);
  }

  if (result.prefs.everlastingLabels) {

    // everlasting-marketplace.js
    let everlastingLabels = document.createElement('script');

    everlastingLabels.type = 'text/javascript';
    everlastingLabels.src = chrome.extension.getURL('js/extension/features/everlasting-labels.js');
    everlastingLabels.className = 'de-init';

    elems.push(everlastingLabels);

    // everlasting-marketplace.css
    let everlastingLabelCss = document.createElement('link');

    everlastingLabelCss.rel = 'stylesheet';
    everlastingLabelCss.type = 'text/css';
    everlastingLabelCss.href = chrome.extension.getURL('css/everlasting-labels.css');

    elems.push(everlastingLabelCss);
  }

  if (result.prefs.everlastingMarket) {

    // everlasting-marketplace.js
    let everlastingMarket = document.createElement('script');

    everlastingMarket.type = 'text/javascript';
    everlastingMarket.src = chrome.extension.getURL('js/extension/features/everlasting-marketplace.js');
    everlastingMarket.className = 'de-init';

    elems.push(everlastingMarket);

    // everlasting-marketplace.css
    let everlastingMarketCss = document.createElement('link');

    everlastingMarketCss.rel = 'stylesheet';
    everlastingMarketCss.type = 'text/css';
    everlastingMarketCss.href = chrome.extension.getURL('css/everlasting-marketplace.css');

    elems.push(everlastingMarketCss);
  }

  if (result.prefs.feedback) {

    let feedback = document.createElement('script');

    feedback.type = 'text/javascript';
    feedback.src = chrome.extension.getURL('js/extension/features/feedback-notifier.js');
    feedback.className = 'de-init';

    elems.push(feedback);

    // feedback-notifier.css
    let feedback_css = document.createElement('link');

    feedback_css.rel = 'stylesheet';
    feedback_css.type = 'text/css';
    feedback_css.href = chrome.extension.getURL('css/feedback-notifier.css');

    elems.push(feedback_css);
  }

  if (result.prefs.filterByCountry) {

    // filter-by-country.js
    let filterByCountry = document.createElement('script');

    filterByCountry.type = 'text/javascript';
    filterByCountry.src = chrome.extension.getURL('js/extension/features/filter-by-country.js');
    filterByCountry.className = 'de-init';

    elems.push(filterByCountry);
  }

  // text format shortcuts
  if (result.prefs.formatShortcuts) {

    // extensions.js
    let extensions = document.createElement('script');

    extensions.type = 'text/javascript';
    extensions.className = 'de-init';
    extensions.src = chrome.extension.getURL('js/extension/dependencies/jquery/extensions.js');

    elems.push(extensions);

    // text-format-shortcuts.js
    let shortcuts = document.createElement('script');

    shortcuts.type = 'text/javascript';
    shortcuts.src = chrome.extension.getURL('js/extension/features/text-format-shortcuts.js');
    shortcuts.className = 'de-init';

    elems.push(shortcuts);

    // text-format-shortcuts.css
    let shortcuts_css = document.createElement('link');

    shortcuts_css.rel = 'stylesheet';
    shortcuts_css.type = 'text/css';
    shortcuts_css.href = chrome.extension.getURL('css/text-format-shortcuts.css');

    elems.push(shortcuts_css);
  }

  // Set value for filter-by-condition.js
  if (result.prefs.hideMarketplaceItems) {

    localStorage.setItem('itemCondition', result.prefs.hideMarketplaceItems);
  }

  if (result.prefs.highlightMedia) {

    // apply-highlights.js
    let highlightScript = document.createElement('script');

    highlightScript.type = 'text/javascript';
    highlightScript.src = chrome.extension.getURL('js/extension/features/apply-highlights.js');
    highlightScript.className = 'de-init';

    elems.push(highlightScript);

    // marketplace-highlights.css
    let highlightCss = document.createElement('link');

    highlightCss.rel = 'stylesheet';
    highlightCss.type = 'text/css';
    highlightCss.href = chrome.extension.getURL('css/marketplace-highlights.css');
    highlightCss.id = 'mediaHighLightsCss';

    elems.push(highlightCss);
  }

  if (result.prefs.notesCount) {

    // notes-counter.js
    let notesCount = document.createElement('script');

    notesCount.type = 'text/javascript';
    notesCount.src = chrome.extension.getURL('js/extension/features/notes-counter.js');
    notesCount.className = 'de-init';

    elems.push(notesCount);
  }

  if (result.prefs.readability) {

    // filter-by-country.js
    let readability = document.createElement('script');

    readability.type = 'text/javascript';
    readability.src = chrome.extension.getURL('js/extension/features/tracklist-readability.js');
    readability.className = 'de-init';

    elems.push(readability);
  }

  // release-durations
  if (result.prefs.releaseDurations) {

    let releaseDurations = document.createElement('script');

    releaseDurations.type = 'text/javascript';
    releaseDurations.src = chrome.extension.getURL('js/extension/features/release-durations.js');
    releaseDurations.className = 'de-init';

    elems.push(releaseDurations);
  }

  // release-ratings
  if ( result.prefs.releaseRatings ) {

    let releaseRatings = document.createElement('script');

    releaseRatings.type = 'text/javascript';
    releaseRatings.src = chrome.extension.getURL('js/extension/features/release-ratings.js');
    releaseRatings.className = 'de-init';

    elems.push(releaseRatings);
  }

  // seller-rep css
  // `sendMessage` is async so handle everything in the callback
  // and call `appendFragment` directly
  if ( result.prefs.sellerRep ) {

    chrome.runtime.sendMessage({request: 'getSellerRepColor'}, function(response) {

      let sellerRepCss = document.createElement('style'),
          respColor = response.sellerRepColor || 'darkorange',
          color = respColor.match(/#*\w/g).join('');

      sellerRepCss.id = 'sellerRepCss';
      sellerRepCss.rel = 'stylesheet';
      sellerRepCss.type = 'text/css';
      sellerRepCss.textContent = `.de-seller-rep ul li i,
                                  .de-seller-rep ul li strong,
                                  .de-seller-rep ul li:not(:last-child) strong a {
                                    color: ${color} !important;
                                  }`;

      appendFragment( [sellerRepCss] );
    });

    // seller-rep.js
    let sellerRep = document.createElement('script');

    sellerRep.type = 'text/javascript';
    sellerRep.src = chrome.extension.getURL('js/extension/features/seller-rep.js');
    sellerRep.className = 'de-init';

    elems.push(sellerRep);
  }

  if ( result.prefs.sortButtons ) {

    // sort-explore-lists.js
    let sortExploreScript = document.createElement('script');

    sortExploreScript.type = 'text/javascript';
    sortExploreScript.src = chrome.extension.getURL('js/extension/features/sort-explore-lists.js');
    sortExploreScript.className = 'de-init';

    elems.push( sortExploreScript );

    // sort-marketplace-lists.js
    let sortMarketplaceScript = document.createElement('script');

    sortMarketplaceScript.type = 'text/javascript';
    sortMarketplaceScript.src = chrome.extension.getURL('js/extension/features/sort-marketplace-lists.js');
    sortMarketplaceScript.className = 'de-init';

    elems.push( sortMarketplaceScript );

    // sort-personal-lists.js
    let sortPersonalListsScript = document.createElement('script');

    sortPersonalListsScript.type = 'text/javascript';
    sortPersonalListsScript.src = chrome.extension.getURL('js/extension/features/sort-personal-lists.js');
    sortPersonalListsScript.className = 'de-init';

    elems.push( sortPersonalListsScript );
  }

  if (result.prefs.suggestedPrices) {

    // update-exchange-rates.js
    let updateExchangeRates = document.createElement('script');

    updateExchangeRates.type = 'text/javascript';
    updateExchangeRates.src = chrome.extension.getURL('js/extension/dependencies/exchange-rates/update-exchange-rates.js');
    updateExchangeRates.className = 'de-init';

    elems.push(updateExchangeRates);

    // suggested-prices-release-page.js
    let suggestedPricesRelease = document.createElement('script');

    suggestedPricesRelease.type = 'text/javascript';
    suggestedPricesRelease.src = chrome.extension.getURL('js/extension/features/suggested-prices-release-page.js');
    suggestedPricesRelease.className = 'de-init';

    elems.push(suggestedPricesRelease);

    // suggested-prices-single.js
    let suggestedPricesSingle = document.createElement('script');

    suggestedPricesSingle.type = 'text/javascript';
    suggestedPricesSingle.src = chrome.extension.getURL('js/extension/features/suggested-prices-single.js');
    suggestedPricesSingle.className = 'de-init';

    elems.push(suggestedPricesSingle);

    // Preloader css
    let suggested = document.createElement('link');

    suggested.rel = 'stylesheet';
    suggested.type = 'text/css';
    suggested.href = chrome.extension.getURL('css/suggested-prices.css');
    suggested.id = 'suggestedCss';

    elems.push(suggested);
  }

  // unit-tests.js
  let unitTests = document.createElement('script');

  unitTests.type = 'text/javascript';
  unitTests.src = chrome.extension.getURL('js/extension/dependencies/tests/unit-tests.js');
  unitTests.className = 'de-init';

  elems.push(unitTests);

  // highlight-comments.js
  let comments = document.createElement('script');

  comments.type = 'text/javascript';
  comments.src = chrome.extension.getURL('js/extension/features/highlight-comments.js');
  comments.className = 'de-init';

  elems.push(comments);

  // filter-by-condition.js
  let hideItems = document.createElement('script');

  hideItems.type = 'text/javascript';
  hideItems.src = chrome.extension.getURL('js/extension/features/filter-by-condition.js');
  hideItems.className = 'de-init';

  elems.push(hideItems);

  // ========================================================
  // Contextual Menu Options
  // ========================================================

  if (result.prefs.useAllDay) {

    chrome.runtime.sendMessage({
      fn: 'searchAllDay',
      id: 'allday',
      method: 'create',
      name: 'All Day',
      request: 'updateContextMenu'
    });
  }

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

  if (result.prefs.useDecks) {

    chrome.runtime.sendMessage({
      fn: 'searchDecks',
      id: 'decks',
      method: 'create',
      name: 'Decks.de',
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

  if (result.prefs.useKristina) {

    chrome.runtime.sendMessage({
      fn: 'searchKristina',
      id: 'kristina',
      method: 'create',
      name: 'Kristina',
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

  if (result.prefs.usePhonica) {

    chrome.runtime.sendMessage({
      fn: 'searchPhonica',
      id: 'phonica',
      method: 'create',
      name: 'Phonica',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useSotu) {

    chrome.runtime.sendMessage({
      fn: 'searchSotu',
      id: 'sotu',
      method: 'create',
      name: 'SOTU',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.useYoutube) {

    chrome.runtime.sendMessage({
      fn: 'searchYoutube',
      id: 'youtube',
      method: 'create',
      name: 'YouTube',
      request: 'updateContextMenu'
    });
  }

  if (result.prefs.userCurrency) {

    localStorage.setItem('userCurrency', result.prefs.userCurrency);
  }

  // append user preferences to the DOM
  // Hack fix for Chrome not loading JQ at start
  (function() {
    let z = setInterval(function() {
      if (window.$) {
        clearInterval(z);
        appendFragment(elems);
      }
    }, 13);
  }());
});

// ========================================================
// Install/Update Notifications
// ========================================================

if (typeof chrome.runtime.onInstalled !== 'undefined') {

  chrome.runtime.onInstalled.addListener(function(details) {

    let previousVersion,
        thisVersion;

    if (details.reason === 'install') {

      console.log('Welcome to the pleasuredome!');

      chrome.storage.sync.set({didUpdate: false}, function() {});

    } else if (details.reason === 'update') {

      /* Don't show an update notice on patches */

      /**
       * versions look something like: "1.10.8".
       * split('.') returns an array of stringed numbers like: ["1", "10", "8"]
       * and compares Major and Minor versions to see if there
       * should be an update notification.
       */
      previousVersion = details.previousVersion.split('.');

      thisVersion = chrome.runtime.getManifest().version.split('.');

      if ( Number(thisVersion[0]) > Number(previousVersion[0]) ||
           Number(thisVersion[1]) > Number(previousVersion[1]) ) {

        chrome.browserAction.setBadgeText({text: ' '});

        chrome.browserAction.setBadgeBackgroundColor({color: '#4cb749'});

        chrome.storage.sync.set({didUpdate: true}, function() {});
      }
    }
  });
}

// ========================================================
// Analytics Option
// ========================================================

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

    analytics.addEventListener('change', toggleAnalytics);

    /* Fire toggleAnalytics once #analytics exists in the DOM */
    toggleAnalytics();

    clearInterval(checkForAnalytics);
  }
}, 1000);


// ========================================================
// Remove unnecessary elements from DOM
// ========================================================

window.onload = function() {

  [...document.querySelectorAll('.de-init')].forEach(child => {

    child.parentNode.removeChild(child);
  });
};


// ========================================================
// - Runtime messages -
// --------------------------------------------------------
// Get preferences from extension side and save to DOM side.
// ========================================================

try {

  // Tag/Hide sellers
  chrome.runtime.sendMessage({request: 'getBlockedSellers'}, function(response) {

    let blockList = response.blockList;

    blockList = JSON.stringify(blockList);

    localStorage.setItem('blockList', blockList);
  });

  // Filter by Country
  chrome.runtime.sendMessage({request: 'filterByCountry'}, function(response) {

    let countryPrefs = response.filterByCountry;

    countryPrefs = JSON.stringify(countryPrefs);

    localStorage.setItem('filterByCountry', countryPrefs);
  });

  // Filter by item condition
  chrome.runtime.sendMessage({request: 'getHideItems'}, function(response) {

    let itemCondition = response.itemCondition;

    itemCondition = JSON.stringify(itemCondition);

    localStorage.setItem('itemCondition', itemCondition);
  });

  // Readability settings
  chrome.runtime.sendMessage({request: 'getReadability'}, function(response) {

    let readability = response.readability;

    readability = JSON.stringify(readability);

    localStorage.setItem('readability', readability);
  });

  // Seller Reputation Percentage
  chrome.runtime.sendMessage({request: 'getSellerRep'}, function(response) {

    let sellerRep = response.sellerRep;

    sellerRep = JSON.stringify(sellerRep);

    localStorage.setItem('sellerRep', sellerRep);
  });

} catch (err) {

  // the chrome.runtime method above ^ seems to run twice so suppress error unless it's from something else...
  if (err.message !== 'Invalid arguments to connect.') {

    console.warn('Discogs Enhancer: ', err);
  }
}
