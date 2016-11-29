/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', function () {

  let
      chromeVer = (/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1],
      userCurrency = document.getElementById('currency'),
      isHovering = false,
      isMarketplaceHovering = false,
      isCountryHovering = false,
      prefs = {},
      hideMarketplaceItems = document.getElementById('marketplaceItems'),
      toggleBlockSellers = document.getElementById('toggleBlockSellers'),
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleConditions = document.getElementById('toggleConditions'),
      toggleConverter = document.getElementById('toggleConverter'),
      toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleFeedback = document.getElementById('toggleFeedback'),
      toggleEverlastingMarket = document.getElementById('toggleEverlastingMarket'),
      toggleNotesCount = document.getElementById('toggleNotesCount'),
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
      formatShortcuts: toggleShortcuts.checked,
      blockSellers: toggleBlockSellers.checked,
      highlightMedia: toggleConditions.checked,
      hideMarketplaceItems: hideMarketplaceItems.value,
      notesCount: toggleNotesCount.checked,
      sortButtons: toggleSortBtns.checked,
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

        $('.notifications').removeClass('hide');
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
   * Checks extension for any recent updates
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

      if (result.prefs.userCurrency) {

        userCurrency.value = result.prefs.userCurrency;

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
   * Hides items in the Marketplace
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

    setupMarketplaceFilter();

    applySave(response, event);
  }

  /**
   * Sets the text value/color of the Marketplace filter in the popup menu
   *
   * @method   setupMarketplaceFilter
   * @return   {undefined}
   */

  function setupMarketplaceFilter() {

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

        colors = ['#ff0000', '#e54803', '#d87307', '#f6bf48', '#85ab11', '#00db1f', '#00dbb4', '#00b4db'];

    if (setting === 0 || setting === null) {

      $('.toggle-group.marketplace .label').html('Filter Items by Condition: &nbsp; <span style="color:white;">Disabled</span>');

    } else {

      $('.toggle-group.marketplace .label').html('Filter Items Below: &nbsp; <span style="color:'+ colors[setting] + ';">' + conditions[setting] + '</span>');
    }
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

      } else if (userCurrency.value === '-') {

        $('#notify').text('Please choose a currency from the select box first.');

        $('.notifications').show();

        togglePrices.checked = false;

        userCurrency.className = 'alert';

        return;

      } else {

      userCurrency.disabled = false;

      applySave(response, event);
    }
  }


  /**
   * Saves the user's currency
   *
   * @method   setCurrency
   * @param    {Object}    event [The event object]
   */

  function setCurrency(event) {

    applySave(null, event);
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
   *
   * //////////////////////////////
   * Event listeners
   * //////////////////////////////
   *
   */

  // Toggle event listeners
  hideMarketplaceItems.addEventListener('change', setHiddenItems);
  userCurrency.addEventListener('change', setCurrency);
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleConditions.addEventListener('change', toggleHighlights);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', useDarkTheme);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleNotesCount.addEventListener('change', triggerSave);
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
   *
   * //////////////////////////////
   * UI functions
   * //////////////////////////////
   *
   */

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

  /**
   * CONTEXTUAL MENU OPTIONS
   */

  // Display contextual menu options on hover
  $('.toggle-group.menus').mouseenter(function() {

    let
        contextMenus = $('#contextMenus'),
        interval,
        toggleGroup = $('.toggle-group.menus');

    isHovering = true;

    setTimeout(() => {

      if (isHovering) {

        $(this).css({height: '155px'});
      }
    }, 400);

    interval = setInterval(function() {

      if (toggleGroup.height() >= 145) {

        contextMenus.fadeIn('fast');

        clearInterval(interval);
      }
    }, 100);

  });

  // Hide contextual menu options on mouseleave
  $('.toggle-group.menus').mouseleave(function() {

    let
        contextMenus = $('#contextMenus'),
        interval,
        toggleGroup = $('.toggle-group.menus');

    contextMenus.fadeOut('fast');

    isHovering = false;

    interval = setInterval(function() {

      if (contextMenus.is(':hidden')) {

        toggleGroup.css({height: '25px'});

        clearInterval(interval);
      }
    }, 100);
  });

  /**
   * MARKETPLACE FILTER BY CONDITION OPTIONS
   */

  // Display marketplace filter option on hover
  $('.toggle-group.marketplace').mouseenter(function() {

    let
        filter = $('.hide-items'),
        interval,
        toggleGroup = $('.toggle-group.marketplace');

    isMarketplaceHovering = true;

    setTimeout(() => {

      if (isMarketplaceHovering) {

        $(this).css({height: '75px'});
      }
    }, 400);

    interval = setInterval(function() {

      if (toggleGroup.height() >= 70) {

        filter.fadeIn('fast');

        clearInterval(interval);
      }
    }, 100);

  });

  // Hide marketplace filter option on mouseleave
  $('.toggle-group.marketplace').mouseleave(function() {

    let
        filter = $('.hide-items'),
        interval,
        toggleGroup = $('.toggle-group.marketplace');

    filter.fadeOut('fast');

    isMarketplaceHovering = false;

    interval = setInterval(function() {

      if (filter.is(':hidden')) {

        toggleGroup.css({height: '25px'});

        clearInterval(interval);
      }
    }, 100);
  });

  /**
   * MARKETPLACE FILTER BY COUNTRY OPTIONS
   */

  // Display country filter option on hover
  $('.toggle-group.country').mouseenter(function() {

    let
        filter = $('.hide-country'),
        interval,
        toggleGroup = $('.toggle-group.country');

    isCountryHovering = true;

    setTimeout(() => {

      if (isCountryHovering) {

        $(this).css({height: '85px'});
      }
    }, 400);

    interval = setInterval(function() {

      if (toggleGroup.height() >= 80) {

        filter.fadeIn('fast');

        clearInterval(interval);
      }
    }, 100);

  });

  // Hide country filter option on mouseleave
  $('.toggle-group.country').mouseleave(function() {

    let
        filter = $('.hide-country'),
        interval,
        toggleGroup = $('.toggle-group.country');

    filter.fadeOut('fast');

    isCountryHovering = false;

    interval = setInterval(function() {

      if (filter.is(':hidden')) {

        toggleGroup.css({height: '25px'});

        clearInterval(interval);
      }
    }, 100);
  });

  /**
   * Sets toggle button values when the popup is rendered
   * and calls necessary methods
   *
   * @method   init
   * @return   {undefined}
   */

  function init() {

    chrome.storage.sync.get('prefs', function(result) {

      hideMarketplaceItems.value = localStorage.getItem('itemCondition') || '';
      toggleBlockSellers.checked = result.prefs.blockSellers;
      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleConditions.checked = result.prefs.highlightMedia;
      toggleConverter.checked = result.prefs.converter;
      toggleDarkTheme.checked = result.prefs.darkTheme;
      toggleEverlastingMarket.checked = result.prefs.everlastingMarket;
      toggleFeedback.checked = result.prefs.feedback;
      toggleNotesCount.checked = result.prefs.notesCount;
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

    setupMarketplaceFilter();
  }

  // Start it up
  init();
});
