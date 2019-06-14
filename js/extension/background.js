/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This is essentially the backbone of the extension.
 * All feature scripts and preferences are loaded/appended from here.
 * It also serves as the intermediary between Discogs and the extension's
 * popover.
 *
 * Note: features that depend on data in localStorage are generally
 * appended in `elemsSecondary`.
 *
 * `elemsSecondary` is a separate set of scripts that are injected
 * into the DOM **after** the user preferences have been saved in
 * localStorage as they depend on those values being updated and
 * available first.
 */

let checkForAnalytics,
    elemsPrimary = [],
    elemsSecondary = [],
    filterMonitor,
    prefs = {},
    resourceLibrary;

/**
 * Augment `HMTLDocument` prototype for ready state checks
 * @returns {Promise}
 */
HTMLDocument.prototype.ready = () => {

  return new Promise(resolve => {

    if (document.readyState === 'complete') {
      resolve(document);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
        resolve(document);
      });
    }
  });
};

/**
 * Used to append the js/css nodes to the DOM when the
 * extension first runs.
 * @param    {Array} elems - An array of nodes to be appeneded
 * @return   {Promise}
 */
function appendFragment(elems) {

  let fragment = document.createDocumentFragment();

  return new Promise(resolve => {

    elems.forEach(elm => fragment.appendChild(elm));

    (document.head || document.documentElement).appendChild(fragment.cloneNode(true));

    return resolve();
  });
}

// Resource Library
// A singleton of shared methods for the extension
resourceLibrary = document.createElement('script');
resourceLibrary.type = 'text/javascript';
resourceLibrary.id = 'resource-library';
resourceLibrary.src = chrome.extension.getURL('js/extension/dependencies/resource-library/resource-library.js');

