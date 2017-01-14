/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', function () {

  let
      chromeVer = (/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1],
      userCurrency = document.getElementById('currency'),
      prefs = {},
      hideMarketplaceItems = document.getElementById('marketplaceItems'),
      toggleBlockSellers = document.getElementById('toggleBlockSellers'),
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleConditions = document.getElementById('toggleConditions'),
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

      // Contextual menus
      toggleBandcamp = document.getElementById('bandcamp'),
      toggleBoomkat = document.getElementById('boomkat'),
      toggleClone = document.getElementById('clone'),
      toggleDecks = document.getElementById('decks'),
      toggleDeeJay = document.getElementById('deejay'),
      toggleDiscogs = document.getElementById('discogs'),
      toggleGramaphone = document.getElementById('gramaphone'),
      toggleHalcyon = document.getElementById('halcyon'),
      toggleHardwax = document.getElementById('hardwax'),
      toggleInsound = document.getElementById('insound'),
      toggleJuno = document.getElementById('juno'),
      toggleKristina = document.getElementById('kristina'),
      toggleOye = document.getElementById('oye'),
      togglePbvinyl = document.getElementById('pbvinyl'),
      togglePhonica = document.getElementById('phonica'),
      toggleSotu = document.getElementById('sotu'),
      toggleYoutube = document.getElementById('youtube');

  // ========================================================
  // Private Functions
  // ========================================================

  /**
   * Clears the update notification
   *
   * @method   _acknowledgeUpdate
   * @param    {string}          message [The message displayed to the user]
   * @return   {undefined}
   */

  function _acknowledgeUpdate(message) {

    chrome.storage.sync.set({didUpdate: false}, function() {});

    chrome.browserAction.setBadgeText({text: ''});
  }

  /**
   * Saves the users preferences
   *
   * @method   _applySave
   * @param    {String}  message [The message displayed to the user]
   * @param    {Object}  event   [The event object]
   * @return   {undefined}
   */

  function _applySave(message, event) {

    let manifest = chrome.runtime.getManifest();

    prefs = {
      blockSellers: toggleBlockSellers.checked,
      collectionUi: toggleCollectionUi.checked,
      converter: toggleConverter.checked,
      darkTheme: toggleDarkTheme.checked,
      everlastingMarket: toggleEverlastingMarket.checked,
      feedback: toggleFeedback.checked,
      filterByCountry: toggleFilterByCountry.checked,
      formatShortcuts: toggleShortcuts.checked,
      hideMarketplaceItems: hideMarketplaceItems.value,
      highlightMedia: toggleConditions.checked,
      notesCount: toggleNotesCount.checked,
      readability: toggleReadability.checked,
      releaseDurations: toggleReleaseDurations.checked,
      sellerRep: toggleSellerRep.checked,
      sortButtons: toggleSortBtns.checked,
      suggestedPrices: togglePrices.checked,
      userCurrency: userCurrency.value,

      // Contextual menus
      useBandcamp: toggleBandcamp.checked,
      useBoomkat: toggleBoomkat.checked,
      useClone: toggleClone.checked,
      useDecks: toggleDecks.checked,
      useDeejay: toggleDeeJay.checked,
      useDiscogs: toggleDiscogs.checked,
      useGramaphone: toggleGramaphone.checked,
      useHalcyon: toggleHalcyon.checked,
      useHardwax: toggleHardwax.checked,
      useInsound: toggleInsound.checked,
      useJuno: toggleJuno.checked,
      useKristina: toggleKristina.checked,
      useOye: toggleOye.checked,
      usePbvinyl: togglePbvinyl.checked,
      usePhonica: togglePhonica.checked,
      useSotu: toggleSotu.checked,
      useYoutube: toggleYoutube.checked
    };

    chrome.storage.sync.set({prefs: prefs}, function() {

      if (message) {

        $('#notify').text(message);

        $('.notifications').css({display:'block'}).delay(2000).fadeOut('slow');
      }
    });

    // Google Analyitcs
    if (_gaq) {

      if (event.target.checked === true || event.target.checked === false) {

        _gaq.push(['_trackEvent', event.target.id + ' : ' + event.target.checked, ' version: ' + manifest.version + ' Chrome: ' + chromeVer]);
      }
    }
  }

  /**
   * Displays the sub-options under Marketplace Features
   *
   * @method _marketplaceFeaturesToggle
   * @param  {object}    options     [the DOM element to display]
   * @param  {object}    toggleGroup [the actual feature in the popup menu]
   * @return {undefined}
   */

  function _marketplaceFeaturesToggle(options, toggleGroup) {

    // Expand
    // Check the current height and either expand or collapse it
    if (toggleGroup.height() == 50) {

      // height is determined by (number of features * 50)
      toggleGroup.css({height: 350});

      $('.marketplace-label .arrow').addClass('rotate90');

      let int = setInterval(function() {

        if ( toggleGroup.height() >= 320 ) {

          options.fadeIn(100);
          // set height to auto so that last most sub-option will expand the parent div
          toggleGroup.css({height: 'auto'});

          clearInterval(int);
        }
      }, 100);
    }
    // Collapse
    // (don't collapse when clicking these elements)
    else if (event.target.className.includes('marketplace') ||
             event.target.textContent === 'Marketplace Features' ) {

      options.fadeOut(100);
      // reset to 350
      toggleGroup.css({height: 350});

      let int = setInterval(function() {

       if (options.is(':hidden')) {

         toggleGroup.css({height: '50px'});

         $('.marketplace-label .arrow').removeClass('rotate90');

         clearInterval(int);
       }
      }, 100);
    }
  }

  /**
   * Displays the options in the popup menu
   *
   * @method _optionsToggle
   * @param  {object}    options     [the DOM element to display]
   * @param  {object}    toggleGroup [the actual feature in the popup menu]
   * @param  {number}    height      [the height that `target` will expand to]
   * @param  {string}    arrowClass  [the parent class of the animated arrow]
   * @return {undefined}
   */

  function _optionsToggle(options, toggleGroup, arrowClass, height) {

    let ms = 200;

    // Expand
    // Check the current height and either expand or collapse it
    if (toggleGroup.height() == 50) {

      toggleGroup.css({height: height + 'px'});
      $(arrowClass + ' .arrow').addClass('rotate90');

      let int = setInterval(function() {

        if ( toggleGroup.height() >= 30 ) {

          options.fadeIn(ms);
          $(arrowClass + ' .status').fadeOut(ms);

          clearInterval(int);
        }
      }, 100);
    }
    // Collapse
    // (don't collapse when clicking these elements)
    else if (event.target.nodeName !== 'INPUT' &&
             event.target.type !== 'checkbox' &&
             event.target.nodeName !== 'LABEL' &&
             event.target.nodeName !== 'SPAN' &&
             event.target.nodeName !== 'A' &&
             event.target.nodeName !== 'SELECT') {

      options.fadeOut(ms);
      $(arrowClass + ' .status').fadeIn(ms);
      $(arrowClass + ' .arrow').removeClass('rotate90');

      let int = setInterval(function() {

       if (options.is(':hidden')) {

         toggleGroup.css({height: '50px'});

         clearInterval(int);
       }
      }, 100);
    }
  }

  /**
   * Updates the Enabled/Disabled status of
   * Filter By Country in the popup
   *
   * @method _setCountryUiStatus
   */

  function _setCountryUiStatus() {

    let self = $('.toggle-group.country .status');

    chrome.storage.sync.get('prefs', function(result) {

      if (result.prefs.filterByCountry === true) {

        _setEnabledStatus( self, 'Enabled' );

        // Disable the selects when the feature is enabled
        document.getElementById('filterCountryCurrency').disabled = true;
        document.getElementById('filterCountry').disabled = true;

      } else {

        _setEnabledStatus( self, 'Disabled' );
      }
    });
  }

  /**
   * Sets the enabled/disabled text status on SUBMENUS
   *
   * @method _setEnabledStatus
   * @param  {object}         target [jQ object]
   * @param  {string}         status [Enabled/Disabled]
   */

  function _setEnabledStatus(target, status) {

    let state = status === 'Enabled'
                ? target.text('Enabled').addClass('enabled').removeClass('disabled')
                : target.text('Disabled').addClass('disabled').removeClass('enabled');

    return state;
  }

  /**
   * Sets the text value/color of the Filter by Condition setting in the popup menu
   *
   * @method   _setupFilterByCondition
   * @return   {undefined}
   */

  function _setupFilterByCondition() {

    let
        setting = Number(localStorage.getItem('itemCondition')),
        status = $('.toggle-group.condition .label .status'),
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

      //self.text('Filter Items by Condition');
      status.text('Disabled').attr('class', 'status disabled');

    } else {

      status.text(conditions[setting]).attr('class', 'status ' + colors[setting]);
    }
  }

  /**
   * Toggles price comparisons
   *
   * @method   _showPrices
   * @param    {Object}   event [The event object]
   * @return   {undefined}
   */

  function _showPrices(event) {

    let response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked && userCurrency.value !== '-') {

        userCurrency.disabled = true;
        togglePrices.checked = true;
        userCurrency.className = '';

        _applySave(response, event);

      }

      else if (userCurrency.value === '-') {

        $('#notify').text('Please choose a currency from the select box first.');

        $('.notifications').css({display:'block'}).delay(2000).fadeOut('slow');

        togglePrices.checked = false;
        userCurrency.className = 'alert';
        return;

      } else {

        userCurrency.disabled = false;
        _applySave(response, event);
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

      if (result.didUpdate) {

        $('#about').text('New updates!').removeClass('button_green').addClass('button_orange');

      } else {

        $('#about').text('About').removeClass('button_orange').addClass('button_green');
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

      // if there is a saved value set the select with it
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

    let input = $('#percent'),
        self = $('.seller-rep .status'),
        toggle = toggleSellerRep;

    // checked and has value entered
    if ( input.val() && toggle.checked) {

      input.prop('disabled', true);
      toggle.disabled = false;
      input.removeClass('alert');

      // reset value to 100 if user enters a greater value
      if ( input > 100 ) { input.val(100); }

      localStorage.setItem('sellerRep', input.val());

      input.val(localStorage.getItem('sellerRep'));

      _setEnabledStatus( self, 'Enabled' );
      triggerSave();

    } else if ( input.val() && !toggle.checked ) {

      input.prop('disabled', false);

      _setEnabledStatus( self, 'Disabled' );
      triggerSave();

    } else if ( !input.val() ) {

      toggle.checked = false;
      input.addClass('alert');
    }
  }

  /**
   * Set/create the value of the Filter By Country selects based on
   * what is in localStorage
   *
   * @method setCountryFilters
   */

  function setCountryFilters() {

    let filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

    if (!filterByCountryPrefs) {

      let newPrefs = { currency: '-', country: '-' };

      localStorage.setItem('filterByCountry', JSON.stringify(newPrefs));

      filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));
    }

    // currency value
    $('#filterCountryCurrency').val(filterByCountryPrefs.currency);

    // country value
    $('#filterCountry').val(filterByCountryPrefs.country);

    _setCountryUiStatus();
  }

  /**
   * Sets the value that will hide items in the
   * Marketplace based on condition
   *
   * @method   setHiddenItems
   * @param    {Object}       event [The event object]
   */

  function setHiddenItems(event) {

    let selectValue = event.target[event.target.selectedIndex].value,
        response = 'Please refresh the page for changes to take effect.';

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

        _gaq.push(['_trackEvent', ' Marketplace Filter: ' + conditions[setting], 'Marketplace Filter']);
      }
    }

    _setupFilterByCondition();
    _applySave(response, event);
  }

  /**
   * Sets the value of the seller rep input
   * when the popup is rendered
   *
   * @method setSellerRep
   * @return {undefined}
   */

  function setSellerRep() {

    let input = $('#percent'),
        self = $('.seller-rep .status'),
        percent = localStorage.getItem('sellerRep') || null;

    if (percent !== null) { input.val(percent); }

    chrome.storage.sync.get('prefs', function(result) {

      if (result.prefs.sellerRep) {

        if (percent !== null) { input.prop('disabled', true); }

        _setEnabledStatus( self, 'Enabled' );

      } else {

        _setEnabledStatus( self, 'Disabled' );
      }
    });
  }

  /**
   * Validates then enables/disables the CSS for Filter Items by Country
   *
   * @method toggleHideCountries
   * @param  {object}            event [the event object]
   * @return {undefined}
   */

  function toggleHideCountries(event) {

    let
        country = document.getElementById('filterCountry'),
        currency = document.getElementById('filterCountryCurrency'),
        response = 'Please refresh the page for changes to take effect.';

    // If everything checks out, enable filtering
    if (validateFilterByCountry() === 'valid' && event.target.checked) {

      currency.disabled = true;
      currency.className = '';

      country.disabled = true;
      country.className = '';

      chrome.tabs.executeScript(null, {file: 'js/apply-filter-by-country-css.js'}, function() {

        _applySave(response, event);
      });

      // Delay updating the UI so that Chrome has a change to write the new preference
      setTimeout(_setCountryUiStatus, 50);
    }
    // If everything checks out, disable filtering
    else if (validateFilterByCountry() === 'valid' && !event.target.checked) {

      currency.disabled = false;
      currency.className = '';

      country.disabled = false;
      country.className = '';

      chrome.tabs.executeScript(null, {file: 'js/remove-filter-by-country-css.js'}, function() {

        _applySave(null, event);
      });

      // Delay updating the UI so that Chrome has a change to write the new preference
      setTimeout(_setCountryUiStatus, 50);
    }
    // Everything is terrible
    else if (validateFilterByCountry() === 'invalid' && event.target.checked) {

      toggleFilterByCountry.checked = false;

      currency.disabled = false;
      currency.className = 'alert';

      country.disabled = false;
      country.className = 'alert';
    }
  }

  /**
   * Toggles Marketplace highlights
   *
   * @method   toggleHighlights
   * @param    {object}         event [the event object]
   * @return   {undefined}
   */

  function toggleHighlights(event) {

    let response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/apply-highlights.js'},
        function() { _applySave(response, event); });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-highlights.js'},
        function() { _applySave(null, event); });
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

    let response = 'Please refresh the page for changes to take effect.';
    _applySave(response, event);
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
        fn: event.target.dataset.funct,
        id: event.target.id,
        method: 'create',
        name: event.target.dataset.name,
        request: 'updateContextMenu'
      });

      _applySave(null, event);

    } else {

      chrome.runtime.sendMessage({
        id: event.target.id,
        method: 'remove',
        request: 'updateContextMenu'
      });

      _applySave(null, event);
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

      chrome.tabs.executeScript(null, {file: 'js/apply-dark-theme.js'},
        function() { _applySave(null, event); });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-dark-theme.js'},
        function() { _applySave(null, event); });
    }
  }

  /**
   * Validates that a value has been set for both selects in Filter Items By Country
   *
   * @method validateFilterByCountry
   * @return {String}
   */

  function validateFilterByCountry() {

    let currency = document.getElementById('filterCountryCurrency'),
        country = document.getElementById('filterCountry');

    return currency.value !== '-' && country.value !== '-' ? 'valid' : 'invalid';
  }

  // ========================================================
  // UI Event Listeners
  // ========================================================

  // Open the about page
  $('body').on('click', '#about', function() {

    chrome.tabs.create({url: '../html/about.html'});
    _acknowledgeUpdate();

    if (_gaq) {

      _gaq.push(['_trackEvent', 'about', 'about clicked']);
    }
  });

  // Open block sellers page
  $('body').on('click', '#editList', function() {

    chrome.tabs.create({url: '../html/block-sellers.html'});
  });

  // Open readability config page
  $('body').on('click', '#editConfig', function() {

    chrome.tabs.create({url: '../html/readability.html'});
  });


  /* MARKETPLACE FEATURE SUBMENUS */
  $('.toggle-group.marketplace').click(function(event) {

    _marketplaceFeaturesToggle( $('.marketplace-features-container'), $(this), '.marketplace' );
  });


  /* CONTEXTUAL MENU SEARCHING OPTIONS */
  $('.toggle-group.menus').click(function(event) {

    _optionsToggle( $('#contextMenus'), $(this), '.menus', 180 );
  });


  /* FILTER BY CONDITION OPTIONS */
  $('.toggle-group.condition').click(function(event) {

    _optionsToggle( $('.hide-items'), $(this), '.condition', 100 );
  });


  /* FILTER ITEMS BY COUNTRY OPTIONS */
  $('.toggle-group.country').click(function(event) {

    _optionsToggle( $('.hide-country'), $(this), '.country', 105 );
  });

  // Save the Filter Items By Country currency select value to localStorage
  $('#filterCountryCurrency').change(function() {

    let filterByCountry = JSON.parse(localStorage.getItem('filterByCountry'));

    if (this.value !== '-') {

      filterByCountry.currency = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountry));
    }
  });

  // Save the Filter Items By Country country select value to localStorage
  $('#filterCountry').change(function() {

    let filterByCountry = JSON.parse(localStorage.getItem('filterByCountry'));

    if (this.value) {

      filterByCountry.country = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountry));
    }
  });


  /* SELLER REPUTATION */
  $('.toggle-group.seller-rep').click(function(event) {

    _optionsToggle( $('.hide-percentage'), $(this), '.seller-rep', 100 );
  });


  // Toggle event listeners
  hideMarketplaceItems.addEventListener('change', setHiddenItems);
  userCurrency.addEventListener('change', function(){ _applySave(null, event); });
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleConditions.addEventListener('change', toggleHighlights);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', useDarkTheme);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleFilterByCountry.addEventListener('change', toggleHideCountries);
  toggleNotesCount.addEventListener('change', triggerSave);
  toggleReadability.addEventListener('change', triggerSave);
  toggleReleaseDurations.addEventListener('change', triggerSave);
  toggleSellerRep.addEventListener('change', saveSellerRep);
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', _showPrices);

  // Contextual menus
  toggleBandcamp.addEventListener('change', updateContextualMenu);
  toggleBoomkat.addEventListener('change', updateContextualMenu);
  toggleClone.addEventListener('change', updateContextualMenu);
  toggleDecks.addEventListener('change', updateContextualMenu);
  toggleDeeJay.addEventListener('change', updateContextualMenu);
  toggleDiscogs.addEventListener('change', updateContextualMenu);
  toggleGramaphone.addEventListener('change', updateContextualMenu);
  toggleHalcyon.addEventListener('change', updateContextualMenu);
  toggleHardwax.addEventListener('change', updateContextualMenu);
  toggleInsound.addEventListener('change', updateContextualMenu);
  toggleJuno.addEventListener('change', updateContextualMenu);
  toggleKristina.addEventListener('change', updateContextualMenu);
  toggleOye.addEventListener('change', updateContextualMenu);
  togglePbvinyl.addEventListener('change', updateContextualMenu);
  togglePhonica.addEventListener('change', updateContextualMenu);
  toggleSotu.addEventListener('change', updateContextualMenu);
  toggleYoutube.addEventListener('change', updateContextualMenu);


  /**
   * Sets toggle button values when the popup is rendered
   * and calls necessary methods
   *
   * @method   init
   * @return   {undefined}
   */

  function init() {

    // Get the user's preferences and set the toggles accordingly
    chrome.storage.sync.get('prefs', function(result) {

      hideMarketplaceItems.value = localStorage.getItem('itemCondition') || '';
      toggleBlockSellers.checked = result.prefs.blockSellers;
      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleConditions.checked = result.prefs.highlightMedia;
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

    // ========================================================
    // DOM Setup
    // ========================================================

    checkForUpdate();
    getCurrency();
    _setupFilterByCondition();
    setCountryFilters();
    setSellerRep();
  }

  // Start it up
  init();
});
