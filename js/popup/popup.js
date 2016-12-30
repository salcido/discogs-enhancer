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

  /**
   * Clears the update notification
   * @method   acknowledgeUpdate
   * @param    {string}          message [The message displayed to the user]
   * @return   {undefined}
   */

  function acknowledgeUpdate(message) {

    chrome.storage.sync.set({didUpdate: false}, function() {});

    chrome.browserAction.setBadgeText({text: ''});
  }


  /**
   * Saves the users preferences
   *
   * @method   applySave
   * @param    {String}  message [The message displayed to the user]
   * @param    {Object}  event   [The event object]
   * @return   {undefined}
   */

  function applySave(message, event) {

    let manifest = chrome.runtime.getManifest();

    prefs = {
      userCurrency: userCurrency.value,
      converter: toggleConverter.checked,
      darkTheme: toggleDarkTheme.checked,
      everlastingMarket: toggleEverlastingMarket.checked,
      feedback: toggleFeedback.checked,
      filterByCountry: toggleFilterByCountry.checked,
      formatShortcuts: toggleShortcuts.checked,
      blockSellers: toggleBlockSellers.checked,
      highlightMedia: toggleConditions.checked,
      hideMarketplaceItems: hideMarketplaceItems.value,
      notesCount: toggleNotesCount.checked,
      sortButtons: toggleSortBtns.checked,
      readability: toggleReadability.checked,
      releaseDurations: toggleReleaseDurations.checked,
      collectionUi: toggleCollectionUi.checked,
      suggestedPrices: togglePrices.checked,

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
   * Displays the options in the popup menu
   *
   * @method optionsToggle
   * @param  {object}    options     [the DOM element to display]
   * @param  {object}    toggleGroup [the actual feature in the popup menu]
   * @param  {number}    height      [the height that `target` will expand to]
   * @return {undefined}
   */

  function optionsToggle(options, toggleGroup, height) {

    // Check the current height and either expand or collapse it
    if (toggleGroup.height() == 25) {

      toggleGroup.css({height: height + 'px'});

      let int = setInterval(function() {

        if (toggleGroup.height() >= (height - 10)) {

          options.fadeIn('fast');

          clearInterval(int);
        }
      }, 100);
    }
    // collapse
    else if (event.target.nodeName !== 'INPUT' &&
             event.target.type !== 'checkbox' &&
             event.target.nodeName !== 'LABEL' &&
             event.target.nodeName !== 'SPAN' &&
             event.target.nodeName !== 'SELECT') {

      options.fadeOut('fast');

      let int = setInterval(function() {

       if (options.is(':hidden')) {

         toggleGroup.css({height: '25px'});

         clearInterval(int);
       }
      }, 100);
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

    setCountryUiStatus();
  }


  /**
   * Updates the Enabled/Disabled status of
   * Filter By Country in the popup
   *
   * @method setCountryUiStatus
   */

  function setCountryUiStatus() {

    chrome.storage.sync.get('prefs', function(result) {

      if (result.prefs.filterByCountry === true) {

        $('.toggle-group.country .label').html('Filter Items by Country: &nbsp; <span style="color:#00db1f;">Enabled</span>');

        // Disable the selects when the feature is enabled
        document.getElementById('filterCountryCurrency').disabled = true;
        document.getElementById('filterCountry').disabled = true;

      } else {

        $('.toggle-group.country .label').html('Filter Items by Country: &nbsp; <span style="color:#FFFFFF;">Disabled</span>');
      }
    });
  }


  /**
   * Sets the text value/color of the Filter by Condition setting in the popup menu
   *
   * @method   setupFilterByCondition
   * @return   {undefined}
   */

  function setupFilterByCondition() {

    let
        setting = Number(localStorage.getItem('itemCondition')),

        conditions = ['Poor (P)',
                      'Fair (F)',
                      'Good (G)',
                      'Good Plus (G+)',
                      'Very Good (VG)',
                      'Very Good Plus (VG+)',
                      'Near Mint (NM/M-)',
                      'Mint (M)'],

        colors = ['#ff0000', // poor
                  '#e54803', // fair
                  '#d87307', // good
                  '#f6bf48', // good plus
                  '#85ab11', // very good
                  '#00db1f', // very good plus
                  '#00dbb4', //near mint
                  '#00b4db']; // mint

    if (setting === 0 || setting === null) {

      $('.toggle-group.condition .label').html('Filter Items by Condition: &nbsp; <span style="color:white;">Disabled</span>');

    } else {

      $('.toggle-group.condition .label').html('Filter Items Below: &nbsp; <span style="color:'+ colors[setting] + ';">' + conditions[setting] + '</span>');
    }
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

    setupFilterByCondition();
    applySave(response, event);
  }


  /**
   * Toggles price comparisons
   *
   * @method   showPrices
   * @param    {Object}   event [The event object]
   * @return   {undefined}
   */

  function showPrices(event) {

    let response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked && userCurrency.value !== '-') {

        userCurrency.disabled = true;
        togglePrices.checked = true;
        userCurrency.className = '';

        applySave(response, event);

      }

    else if (userCurrency.value === '-') {

        $('#notify').text('Please choose a currency from the select box first.');

        $('.notifications').css({display:'block'}).delay(2000).fadeOut('slow');

        togglePrices.checked = false;
        userCurrency.className = 'alert';

        return;

      } else {

      userCurrency.disabled = false;

      applySave(response, event);
    }
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

        applySave(response, event);
      });

      // Delay updating the UI so that Chrome has a change to write the new preference
      setTimeout(function() { setCountryUiStatus(); }, 50);
    }
    // If everything checks out, disable filtering
    else if (validateFilterByCountry() === 'valid' && !event.target.checked) {

      currency.disabled = false;
      currency.className = '';

      country.disabled = false;
      country.className = '';

      chrome.tabs.executeScript(null, {file: 'js/remove-filter-by-country-css.js'}, function() {

        applySave(null, event);
      });

      // Delay updating the UI so that Chrome has a change to write the new preference
      setTimeout(function() { setCountryUiStatus(); }, 50);
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

      chrome.tabs.executeScript(null, {file: 'js/apply-highlights.js'}, function() {

        applySave(response, event);
      });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-highlights.js'}, function() {

        applySave(null, event);
      });
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

    applySave(response, event);
  }


  /**
   * Creates/removes contextual menu items
   *
   * @method   updateMenu
   * @param    {Object}   event [The event object]
   * @return   {undefined}
   */

  function updateMenu(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
        fn: event.target.dataset.funct,
        id: event.target.id,
        method: 'create',
        name: event.target.dataset.name,
        request: 'updateContextMenu'
      });

      applySave(null, event);

    } else {

      chrome.runtime.sendMessage({
        id: event.target.id,
        method: 'remove',
        request: 'updateContextMenu'
      });

      applySave(null, event);
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

      chrome.tabs.executeScript(null, {file: 'js/apply-dark-theme.js'}, function() {

        applySave(null, event);
      });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-dark-theme.js'}, function() {

        applySave(null, event);
      });
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
  // UI Functionality
  // ========================================================

  // Open the about page
  $('body').on('click', '#about', function() {

    chrome.tabs.create({url: '../html/about.html'});

    acknowledgeUpdate();

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


  /**
   * CONTEXTUAL MENU SEARCHING OPTIONS
   */

  $('.toggle-group.menus').click(function(event) {

    optionsToggle( $('#contextMenus'), $('.toggle-group.menus'), 155 );
  });


  /**
   * FILTER BY CONDITION OPTIONS
   */

  $('.toggle-group.condition').click(function(event) {

    optionsToggle( $('.hide-items'), $('.toggle-group.condition'), 75 );
  });


  /**
   * FILTER ITEMS BY COUNTRY OPTIONS
   */

  $('.toggle-group.country').click(function(event) {

    optionsToggle( $('.hide-country'), $('.toggle-group.country'), 85 );
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


  // ========================================================
  // Event listeners
  // ========================================================

  // Toggle event listeners
  hideMarketplaceItems.addEventListener('change', setHiddenItems);
  userCurrency.addEventListener('change', function(){ applySave(null, event); });
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
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', showPrices);

  // Contextual menus
  toggleBandcamp.addEventListener('change', updateMenu);
  toggleBoomkat.addEventListener('change', updateMenu);
  toggleClone.addEventListener('change', updateMenu);
  toggleDecks.addEventListener('change', updateMenu);
  toggleDeeJay.addEventListener('change', updateMenu);
  toggleDiscogs.addEventListener('change', updateMenu);
  toggleGramaphone.addEventListener('change', updateMenu);
  toggleHalcyon.addEventListener('change', updateMenu);
  toggleHardwax.addEventListener('change', updateMenu);
  toggleInsound.addEventListener('change', updateMenu);
  toggleJuno.addEventListener('change', updateMenu);
  toggleKristina.addEventListener('change', updateMenu);
  toggleOye.addEventListener('change', updateMenu);
  togglePbvinyl.addEventListener('change', updateMenu);
  togglePhonica.addEventListener('change', updateMenu);
  toggleSotu.addEventListener('change', updateMenu);
  toggleYoutube.addEventListener('change', updateMenu);


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
    setupFilterByCondition();
    setCountryFilters();
  }

  // Start it up
  init();
});
