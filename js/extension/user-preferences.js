/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This is a content script that appends the appropriate feature scripts
 * based on the user's saved preferences. It also merges the user's
 * preferences from both chrome.storage and the DOM's localStorage into a
 * single localStorage object called `userPreferences`. The feature scripts
 * appended here rely on `userPreferences` to function.
 */

let
    donate,
    elems = [],
    filterMonitor,
    hashes,
    prefs = {},
    resourceLibrary;

// Feature preferece defaults
// TODO: these can be removed after a few months once
// users have been migrated.

// Update: Chrome webstore says there are a number
// of users who are still on versions 2.x so I'll keep this
// around a bit longer.
let defaults = {
  blockList: { list: [], hide: 'tag' },
  countryList: { list: [], currency: false, include: false },
  discriminators: {
    hide: false,
    superscript: true,
    unselectable: true,
    transparent: false,
  },
  favoriteList: { list: [] },
  filterPrices: { minimum: null, maximum: null },
  linksInTabs: {
    artists: false,
    collection: false,
    dashboard: false,
    labels: false,
    lists: false,
    marketplace: false,
    releases: false,
    wantlist: false,
  },
  mediaCondition: 7,
  minimumRating: null,
  navbarShortcuts: {
    forum: false,
    groups: false,
    inventory: false,
    itemsIWant: false,
    listAnItem: false,
    orders: false,
    profile: false,
    purchases: false,
    storefront: false,
    subsAndDrafts: false,
  },
  readability: {
    indexTracks: false,
    nth: 10,
    otherMediaReadability: false,
    otherMediaThreshold: 15,
    size: 0.5,
    vcReadability: true,
    vcThreshold: 8
  },
  sellerRep: 75,
  sellerRepColor: 'darkorange',
  sellerRepFilter: false,
  sleeveCondition: { value: 7, generic: false, noCover: false },
  usDateFormat: false,
};

// ========================================================
// Functions
// ========================================================

/**
 * Migrates user preferences from localStorage to chrome.storage.
 * Background.js (service worker) does not have access to localStorage
 * so the migration needs to happen from this content script.
 * @returns {Promise}
 */
function migratePreferences() {
  return chrome.storage.sync.get(['migrated']).then(({ migrated }) => {
    return new Promise(async resolve => {

      if (migrated) {
        return resolve();
      }

      let up = JSON.parse(localStorage.getItem('userPreferences')) || {};

      let
          blockList = up.blockList || defaults.blockList,
          countryList = up.countryList || defaults.countryList,
          discriminators = up.discriminators || defaults.discriminators,
          favoriteList = up.favoriteList || defaults.favoriteList,
          filterPrices = up.filterPrices || defaults.filterPrices,
          linksInTabs = up.linksInTabs || defaults.linksInTabs,
          navbarShortcuts = up.navbarShortcuts || defaults.navbarShortcuts,
          mediaCondition = up.mediaCondition || defaults.mediaCondition,
          minimumRating = up.inventoryRatings || defaults.minimumRating,
          readability = up.readability || defaults.readability,
          sellerRep = up.sellerRep || defaults.sellerRep,
          sellerRepColor = up.sellerRepColor || defaults.sellerRepColor,
          sellerRepFilter = up.sellerRepFilter || defaults.sellerRepFilter,
          sleeveCondition = up.sleeveCondition || defaults.sleeveCondition,
          usDateFormat = up.usDateFormat || defaults.usDateFormat;

      let featureData = {
            blockList,
            countryList,
            discriminators,
            favoriteList,
            filterPrices,
            linksInTabs,
            navbarShortcuts,
            mediaCondition,
            minimumRating,
            readability,
            sellerRep,
            sellerRepColor,
            sellerRepFilter,
            sleeveCondition,
            usDateFormat
          };

      return Promise.all([
        chrome.storage.sync.set({ featureData }),
        chrome.storage.sync.set({ 'migrated': true })
      ]).then(() => {
        console.log('Discogs Enhancer: Feature Preferences migrated.');
        return resolve();
      });
    });
  });
}

/**
 * docuemnt.readyState check via promise
 * @returns {Promise}
 */
function documentReady(document) {
  return new Promise(resolve => {

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      return resolve(document);
    }

    document.addEventListener('DOMContentLoaded', () => {
      return resolve(document);
    });
  });
}

/**
 * Used to append the js/css nodes to the DOM when the
 * extension first runs.
 * @param    {Array} elems - An array of nodes to be appended
 * @return   {Promise}
 */
function appendFragment(elems) {
  return new Promise((resolve, reject) => {
    let fragment = document.createDocumentFragment(),
        loadedScripts = 0;

    elems.forEach(elm => {
      elm.onload = () => {
        loadedScripts++;
        if (loadedScripts === elems.length) resolve();
      };

      elm.onerror = () => {
        reject(new Error(`Discogs Enhancer: Failed to load ${elm.src}`));
      };

      fragment.appendChild(elm);
    });

    (document.head || document.documentElement).appendChild(fragment);
  });
}

