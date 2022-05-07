/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This file get inserted into the Popup.html file and contains
 * all the logic that the popup needs to function.
 *
 */
require('../../../css/popup/popup.scss');
import * as absoluteDate from './features/absolute-date.js';
import * as contextualMenus from './features/contextual-menus.js';
import * as linksInTabs from './features/links-in-new-tabs.js';
import * as filterMediaCondition from './features/filter-media-condition.js';
import * as filterPrices from './features/filter-prices.js';
import * as filterSleeveCondition from './features/filter-sleeve-condition.js';
import * as inventoryRatings from './features/inventory-ratings.js';
import * as inventoryScanner from './features/inventory-scanner.js';
import * as sellerRep from './features/seller-rep.js';
import * as suggestedPrices from './features/suggested-prices.js';
import * as tweakDiscrims from './features/tweak-discriminators.js';
import { executeScript } from './features/execute-script.js'
import {
  acknowledgeUpdate,
  optionsToggle,
  searchFeatures,
  applySave,
  triggerSave,
  checkForUpdate
} from './utils';

// ========================================================
// Extend Element's prototype to easily add/remove multiple
// classes from a target element.
// ========================================================
if (!Element.prototype.removeClasses) {
  Element.prototype.removeClasses = function (...remove) {
    remove.forEach(cls => this.classList.remove(cls));
  };
}

if (!Element.prototype.addClasses) {
  Element.prototype.addClasses = function (...add) {
    add.forEach(cls => this.classList.add(cls));
  };
}

/**
 * Helper method that lets me know I'm working with the
 * `development` version of the extension
 * @returns {undefined}
 */
function isDev() {
  if (__DEV__) {
    document.querySelector('.title h1').style.color = 'gold';
  }
}