appendFragment([resourceLibrary]).then(() => {
  // Get the users preferences or create them if they
  // do not yet exist.
  chrome.storage.sync.get('prefs', result => {

    if (!result.prefs) {

      prefs = {
        absoluteDate: false,
        averagePrice: false,
        baoiFields: false,
        blockSellers: true,
        blurryImageFix: false,
        collectionNewTabs: false,
        collectionUi: false,
        converter: true,
        darkTheme: false,
        everlastingCollection: false,
        everlastingMarket: true,
        favoriteSellers: true,
        feedback: false,
        filterMediaCondition: false,
        filterMediaConditionValue: null,
        filterShippingCountry: false,
        filterSleeveCondition: false,
        filterSleeveConditionValue: null,
        formatShortcuts: true,
        hideMinMaxColumns: false,
        highlightMedia: true,
        inventoryRatings: false,
        listsInTabs: false,
        notesCount: true,
        quickSearch: false,
        randomItem: false,
        ratingPercent: false,
        readability: false,
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
        //
        useAllDay: false,
        useBandcamp: false,
        useBoomkat: false,
        useClone: false,
        useDeejay: false,
        useDiscogs: true,
        useEarcave: false,
        useGramaphone: false,
        useHalcyon: false,
        useHardwax: false,
        useInsound: false,
        useJuno: false,
        useKristina: false,
        useOye: false,
        usePhonica: false,
        useRushhour: false,
        useSotu: false,
        useYoutube: false
      };

      chrome.storage.sync.set({ prefs: prefs }, () => console.log('Preferences created.'));
    } else {
      prefs = result.prefs;
    }

    // Dark Theme
    if ( result.prefs.darkTheme ) document.documentElement.classList.add('de-dark-theme');
    // Don't use the dark theme on subdomains
    // Fixed in this file instead of manifest.json due to issues explained here:
    // https://github.com/salcido/discogs-enhancer/issues/14
    if ( !window.location.href.includes('www') ) {
      document.documentElement.classList.remove('de-dark-theme');
    }

    return new Promise(resolve => {
      // ========================================================
      // Preference-agnostic scripts (always appended)
      // ========================================================

      // Filter Monitor
      // **Appended last via `elemsSecondary`
      filterMonitor = document.createElement('script');
      filterMonitor.type = 'text/javascript';
      filterMonitor.className = 'de-init';
      filterMonitor.src = chrome.extension.getURL('js/extension/features/filter-monitor.js');

      elemsSecondary.push(filterMonitor);

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
      minMax_css.href = chrome.extension.getURL('css/min-max-columns.css');
      minMax_css.id = 'minMaxColumnsCss';
      minMax_css.disabled = !result.prefs.hideMinMaxColumns;

      elemsPrimary.push(minMax_css);

      // baoi-fields.css
      let baoi_css = document.createElement('link');

      baoi_css.rel = 'stylesheet';
      baoi_css.type = 'text/css';
      baoi_css.href = chrome.extension.getURL('css/baoi-fields.css');
      baoi_css.id = 'baoiFieldsCss',
      baoi_css.disabled = !result.prefs.baoiFields;

      elemsPrimary.push(baoi_css);

      // large-youtube-playlists.css
      let ytPlaylists_css = document.createElement('link');

      ytPlaylists_css.rel = 'stylesheet';
      ytPlaylists_css.type = 'text/css';
      ytPlaylists_css.href = chrome.extension.getURL('css/large-youtube-playlists.css');
      ytPlaylists_css.id = 'ytPlaylistsCss',
      ytPlaylists_css.disabled = !result.prefs.ytPlaylists;

      elemsPrimary.push(ytPlaylists_css);

      // everlasting.css
      let everlastingCss = document.createElement('link');

      everlastingCss.rel = 'stylesheet';
      everlastingCss.type = 'text/css';
      everlastingCss.href = chrome.extension.getURL('css/everlasting.css');

      elemsPrimary.push(everlastingCss);

      // Friend-counter (always enabled)
      // See comments in friend-counter.js for more details
      let friendCounter = document.createElement('script');

      friendCounter.type = 'text/javascript';
      friendCounter.className = 'de-init';
      friendCounter.src = chrome.extension.getURL('js/extension/features/friend-counter.js');

      elemsPrimary.push(friendCounter);

      // Marketplace Highlights
      // apply-highlights.js
      let highlightScript = document.createElement('script');

      highlightScript.type = 'text/javascript';
      highlightScript.src = chrome.extension.getURL('js/extension/features/apply-highlights.js');
      highlightScript.className = 'de-init';

      elemsPrimary.push(highlightScript);

      // marketplace-highlights.css
      let highlightCss = document.createElement('link');

      highlightCss.rel = 'stylesheet';
      highlightCss.type = 'text/css';
      highlightCss.href = chrome.extension.getURL('css/marketplace-highlights.css');
      highlightCss.id = 'mediaHighLightsCss';
      highlightCss.disabled = !result.prefs.highlightMedia;

      elemsPrimary.push(highlightCss);

      // ========================================================
      // Preference-dependent scripts
      // ========================================================

      if ( result.prefs.absoluteDate ) {
        // toggle-absolute-date.js
        let absoluteDate = document.createElement('script');

        absoluteDate.type = 'text/javascript';
        absoluteDate.src = chrome.extension.getURL('js/extension/features/toggle-absolute-date.js');
        absoluteDate.className = 'de-init';

        elemsSecondary.push(absoluteDate);
      }

      if ( result.prefs.averagePrice ) {
        // average-price.js
        let averagePrice = document.createElement('script');

        averagePrice.type = 'text/javascript';
        averagePrice.src = chrome.extension.getURL('js/extension/features/average-price.js');
        averagePrice.className = 'de-init';

        elemsPrimary.push(averagePrice);
      }

      if (result.prefs.blockSellers) {

        // block-sellers.js
        let blockSellers = document.createElement('script');

        blockSellers.type = 'text/javascript';
        blockSellers.src = chrome.extension.getURL('js/extension/features/block-sellers.js');
        blockSellers.className = 'de-init';

        elemsSecondary.push(blockSellers);

        // blocked-seller.css
        let blockSellers_css = document.createElement('link');

        blockSellers_css.rel = 'stylesheet';
        blockSellers_css.type = 'text/css';
        blockSellers_css.href = chrome.extension.getURL('css/blocked-seller.css');

        elemsPrimary.push(blockSellers_css);
      }

      if (result.prefs.blurryImageFix) {

        // blurry-image-fix.js
        let blurryImageFix = document.createElement('script');

        blurryImageFix.type = 'text/javascript';
        blurryImageFix.className = 'de-init';
        blurryImageFix.src = chrome.extension.getURL('js/extension/features/blurry-image-fix.js');

        elemsPrimary.push(blurryImageFix);
      }

      if (result.prefs.collectionNewTabs) {

        // collection-new-tabs.js.js
        let collectionNewTabs = document.createElement('script');

        collectionNewTabs.type = 'text/javascript';
        collectionNewTabs.src = chrome.extension.getURL('js/extension/features/collection-new-tabs.js');
        collectionNewTabs.className = 'de-init';

        elemsPrimary.push(collectionNewTabs);
      }

      if (result.prefs.collectionUi) {

        // better-collection-ui.js
        let collectionUi = document.createElement('script');

        collectionUi.type = 'text/javascript';
        collectionUi.src = chrome.extension.getURL('js/extension/features/better-collection-ui.js');
        collectionUi.className = 'de-init';

        elemsPrimary.push(collectionUi);
      }

      if (result.prefs.converter) {

        // currency-converter.css
        let converter_css = document.createElement('link');

        converter_css.rel = 'stylesheet';
        converter_css.type = 'text/css';
        converter_css.href = chrome.extension.getURL('css/currency-converter.css');

        elemsPrimary.push(converter_css);

        // currency-converter.js
        let converter = document.createElement('script');

        converter.type = 'text/javascript';
        converter.className = 'de-init';
        converter.src = chrome.extension.getURL('js/extension/features/currency-converter.js');

        elemsPrimary.push(converter);
      }

      // release-history-legend.js
      if (result.prefs.darkTheme) {

        let releaseHistoryScript = document.createElement('script');

        releaseHistoryScript.type = 'text/javascript';
        releaseHistoryScript.src = chrome.extension.getURL('js/extension/features/release-history-legend.js');
        releaseHistoryScript.className = 'de-init';

        elemsPrimary.push(releaseHistoryScript);

        // options.js
        // The option menu is only available when the dark theme is in use
        let options = document.createElement('script');

        options.type = 'text/javascript';
        options.src = chrome.extension.getURL('js/extension/dependencies/options/options.js');
        options.className = 'de-init';

        elemsPrimary.push(options);
      }

      // everlasting collection
      if ( result.prefs.everlastingCollection ) {

        // everlasting-collection-notes.js
        let everlastingCollectionNotes = document.createElement('script');

        everlastingCollectionNotes.type = 'text/javascript';
        everlastingCollectionNotes.src = chrome.extension.getURL('js/extension/features/everlasting-collection-notes.js');
        everlastingCollectionNotes.className = 'de-init';

        elemsPrimary.push(everlastingCollectionNotes);

        // everlasting-collection-ratings.js
        let everlastingCollectionRatings = document.createElement('script');

        everlastingCollectionRatings.type = 'text/javascript';
        everlastingCollectionRatings.src = chrome.extension.getURL('js/extension/features/everlasting-collection-ratings.js');
        everlastingCollectionRatings.className = 'de-init';

        elemsPrimary.push(everlastingCollectionRatings);

        // everlasting-collection-sm-med.js
        let everlastingCollection = document.createElement('script');

        everlastingCollection.type = 'text/javascript';
        everlastingCollection.src = chrome.extension.getURL('js/extension/features/everlasting-collection-sm-med.js');
        everlastingCollection.className = 'de-init';

        elemsPrimary.push(everlastingCollection);
      }

      // everlasting marketplace
      // **Appended last via `elemsSecondary`
      if (result.prefs.everlastingMarket) {

        // everlasting-marketplace.js && everlasting-marketplace-release-page.js
        let everlastingMarket = document.createElement('script'),
            everlastingMarketReleases = document.createElement('script');

        everlastingMarket.type = 'text/javascript';
        everlastingMarket.src = chrome.extension.getURL('js/extension/features/everlasting-marketplace.js');
        everlastingMarket.className = 'de-init';

        elemsSecondary.push(everlastingMarket);

        everlastingMarketReleases.type = 'text/javascript';
        everlastingMarketReleases.src = chrome.extension.getURL('js/extension/features/everlasting-marketplace-release-page.js');
        everlastingMarketReleases.className = 'de-init';

        elemsSecondary.push(everlastingMarketReleases);
      }

      if (result.prefs.favoriteSellers) {

        // favorite-sellers.js
        let favoriteSellers = document.createElement('script');

        favoriteSellers.type = 'text/javascript';
        favoriteSellers.src = chrome.extension.getURL('js/extension/features/favorite-sellers.js');
        favoriteSellers.className = 'de-init';

        elemsSecondary.push(favoriteSellers);

        // favorite-sellers.css
        let favoriteSellers_css = document.createElement('link');

        favoriteSellers_css.rel = 'stylesheet';
        favoriteSellers_css.type = 'text/css';
        favoriteSellers_css.href = chrome.extension.getURL('css/favorite-sellers.css');

        elemsPrimary.push(favoriteSellers_css);
      }

      if (result.prefs.feedback) {

        let feedback = document.createElement('script');

        feedback.type = 'text/javascript';
        feedback.src = chrome.extension.getURL('js/extension/features/feedback-notifier.js');
        feedback.className = 'de-init';

        elemsPrimary.push(feedback);

        // feedback-notifier.css
        let feedback_css = document.createElement('link');

        feedback_css.rel = 'stylesheet';
        feedback_css.type = 'text/css';
        feedback_css.href = chrome.extension.getURL('css/feedback-notifier.css');

        elemsPrimary.push(feedback_css);
      }

      if (result.prefs.filterMediaCondition) {

        // filter-media-condition.js
        // **Appended last via `elemsSecondary`
        let filterMediaCondition = document.createElement('script');

        filterMediaCondition.type = 'text/javascript';
        filterMediaCondition.src = chrome.extension.getURL('js/extension/features/filter-media-condition.js');
        filterMediaCondition.className = 'de-init';

        elemsSecondary.push(filterMediaCondition);
      }

      if (result.prefs.filterShippingCountry) {

        // filter-shipping-country.js
        // **Appended last via `elemsSecondary`
        let filterShippingCountry = document.createElement('script');

        filterShippingCountry.type = 'text/javascript';
        filterShippingCountry.src = chrome.extension.getURL('js/extension/features/filter-shipping-country.js');
        filterShippingCountry.className = 'de-init';

        elemsSecondary.push(filterShippingCountry);
      }

      if (result.prefs.filterSleeveCondition) {

        // filter-sleeve-condition.js
        // **Appended last via `elemsSecondary`
        let filterSleeveCondition = document.createElement('script');

        filterSleeveCondition.type = 'text/javascript';
        filterSleeveCondition.src = chrome.extension.getURL('js/extension/features/filter-sleeve-condition.js');
        filterSleeveCondition.className = 'de-init';

        elemsSecondary.push(filterSleeveCondition);
      }

      // text format shortcuts
      if (result.prefs.formatShortcuts) {

        // text-format-shortcuts.js
        let shortcuts = document.createElement('script');

        shortcuts.type = 'text/javascript';
        shortcuts.src = chrome.extension.getURL('js/extension/features/text-format-shortcuts.js');
        shortcuts.className = 'de-init';

        elemsPrimary.push(shortcuts);

        // text-format-shortcuts.css
        let shortcuts_css = document.createElement('link');

        shortcuts_css.rel = 'stylesheet';
        shortcuts_css.type = 'text/css';
        shortcuts_css.href = chrome.extension.getURL('css/text-format-shortcuts.css');

        elemsPrimary.push(shortcuts_css);
      }

      // Set value for filter-media-condition.js
      if (result.prefs.filterMediaConditionValue) {

        localStorage.setItem('mediaCondition', result.prefs.filterMediaConditionValue);
      }

      // Set value for filter-sleeve-condition.js
      if (result.prefs.filterSleeveConditionValue) {

        localStorage.setItem('sleeveCondition', result.prefs.filterSleeveConditionValue);
      }

      if (result.prefs.notesCount) {

        // notes-counter.js
        let notesCount = document.createElement('script');

        notesCount.type = 'text/javascript';
        notesCount.src = chrome.extension.getURL('js/extension/features/notes-counter.js');
        notesCount.className = 'de-init';

        elemsPrimary.push(notesCount);
      }

      if ( result.prefs.quickSearch ) {

        // quick-search.js
        let quickSearch = document.createElement('script');

        quickSearch.type = 'text/javascript';
        quickSearch.src = chrome.extension.getURL('js/extension/features/quick-search.js');
        quickSearch.className = 'de-init';

        elemsPrimary.push(quickSearch);
      }

      if (result.prefs.inventoryRatings) {

        // inventory-ratings.js
        let inventoryRatings = document.createElement('script');

        inventoryRatings.type = 'text/javascript';
        inventoryRatings.src = chrome.extension.getURL('js/extension/features/inventory-ratings.js');
        inventoryRatings.className = 'de-init';

        elemsSecondary.push(inventoryRatings);
      }

      if ( result.prefs.listsInTabs ) {
        // list-items-in-tabs.js
        let listsInTabs = document.createElement('script');

        listsInTabs.type = 'text/javascript';
        listsInTabs.src = chrome.extension.getURL('js/extension/features/list-items-in-tabs.js');
        listsInTabs.className = 'de-init';

        elemsPrimary.push(listsInTabs);
      }

      if (result.prefs.randomItem) {

        // random-item.js
        let randomItem = document.createElement('script');

        randomItem.type = 'text/javascript';
        randomItem.src = chrome.extension.getURL('js/extension/features/random-item.js');
        randomItem.className = 'de-init';

        elemsPrimary.push(randomItem);

        // random-item.css
        let randomItemCss = document.createElement('link');

        randomItemCss.rel = 'stylesheet';
        randomItemCss.type = 'text/css';
        randomItemCss.href = chrome.extension.getURL('css/random-item.css');
        randomItemCss.id = 'randomItemCss';

        elemsPrimary.push(randomItemCss);
      }

      if ( result.prefs.ratingPercent ) {

        let ratingPercent = document.createElement('script');

        ratingPercent.type = 'text/javascript';
        ratingPercent.src = chrome.extension.getURL('js/extension/features/rating-percent.js');
        ratingPercent.className = 'de-init';

        elemsSecondary.push(ratingPercent);
      }

      if (result.prefs.readability) {

        let tracklist_css = document.createElement('link');

        tracklist_css.rel = 'stylesheet';
        tracklist_css.type = 'text/css';
        tracklist_css.href = chrome.extension.getURL('css/tracklist-readability.css');
        tracklist_css.id = 'tracklist_css';

        elemsPrimary.push(tracklist_css);

        // tracklist-readability.js
        let readability = document.createElement('script');

        readability.type = 'text/javascript';
        readability.src = chrome.extension.getURL('js/extension/features/tracklist-readability.js');
        readability.className = 'de-init';

        elemsPrimary.push(readability);
      }

      // release-durations
      if (result.prefs.releaseDurations) {

        let releaseDurations = document.createElement('script');

        releaseDurations.type = 'text/javascript';
        releaseDurations.src = chrome.extension.getURL('js/extension/features/release-durations.js');
        releaseDurations.className = 'de-init';

        elemsPrimary.push(releaseDurations);
      }

      // release-ratings
      if ( result.prefs.releaseRatings ) {

        let releaseRatings = document.createElement('script');

        releaseRatings.type = 'text/javascript';
        releaseRatings.src = chrome.extension.getURL('js/extension/features/release-ratings.js');
        releaseRatings.className = 'de-init';

        elemsPrimary.push(releaseRatings);
      }

      // release-scanner
      if ( result.prefs.releaseScanner ) {

        let releaseScanner = document.createElement('script');

        releaseScanner.type = 'text/javascript';
        releaseScanner.src = chrome.extension.getURL('js/extension/features/release-scanner.js');
        releaseScanner.className = 'de-init';

        elemsPrimary.push(releaseScanner);
      }

      // remove-from-wantlist.js/css
      if ( result.prefs.removeFromWantlist ) {

        // remove-from-wantlist.css
        let removeFromWantlist_css = document.createElement('link');

        removeFromWantlist_css.rel = 'stylesheet';
        removeFromWantlist_css.type = 'text/css';
        removeFromWantlist_css.href = chrome.extension.getURL('css/remove-from-wantlist.css');
        removeFromWantlist_css.id = 'removeFromWantlist_css';

        elemsPrimary.push(removeFromWantlist_css);

        // remove-from-wantlist.js
        let removeFromWantlist = document.createElement('script');

        removeFromWantlist.type = 'text/javascript';
        removeFromWantlist.src = chrome.extension.getURL('js/extension/features/remove-from-wantlist.js');
        removeFromWantlist.className = 'de-init';

        elemsPrimary.push(removeFromWantlist);
      }

      if ( result.prefs.sellerItemsInCart ) {

        let sellerItemsInCart = document.createElement('script');

        sellerItemsInCart.type = 'text/javascript';
        sellerItemsInCart.src = chrome.extension.getURL('js/extension/features/show-sellers-in-cart.js');
        sellerItemsInCart.className = 'de-init';

        elemsSecondary.push(sellerItemsInCart);
      }

      if ( result.prefs.sellerRep ) {

        // seller-rep.js
        let sellerRep = document.createElement('script');

        sellerRep.type = 'text/javascript';
        sellerRep.src = chrome.extension.getURL('js/extension/features/seller-rep.js');
        sellerRep.className = 'de-init';

        elemsSecondary.push(sellerRep);
      }

      if ( result.prefs.sortButtons ) {

        let sortButton_css = document.createElement('link');

        sortButton_css.rel = 'stylesheet';
        sortButton_css.type = 'text/css';
        sortButton_css.href = chrome.extension.getURL('css/sort-buttons.css');
        sortButton_css.id = 'sortButton_css';

        elemsPrimary.push( sortButton_css );

        // sort-explore-lists.js
        let sortExploreScript = document.createElement('script');

        sortExploreScript.type = 'text/javascript';
        sortExploreScript.src = chrome.extension.getURL('js/extension/features/sort-explore-lists.js');
        sortExploreScript.className = 'de-init';

        elemsPrimary.push( sortExploreScript );

        // sort-marketplace-lists.js
        let sortMarketplaceScript = document.createElement('script');

        sortMarketplaceScript.type = 'text/javascript';
        sortMarketplaceScript.src = chrome.extension.getURL('js/extension/features/sort-marketplace-lists.js');
        sortMarketplaceScript.className = 'de-init';

        elemsPrimary.push( sortMarketplaceScript );

        // sort-personal-lists.js
        let sortPersonalListsScript = document.createElement('script');

        sortPersonalListsScript.type = 'text/javascript';
        sortPersonalListsScript.src = chrome.extension.getURL('js/extension/features/sort-personal-lists.js');
        sortPersonalListsScript.className = 'de-init';

        elemsPrimary.push( sortPersonalListsScript );
      }

      if (result.prefs.suggestedPrices) {

        // update-exchange-rates.js
        // **Appended last via `elemsSecondary`
        let updateExchangeRates = document.createElement('script');

        updateExchangeRates.type = 'text/javascript';
        updateExchangeRates.src = chrome.extension.getURL('js/extension/dependencies/exchange-rates/update-exchange-rates.js');
        updateExchangeRates.className = 'de-init';

        elemsSecondary.push(updateExchangeRates);

        // suggested-prices-release-page.js
        let suggestedPricesRelease = document.createElement('script');

        suggestedPricesRelease.type = 'text/javascript';
        suggestedPricesRelease.src = chrome.extension.getURL('js/extension/features/suggested-prices-release-page.js');
        suggestedPricesRelease.className = 'de-init';

        elemsPrimary.push(suggestedPricesRelease);

        // suggested-prices-single.js
        let suggestedPricesSingle = document.createElement('script');

        suggestedPricesSingle.type = 'text/javascript';
        suggestedPricesSingle.src = chrome.extension.getURL('js/extension/features/suggested-prices-single.js');
        suggestedPricesSingle.className = 'de-init';

        elemsPrimary.push(suggestedPricesSingle);

        // Preloader css
        let suggested = document.createElement('link');

        suggested.rel = 'stylesheet';
        suggested.type = 'text/css';
        suggested.href = chrome.extension.getURL('css/suggested-prices.css');
        suggested.id = 'suggestedCss';

        elemsPrimary.push(suggested);
      }

      // tweak-discriminators.js
      if ( result.prefs.tweakDiscrims ) {

        let tweakDiscrims = document.createElement('script');

        tweakDiscrims.type = 'text/javascript';
        tweakDiscrims.src = chrome.extension.getURL('js/extension/features/tweak-discriminators.js');
        tweakDiscrims.className = 'de-init';

        elemsSecondary.push(tweakDiscrims);
      }

      // unit-tests.js
      let unitTests = document.createElement('script');

      unitTests.type = 'text/javascript';
      unitTests.src = chrome.extension.getURL('js/extension/dependencies/tests/unit-tests.js');
      unitTests.className = 'de-init';

      elemsPrimary.push(unitTests);

      // highlight-comments.js
      let comments = document.createElement('script');

      comments.type = 'text/javascript';
      comments.src = chrome.extension.getURL('js/extension/features/highlight-comments.js');
      comments.className = 'de-init';

      elemsPrimary.push(comments);

      // ========================================================
      // Contextual Menu Options
      // ========================================================

      // Add Discogs first ...
      if (result.prefs.useDiscogs) {

        chrome.runtime.sendMessage({
          fn: 'searchDiscogs',
          id: 'discogs',
          method: 'create',
          name: 'Discogs',
          request: 'updateContextMenu'
        });
      }

      // Then the remaining stores in alphabetical order
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

      if (result.prefs.useDeejay) {

        chrome.runtime.sendMessage({
          fn: 'searchDeeJay',
          id: 'deejay',
          method: 'create',
          name: 'DeeJay',
          request: 'updateContextMenu'
        });
      }

      if (result.prefs.useEarcave) {

        chrome.runtime.sendMessage({
          fn: 'searchEarcave',
          id: 'earcave',
          method: 'create',
          name: 'Earcave',
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

      if (result.prefs.usePhonica) {

        chrome.runtime.sendMessage({
          fn: 'searchPhonica',
          id: 'phonica',
          method: 'create',
          name: 'Phonica',
          request: 'updateContextMenu'
        });
      }

      if (result.prefs.useRushhour) {

        chrome.runtime.sendMessage({
          fn: 'searchRushhour',
          id: 'rushhour',
          method: 'create',
          name: 'Rush Hour',
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

      return resolve(result);
    })
    .then(() => appendFragment(elemsPrimary))
    .then(() => document.ready())
    .then(() => {

      // - Current Filter State -
      // --------------------------------------------------------
      // This tracks the filter preferences so that the current
      // filtering status can be appended to the DOM whilst
      // using Everlasting Marketplace.
      // --------------------------------------------------------
      function getCurrentFilterState() {
        let currentFilterState;
        currentFilterState = {
              everlastingMarket: prefs.everlastingMarket,
              filterMediaCondition: prefs.filterMediaCondition,
              filterShippingCountry: prefs.filterShippingCountry,
              filterSleeveCondition: prefs.filterSleeveCondition,
            };
        return currentFilterState;
      }

      // - Runtime messages -
      // --------------------------------------------------------
      // Get preferences from extension side and save to DOM side.
      // --------------------------------------------------------
      try {

        chrome.runtime.sendMessage({ request: 'userPreferences' }, response => {

          let target = localStorage.getItem('userPreferences'),
              source = response.userPreferences,
              currentFilterState = getCurrentFilterState(),
              userCurrency = prefs.userCurrency,
              newPrefs;

          target = target ? JSON.parse(target) : response.userPreferences;
          newPrefs = Object.assign(target, source, { currentFilterState }, { userCurrency });
          localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
        });

      } catch (err) {

        // the chrome.runtime method above ^ seems to run twice so suppress error unless it's from something else...
        if (err.message !== 'Invalid arguments to connect.') {

          console.warn('Discogs Enhancer: ', err);
        }
      }
    })
    .then(() => appendFragment(elemsSecondary))
    .then(() => {
      // DOM clean up
      document.querySelectorAll('.de-init').forEach(child => {
        child.parentNode.removeChild(child);
      });
    })
    .catch(err => console.error('Error injecting scripts', err));
  });
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

      // - Don't show an update notice on patches -
      // --------------------------------------------------------
      // Versions look something like: "1.10.8".
      // split('.') returns an array of stringed numbers like: ["1", "10", "8"]
      // and compares Major and Minor versions to see if there
      // should be an update notification.
      // --------------------------------------------------------
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

function toggleAnalytics(analytics) {

  let opts = JSON.parse(localStorage.getItem('options')),
      request = { request: 'analytics', enabled: analytics.checked };

  chrome.runtime.sendMessage(request, ({ enabled }) => {

    opts.analytics = enabled;
    opts = JSON.stringify(opts);

    localStorage.setItem('options', opts);
  });
}

// Fire toggleAnalytics once #analytics exists in the DOM
checkForAnalytics = setInterval(() => {

  let analytics = document.getElementById('analytics');

  if ( analytics ) {

    analytics.addEventListener('change', toggleAnalytics);
    toggleAnalytics(analytics);
  }
  clearInterval(checkForAnalytics);
}, 1000);
