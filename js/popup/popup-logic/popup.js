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
import * as baoiFields from './features/baoi-fields.js';
import * as contextualMenus from './features/contextual-menus.js';
import * as darkTheme from './features/dark-theme.js';
import * as filterByCondition from './features/filter-by-condition.js';
import * as filterByCountry from './features/filter-by-country.js';
import * as mediaHighlights from './features/media-condition-highlights.js';
import * as minMaxColumns from './features/min-max-columns.js';
import * as sellerRep from './features/seller-rep.js';
import * as suggestedPrices from './features/suggested-prices.js';
import * as ytPlaylists from './features/youtube-playlists.js';
import { acknowledgeUpdate, optionsToggle, searchFeatures, applySave, triggerSave, checkForUpdate } from './utils';

// ========================================================
// Extend Element's prototype to easily add/remove multiple
// classes from a target element. I realize we've all
// been told this is a bad thing to do but since this
// extension is self-contained there will likely never be
// any method-naming conflicts.
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

// ========================================================
// Document ready
// ========================================================
window.addEventListener('load', () => {

  let
      searchbox = document.getElementById('searchbox'),
      toggleBaoiFields = document.getElementById('toggleBaoiFields'),
      toggleBlockSellers = document.getElementById('toggleBlockSellers'),
      toggleBlurryImageFix = document.getElementById('toggleBlurryImageFix'),
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleConverter = document.getElementById('toggleConverter'),
      toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleEverlastingMarket = document.getElementById('toggleEverlastingMarket'),
      toggleFeedback = document.getElementById('toggleFeedback'),
      toggleFilterByCondition = document.getElementById('toggleFilterByCondition'),
      toggleFilterByCountry = document.getElementById('toggleFilterByCountry'),
      toggleHighlights = document.getElementById('toggleHighlights'),
      toggleMinMaxColumns = document.getElementById('toggleMinMaxColumns'),
      toggleNotesCount = document.getElementById('toggleNotesCount'),
      togglePrices = document.getElementById('togglePrices'),
      toggleRandomItem = document.getElementById('toggleRandomItem'),
      toggleReadability = document.getElementById('toggleReadability'),
      toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
      toggleReleaseRatings = document.getElementById('toggleReleaseRatings'),
      toggleSellerRep = document.getElementById('toggleSellerRep'),
      toggleShortcuts = document.getElementById('toggleShortcuts'),
      toggleSortBtns = document.getElementById('toggleSortBtns'),
      toggleYtPlaylists = document.getElementById('toggleYtPlaylists'),
      userCurrency = document.getElementById('currency'),

      // Contextual menus
      toggleAllDay,
      toggleBandcamp,
      toggleBoomkat,
      toggleClone,
      toggleDecks,
      toggleDeeJay,
      toggleDiscogs,
      toggleGramaphone,
      toggleHalcyon,
      toggleHardwax,
      toggleInsound,
      toggleJuno,
      toggleKristina,
      toggleOye,
      togglePbvinyl,
      togglePhonica,
      toggleSotu,
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
  document.getElementById('learn').addEventListener('click', function() {

    chrome.tabs.create({url: '../html/learn.html'});
    acknowledgeUpdate();

    if ( _gaq ) { _gaq.push(['_trackEvent', 'learn', 'learn clicked']); }
  });

  // Open Block Sellers Configuration page
  // ========================================================
  document.getElementById('editList').addEventListener('click', function() {
    chrome.tabs.create({url: '../html/block-sellers.html'});
  });

  // Open Readability Configuration page
  // ========================================================
  document.getElementById('editReadability').addEventListener('click', function() {
    chrome.tabs.create({url: '../html/readability.html'});
  });

  // Contextual Menu Searching Options
  // ========================================================
  document.querySelector('.toggle-group.menus').addEventListener('click', function() {
    optionsToggle('#contextMenus', this, '.menus', 180 );
  });

  // Filter by Condition Options
  // ========================================================
  filterByCondition.init();

  // Filter Items by Country Options
  // ========================================================
  filterByCountry.init();

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

  // ========================================================
  // Event listeners for toggles
  // ========================================================
  toggleBaoiFields.addEventListener('change', baoiFields.toggleBAOIfields);
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleBlurryImageFix.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', darkTheme.useDarkTheme);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleFilterByCondition.addEventListener('change', filterByCondition.toggleHideConditions);
  toggleFilterByCountry.addEventListener('change', filterByCountry.toggleHideCountries);
  toggleHighlights.addEventListener('change', mediaHighlights.toggleMediaHighlights);
  toggleMinMaxColumns.addEventListener('change', minMaxColumns.toggleColumns);
  toggleNotesCount.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', suggestedPrices.showPrices);
  toggleRandomItem.addEventListener('change', triggerSave);
  toggleReadability.addEventListener('change', triggerSave);
  toggleReleaseDurations.addEventListener('change', triggerSave);
  toggleReleaseRatings.addEventListener('change', triggerSave);
  toggleSellerRep.addEventListener('change', sellerRep.saveSellerRep);
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  toggleYtPlaylists.addEventListener('change', ytPlaylists.toggleYtPlaylists);
  userCurrency.addEventListener('change', () => applySave(null, event));

  // ========================================================
  // DOM Setup
  // ========================================================

  /**
   * Sets toggle button values when the popup is rendered
   * and calls necessary methods in order to render
   * the popup's UI in the correct state
   * @method   init
   * @return   {undefined}
   */
  function init() {

    contextualMenus.createContextualMenuElements();

    // Assign contextual menu elements to vars
    toggleAllDay = document.getElementById('allday');
    toggleBandcamp = document.getElementById('bandcamp');
    toggleBoomkat = document.getElementById('boomkat');
    toggleClone = document.getElementById('clone');
    toggleDecks = document.getElementById('decks');
    toggleDeeJay = document.getElementById('deejay');
    toggleDiscogs = document.getElementById('discogs');
    toggleGramaphone = document.getElementById('gramaphone');
    toggleHalcyon = document.getElementById('halcyon');
    toggleHardwax = document.getElementById('hardwax');
    toggleInsound = document.getElementById('insound');
    toggleJuno = document.getElementById('juno');
    toggleKristina = document.getElementById('kristina');
    toggleOye = document.getElementById('oye');
    togglePbvinyl = document.getElementById('pbvinyl');
    togglePhonica = document.getElementById('phonica');
    toggleSotu = document.getElementById('sotu');
    toggleYoutube = document.getElementById('youtube');

    // Get the user's saved preferences and set the toggles accordingly
    chrome.storage.sync.get('prefs', result => {
      // Feature preferences
      toggleBaoiFields.checked = result.prefs.baoiFields;
      toggleBlockSellers.checked = result.prefs.blockSellers;
      toggleBlurryImageFix.checked = result.prefs.blurryImageFix;
      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleConverter.checked = result.prefs.converter;
      toggleDarkTheme.checked = result.prefs.darkTheme;
      toggleEverlastingMarket.checked = result.prefs.everlastingMarket;
      toggleFeedback.checked = result.prefs.feedback;
      toggleFilterByCondition.checked = result.prefs.filterByCondition;
      toggleFilterByCountry.checked = result.prefs.filterByCountry;
      toggleHighlights.checked = result.prefs.highlightMedia;
      toggleMinMaxColumns.checked = result.prefs.hideMinMaxColumns;
      toggleNotesCount.checked = result.prefs.notesCount;
      togglePrices.checked = result.prefs.suggestedPrices;
      toggleRandomItem.checked = result.prefs.randomItem;
      toggleReadability.checked = result.prefs.readability;
      toggleReleaseDurations.checked = result.prefs.releaseDurations;
      toggleReleaseRatings.checked = result.prefs.releaseRatings;
      toggleSellerRep.checked = result.prefs.sellerRep;
      toggleShortcuts.checked = result.prefs.formatShortcuts;
      toggleSortBtns.checked = result.prefs.sortButtons;
      toggleYtPlaylists.checked = result.prefs.ytPlaylists;

      // Contextual menus
      toggleAllDay.checked = result.prefs.useAllDay;
      toggleBandcamp.checked = result.prefs.useBandcamp;
      toggleBoomkat.checked = result.prefs.useBoomkat;
      toggleClone.checked = result.prefs.useClone;
      toggleDecks.checked = result.prefs.useDecks;
      toggleDeeJay.checked = result.prefs.useDeejay;
      toggleDiscogs.checked = result.prefs.useDiscogs;
      toggleGramaphone.checked = result.prefs.useGramaphone;
      toggleHalcyon.checked = result.prefs.useHalcyon;
      toggleHardwax.checked = result.prefs.useHardwax;
      toggleInsound.checked = result.prefs.useInsound;
      toggleJuno.checked = result.prefs.useJuno;
      toggleKristina.checked = result.prefs.useKristina;
      toggleOye.checked = result.prefs.useOye;
      togglePbvinyl.checked = result.prefs.usePbvinyl;
      togglePhonica.checked = result.prefs.usePhonica;
      toggleSotu.checked = result.prefs.useSotu;
      toggleYoutube.checked = result.prefs.useYoutube;
    });

    // Set values for features with options
    checkForUpdate();
    suggestedPrices.getCurrency();
    sellerRep.setSellerRep();
    filterByCountry.setCountryFilterValues();

    setTimeout(() => {
      filterByCondition.setupFilterByCondition(toggleFilterByCondition.checked);
    }, 0);

    // .mac class will remove scrollbars from the popup menu
    if ( navigator.userAgent.includes('Mac OS X') ) {
      document.getElementsByTagName('html')[0].classList.add('mac');
    }

    // Check for #toggleDarkTheme then remove the class if needed
    let a = setInterval(() => {

      if ( document.querySelector('#toggleDarkTheme') ) {

        if ( !toggleDarkTheme.checked ) {
          document.querySelector('html').classList.add('light');
        }
        clearInterval(a);
      }
    }, 13);

    // Set the focus on the search box
    setTimeout(() => { searchbox.focus(); }, 300);
  }

  init();

}, false);
