/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

import * as ext from './dom-extensions/dom-extensions';
import { acknowledgeUpdate, optionsToggle, searchFeatures, applySave, triggerSave, checkForUpdate } from './utils/utils';
import * as contextualMenus from './features/contextual-menus.js';
import * as darkTheme from './features/dark-theme.js';
import * as filterByCondition from './features/filter-by-condition.js';
import * as filterByCountry from './features/filter-by-country.js';
import * as mediaHighlights from './features/media-condition-highlights.js';
import * as sellerRep from './features/seller-rep.js';
import * as suggestedPrices from './features/suggested-prices.js';

// ========================================================
// Extend Element's prototype to easily add/remove multiple
// classes from a target element. Yes, I realize we've all
// been told this is a bad thing to do but since this
// extension is self-contained there will likely never be
// any method-naming conflicts.
// ========================================================
if ( !Element.prototype.removeClasses ) {
  Element.prototype.removeClasses = ext.removeClasses;
}

if ( !Element.prototype.addClasses ) {
  Element.prototype.addClasses = ext.addClasses;
}

window.addEventListener('load', function load() {

  let
      hideMarketplaceItems = document.getElementById('marketplaceItems'),
      searchbox = document.getElementById('searchbox'),
      toggleBlockSellers = document.getElementById('toggleBlockSellers'),
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleHighlights = document.getElementById('toggleHighlights'),
      toggleConverter = document.getElementById('toggleConverter'),
      toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleFeedback = document.getElementById('toggleFeedback'),
      toggleFilterByCountry = document.getElementById('toggleFilterByCountry'),
      toggleEverlastingMarket = document.getElementById('toggleEverlastingMarket'),
      toggleNotesCount = document.getElementById('toggleNotesCount'),
      togglePrices = document.getElementById('togglePrices'),
      toggleReadability = document.getElementById('toggleReadability'),
      toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
      toggleSellerRep = document.getElementById('toggleSellerRep'),
      toggleShortcuts = document.getElementById('toggleShortcuts'),
      toggleSortBtns = document.getElementById('toggleSortBtns'),
      userCurrency = document.getElementById('currency'),

      // ========================================================
      // Contextual menus
      // ========================================================
      // Declared here first for scope and later assigned with
      // setContextualMenuIds()
      // ========================================================
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
  // Public Functions
  // ========================================================

  /**
   * Assigns values to contexual menu vars
   *
   * @method setContextualMenuIds
   * @return {undefined}
   */

  function setContextualMenuIds() {

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
  }

  // ========================================================
  // UI Event Listeners
  // ========================================================

  // Open the about page
  document.getElementById('about').addEventListener('click', function(event) {

    chrome.tabs.create({url: '../html/about.html'});
    acknowledgeUpdate();

    if (_gaq) { _gaq.push(['_trackEvent', 'about', 'about clicked']); }
  });

  // Open block sellers page
  document.getElementById('editList').addEventListener('click', function(event) {
    chrome.tabs.create({url: '../html/block-sellers.html'});
  });

  // Open readability config page
  document.getElementById('editReadability').addEventListener('click', function(event) {
    chrome.tabs.create({url: '../html/readability.html'});
  });

  /* CONTEXTUAL MENU SEARCHING OPTIONS */
  document.querySelector('.toggle-group.menus').addEventListener('click', function(event) {
    optionsToggle('#contextMenus', this, '.menus', 180 );
  });

  /* FILTER BY CONDITION OPTIONS */
  document.querySelector('.toggle-group.condition').addEventListener('click', function(event) {
    optionsToggle('.hide-condition', this, '.condition', 100 );
  });

  /* FILTER ITEMS BY COUNTRY OPTIONS */
  document.querySelector('.toggle-group.country').addEventListener('click', function(event) {
    optionsToggle('.hide-country', this, '.country', 115 );
  });

  // Save the Filter Items By Country CURRENCY select value to localStorage
  document.getElementById('filterCountryCurrency').addEventListener('change', function(event) {

    let filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

    if (this.value !== '-') {

      filterByCountryPrefs.currency = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountryPrefs));
    }
  });

  // Save the Filter Items By Country COUNTRY select value to localStorage
  document.getElementById('filterCountry').addEventListener('change', function(event) {

    let filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

    if (this.value) {

      filterByCountryPrefs.country = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountryPrefs));
    }
  });

  /* SELLER REPUTATION */
  document.querySelector('.toggle-group.seller-rep').addEventListener('click', function() {
    optionsToggle('.hide-percentage', this, '.seller-rep', 100 );
  });

  /* SEARCH FUNCTIONALITY */
  searchbox.addEventListener('keydown', function() {
    searchFeatures();
  });

  // Clear search input
  document.querySelector('.clear-search').addEventListener('mousedown', function() {

    searchbox.value = '';
    searchFeatures();

    // reset the focus
    setTimeout(() => { searchbox.focus(); }, 200);
  });

  // Toggle event listeners
  hideMarketplaceItems.addEventListener('change', filterByCondition.setFilterByConditionValue);
  userCurrency.addEventListener('change', function(){ applySave(null, event); });
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleHighlights.addEventListener('change', mediaHighlights.toggleMediaHighlights);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', darkTheme.useDarkTheme);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleFilterByCountry.addEventListener('change', filterByCountry.toggleHideCountries);
  toggleNotesCount.addEventListener('change', triggerSave);
  toggleReadability.addEventListener('change', triggerSave);
  toggleReleaseDurations.addEventListener('change', triggerSave);
  toggleSellerRep.addEventListener('change', sellerRep.saveSellerRep);
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', suggestedPrices.showPrices);

  // ========================================================
  // DOM Setup
  // ========================================================

  /**
   * Sets toggle button values when the popup is rendered
   * and calls necessary methods
   *
   * @method   init
   * @return   {undefined}
   */

  function init() {

    contextualMenus.setupContextualMenus();
    setContextualMenuIds();

    // Get the user's preferences and set the toggles accordingly
    chrome.storage.sync.get('prefs', function(result) {

      hideMarketplaceItems.value = localStorage.getItem('itemCondition') || '';
      toggleBlockSellers.checked = result.prefs.blockSellers;
      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleHighlights.checked = result.prefs.highlightMedia;
      toggleConverter.checked = result.prefs.converter;
      toggleDarkTheme.checked = result.prefs.darkTheme;
      toggleEverlastingMarket.checked = result.prefs.everlastingMarket;
      toggleFeedback.checked = result.prefs.feedback;
      toggleFilterByCountry.checked = result.prefs.filterByCountry;
      toggleNotesCount.checked = result.prefs.notesCount;
      toggleReadability.checked = result.prefs.readability;
      toggleReleaseDurations.checked = result.prefs.releaseDurations;
      toggleSellerRep.checked = result.prefs.sellerRep;
      toggleShortcuts.checked = result.prefs.formatShortcuts;
      toggleSortBtns.checked = result.prefs.sortButtons;
      togglePrices.checked = result.prefs.suggestedPrices;

      // Contextual menus
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

    checkForUpdate();
    suggestedPrices.getCurrency();
    filterByCondition.setupFilterByCondition();
    filterByCountry.setCountryFilterValues();
    sellerRep.setSellerRep();

    // .mac class will remove scrollbars from the popup menu
    if (navigator.userAgent.includes('Mac OS X')) {

      document.getElementsByTagName('html')[0].addClasses('mac');
    }
    setTimeout(() => { searchbox.focus(); }, 300);
  }

  init();

}, false);