/**
 * This tracks the filter preferences so that the current
 * Marketplace filtering status can be appended to the DOM whilst
 * using Everlasting Marketplace.
 * @returns {Object}
 */
function getCurrentFilterState(prefs) {

  let currentFilterState = {
    everlastingMarket: prefs?.everlastingMarket || false,
    filterMediaCondition: prefs?.filterMediaCondition || false,
    filterPrices: prefs?.filterPrices || false,
    filterShippingCountry: prefs?.filterShippingCountry || false,
    filterSleeveCondition: prefs?.filterSleeveCondition || false,
  };

  return currentFilterState;
}

/**
 * Gets the specified cookie. Used for retreving the username
 * @param {string} name - The name of the cookie
 * @returns {string}
 */
window.getCookie = function (name) {
  let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
};

// ========================================================
//  Script Appension
// ========================================================

// Dark Theme CSS is automatically appened via manifest.json on 'document_start'
document.documentElement.classList.add('de-dark-theme', 'de-enabled');

// Get the user's preferences (preferences are created on install in background.js)
chrome.storage.sync.get('prefs', result => {
  prefs = result.prefs;
  let autoDarkTheme = prefs.darkThemeSystemPref;

  let prefersDarkColorScheme = window.matchMedia('(prefers-color-scheme:dark)');
  // Disable the Dark Theme / match system preference
  if (!prefs.darkTheme) {
    document.documentElement.classList.remove('de-dark-theme');
  }

  if (prefs.darkTheme && autoDarkTheme && !prefersDarkColorScheme.matches) {
    document.documentElement.classList.remove('de-dark-theme');
  }
  // Set theme variant
  if (prefs.darkThemeVariant) {
    document.documentElement.classList.add(`theme-${prefs.darkThemeVariant}`);
  }
});

// Resource Library
// A singleton of shared methods for the extension.
// Appended first so the methods are available to the
// subsequently appended features.
resourceLibrary = document.createElement('script');
resourceLibrary.type = 'text/javascript';
resourceLibrary.id = 'resource-library';
resourceLibrary.src = chrome.runtime.getURL('js/extension/dependencies/resource-library.js');

