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
import * as baoiFields from './features/baoi-fields.js';
import * as compactArtist from './features/compact-artist.js';
import * as contextualMenus from './features/contextual-menus.js';
import * as linksInTabs from './features/links-in-new-tabs.js';
import * as darkTheme from './features/dark-theme.js';
import * as filterMediaCondition from './features/filter-media-condition.js';
import * as filterPrices from './features/filter-prices.js';
import * as filterSleeveCondition from './features/filter-sleeve-condition.js';
import * as filterShippingCountry from './features/filter-shipping-country.js';
import * as inventoryRatings from './features/inventory-ratings.js';
import * as inventoryScanner from './features/inventory-scanner.js';
import * as mediaHighlights from './features/media-condition-highlights.js';
import * as minMaxColumns from './features/min-max-columns.js';
import * as sellerRep from './features/seller-rep.js';
import * as suggestedPrices from './features/suggested-prices.js';
import * as tweakDiscrims from './features/tweak-discriminators.js';
import * as ytPlaylists from './features/youtube-playlists.js';
import { acknowledgeUpdate,
         optionsToggle,
         searchFeatures,
         applySave,
         triggerSave,
         checkForUpdate } from './utils';

// ========================================================
// Extend Element's prototype to easily add/remove multiple
// classes from a target element.
// ========================================================
if ( !Element.prototype.removeClasses ) {
  Element.prototype.removeClasses = function(...remove) {
    remove.forEach(cls => this.classList.remove(cls));
  };
}