// ========================================================
// Document ready
// ========================================================
//
// Adding A Feature: Step 5
window.addEventListener('load', () => {

  let
    searchbox = document.getElementById('searchbox'),
    toggleAbsoluteDate = document.getElementById('toggleAbsoluteDate'),
    toggleAveragePrice = document.getElementById('toggleAveragePrice'),
    toggleBaoiFields = document.getElementById('toggleBaoiFields'),
    toggleBlockBuyers = document.getElementById('toggleBlockBuyers'),
    toggleBlockSellers = document.getElementById('toggleBlockSellers'),
    toggleBlurryImageFix = document.getElementById('toggleBlurryImageFix'),
    toggleCollectionUi = document.getElementById('toggleCollectionUi'),
    toggleCommentScanner = document.getElementById('toggleCommentScanner'),
    toggleConfirmBeforeRemoving = document.getElementById('toggleConfirmBeforeRemoving'),
    toggleConverter = document.getElementById('toggleConverter'),
    toggleDarkTheme = document.getElementById('toggleDarkTheme'),
    toggleDemandIndex = document.getElementById('toggleDemandIndex'),
    toggleEditingNotepad = document.getElementById('toggleEditingNotepad'),
    toggleEverlastingCollection = document.getElementById('toggleEverlastingCollection'),
    toggleEverlastingMarket = document.getElementById('toggleEverlastingMarket'),
    toggleFavoriteSellers = document.getElementById('toggleFavoriteSellers'),
    toggleFeedback = document.getElementById('toggleFeedback'),
    toggleFilterMediaCondition = document.getElementById('toggleFilterMediaCondition'),
    toggleFilterPrices = document.getElementById('toggleFilterPrices'),
    toggleFilterShippingCountry = document.getElementById('toggleFilterShippingCountry'),
    toggleFilterSleeveCondition = document.getElementById('toggleFilterSleeveCondition'),
    toggleFilterUnavailable = document.getElementById('toggleFilterUnavailable'),
    toggleForceDashboard = document.getElementById('toggleForceDashboard'),
    toggleHighlights = document.getElementById('toggleHighlights'),
    toggleInventoryRatings = document.getElementById('toggleInventoryRatings'),
    toggleInventoryScanner = document.getElementById('toggleInventoryScanner'),
    toggleMinMaxColumns = document.getElementById('toggleMinMaxColumns'),
    toggleNotesCount = document.getElementById('toggleNotesCount'),
    togglePrices = document.getElementById('togglePrices'),
    toggleQuickSearch = document.getElementById('toggleQuickSearch'),
    toggleRandomItem = document.getElementById('toggleRandomItem'),
    toggleRatingPercent = document.getElementById('toggleRatingPercent'),
    toggleReadability = document.getElementById('toggleReadability'),
    toggleRelativeSoldDate = document.getElementById('toggleRelativeSoldDate'),
    toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
    toggleReleaseRatings = document.getElementById('toggleReleaseRatings'),
    toggleReleaseScanner = document.getElementById('toggleReleaseScanner'),
    toggleRemoveFromWantlist = document.getElementById('toggleRemoveFromWantlist'),
    toggleSellerItemsInCart = document.getElementById('toggleSellerItemsInCart'),
    toggleSellerRep = document.getElementById('toggleSellerRep'),
    toggleShortcuts = document.getElementById('toggleShortcuts'),
    toggleSortBtns = document.getElementById('toggleSortBtns'),
    toggleTweakDiscrims = document.getElementById('toggleTweakDiscrims'),
    toggleYtPlaylists = document.getElementById('toggleYtPlaylists'),
    userCurrency = document.getElementById('currency'),

    // Contextual menus
    toggleAllDay,
    toggleBandcamp,
    toggleBeatport,
    toggleBoomkat,
    toggleClone,
    toggleDeeJay,
    toggleDiscogs,
    toggleEarcave,
    toggleGramaphone,
    toggleHardwax,
    toggleJuno,
    toggleOye,
    togglePhonica,
    toggleRateYourMusic,
    toggleRedeye,
    toggleRushhour,
    toggleSotu,
    toggleYoutube;

  // ========================================================
  // UI EVENT LISTENERS
  // ========================================================


  // Toggle light/dark theme
  // ========================================================
  toggleDarkTheme.addEventListener('click', () => {

    let html = document.querySelector('html');

    if (toggleDarkTheme.checked) {

      return html.classList.remove('light');
    }

    return html.classList.add('light');
  });

  // Open Learn page
  // ========================================================
  document.getElementById('learn').addEventListener('click', function () {

    chrome.tabs.create({ url: '../html/learn.html' });
    acknowledgeUpdate();

    if (window.ga) { ga('send', 'event', 'learn', 'learn clicked'); }
  });

  // Help Bubble Clicks
  // ========================================================
  document.querySelectorAll('.help').forEach(bubble => {
    let id = bubble.classList[1];
    bubble.addEventListener('click', () => {
      chrome.tabs.create({ url: `../html/learn.html#${id}` });
    });
  });

  // Open Block Sellers Configuration page
  // ========================================================
  document.getElementById('editList').addEventListener('click', function () {
    chrome.tabs.create({ url: '../html/block-sellers.html' });
  });

  // Open Filter Shipping Countries Configuration page
  // ========================================================
  document.getElementById('editShippingList').addEventListener('click', function () {
    chrome.tabs.create({ url: '../html/filter-shipping-country.html' });
  });

  // Open Favorite Sellers Configuration page
  // ========================================================
  document.getElementById('editFavList').addEventListener('click', function () {
    chrome.tabs.create({ url: '../html/favorite-sellers.html' });
  });

  // Open Readability Configuration page
  // ========================================================
  document.getElementById('editReadability').addEventListener('click', function () {
    chrome.tabs.create({ url: '../html/readability.html' });
  });

  // Contextual Menu Searching Options
  // ========================================================
  document.querySelector('.toggle-group.menus').addEventListener('click', function () {
    optionsToggle('#contextMenus', this, '.menus', 180);
  });

  // Open Links In New tabs
  // ------------------------------------------------------
  document.querySelector('.toggle-group.tabs').addEventListener('click', function () {
    optionsToggle('#linksInTabs', this, '.tabs', 130);
  });

  // Absolute Date Feature
  // ------------------------------------------------------
  absoluteDate.init();

  // Filter Media Condition Options
  // ========================================================
  filterMediaCondition.init();

  // Filter Prices
  // ========================================================
  filterPrices.init();

  // Filter Sleeve Condition Options
  // ========================================================
  filterSleeveCondition.init();

  // Inventory Ratings Options
  // ========================================================
  inventoryRatings.init();

  // Inventory Ratings Options
  // ========================================================
  inventoryScanner.init();

  // Search Functionality
  // ========================================================
  searchbox.addEventListener('keydown', searchFeatures);

  // Clear search input
  document.querySelector('.clear-search').addEventListener('mousedown', function () {

    searchbox.value = '';
    searchFeatures();

    // reset the focus
    setTimeout(() => { searchbox.focus(); }, 200);
  });

  // Seller Reputation
  // ========================================================
  sellerRep.init();

  // Tweak Discriminators
  // ========================================================
  tweakDiscrims.init();

  // ========================================================
  // Event listeners for toggles
  // ========================================================
  //
  // Adding A Feature: Step 5
  toggleAbsoluteDate.addEventListener('change', triggerSave);
  toggleAveragePrice.addEventListener('change', triggerSave);
  toggleBaoiFields.addEventListener('change', () => executeScript(event, () => {
    const link = document.getElementById('baoiFieldsCss');
    if (link) { link.disabled = !link.disabled; }
  }));
  toggleBlockBuyers.addEventListener('change', triggerSave);
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleBlurryImageFix.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleCommentScanner.addEventListener('change', triggerSave);
  toggleConfirmBeforeRemoving.addEventListener('change', triggerSave);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', () => executeScript(event, () => {
    document.documentElement.classList.toggle('de-dark-theme');
  }));
  toggleDemandIndex.addEventListener('change', triggerSave);
  toggleEditingNotepad.addEventListener('change', triggerSave);
  toggleEverlastingCollection.addEventListener('change', triggerSave);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFavoriteSellers.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleFilterMediaCondition.addEventListener('change', filterMediaCondition.toggleHideConditions);
  toggleFilterPrices.addEventListener('change', filterPrices.validateFilterPrices);
  toggleFilterShippingCountry.addEventListener('change', () => executeScript(event, () => {
    let link = document.getElementById('filterShippingCountryCss');
    if (link) { link.disabled = !link.disabled; }
  }));
  toggleFilterSleeveCondition.addEventListener('change', filterSleeveCondition.toggleSleeveConditions);
  toggleFilterUnavailable.addEventListener('change', triggerSave);
  toggleForceDashboard.addEventListener('change', triggerSave);
  toggleHighlights.addEventListener('change', () => executeScript(event, () => {
    let link = document.getElementById('mediaHighLightsCss');
    if (link) { link.disabled = !link.disabled; }
  }));
  toggleInventoryRatings.addEventListener('change', inventoryRatings.saveInventoryRatings);
  toggleInventoryScanner.addEventListener('change', inventoryScanner.saveInventoryThreshold);
  toggleMinMaxColumns.addEventListener('change', () => executeScript(event, () => {
    let link = document.getElementById('minMaxColumnsCss');
    if (link) { link.disabled = !link.disabled; }
  }));
  toggleNotesCount.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', suggestedPrices.validateAndSave);
  toggleQuickSearch.addEventListener('change', triggerSave);
  toggleRandomItem.addEventListener('change', triggerSave);
  toggleRatingPercent.addEventListener('change', triggerSave);
  toggleReadability.addEventListener('change', triggerSave);
  toggleRelativeSoldDate.addEventListener('change', triggerSave);
  toggleReleaseDurations.addEventListener('change', triggerSave);
  toggleReleaseRatings.addEventListener('change', triggerSave);
  toggleReleaseScanner.addEventListener('change', triggerSave);
  toggleRemoveFromWantlist.addEventListener('change', triggerSave);
  toggleSellerItemsInCart.addEventListener('change', triggerSave);
  toggleSellerRep.addEventListener('change', sellerRep.saveSellerRep);
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  toggleTweakDiscrims.addEventListener('change', triggerSave);
  toggleYtPlaylists.addEventListener('change', () => executeScript(event, () => {
    let link = document.getElementById('ytPlaylistsCss');
    if (link) { link.disabled = !link.disabled; }
  }));
  userCurrency.addEventListener('change', () => applySave(null, event));

  /**
   * Fetches known issues from discogs-enhancer.com/issues
   * @returns {Object} - Performance issue data: { content: <string>, version: <string> }
   */
  async function getIssues() {
    let url = 'https://discogs-enhancer.com/issues',
      hasBlocklist = localStorage.getItem('blockList'),
      blocklist = hasBlocklist ? JSON.parse(hasBlocklist) : null;

    if (__DEV__
      && blocklist
      && blocklist.list
      && blocklist.list.includes('development')
    ) {
      url = 'http://localhost:3000/issues';
    }

    return await fetch(url)
      .then(response => response.json())
      .catch(() => {
        return { content: null, version: null };
      });
  }

  /**
   * Compares version numbers and returns a boolean
   * which is used to display a note about any known site issues.
   * @param {String} vA - Current version - a version string (1.0.0)
   * @param {String} vB - Version with issue - a version string (1.0.1)
   * @returns {boolean}
   */
  function compareVersions(vA, vB) {
    return vA.localeCompare(vB, undefined, { numeric: true }) <= 0;
  }

  /**
   * Iterates over the features array and looks for any enabled
   * features that are contained within it.
   * @param {Array} features - An array of feature names returned from /issues endpoint
   * @returns {Boolean}
   */
  function hasFeatureEnabled(features) {
    let featureEnabled = false;

    for (let [key] of Object.entries(prefs)) {

      if (features.includes('any') || prefs[key] && features.includes(key)) {
        featureEnabled = true;
      }
    }
    return featureEnabled;
  }

  /**
   * Whether to display the warning message in the popup
   * @param {Object} - The response object from discogs-enhancer.com/issues endpoint
   */
  function showHeadsUp({ content = null, version = null, features = [] }) {

    let manifest = chrome.runtime.getManifest(),
      thisVersion = manifest.version,
      versionWithIssue = version,
      showWarning = false;

    if (version) {
      showWarning = compareVersions(thisVersion, versionWithIssue);
    }

    if (content
      && content.length
      && showWarning
      && hasFeatureEnabled(features)) {

      let warning = document.querySelector('.issues');

      warning.querySelector('.content').textContent = content;
      warning.style.display = 'block';
    }
  }

  // ========================================================
  // DOM Setup
  // ========================================================

  // Store prefs to reference with showHeadsup()
  let prefs;

  /**
   * Sets toggle button values when the popup is rendered
   * and calls necessary methods in order to render
   * the popup's UI in the correct state
   * @method   init
   * @return   {undefined}
   */
  async function init() {

    contextualMenus.createContextualMenuElements();
    linksInTabs.createLinkTabElements();

    // Assign contextual menu elements to vars
    toggleAllDay = document.getElementById('allday');
    toggleBandcamp = document.getElementById('bandcamp');
    toggleBeatport = document.getElementById('beatport');
    toggleBoomkat = document.getElementById('boomkat');
    toggleClone = document.getElementById('clone');
    toggleDeeJay = document.getElementById('deejay');
    toggleDiscogs = document.getElementById('discogs');
    toggleEarcave = document.getElementById('earcave');
    toggleGramaphone = document.getElementById('gramaphone');
    toggleHardwax = document.getElementById('hardwax');
    toggleJuno = document.getElementById('juno');
    toggleOye = document.getElementById('oye');
    togglePhonica = document.getElementById('phonica');
    toggleRateYourMusic = document.getElementById('rateyourmusic');
    toggleRedeye = document.getElementById('redeye');
    toggleRushhour = document.getElementById('rushhour');
    toggleSotu = document.getElementById('sotu');
    toggleYoutube = document.getElementById('youtube');

    // Get the user's saved preferences and set the toggles accordingly
    //
    // Adding A Feature: Step 5
    chrome.storage.sync.get('prefs', result => {
      // Feature preferences
      toggleAbsoluteDate.checked = result.prefs.absoluteDate;
      toggleAveragePrice.checked = result.prefs.averagePrice;
      toggleBaoiFields.checked = result.prefs.baoiFields;
      toggleBlockBuyers.checked = result.prefs.blockBuyers;
      toggleBlockSellers.checked = result.prefs.blockSellers;
      toggleBlurryImageFix.checked = result.prefs.blurryImageFix;
      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleCommentScanner.checked = result.prefs.commentScanner;
      toggleConfirmBeforeRemoving.checked = result.prefs.confirmBeforeRemoving;
      toggleConverter.checked = result.prefs.converter;
      toggleDarkTheme.checked = result.prefs.darkTheme;
      toggleDemandIndex.checked = result.prefs.demandIndex;
      toggleEditingNotepad.checked = result.prefs.editingNotepad;
      toggleEverlastingCollection.checked = result.prefs.everlastingCollection;
      toggleEverlastingMarket.checked = result.prefs.everlastingMarket;
      toggleFavoriteSellers.checked = result.prefs.favoriteSellers;
      toggleFeedback.checked = result.prefs.feedback;
      toggleFilterMediaCondition.checked = result.prefs.filterMediaCondition;
      toggleFilterPrices.checked = result.prefs.filterPrices;
      toggleFilterShippingCountry.checked = result.prefs.filterShippingCountry;
      toggleFilterSleeveCondition.checked = result.prefs.filterSleeveCondition;
      toggleFilterUnavailable.checked = result.prefs.filterUnavailable;
      toggleForceDashboard.checked = result.prefs.forceDashboard;
      toggleHighlights.checked = result.prefs.highlightMedia;
      toggleInventoryRatings.checked = result.prefs.inventoryRatings;
      toggleInventoryScanner.checked = result.prefs.inventoryScanner;
      toggleMinMaxColumns.checked = result.prefs.hideMinMaxColumns;
      toggleNotesCount.checked = result.prefs.notesCount;
      togglePrices.checked = result.prefs.suggestedPrices;
      toggleQuickSearch.checked = result.prefs.quickSearch;
      toggleRandomItem.checked = result.prefs.randomItem;
      toggleRatingPercent.checked = result.prefs.ratingPercent;
      toggleReadability.checked = result.prefs.readability;
      toggleRelativeSoldDate.checked = result.prefs.relativeSoldDate;
      toggleReleaseDurations.checked = result.prefs.releaseDurations;
      toggleReleaseRatings.checked = result.prefs.releaseRatings;
      toggleReleaseScanner.checked = result.prefs.releaseScanner;
      toggleRemoveFromWantlist.checked = result.prefs.removeFromWantlist;
      toggleSellerItemsInCart.checked = result.prefs.sellerItemsInCart;
      toggleSellerRep.checked = result.prefs.sellerRep;
      toggleShortcuts.checked = result.prefs.formatShortcuts;
      toggleSortBtns.checked = result.prefs.sortButtons;
      toggleTweakDiscrims.checked = result.prefs.tweakDiscrims;
      toggleYtPlaylists.checked = result.prefs.ytPlaylists;

      // Contextual menus
      toggleAllDay.checked = result.prefs.useAllDay;
      toggleBandcamp.checked = result.prefs.useBandcamp;
      toggleBeatport.checked = result.prefs.useBeatport;
      toggleBoomkat.checked = result.prefs.useBoomkat;
      toggleClone.checked = result.prefs.useClone;
      toggleDeeJay.checked = result.prefs.useDeejay;
      toggleDiscogs.checked = result.prefs.useDiscogs;
      toggleEarcave.checked = result.prefs.useEarcave;
      toggleGramaphone.checked = result.prefs.useGramaphone;
      toggleHardwax.checked = result.prefs.useHardwax;
      toggleJuno.checked = result.prefs.useJuno;
      toggleOye.checked = result.prefs.useOye;
      togglePhonica.checked = result.prefs.usePhonica;
      toggleRateYourMusic.checked = result.prefs.useRateYourMusic;
      toggleRedeye.checked = result.prefs.useRedeye;
      toggleRushhour.checked = result.prefs.useRushhour;
      toggleSotu.checked = result.prefs.useSotu;
      toggleYoutube.checked = result.prefs.useYoutube;
      // Store prefs to reference with showHeadsup()
      prefs = result.prefs;
    });

    // Set values for features with options
    checkForUpdate();
    suggestedPrices.getSuggestedPricesCurrency();
    filterPrices.getFilterPricesCurrency();
    sellerRep.setSellerRep();
    absoluteDate.setAbsoluteDateStatus();
    inventoryRatings.setInventoryRatings();
    inventoryScanner.setInventoryThreshold();

    setTimeout(() => {
      filterMediaCondition.setupFilterByCondition(toggleFilterMediaCondition.checked);
    }, 0);

    setTimeout(() => {
      filterSleeveCondition.setupFilterSleeveCondition(toggleFilterSleeveCondition.checked);
    }, 0);

    // .mac class will remove scrollbars from the popup menu
    if (navigator.userAgent.includes('Mac OS X')) {
      document.getElementsByTagName('html')[0].classList.add('mac');
    }

    // Check for #toggleDarkTheme then remove the class if needed
    let a = setInterval(() => {

      if (document.querySelector('#toggleDarkTheme')) {

        if (!toggleDarkTheme.checked) {
          document.querySelector('html').classList.add('light');
        }
        clearInterval(a);
      }
    }, 13);

    isDev();

    // Set the focus on the search box
    setTimeout(() => { searchbox.focus(); }, 300);
    if (window.ga) { window.ga('send', 'pageview', '/popup.html'); }

    // Check for any known issues with Discogs
    let issues = await getIssues();
    showHeadsUp(issues);
  }

  init();

}, false);