appendFragment([resourceLibrary])
  .then(() => migratePreferences())
  .then(async () => {
    if (window.getCookie('desl')) return;

    // Don't use the dark theme on subdomains or specific pages
    // Fixed in this file instead of manifest.json due to issues explained here:
    // https://github.com/salcido/discogs-enhancer/issues/14
    if (!window.location.href.includes('www')
      || window.location.href.includes('/order/prints?')
      || window.location.href.includes('discogs.com/company')
      || window.location.href.includes('discogs.com/selling')
      || window.location.href.includes('/company/careers')
      || window.location.href.includes('discogs.com/record-stores')
      || window.location.href.includes('discogs.com/record-store-day')
      || window.location.href.includes('/digs')) {

      document.documentElement.classList.remove('de-dark-theme');
    }

    return new Promise(resolve => {
      // ========================================================
      // Preference-agnostic scripts (always appended)
      // ========================================================

      // GraphQL Hashes
      hashes = document.createElement('script');
      hashes.type = 'text/javascript';
      hashes.className = 'de-init';
      hashes.src = chrome.runtime.getURL('js/extension/dependencies/hashes.js');

      elems.push(hashes);

      // Filter Monitor
      filterMonitor = document.createElement('script');
      filterMonitor.type = 'text/javascript';
      filterMonitor.className = 'de-init';
      filterMonitor.src = chrome.runtime.getURL('js/extension/features/filter-monitor.js');

      elems.push(filterMonitor);

      // update-exchange-rates.js
      let updateExchangeRates = document.createElement('script');

      updateExchangeRates.type = 'text/javascript';
      updateExchangeRates.src = chrome.runtime.getURL('js/extension/dependencies/update-exchange-rates.js');
      updateExchangeRates.className = 'de-init';

      elems.push(updateExchangeRates);

      // links-in-new-tabs.js
      let linksInTabs = document.createElement('script');

      linksInTabs.type = 'text/javascript';
      linksInTabs.src = chrome.runtime.getURL('js/extension/features/links-in-new-tabs.js');
      linksInTabs.className = 'de-init';

      elems.push(linksInTabs);

      // Nav bar shortcuts
      let navbarShortcuts = document.createElement('script');

      navbarShortcuts.type = 'text/javascript';
      navbarShortcuts.src = chrome.runtime.getURL('js/extension/features/navbar-shortcuts.js');
      navbarShortcuts.className = 'de-init';

      elems.push(navbarShortcuts);

      // New Header #shadow-root fix
      let shadowrootfix = document.createElement('script');

      shadowrootfix.type = 'text/javascript';
      shadowrootfix.src = chrome.runtime.getURL('js/extension/dependencies/shadow-root.js');
      shadowrootfix.className = 'de-init';

      elems.push(shadowrootfix);

      // New Release Page Fixes
      let newReleasePageFixes = document.createElement('link');

      newReleasePageFixes.rel = 'stylesheet';
      newReleasePageFixes.type = 'text/css';
      newReleasePageFixes.href = chrome.runtime.getURL('css/new-release-page-fixes.css');
      newReleasePageFixes.id = 'newReleasePageFixes';

      elems.push(newReleasePageFixes);

      // Donate Modal
      donate = document.createElement('script');
      donate.type = 'text/javascript';
      donate.className = 'de-init';
      donate.src = chrome.runtime.getURL('js/extension/features/donate-modal.js');

      elems.push(donate);

      let oldArtistLabelPages = document.createElement('script');

      oldArtistLabelPages.type = 'text/javascript';
      oldArtistLabelPages.src = chrome.runtime.getURL('js/extension/features/old-artist-label-pages.js');
      oldArtistLabelPages.className = 'de-init';

      elems.push(oldArtistLabelPages);

      // - Toggleable CSS files -
      // --------------------------------------------------------
      // These are always appended and enabled/disabled via
      // JS so that the user can toggle them from the extension
      // menu and not have to refresh to see the effects.
      // --------------------------------------------------------

      // min-max-columns.css
      let minMax_css = document.createElement('link');

      minMax_css.rel = 'stylesheet';
      minMax_css.type = 'text/css';
      minMax_css.href = chrome.runtime.getURL('css/min-max-columns.css');
      minMax_css.id = 'minMaxColumnsCss';
      minMax_css.disabled = !prefs.hideMinMaxColumns;

      elems.push(minMax_css);

      // compact-artist.scss
      let compact_artist_css = document.createElement('link');

      compact_artist_css.rel = 'stylesheet';
      compact_artist_css.type = 'text/css';
      compact_artist_css.href = chrome.runtime.getURL('css/compact-artist.css');
      compact_artist_css.id = 'compactArtistCss';
      compact_artist_css.disabled = !prefs.compactArtist;

      elems.push(compact_artist_css);

      // baoi-fields.css
      let baoi_css = document.createElement('link');

      baoi_css.rel = 'stylesheet';
      baoi_css.type = 'text/css';
      baoi_css.href = chrome.runtime.getURL('css/baoi-fields.css');
      baoi_css.id = 'baoiFieldsCss';
      baoi_css.disabled = !prefs.baoiFields;

      elems.push(baoi_css);

      // large-youtube-playlists.css
      let ytPlaylists_css = document.createElement('link');

      ytPlaylists_css.rel = 'stylesheet';
      ytPlaylists_css.type = 'text/css';
      ytPlaylists_css.href = chrome.runtime.getURL('css/large-youtube-playlists.css');
      ytPlaylists_css.id = 'ytPlaylistsCss';
      ytPlaylists_css.disabled = !prefs.ytPlaylists;

      elems.push(ytPlaylists_css);

      // everlasting.css
      let everlastingCss = document.createElement('link');

      everlastingCss.rel = 'stylesheet';
      everlastingCss.type = 'text/css';
      everlastingCss.href = chrome.runtime.getURL('css/everlasting.css');

      elems.push(everlastingCss);

      // Friend-counter (always enabled)
      // See comments in friend-counter.js for more details
      let friendCounter = document.createElement('script');

      friendCounter.type = 'text/javascript';
      friendCounter.className = 'de-init';
      friendCounter.src = chrome.runtime.getURL('js/extension/features/friend-counter.js');

      elems.push(friendCounter);

      // marketplace-highlights.js
      let highlightScript = document.createElement('script');

      highlightScript.type = 'text/javascript';
      highlightScript.src = chrome.runtime.getURL('js/extension/features/marketplace-highlights.js');
      highlightScript.className = 'de-init';

      elems.push(highlightScript);

      // marketplace-highlights.css
      let highlightCss = document.createElement('link');

      highlightCss.rel = 'stylesheet';
      highlightCss.type = 'text/css';
      highlightCss.href = chrome.runtime.getURL('css/marketplace-highlights.css');
      highlightCss.id = 'mediaHighLightsCss';
      highlightCss.disabled = !prefs.highlightMedia;

      elems.push(highlightCss);

      // ========================================================
      // Preference-dependent scripts
      // ========================================================

      // Adding A Feature: Step 1

      if (prefs.absoluteDate) {
        // show-actual-dates.js
        let absoluteDate = document.createElement('script');

        absoluteDate.type = 'text/javascript';
        absoluteDate.src = chrome.runtime.getURL('js/extension/features/show-actual-dates.js');
        absoluteDate.className = 'de-init';

        elems.push(absoluteDate);

        let absoluteDateReact = document.createElement('script');

        absoluteDateReact.type = 'text/javascript';
        absoluteDateReact.src = chrome.runtime.getURL('js/extension/features/show-actual-dates-react.js');
        absoluteDateReact.className = 'de-init';

        elems.push(absoluteDateReact);
      }

      if (prefs.averagePrice) {
        // average-price.js
        let averagePrice = document.createElement('script');

        averagePrice.type = 'text/javascript';
        averagePrice.src = chrome.runtime.getURL('js/extension/features/average-price.js');
        averagePrice.className = 'de-init';

        elems.push(averagePrice);
      }

      if (prefs.blockBuyers) {
        // block-buyers.js
        let blockBuyers = document.createElement('script');

        blockBuyers.type = 'text/javascript';
        blockBuyers.src = chrome.runtime.getURL('js/extension/features/block-buyers.js');
        blockBuyers.className = 'de-init';

        elems.push(blockBuyers);
      }

      if (prefs.blockSellers) {

        // block-sellers.js
        let blockSellers = document.createElement('script');

        blockSellers.type = 'text/javascript';
        blockSellers.src = chrome.runtime.getURL('js/extension/features/block-sellers.js');
        blockSellers.className = 'de-init';

        elems.push(blockSellers);

        let blockSellersPopover = document.createElement('script');

        blockSellersPopover.type = 'text/javascript';
        blockSellersPopover.src = chrome.runtime.getURL('js/extension/features/block-sellers-popover.js');
        blockSellersPopover.className = 'de-init';

        elems.push(blockSellersPopover);

        // blocked-seller.css
        let blockSellers_css = document.createElement('link');

        blockSellers_css.rel = 'stylesheet';
        blockSellers_css.type = 'text/css';
        blockSellers_css.href = chrome.runtime.getURL('css/blocked-seller.css');

        elems.push(blockSellers_css);
      }

      if (prefs.confirmBeforeRemoving) {

        let confirmBeforeRemoving = document.createElement('script');

        confirmBeforeRemoving.type = 'text/javascript';
        confirmBeforeRemoving.src = chrome.runtime.getURL('js/extension/features/confirm-before-removing.js');
        confirmBeforeRemoving.className = 'de-init';

        elems.push(confirmBeforeRemoving);
      }

      if (prefs.collectionBoxFix) {

        // collection-box-fix.js
        let collectionBoxFix = document.createElement('script');

        collectionBoxFix.type = 'text/javascript';
        collectionBoxFix.src = chrome.runtime.getURL('js/extension/features/collection-box-fix.js');
        collectionBoxFix.className = 'de-init';

        elems.push(collectionBoxFix);
      }

      if (prefs.converter
        && !window.location.href.includes('wantlister')
        && !window.location.href.includes('/order/prints?')) {

        // currency-converter.css
        let converter_css = document.createElement('link');

        converter_css.rel = 'stylesheet';
        converter_css.type = 'text/css';
        converter_css.href = chrome.runtime.getURL('css/currency-converter.css');

        elems.push(converter_css);

        // currency-converter.js
        let converter = document.createElement('script');

        converter.type = 'text/javascript';
        converter.className = 'de-init';
        converter.src = chrome.runtime.getURL('js/extension/features/currency-converter.js');

        elems.push(converter);
      }

      // release-history-legend.js
      if (prefs.darkTheme) {

        let releaseHistoryScript = document.createElement('script');

        releaseHistoryScript.type = 'text/javascript';
        releaseHistoryScript.src = chrome.runtime.getURL('js/extension/features/release-history-legend.js');
        releaseHistoryScript.className = 'de-init';

        elems.push(releaseHistoryScript);

        // options.js
        // The option menu is only available when the dark theme is in use
        let options = document.createElement('script');

        options.type = 'text/javascript';
        options.src = chrome.runtime.getURL('js/extension/dependencies/options.js');
        options.className = 'de-init';

        elems.push(options);
      }

      // Dark Theme Apple Music Widget
      if (prefs.darkTheme) {

        let amTheme = document.createElement('script');

        amTheme.type = 'text/javascript';
        amTheme.className = 'de-init';
        amTheme.src = chrome.runtime.getURL('js/extension/features/dark-theme-apple-music.js');

        elems.push(amTheme);
      }

      // Dark Theme System Preference Listener
      if (prefs.darkTheme && prefs.darkThemeSystemPref) {

        let themeListener = document.createElement('script');

        themeListener.type = 'text/javascript';
        themeListener.className = 'de-init';
        themeListener.src = chrome.runtime.getURL('js/extension/features/dark-theme-listener.js');

        elems.push(themeListener);
      }

      // demand-index.js
      if (prefs.demandIndex) {

        let demandIndex = document.createElement('script');

        demandIndex.type = 'text/javascript';
        demandIndex.src = chrome.runtime.getURL('js/extension/features/demand-index.js');
        demandIndex.className = 'de-init';

        elems.push(demandIndex);

        let demandIndexReact = document.createElement('script');

        demandIndexReact.type = 'text/javascript';
        demandIndexReact.src = chrome.runtime.getURL('js/extension/features/demand-index-react.js');
        demandIndexReact.className = 'de-init';

        elems.push(demandIndexReact);

        let demandIndexMP = document.createElement('script');

        demandIndexMP.type = 'text/javascript';
        demandIndexMP.src = chrome.runtime.getURL('js/extension/features/demand-index-marketplace.js');
        demandIndexMP.className = 'de-init';

        elems.push(demandIndexMP);
      }

      // editing notepad
      if (prefs.editingNotepad) {

        let editingNotepad = document.createElement('script');

        editingNotepad.type = 'text/javascript';
        editingNotepad.src = chrome.runtime.getURL('js/extension/features/editing-notepad.js');
        editingNotepad.className = 'de-init';

        elems.push(editingNotepad);
      }

      // everlasting marketplace
      if (prefs.everlastingMarket) {

        // everlasting-marketplace.js && everlasting-marketplace-release-page.js
        let everlastingMarket = document.createElement('script'),
            everlastingMarketReleases = document.createElement('script');

        everlastingMarket.type = 'text/javascript';
        everlastingMarket.src = chrome.runtime.getURL('js/extension/features/everlasting-marketplace.js');
        everlastingMarket.className = 'de-init';

        elems.push(everlastingMarket);

        everlastingMarketReleases.type = 'text/javascript';
        everlastingMarketReleases.src = chrome.runtime.getURL('js/extension/features/everlasting-marketplace-release-page.js');
        everlastingMarketReleases.className = 'de-init';

        elems.push(everlastingMarketReleases);
      }

      if (prefs.favoriteSellers) {

        // favorite-sellers.js
        let favoriteSellers = document.createElement('script');

        favoriteSellers.type = 'text/javascript';
        favoriteSellers.src = chrome.runtime.getURL('js/extension/features/favorite-sellers.js');
        favoriteSellers.className = 'de-init';

        elems.push(favoriteSellers);
      }

      if (prefs.feedback) {

        let feedback = document.createElement('script');

        feedback.type = 'text/javascript';
        feedback.src = chrome.runtime.getURL('js/extension/features/feedback-notifier.js');
        feedback.className = 'de-init';

        elems.push(feedback);
      }

      if (prefs.filterMediaCondition) {

        // filter-media-condition.js
        let filterMediaCondition = document.createElement('script');

        filterMediaCondition.type = 'text/javascript';
        filterMediaCondition.src = chrome.runtime.getURL('js/extension/features/filter-media-condition.js');
        filterMediaCondition.className = 'de-init';

        elems.push(filterMediaCondition);
      }

      if (prefs.filterPrices) {

        let filterPrices = document.createElement('script');

        filterPrices.type = 'text/javascript';
        filterPrices.src = chrome.runtime.getURL('js/extension/features/filter-prices.js');
        filterPrices.className = 'de-init';

        elems.push(filterPrices);
      }

      if (prefs.filterShippingCountry) {

        // filter-shipping-country.js
        let filterShippingCountry = document.createElement('script');

        filterShippingCountry.type = 'text/javascript';
        filterShippingCountry.src = chrome.runtime.getURL('js/extension/features/filter-shipping-country.js');
        filterShippingCountry.className = 'de-init';

        elems.push(filterShippingCountry);
      }

      if (prefs.filterSleeveCondition) {

        // filter-sleeve-condition.js
        let filterSleeveCondition = document.createElement('script');

        filterSleeveCondition.type = 'text/javascript';
        filterSleeveCondition.src = chrome.runtime.getURL('js/extension/features/filter-sleeve-condition.js');
        filterSleeveCondition.className = 'de-init';

        elems.push(filterSleeveCondition);
      }

      // text format shortcuts
      if (prefs.formatShortcuts) {

        // text-format-shortcuts.js
        let shortcuts = document.createElement('script');

        shortcuts.type = 'text/javascript';
        shortcuts.src = chrome.runtime.getURL('js/extension/features/text-format-shortcuts.js');
        shortcuts.className = 'de-init';

        elems.push(shortcuts);

        let shortcutsReact = document.createElement('script');

        shortcutsReact.type = 'text/javascript';
        shortcutsReact.src = chrome.runtime.getURL('js/extension/features/text-format-shortcuts-react.js');
        shortcutsReact.className = 'de-init';

        elems.push(shortcutsReact);

        // text-format-shortcuts.css
        let shortcuts_css = document.createElement('link');

        shortcuts_css.rel = 'stylesheet';
        shortcuts_css.type = 'text/css';
        shortcuts_css.href = chrome.runtime.getURL('css/text-format-shortcuts.css');

        elems.push(shortcuts_css);
      }

      // force-dashboard-link.js
      if (prefs.forceDashboard) {

        let forceDashboard = document.createElement('script');

        forceDashboard.type = 'text/javascript';
        forceDashboard.src = chrome.runtime.getURL('js/extension/features/force-dashboard.js');
        forceDashboard.className = 'de-init';

        elems.push(forceDashboard);
      }

      if (prefs.filterUnavailable) {

        // filter-unavailable.js
        let unavailable = document.createElement('script');

        unavailable.type = 'text/javascript';
        unavailable.src = chrome.runtime.getURL('js/extension/features/filter-unavailable.js');
        unavailable.className = 'de-init';

        elems.push(unavailable);
      }

      if ( prefs.fullWidthPages ) {

        let fullWidthPages = document.createElement('script');

        fullWidthPages.type = 'text/javascript';
        fullWidthPages.src = chrome.runtime.getURL('js/extension/features/full-width-pages.js');
        fullWidthPages.className = 'de-init';

        elems.push(fullWidthPages);
      }

      if (prefs.notesCount) {

        // notes-counter.js
        let notesCount = document.createElement('script');

        notesCount.type = 'text/javascript';
        notesCount.src = chrome.runtime.getURL('js/extension/features/notes-counter.js');
        notesCount.className = 'de-init';

        elems.push(notesCount);

        let notesCountReact = document.createElement('script');

        notesCountReact.type = 'text/javascript';
        notesCountReact.src = chrome.runtime.getURL('js/extension/features/notes-counter-react.js');
        notesCountReact.className = 'de-init';

        elems.push(notesCountReact);
      }

      if (prefs.quickSearch) {

        // quick-search.js
        let quickSearch = document.createElement('script');

        quickSearch.type = 'text/javascript';
        quickSearch.src = chrome.runtime.getURL('js/extension/features/quick-search.js');
        quickSearch.className = 'de-init';

        elems.push(quickSearch);
      }

      if (prefs.quickSearchTracklists) {

        // quick-search.js
        let quickSearchTracklists = document.createElement('script');

        quickSearchTracklists.type = 'text/javascript';
        quickSearchTracklists.src = chrome.runtime.getURL('js/extension/features/quick-search-tracklists.js');
        quickSearchTracklists.className = 'de-init';

        elems.push(quickSearchTracklists);
      }

      if (prefs.inventoryRatings) {

        // inventory-ratings.js
        let inventoryRatings = document.createElement('script');

        inventoryRatings.type = 'text/javascript';
        inventoryRatings.src = chrome.runtime.getURL('js/extension/features/inventory-ratings.js');
        inventoryRatings.className = 'de-init';

        elems.push(inventoryRatings);
      }

      if (prefs.randomItem) {

        // random-item.js
        let randomItem = document.createElement('script');

        randomItem.type = 'text/javascript';
        randomItem.src = chrome.runtime.getURL('js/extension/features/random-item.js');

        elems.push(randomItem);
      }

      if (prefs.ratingPercent) {

        // rating-percent.js
        let ratingPercent = document.createElement('script');

        ratingPercent.type = 'text/javascript';
        ratingPercent.src = chrome.runtime.getURL('js/extension/features/rating-percent.js');
        ratingPercent.className = 'de-init';

        elems.push(ratingPercent);

        let ratingPercentReact = document.createElement('script');

        ratingPercentReact.type = 'text/javascript';
        ratingPercentReact.src = chrome.runtime.getURL('js/extension/features/rating-percent-react.js');
        ratingPercentReact.className = 'de-init';

        elems.push(ratingPercentReact);
      }

      if (prefs.readability) {

        let tracklist_css = document.createElement('link');

        tracklist_css.rel = 'stylesheet';
        tracklist_css.type = 'text/css';
        tracklist_css.href = chrome.runtime.getURL('css/tracklist-readability.css');
        tracklist_css.id = 'tracklist_css';

        elems.push(tracklist_css);

        // tracklist-readability.js
        let readability = document.createElement('script');

        readability.type = 'text/javascript';
        readability.src = chrome.runtime.getURL('js/extension/features/tracklist-readability.js');
        readability.className = 'de-init';

        elems.push(readability);

        let readabilityReact = document.createElement('script');

        readabilityReact.type = 'text/javascript';
        readabilityReact.src = chrome.runtime.getURL('js/extension/features/tracklist-readability-react.js');
        readabilityReact.className = 'de-init';

        elems.push(readabilityReact);
      }

      if (prefs.relativeSoldDate) {

        // relative-sold-date.js
        let relativeSoldDate = document.createElement('script');

        relativeSoldDate.type = 'text/javascript';
        relativeSoldDate.src = chrome.runtime.getURL('js/extension/features/relative-sold-date.js');
        relativeSoldDate.className = 'de-init';

        elems.push(relativeSoldDate);

        let relativeSoldDateReact = document.createElement('script');

        relativeSoldDateReact.type = 'text/javascript';
        relativeSoldDateReact.src = chrome.runtime.getURL('js/extension/features/relative-sold-date-react.js');
        relativeSoldDateReact.className = 'de-init';

        elems.push(relativeSoldDateReact);
      }

      // release-durations
      if (prefs.releaseDurations) {

        let releaseDurations = document.createElement('script');

        releaseDurations.type = 'text/javascript';
        releaseDurations.src = chrome.runtime.getURL('js/extension/features/release-durations.js');
        releaseDurations.className = 'de-init';

        elems.push(releaseDurations);

        let releaseDurationsReact = document.createElement('script');

        releaseDurationsReact.type = 'text/javascript';
        releaseDurationsReact.src = chrome.runtime.getURL('js/extension/features/release-durations-react.js');
        releaseDurationsReact.className = 'de-init';

        elems.push(releaseDurationsReact);
      }

      // release-ratings
      if (prefs.releaseRatings) {

        let releaseRatings = document.createElement('script');

        releaseRatings.type = 'text/javascript';
        releaseRatings.src = chrome.runtime.getURL('js/extension/features/release-ratings.js');
        releaseRatings.className = 'de-init';

        elems.push(releaseRatings);
      }

      // release-scanner
      if (prefs.releaseScanner) {

        let releaseScanner = document.createElement('script');

        releaseScanner.type = 'text/javascript';
        releaseScanner.src = chrome.runtime.getURL('js/extension/features/release-scanner.js');
        releaseScanner.className = 'de-init';

        elems.push(releaseScanner);

        let releaseScannerArtistLabel = document.createElement('script');

        releaseScannerArtistLabel.type = 'text/javascript';
        releaseScannerArtistLabel.src = chrome.runtime.getURL('js/extension/features/release-scanner-artist-label.js');
        releaseScannerArtistLabel.className = 'de-init';

        elems.push(releaseScannerArtistLabel);
      }

      if (prefs.removeFromWantlist) {

        // remove-from-wantlist.js
        let removeFromWantlist = document.createElement('script');

        removeFromWantlist.type = 'text/javascript';
        removeFromWantlist.src = chrome.runtime.getURL('js/extension/features/remove-from-wantlist.js');
        removeFromWantlist.className = 'de-init';

        elems.push(removeFromWantlist);
      }

      if (prefs.sellerItemsInCart) {

        let sellerItemsInCart = document.createElement('script');

        sellerItemsInCart.type = 'text/javascript';
        sellerItemsInCart.src = chrome.runtime.getURL('js/extension/features/show-sellers-in-cart.js');
        sellerItemsInCart.className = 'de-init';

        elems.push(sellerItemsInCart);
      }

      if (prefs.sellerRep) {

        // seller-rep.js
        let sellerRep = document.createElement('script');

        sellerRep.type = 'text/javascript';
        sellerRep.src = chrome.runtime.getURL('js/extension/features/seller-rep.js');
        sellerRep.className = 'de-init';

        elems.push(sellerRep);
      }

      if (prefs.shoppingSpreeMode) {
        // shopping-spree-mode.js
        let shoppingSpree = document.createElement('script');

        shoppingSpree.type = 'text/javascript';
        shoppingSpree.src = chrome.runtime.getURL('js/extension/features/shopping-spree-mode.js');
        shoppingSpree.className = 'de-init';

        elems.push(shoppingSpree);

        // shopping-spree-mode-new.js
        let shoppingSpreeNew = document.createElement('script');

        shoppingSpreeNew.type = 'text/javascript';
        shoppingSpreeNew.src = chrome.runtime.getURL('js/extension/features/shopping-spree-mode-new.js');
        shoppingSpreeNew.className = 'de-init';

        elems.push(shoppingSpreeNew);
      }

      if (prefs.sortButtons) {

        let sortButton_css = document.createElement('link');

        sortButton_css.rel = 'stylesheet';
        sortButton_css.type = 'text/css';
        sortButton_css.href = chrome.runtime.getURL('css/sort-buttons.css');
        sortButton_css.id = 'sortButton_css';

        elems.push(sortButton_css);

        // sort-explore-lists.js
        let sortExploreScript = document.createElement('script');

        sortExploreScript.type = 'text/javascript';
        sortExploreScript.src = chrome.runtime.getURL('js/extension/features/sort-explore-lists.js');
        sortExploreScript.className = 'de-init';

        elems.push(sortExploreScript);

        // sort-marketplace-lists.js
        let sortMarketplaceScript = document.createElement('script');

        sortMarketplaceScript.type = 'text/javascript';
        sortMarketplaceScript.src = chrome.runtime.getURL('js/extension/features/sort-marketplace-lists.js');
        sortMarketplaceScript.className = 'de-init';

        elems.push(sortMarketplaceScript);
      }

      if (prefs.sortByTotalPrice) {

        let sortByTotalPriceScript = document.createElement('script');

        sortByTotalPriceScript.type = 'text/javascript';
        sortByTotalPriceScript.src = chrome.runtime.getURL('js/extension/features/sort-by-total-price.js');
        sortByTotalPriceScript.id = 'sortbytotal';
        // sortByTotalPriceScript.className = 'de-init';

        elems.push(sortByTotalPriceScript);
      }

      if (prefs.suggestedPrices) {
        // suggested-prices-release-page.js
        let suggestedPricesRelease = document.createElement('script');

        suggestedPricesRelease.type = 'text/javascript';
        suggestedPricesRelease.src = chrome.runtime.getURL('js/extension/features/suggested-prices-release-page.js');
        suggestedPricesRelease.className = 'de-init';

        elems.push(suggestedPricesRelease);

        // suggested-prices-single.js
        let suggestedPricesSingle = document.createElement('script');

        suggestedPricesSingle.type = 'text/javascript';
        suggestedPricesSingle.src = chrome.runtime.getURL('js/extension/features/suggested-prices-single.js');
        suggestedPricesSingle.className = 'de-init';

        elems.push(suggestedPricesSingle);

        // Preloader css
        let suggested = document.createElement('link');

        suggested.rel = 'stylesheet';
        suggested.type = 'text/css';
        suggested.href = chrome.runtime.getURL('css/suggested-prices.css');
        suggested.id = 'suggestedCss';

        elems.push(suggested);
      }

      // tweak-discriminators.js
      if (prefs.tweakDiscrims) {

        let tweakDiscrims = document.createElement('script');

        tweakDiscrims.type = 'text/javascript';
        tweakDiscrims.src = chrome.runtime.getURL('js/extension/features/tweak-discriminators.js');
        tweakDiscrims.className = 'de-init';

        elems.push(tweakDiscrims);

        let tweakDiscrimsReact = document.createElement('script');

        tweakDiscrimsReact.type = 'text/javascript';
        tweakDiscrimsReact.src = chrome.runtime.getURL('js/extension/features/tweak-discriminators-react.js');
        tweakDiscrimsReact.className = 'de-init';

        elems.push(tweakDiscrimsReact);
      }

      // unit-tests.js
      let unitTests = document.createElement('script');

      unitTests.type = 'text/javascript';
      unitTests.src = chrome.runtime.getURL('js/extension/dependencies/tests/unit-tests.js');
      unitTests.className = 'de-init';

      elems.push(unitTests);

      // highlight-comments.js
      let comments = document.createElement('script');

      comments.type = 'text/javascript';
      comments.src = chrome.runtime.getURL('js/extension/features/highlight-comments.js');
      comments.className = 'de-init';

      elems.push(comments);

      return resolve(prefs);
    })
      .then((prefs) => {
        chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
          return new Promise(async resolve => {

            let oldPrefs = JSON.parse(localStorage.getItem('userPreferences')) || {},
                currentFilterState = getCurrentFilterState(prefs),
                userCurrency = prefs.userCurrency,
                newPrefs;

            // Remove deprecated properties from preferences
            // TODO: delete these eventually

            // Delete old feedback object if it does not contain a username
            if (oldPrefs.feedback && oldPrefs.feedback.buyer
              || oldPrefs.feedback && oldPrefs.feedback.seller) {
              delete oldPrefs.feedback;
            }
            // Delete old ls objects after migration
            delete oldPrefs.inventoryRatings;
            delete oldPrefs.sellerNames;
            delete oldPrefs.blockList;
            delete oldPrefs.countryList;
            delete oldPrefs.discriminators;
            delete oldPrefs.favoriteList;
            delete oldPrefs.filterPrices;
            delete oldPrefs.linksInTabs;
            delete oldPrefs.mediaCondition;
            delete oldPrefs.minimumRating;
            delete oldPrefs.readability;
            delete oldPrefs.sellerRep;
            delete oldPrefs.sellerRepColor;
            delete oldPrefs.sellerRepFilter;
            delete oldPrefs.sleeveCondition;
            delete oldPrefs.usDateFormat;

            // Get any newly blocked sellers and add them into chrome.storage
            oldPrefs.newBlockedSellers = oldPrefs.newBlockedSellers ?? [];

            if (oldPrefs.newBlockedSellers.length > 0) {

              let uniqueBlockedSellers = [...new Set(oldPrefs.newBlockedSellers)];

              uniqueBlockedSellers.forEach(seller => {
                featureData.blockList.list.push(seller);
              });
            }

            oldPrefs.newBlockedSellers = [];

            newPrefs = Object.assign(oldPrefs, { featureData }, { currentFilterState }, { userCurrency });

            // Instantiate default options
            if (!Object.prototype.hasOwnProperty.call(newPrefs, 'options')) {

              let options = {
                colorize: false,
                comments: false,
                debug: false,
                quicksearch: '',
                threshold: 2,
                unitTests: false
              };

              newPrefs.options = options;
            }

            localStorage.setItem('userPreferences', JSON.stringify(newPrefs));

            await chrome.storage.sync.set({ featureData });

            return resolve();
          });
        });
      })
      .then(() => appendFragment(elems))
      .then(() => documentReady(window.document))
      .then(() => {
        // DOM clean up
        document.querySelectorAll('.de-init').forEach(child => {
          child.parentNode.removeChild(child);
        });
      })
      .catch(err => console.error('Discogs Enhancer: Error injecting scripts', err));
  });