if ( !Element.prototype.addClasses ) {
  Element.prototype.addClasses = function(...add) {
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
      automaticDarkTheme = document.getElementById('automaticTheme'),
      searchbox = document.getElementById('searchbox'),
      selectDarkTheme = document.getElementById('themeSelect'),
      toggleAbsoluteDate = document.getElementById('toggleAbsoluteDate'),
      toggleAveragePrice = document.getElementById('toggleAveragePrice'),
      toggleBaoiFields = document.getElementById('toggleBaoiFields'),
      toggleBlockBuyers = document.getElementById('toggleBlockBuyers'),
      toggleBlockSellers = document.getElementById('toggleBlockSellers'),
      toggleCompactArtist = document.getElementById('toggleCompactArtist'),
      toggleCollectionBoxFix = document.getElementById('toggleCollectionBoxFix'),
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleConfirmBeforeRemoving = document.getElementById('toggleConfirmBeforeRemoving'),
      toggleConverter = document.getElementById('toggleConverter'),
      toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleDemandIndex = document.getElementById('toggleDemandIndex'),
      toggleEditingNotepad = document.getElementById( 'toggleEditingNotepad' ),
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
      toggleFullWidth = document.getElementById('toggleFullWidth'),
      toggleHighlights = document.getElementById('toggleHighlights'),
      toggleInventoryRatings = document.getElementById('toggleInventoryRatings'),
      toggleInventoryScanner = document.getElementById('toggleInventoryScanner'),
      toggleMinMaxColumns = document.getElementById('toggleMinMaxColumns'),
      toggleNotesCount = document.getElementById('toggleNotesCount'),
      togglePrices = document.getElementById('togglePrices'),
      toggleQuickSearch = document.getElementById('toggleQuickSearch'),
      toggleQuickSearchTracklists = document.getElementById('toggleQuickSearchTracklists'),
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
      toggleShoppingSpree = document.getElementById('toggleShoppingSpree'),
      toggleShortcuts = document.getElementById('toggleShortcuts'),
      toggleSortBtns = document.getElementById('toggleSortBtns'),
      toggleSortByTotalPrice = document.getElementById('toggleSortByTotalPrice'),
      toggleTweakDiscrims = document.getElementById('toggleTweakDiscrims'),
      toggleYtPlaylists = document.getElementById('toggleYtPlaylists'),
      userCurrency = document.getElementById('currency'),

      // Contextual menus
      toggleAllDay,
      toggleBandcamp,
      toggleBeatport,
      toggleBoomkat,
      toggleCDandLP,
      toggleClone,
      toggleDecks,
      toggleDeeJay,
      toggleDiscogs,
      toggleEarcave,
      toggleEbay,
      toggleGramaphone,
      toggleHardwax,
      toggleJuno,
      toggleMeditations,
      toggleNorman,
      toggleOye,
      togglePhonica,
      toggleRateYourMusic,
      toggleRedeye,
      toggleRubadub,
      toggleRushhour,
      toggleSotu,
      toggleSoundcloud,
      toggleTraxsource,
      toggleYoutube;

  // ========================================================
  // UI EVENT LISTENERS
  // ========================================================


  // Toggle light/dark theme
  // ========================================================
  toggleDarkTheme.addEventListener('click', () => {

    let html = document.querySelector('html');

    if ( toggleDarkTheme.checked ) {

      return html.classList.remove('light');
    }

    return html.classList.add('light');
  });

  // Open Learn page
  // ========================================================
  document.getElementById('learn').addEventListener('click', async function() {
      chrome.tabs.create({url: '../html/learn.html'});
      acknowledgeUpdate();
  });

  // Help Bubble Clicks
  // ========================================================
  document.querySelectorAll('.help').forEach(bubble => {
    let id = bubble.classList[1];
    bubble.addEventListener('click', () => {
      chrome.tabs.create({url: `../html/learn.html#${id}`});
    });
  });

  // Open Block Sellers Configuration page
  // ========================================================
  document.getElementById('editList').addEventListener('click', function() {
    chrome.tabs.create({url: '../html/block-sellers.html'});
  });

  // Open Filter Shipping Countries Configuration page
  // ========================================================
  document.getElementById('editShippingList').addEventListener('click', function() {
    chrome.tabs.create({url: '../html/filter-shipping-country.html'});
  });

  // Open Favorite Sellers Configuration page
  // ========================================================
  document.getElementById('editFavList').addEventListener('click', function() {
    chrome.tabs.create({url: '../html/favorite-sellers.html'});
  });

  // Open Readability Configuration page
  // ========================================================
  document.getElementById('editReadability').addEventListener('click', function() {
    chrome.tabs.create({url: '../html/readability.html'});
  });

  // Contextual Menu Searching Options
  // ========================================================
  document.querySelector('.toggle-group.menus').addEventListener('click', function() {
    optionsToggle('#contextMenus', this, '.menus', 235 );
  });

  // Open Links In New tabs
  // ------------------------------------------------------
  document.querySelector('.toggle-group.tabs').addEventListener('click', function() {
    optionsToggle('#linksInTabs', this, '.tabs', 130 );
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
  document.querySelector('.clear-search').addEventListener('mousedown', function() {

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
  automaticDarkTheme.addEventListener('change', triggerSave);
  selectDarkTheme.addEventListener('change', darkTheme.setDarkTheme);
  toggleAbsoluteDate.addEventListener('change', triggerSave);
  toggleAveragePrice.addEventListener('change', triggerSave);
  toggleBaoiFields.addEventListener('change', baoiFields.toggleBAOIfields);
  toggleBlockBuyers.addEventListener('change', triggerSave);
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleCompactArtist.addEventListener('change', compactArtist.toggleCompactArtist);
  toggleCollectionBoxFix.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleConfirmBeforeRemoving.addEventListener('change', triggerSave);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', darkTheme.useDarkTheme);
  toggleDemandIndex.addEventListener('change', triggerSave);
  toggleEditingNotepad.addEventListener('change', triggerSave);
  toggleEverlastingCollection.addEventListener('change', triggerSave);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFavoriteSellers.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleFilterMediaCondition.addEventListener('change', filterMediaCondition.toggleHideConditions);
  toggleFilterPrices.addEventListener('change', filterPrices.validateFilterPrices);
  toggleFilterShippingCountry.addEventListener('change', filterShippingCountry.toggleHideCountries);
  toggleFilterSleeveCondition.addEventListener('change', filterSleeveCondition.toggleSleeveConditions);
  toggleFilterUnavailable.addEventListener('change', triggerSave);
  toggleForceDashboard.addEventListener('change', triggerSave);
  toggleFullWidth.addEventListener('change', triggerSave);
  toggleHighlights.addEventListener('change', mediaHighlights.toggleMediaHighlights);
  toggleInventoryRatings.addEventListener('change', inventoryRatings.saveInventoryRatings);
  toggleInventoryScanner.addEventListener('change', inventoryScanner.saveInventoryThreshold);
  toggleMinMaxColumns.addEventListener('change', minMaxColumns.toggleColumns);
  toggleNotesCount.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', suggestedPrices.validateAndSave);
  toggleQuickSearch.addEventListener('change', triggerSave);
  toggleQuickSearchTracklists.addEventListener('change', triggerSave);
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
  toggleShoppingSpree.addEventListener('change', triggerSave);
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  toggleSortByTotalPrice.addEventListener('change', triggerSave);
  toggleTweakDiscrims.addEventListener('change', triggerSave);
  toggleYtPlaylists.addEventListener('change', ytPlaylists.toggleYtPlaylists);
  userCurrency.addEventListener('change', () => applySave(null, event));

  /**
   * Fetches known issues from discogs-enhancer.com/issues
   * @returns {Object} - Performance issue data: { content: <string>, version: <string> }
   */
   function getIssues() {
    return chrome.storage.sync.get(['featureData']).then(async ({ featureData }) => {
      let url = 'https://discogs-enhancer.com/issues',
          { blockList } = featureData;

      if (__DEV__
          && blockList
          && blockList.list
          && blockList.list.includes('development')
        ) {
        url = 'http://localhost:3000/issues';
      }

      return await fetch(url)
        .then(response => {
          let res = response.json();
          return res;
        })
        .catch(() => {
          return { content: null, version: null };
        });
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

    for ( let [key] of Object.entries(cachedPrefs) ) {

        if ( features.includes('any') || cachedPrefs[key] && features.includes(key) ) {
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

    if ( content
         && content.length
         && showWarning
         && hasFeatureEnabled(features) ) {

      let warning = document.querySelector('.issues');

      warning.querySelector('.content').textContent = content;
      warning.style.display = 'block';
    }
  }

  // ========================================================
  // DOM Setup
  // ========================================================

  // Store prefs to reference with showHeadsup()
  let cachedPrefs;

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
    toggleCDandLP = document.getElementById('cdandlp');
    toggleClone = document.getElementById('clone');
    toggleDecks = document.getElementById('decks');
    toggleDeeJay = document.getElementById('deejay');
    toggleDiscogs = document.getElementById('discogs');
    toggleEarcave = document.getElementById('earcave');
    toggleEbay = document.getElementById('ebay');
    toggleGramaphone = document.getElementById('gramaphone');
    toggleHardwax = document.getElementById('hardwax');
    toggleJuno = document.getElementById('juno');
    toggleMeditations = document.getElementById('meditations');
    toggleNorman = document.getElementById('norman');
    toggleOye = document.getElementById('oye');
    togglePhonica = document.getElementById('phonica');
    toggleRateYourMusic = document.getElementById('rateyourmusic');
    toggleRedeye = document.getElementById('redeye');
    toggleRubadub = document.getElementById('rubadub');
    toggleRushhour = document.getElementById('rushhour');
    toggleSotu = document.getElementById('sotu');
    toggleSoundcloud = document.getElementById('soundcloud');
    toggleTraxsource = document.getElementById('traxsource');
    toggleYoutube = document.getElementById('youtube');

    // Get the user's saved preferences and set the toggles accordingly
    //
    // Adding A Feature: Step 5
    chrome.storage.sync.get('prefs', ({ prefs }) => {
      // Feature preferences
      automaticDarkTheme.checked = prefs.darkThemeSystemPref,
      selectDarkTheme.value = prefs.darkThemeVariant || '',
      toggleAbsoluteDate.checked = prefs.absoluteDate;
      toggleAveragePrice.checked = prefs.averagePrice;
      toggleBaoiFields.checked = prefs.baoiFields;
      toggleBlockBuyers.checked = prefs.blockBuyers;
      toggleBlockSellers.checked = prefs.blockSellers;
      toggleCollectionBoxFix.checked = prefs.collectionBoxFix;
      toggleCollectionUi.checked = prefs.collectionUi;
      toggleCompactArtist.checked = prefs.compactArtist;
      toggleConfirmBeforeRemoving.checked = prefs.confirmBeforeRemoving;
      toggleConverter.checked = prefs.converter;
      toggleDarkTheme.checked = prefs.darkTheme;
      toggleDemandIndex.checked = prefs.demandIndex;
      toggleEditingNotepad.checked = prefs.editingNotepad;
      toggleEverlastingCollection.checked = prefs.everlastingCollection;
      toggleEverlastingMarket.checked = prefs.everlastingMarket;
      toggleFavoriteSellers.checked = prefs.favoriteSellers;
      toggleFeedback.checked = prefs.feedback;
      toggleFilterMediaCondition.checked = prefs.filterMediaCondition;
      toggleFilterPrices.checked = prefs.filterPrices;
      toggleFilterShippingCountry.checked = prefs.filterShippingCountry;
      toggleFilterSleeveCondition.checked = prefs.filterSleeveCondition;
      toggleFilterUnavailable.checked = prefs.filterUnavailable;
      toggleForceDashboard.checked = prefs.forceDashboard;
      toggleFullWidth.checked = prefs.fullWidthPages;
      toggleHighlights.checked = prefs.highlightMedia;
      toggleInventoryRatings.checked = prefs.inventoryRatings;
      toggleInventoryScanner.checked = prefs.inventoryScanner;
      toggleMinMaxColumns.checked = prefs.hideMinMaxColumns;
      toggleNotesCount.checked = prefs.notesCount;
      togglePrices.checked = prefs.suggestedPrices;
      toggleQuickSearch.checked = prefs.quickSearch;
      toggleQuickSearchTracklists.checked = prefs.quickSearchTracklists;
      toggleRandomItem.checked = prefs.randomItem;
      toggleRatingPercent.checked = prefs.ratingPercent;
      toggleReadability.checked = prefs.readability;
      toggleRelativeSoldDate.checked = prefs.relativeSoldDate;
      toggleReleaseDurations.checked = prefs.releaseDurations;
      toggleReleaseRatings.checked = prefs.releaseRatings;
      toggleReleaseScanner.checked = prefs.releaseScanner;
      toggleRemoveFromWantlist.checked = prefs.removeFromWantlist;
      toggleSellerItemsInCart.checked = prefs.sellerItemsInCart;
      toggleSellerRep.checked = prefs.sellerRep;
      toggleShoppingSpree.checked = prefs.shoppingSpreeMode,
      toggleShortcuts.checked = prefs.formatShortcuts;
      toggleSortBtns.checked = prefs.sortButtons;
      toggleSortByTotalPrice.checked = prefs.sortByTotalPrice;
      toggleTweakDiscrims.checked = prefs.tweakDiscrims;
      toggleYtPlaylists.checked = prefs.ytPlaylists;

      // Contextual menus
      toggleAllDay.checked = prefs.useAllDay;
      toggleBandcamp.checked = prefs.useBandcamp;
      toggleBeatport.checked = prefs.useBeatport;
      toggleBoomkat.checked = prefs.useBoomkat;
      toggleCDandLP.checked = prefs.useCDandLP;
      toggleClone.checked = prefs.useClone;
      toggleDecks.checked = prefs.useDecks;
      toggleDeeJay.checked = prefs.useDeejay;
      toggleDiscogs.checked = prefs.useDiscogs;
      toggleEarcave.checked = prefs.useEarcave;
      toggleEbay.checked = prefs.useEbay;
      toggleGramaphone.checked = prefs.useGramaphone;
      toggleHardwax.checked = prefs.useHardwax;
      toggleJuno.checked = prefs.useJuno;
      toggleMeditations.checked = prefs.useMeditations;
      toggleNorman.checked = prefs.useNorman;
      toggleOye.checked = prefs.useOye;
      togglePhonica.checked = prefs.usePhonica;
      toggleRateYourMusic.checked = prefs.useRateYourMusic;
      toggleRedeye.checked = prefs.useRedeye;
      toggleRubadub.checked = prefs.useRubadub;
      toggleRushhour.checked = prefs.useRushhour;
      toggleSotu.checked = prefs.useSotu;
      toggleSoundcloud.checked = prefs.useSoundcloud;
      toggleTraxsource.checked = prefs.useTraxsource;
      toggleYoutube.checked = prefs.useYoutube;
      // Store prefs to reference with showHeadsup()
      cachedPrefs = prefs;
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
    }, 100);

    setTimeout(() => {
      filterSleeveCondition.setupFilterSleeveCondition(toggleFilterSleeveCondition.checked);
    }, 100);

    // .mac class will remove scrollbars from the popup menu
    if ( navigator.userAgent.includes('Mac OS X') ) {
      document.getElementsByTagName('html')[0].classList.add('mac');
    }

    // Check for #toggleDarkTheme then remove the class if needed
    let a = setInterval(() => {

      if ( document.querySelector('#toggleDarkTheme') ) {

        if ( !toggleDarkTheme.checked ) {
          document.querySelector('html').classList.add('light');
          document.querySelector('.automatic-theme').style.display = 'none';
          document.querySelector('#themeSelect').style.display = 'none';
        }
        clearInterval(a);
      }
    }, 13);

    // Hide the automatic-theme checkbox if Dark Theme is disabled
    toggleDarkTheme.addEventListener('change', event => {

      if (event.target.checked) {
        document.querySelector('.automatic-theme').style.display = 'inline-flex';
        document.querySelector('#themeSelect').style.display = 'inline-block';
      } else {
        document.querySelector('.automatic-theme').style.display = 'none';
        document.querySelector('#themeSelect').style.display = 'none';
      }
    });

    isDev();

    // Set the focus on the search box
    setTimeout(() => { searchbox.focus(); }, 300);

    // Check for any known issues with Discogs
    getIssues().then((issues) => showHeadsUp(issues));
  }

  init();

}, false);
