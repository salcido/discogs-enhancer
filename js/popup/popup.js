/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

import * as ext from './dom_extensions/dom-extensions';
import * as utils from './utils/utils';
import * as filterByCountry from './features/filter-by-country.js';

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
      userCurrency = document.getElementById('currency'),
      features = [...document.querySelectorAll('.toggle-group .meta')],
      hideMarketplaceItems = document.getElementById('marketplaceItems'),
      noResults = document.getElementById('noResults'),
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
      toggleReadability = document.getElementById('toggleReadability'),
      toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
      toggleSellerRep = document.getElementById('toggleSellerRep'),
      toggleShortcuts = document.getElementById('toggleShortcuts'),
      toggleSortBtns = document.getElementById('toggleSortBtns'),
      togglePrices = document.getElementById('togglePrices'),

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
  // Private Functions
  // ========================================================



  /**
   * Sets the text value/color of the Filter by Condition setting in the popup menu
   *
   * @method   _setupFilterByCondition
   * @return   {undefined}
   */

  function _setupFilterByCondition() {

    let
        setting = Number(localStorage.getItem('itemCondition')),
        status = document.querySelector('.toggle-group.condition .label .condition-status'),
        conditions = ['Poor (P)',
                      'Fair (F)',
                      'Good (G)',
                      'Good Plus (G+)',
                      'Very Good (VG)',
                      'Very Good Plus (VG+)',
                      'Near Mint (NM/M-)',
                      'Mint (M)'],
        colors = ['poor',
                  'fair',
                  'good',
                  'good-plus',
                  'very-good',
                  'very-good-plus',
                  'near-mint',
                  'mint'];

    if (setting === 0 || setting === null) {

      status.textContent = 'Disabled';
      status.className = 'condition-status disabled';

    } else {

      status.textContent = conditions[setting];
      status.className = 'condition-status ' + colors[setting];
    }
  }

  /**
   * Toggles price comparisons and displays an Error
   * if a currency value is not selected.
   *
   * @method   _showPrices
   * @param    {Object}   event [The event object]
   * @return   {undefined}
   */

  function _showPrices(event) {

    if (event.target.checked && userCurrency.value !== '-') {

        userCurrency.disabled = true;
        togglePrices.checked = true;
        userCurrency.className = '';

        utils._applySave('refresh`', event);

      }

      else if (userCurrency.value === '-') {

        let message =  'Please choose a currency from the select box first.',
            notifications = document.getElementsByClassName('notifications')[0];

        document.getElementById('notify').textContent = message;

        notifications.addClasses('show');

        setTimeout(() => { utils._fadeOut(notifications); }, 1500);

        togglePrices.checked = false;
        userCurrency.className = 'alert';
        return;

      } else {

        userCurrency.disabled = false;
        utils._applySave('refresh', event);
    }
  }

  // ========================================================
  // Public Functions
  // ========================================================

  /**
   * Checks extension for any recent updates and sets
   * the `about` button color if an update has occured
   *
   * @method   checkForUpdate
   * @return   {undefined}
   */

  function checkForUpdate() {

    chrome.storage.sync.get('didUpdate', function(result) {

      let about = document.getElementById('about');

      if (result.didUpdate) {

        about.textContent = 'New updates!';
        about.classList.remove('button_green');
        about.classList.add('button_orange');

        chrome.browserAction.setBadgeText({text: ''});

      } else {

        about.textContent = 'About';
        about.classList.add('button_green');
        about.classList.remove('button_orange');
      }
    });
  }

  /**
   * Gets and saves currency preferences
   *
   * @method   getCurrency
   * @return   {undefined}
   */

  function getCurrency() {

    chrome.storage.sync.get('prefs', function(result) {

      // if there is a saved value, set the select with it
      if (result.prefs.userCurrency) {
        userCurrency.value = result.prefs.userCurrency;

        // validation
        if (userCurrency.value !== '-' && togglePrices.checked === true) {
          userCurrency.disabled = true;
        }

      } else {

        togglePrices.checked = false;
        userCurrency.disabled = false;
      }
    });
  }

  /**
   * Saves the sellerRep percentage
   *
   * @method saveSellerRep
   * @return {undefined}
   */

  function saveSellerRep() {

    let
        input = document.getElementById('percent'),
        repValue = document.getElementsByClassName('rep-value')[0],
        self = document.querySelector('.seller-rep .status'),
        toggle = toggleSellerRep;

    // enabled -and- has value entered
    if ( input.value && toggle.checked ) {

      input.disabled = true;
      toggle.disabled = false;
      input.classList.remove('alert');

      // reset value to '100' if user enters a greater value
      if ( input.value > 100 ) { input.value = 100; }

      localStorage.setItem('sellerRep', input.value);

      input.value = localStorage.getItem('sellerRep');

      // Displays percentage value like: - 80%
      repValue.textContent = `\u2011 ${input.value}%`;

      utils._setEnabledStatus( self, 'Enabled' );
      utils._applySave('refresh', event);

      if (_gaq) {
        _gaq.push(['_trackEvent', ` Seller Rep Percentage: ${input.value}`, 'Seller Reputation']);
      }

    } else if ( input.value && !toggle.checked ) {

      input.disabled = false;
      repValue.textContent = '';

      utils._setEnabledStatus( self, 'Disabled' );
      utils._applySave('refresh', event);

    } else if ( !input.value ) {

      toggle.checked = false;
      input.classList.add('alert');
    }
  }

  /**
   * Adds/removes `hide` class from the
   * features in popup. Also shows/hides
   * the clear button.
   *
   * @method searchFeatures
   * @return {undefined}
   */

  function searchFeatures() {

    setTimeout(() => {

      features.forEach(feature => {

        let clear = document.getElementsByClassName('clear-search')[0],
            query = searchbox.value.toLowerCase(),
            text = feature.textContent.toLowerCase();

        if ( !text.includes(query) ) {

          feature.parentNode.classList.add('hide');

        } else {

          feature.parentNode.classList.remove('hide');
          noResults.classList.add('hide');
        }

        // Show no results notification
        if ( features.every(utils._isHidden) ) {

          noResults.classList.remove('hide');
        }

        // show/hide the X icon
        return searchbox.value ? clear.classList.remove('hide') : clear.classList.add('hide');
      });
    }, 0);
  }

  /**
   * Sets the value that will hide items in the
   * Marketplace based on condition
   *
   * @method   setHiddenItems
   * @param    {Object}       event [The event object]
   */

  function setHiddenItems(event) {

    let selectValue = event.target[event.target.selectedIndex].value;

    // Filter is disabled
    if (!selectValue) {

      localStorage.removeItem('itemCondition');

      if (_gaq) {

        _gaq.push(['_trackEvent', 'Marketplace Filter: Disabled', 'Marketplace Filter']);
      }

    // Filter is enabled
    } else {

      // set new value on change
      localStorage.setItem( 'itemCondition', String(selectValue) );

      if (_gaq) {

        let conditions = ['Poor (P)',
                          'Fair (F)',
                          'Good (G)',
                          'Good Plus (G+)',
                          'Very Good (VG)',
                          'Very Good Plus (VG+)',
                          'Near Mint (NM/M-)',
                          'Mint (M)'],

            setting = Number(localStorage.getItem('itemCondition'));

        _gaq.push(['_trackEvent', `Marketplace Filter: ${conditions[setting]}`, 'Marketplace Filter']);
      }
    }

    _setupFilterByCondition();
    utils._applySave('refresh', event);
  }

  /**
   * Sets the value of the seller reputation input
   * when the popup is rendered
   *
   * @method setSellerRep
   * @return {undefined}
   */

  function setSellerRep() {

    let input = document.getElementById('percent'),
        percent = localStorage.getItem('sellerRep') || null,
        repValue = document.getElementsByClassName('rep-value')[0],
        self = document.querySelector('.seller-rep .status');

    if (percent !== null) { input.value = percent; }

    chrome.storage.sync.get('prefs', function(result) {

      if (result.prefs.sellerRep && percent !== null) {

        input.disabled = true;
        // Displays percentage value like: - 80%
        repValue.textContent = `\u2011 ${input.value}%`;
        utils._setEnabledStatus( self, 'Enabled' );
      }

      else if (result.prefs.sellerRep && percent === null) {

        toggleSellerRep.checked = false;
        utils._setEnabledStatus( self, 'Disabled' );

      } else {

        utils._setEnabledStatus( self, 'Disabled' );
      }
    });
  }

  /**
   * Creates contextual menu markup inside the
   * Contextual Menu options feature in the popup.
   *
   * @method setupContextualMenus
   * @return {undefined}
   */

  function setupContextualMenus() {

    let contextMenus = document.getElementById('contextMenus'),
        fragment = document.createDocumentFragment(),
        menus = [
            {
              dataName: 'Bandcamp',
              fn: 'searchBandcamp',
              id: 'bandcamp'
            },
            {
              dataName: 'Boomkat',
              fn: 'searchBoomkat',
              id: 'boomkat'
            },
            {
              dataName: 'Clone',
              fn: 'searchClone',
              id: 'clone'
            },
            {
              dataName: 'Decks.de',
              fn: 'searchDecks',
              id: 'decks'
            },
            {
              dataName: 'DeeJay',
              fn: 'searchDeeJay',
              id: 'deejay'
            },
            {
              dataName: 'Discogs',
              fn: 'searchDiscogs',
              id: 'discogs'
            },
            {
              dataName: 'Gramaphone',
              fn: 'searchGramaphone',
              id: 'gramaphone'
            },
            {
              dataName: 'Halcyon',
              fn: 'searchHalcyon',
              id: 'halcyon'
            },
            {
              dataName: 'Hardwax',
              fn: 'searchHardwax',
              id: 'hardwax'
            },
            {
              dataName: 'InSound',
              fn: 'searchInsound',
              id: 'insound'
            },
            {
              dataName: 'Juno',
              fn: 'searchJuno',
              id: 'juno'
            },
            {
              dataName: 'Kristina',
              fn: 'searchKristina',
              id: 'kristina'
            },
            {
              dataName: 'Oye',
              fn: 'searchOye',
              id: 'oye'
            },
            {
              dataName: 'PBVinyl',
              fn: 'searchPbvinyl',
              id: 'pbvinyl'
            },
            {
              dataName: 'Phonica',
              fn: 'searchPhonica',
              id: 'phonica'
            },
            {
              dataName: 'SOTU',
              fn: 'searchSotu',
              id: 'sotu'
            },
            {
              dataName: 'YouTube',
              fn: 'searchYoutube',
              id: 'youtube'
            }
          ];

    // Create contextual menu elements
    menus.forEach(function(menu, i) {

      let
          boxwrap = document.createElement('div'),
          input = document.createElement('input'),
          label = document.createElement('label'),
          span = document.createElement('span');

      boxwrap.className = 'checkbox-wrap';

      input.type = 'checkbox';
      input.id = menu.id;
      input.dataset.name = menu.dataName;
      input.dataset.fn = menu.fn;

      span.textContent = menu.dataName;

      // Assemble markup
      label.appendChild(input);
      label.appendChild(span);
      boxwrap.appendChild(label);
      fragment.appendChild(boxwrap);
    });

    // Append all contextual menu elements
    contextMenus.appendChild(fragment);

    // Attach eventListeners
    menus.forEach(menu => {
      document.getElementById(menu.id).addEventListener('change', updateContextualMenu);
    });
  }

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

  /**
   * Toggles Marketplace highlights
   *
   * @method   toggleMediaHighlights
   * @param    {object}         event [the event object]
   * @return   {undefined}
   */

  function toggleMediaHighlights(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-highlights.js'},
        function() { utils._applySave( 'refresh', event); });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-highlights.js'},
        function() { utils._applySave(null, event); });
    }
  }

  /**
   * Tells the user to refresh after updating a preference
   *
   * @method   triggerSave
   * @param    {Object}    event [The event object]
   * @return   {undefined}
   */

  function triggerSave(event) {

    utils._applySave('refresh', event);
  }

  /**
   * Creates/removes contextual menu items
   *
   * @method   updateContextualMenu
   * @param    {Object}   event [The event object]
   * @return   {undefined}
   */

  function updateContextualMenu(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
        fn: event.target.dataset.fn,
        id: event.target.id,
        method: 'create',
        name: event.target.dataset.name,
        request: 'updateContextMenu'
      });

      utils._applySave(null, event);

    } else {

      chrome.runtime.sendMessage({
        id: event.target.id,
        method: 'remove',
        request: 'updateContextMenu'
      });

      utils._applySave(null, event);
    }
  }

  /**
   * Toggles the dark theme
   *
   * @method   useDarkTheme
   * @param    {Object}     event [The event object]
   * @return   {undefined}
   */

  function useDarkTheme(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-dark-theme.js'},
        function() { utils._applySave(null, event); });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-dark-theme.js'},
        function() { utils._applySave(null, event); });
    }
  }

  // ========================================================
  // UI Event Listeners
  // ========================================================

  // Open the about page
  document.getElementById('about').addEventListener('click', function(event) {

    chrome.tabs.create({url: '../html/about.html'});
    utils._acknowledgeUpdate();

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
    utils._optionsToggle('#contextMenus', this, '.menus', 180 );
  });

  /* FILTER BY CONDITION OPTIONS */
  document.querySelector('.toggle-group.condition').addEventListener('click', function(event) {
    utils._optionsToggle('.hide-condition', this, '.condition', 100 );
  });

  /* FILTER ITEMS BY COUNTRY OPTIONS */
  document.querySelector('.toggle-group.country').addEventListener('click', function(event) {
    utils._optionsToggle('.hide-country', this, '.country', 115 );
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
    utils._optionsToggle('.hide-percentage', this, '.seller-rep', 100 );
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
  hideMarketplaceItems.addEventListener('change', setHiddenItems);
  userCurrency.addEventListener('change', function(){ utils._applySave(null, event); });
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleHighlights.addEventListener('change', toggleMediaHighlights);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', useDarkTheme);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleFilterByCountry.addEventListener('change', filterByCountry.toggleHideCountries);
  toggleNotesCount.addEventListener('change', triggerSave);
  toggleReadability.addEventListener('change', triggerSave);
  toggleReleaseDurations.addEventListener('change', triggerSave);
  toggleSellerRep.addEventListener('change', saveSellerRep);
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', _showPrices);

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

    setupContextualMenus();
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
    getCurrency();
    _setupFilterByCondition();
    filterByCountry.setCountryFilterValues();
    setSellerRep();

    // .mac class will remove scrollbars from the popup menu
    if (navigator.userAgent.includes('Mac OS X')) {

      document.getElementsByTagName('html')[0].addClasses('mac');
    }
    setTimeout(() => { searchbox.focus(); }, 300);
  }

  init();

}, false);
