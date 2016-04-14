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

  var
      userCurrency = document.getElementById('currency'),
      isHovering = false,
      prefs = {},
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleConditions = document.getElementById('toggleConditions'),
      toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
      toggleSortBtns = document.getElementById('toggleSortBtns'),
      togglePrices = document.getElementById('togglePrices'),

      // Contextual menus
      toggleBandcamp = document.getElementById('bandcamp'),
      toggleBoomkat = document.getElementById('boomkat'),
      toggleClone = document.getElementById('clone'),
      toggleDeeJay = document.getElementById('deejay'),
      toggleDiscogs = document.getElementById('discogs'),
      toggleGramaphone = document.getElementById('gramaphone'),
      toggleHalcyon = document.getElementById('halcyon'),
      toggleHardwax = document.getElementById('hardwax'),
      toggleInsound = document.getElementById('insound'),
      toggleJuno = document.getElementById('juno'),
      toggleOye = document.getElementById('oye'),
      togglePbvinyl = document.getElementById('pbvinyl');


  // Clears the update notifications
  function acknowledgeUpdate(message) {

    chrome.storage.sync.set({didUpdate: false}, function() {});

    chrome.browserAction.setBadgeText({text: ''});
  }


  // Save preferences
  function saveChanges(message, event) {

    prefs = {
      userCurrency: userCurrency.value,
      darkTheme: toggleDarkTheme.checked,
      highlightMedia: toggleConditions.checked,
      sortButtons: toggleSortBtns.checked,
      releaseDurations: toggleReleaseDurations.checked,
      collectionUi: toggleCollectionUi.checked,
      suggestedPrices: togglePrices.checked,

      // Contextual menus
      useBandcamp: toggleBandcamp.checked,
      useBoomkat: toggleBoomkat.checked,
      useClone: toggleClone.checked,
      useDeejay: toggleDeeJay.checked,
      useDiscogs: toggleDiscogs.checked,
      useGramaphone: toggleGramaphone.checked,
      useHalcyon: toggleHalcyon.checked,
      useHardwax: toggleHardwax.checked,
      useInsound: toggleInsound.checked,
      useJuno: toggleJuno.checked,
      useOye: toggleOye.checked,
      usePbvinyl: togglePbvinyl.checked
    };

    chrome.storage.sync.set({prefs: prefs}, function() {

      if (message) {

        $('#notify').html(message);

        $('.notifications').removeClass('hide');
      }
    });

     // Google Analyitcs
    _gaq.push(['_trackEvent', event.target.id, event.target.id + ' : ' +
               (event.target.checked || event.target[event.target.selectedIndex].value)]);
  }


  // Toggle dark mode on/off
  function useDarkTheme(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/apply-dark-theme.js'}, function() {

        saveChanges(null, event);
      });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-dark-theme.js'}, function() {

        saveChanges(null, event);
      });
    }
  }


  // Toggle release condition highlighting on/off
  function toggleHighlights(event) {

    var response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/apply-highlights.js'}, function() {

        saveChanges(response, event);
      });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-highlights.js'}, function() {

        saveChanges(null, event);
      });
    }
  }


  // Toggle ability to sort genres, etc
  function sortGenres(event) {

    var response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/sort-explore-lists.js'}, function() {

        saveChanges(response, event);
      });

    } else {

      saveChanges(response, event);
    }
  }


  // Toggle track totals
  function trackTotals(event) {

    var response = 'Please refresh the page for changes to take effect.';

    saveChanges(response, event);
  }


  // Toggle better collection UI
  function enableCollectionUi(event) {

    var response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/better-collection-ui.js'}, function() {

        saveChanges(null, event);
      });

    } else {

      saveChanges(response, event);
    }
  }


  // Toggle prices suggestions
  function showPrices(event) {

    var response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked && userCurrency.value !== '-') {

        userCurrency.disabled = true;

        togglePrices.checked = true;

        userCurrency.className = '';

        saveChanges(response, event);

      } else if (userCurrency.value === '-') {

        $('#notify').html('Please choose a currency from the select box first.');

        $('.notifications').show();

        togglePrices.checked = false;

        userCurrency.className = 'alert';

        return;

      } else {

      userCurrency.disabled = false;

      saveChanges(response, event);
    }
  }


  // Get/Save currency preferences
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

  // Saves user currency
  function setCurrency(event) {

    saveChanges(null, event);
  }


  // Display contextual menu options on hover
  $('.toggle-group.menus').mouseenter(function() {

    var
        contextMenus = $('#contextMenus'),
        interval,
        toggleGroup = $('.toggle-group.menus');

    isHovering = true;

    setTimeout(function() {

      if (isHovering) {

        $(this).css({height: '125px'});
      }
    }.bind(this), 300);

    interval = setInterval(function() {

      if (toggleGroup.height() >= 120) {

        contextMenus.fadeIn('fast');

        clearInterval(interval);
      }
    }, 100);

  });


  // Hide contextual menu options on mouseleave
  $('.toggle-group.menus').mouseleave(function() {

    var
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


  // Create/remove contextual menus
  function updateMenu(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
        fn: event.target.dataset.funct,
        id: event.target.id,
        method: 'create',
        name: event.target.dataset.name,
        request: 'updateContextMenu'
      });

      saveChanges(null, event);

    } else {

      chrome.runtime.sendMessage({
        id: event.target.id,
        method: 'remove',
        request: 'updateContextMenu'
      });

      saveChanges(null, event);
    }
  }

  // Toggle event listeners
  userCurrency.addEventListener('change', setCurrency);
  toggleCollectionUi.addEventListener('change', enableCollectionUi);
  toggleConditions.addEventListener('change', toggleHighlights);
  toggleDarkTheme.addEventListener('change', useDarkTheme);
  toggleReleaseDurations.addEventListener('change', trackTotals);
  toggleSortBtns.addEventListener('change', sortGenres);
  togglePrices.addEventListener('change', showPrices);

  // Contextual menus
  toggleBandcamp.addEventListener('change', updateMenu);
  toggleBoomkat.addEventListener('change', updateMenu);
  toggleClone.addEventListener('change', updateMenu);
  toggleDeeJay.addEventListener('change', updateMenu);
  toggleDiscogs.addEventListener('change', updateMenu);
  toggleGramaphone.addEventListener('change', updateMenu);
  toggleHalcyon.addEventListener('change', updateMenu);
  toggleHardwax.addEventListener('change', updateMenu);
  toggleInsound.addEventListener('change', updateMenu);
  toggleJuno.addEventListener('change', updateMenu);
  toggleOye.addEventListener('change', updateMenu);
  togglePbvinyl.addEventListener('change', updateMenu);


  function checkForUpdate() {

    chrome.storage.sync.get('didUpdate', function(result) {

      if (result.didUpdate) {

        $('#about').text('New updates!').removeClass('button_green').addClass('button_orange');

      } else {

        $('#about').text('About').removeClass('button_orange').addClass('button_green');
      }
    });
  }


  // Open the about page
  $('body').on('click', '#about', function() {

    chrome.tabs.create({url: '../html/about.html'});

    acknowledgeUpdate();
  });


  // Get stored preferences for extension menu
  function init() {

    chrome.storage.sync.get('prefs', function(result) {

      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleConditions.checked = result.prefs.highlightMedia;
      toggleDarkTheme.checked = result.prefs.darkTheme;
      toggleReleaseDurations.checked = result.prefs.releaseDurations;
      toggleSortBtns.checked = result.prefs.sortButtons;
      togglePrices.checked = result.prefs.suggestedPrices;

      // Contextual menus
      toggleBandcamp.checked = result.prefs.useBandcamp;
      toggleBoomkat.checked = result.prefs.useBoomkat;
      toggleClone.checked = result.prefs.useClone;
      toggleDeeJay.checked = result.prefs.useDeejay;
      toggleDiscogs.checked = result.prefs.useDiscogs;
      toggleGramaphone.checked = result.prefs.useGramaphone;
      toggleHalcyon.checked = result.prefs.useHalcyon;
      toggleHardwax.checked = result.prefs.useHardwax;
      toggleInsound.checked = result.prefs.useInsound;
      toggleJuno.checked = result.prefs.useJuno;
      toggleOye.checked = result.prefs.useOye;
      togglePbvinyl.checked = result.prefs.usePbvinyl;
    });

    checkForUpdate();

    getCurrency();
  }

  // Start it up
  init();
});
