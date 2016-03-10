document.addEventListener('DOMContentLoaded', function () {

  var
      isHovering = false,
      prefs = {},
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleConditions = document.getElementById('toggleConditions'),
      toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleDeeJay = document.getElementById('deejay'),
      toggleDiscogs = document.getElementById('discogs'),
      toggleInsound = document.getElementById('insound'),
      toggleJuno = document.getElementById('juno'),
      toggleOye = document.getElementById('oye'),
      togglePbvinyl = document.getElementById('pbvinyl'),
      toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
      toggleSortBtns = document.getElementById('toggleSortBtns');


  /**
   * Save preferences
   */

  function saveChanges(message) {

    prefs = {
      darkTheme: toggleDarkTheme.checked,
      highlightMedia: toggleConditions.checked,
      sortButtons: toggleSortBtns.checked,
      releaseDurations: toggleReleaseDurations.checked,
      collectionUi: toggleCollectionUi.checked,
      useDeejay: toggleDeeJay.checked,
      useDiscogs: toggleDiscogs.checked,
      useInsound: toggleInsound.checked,
      useJuno: toggleJuno.checked,
      useOye: toggleOye.checked,
      usePbvinyl: togglePbvinyl.checked
      };

    chrome.storage.sync.set({prefs: prefs}, function() {

      if (message) {

        $('.notify').html(message);

        $('.notifications').removeClass('hide');
      }
    });
  }

  function didSeeUpdate(message) {

    chrome.storage.sync.set({didUpdate: false}, function() {});

    chrome.browserAction.setBadgeText({text: ''});
  }

  /**
   * Toggle dark mode on/off
   */

  function useDarkTheme(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/apply-dark-theme.js'}, function() {

        saveChanges();
      });

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'oye',
              method: 'create'
          });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-dark-theme.js'}, function() {

        saveChanges();
      });
    }
  }


  /**
   * Toggle release condition highlighting on/off
   */

  function toggleHighlights(event) {

    var response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/apply-highlights.js'}, function() {

        saveChanges(response);
      });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-highlights.js'}, function() {

        saveChanges();
      });
    }
  }


  /**
   * Toggle ability to sort genres, etc
   */

  function sortGenres(event) {

    var response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/sort-explore-lists.js'}, function() {

        saveChanges(response);
      });

    } else {

      saveChanges(response);
    }
  }


  /**
   * Toggle track totals
   */

  function trackTotals(event) {

    var response = 'Please refresh the page for changes to take effect.';

    saveChanges(response);
  }


  /**
   * Toggle better collection UI
   */

  function enableCollectionUi(event) {

    var response = 'Please refresh the page for changes to take effect.';

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/better-collection-ui.js'}, function() {

        saveChanges();
      });

    } else {

      saveChanges(response);
    }
  }


  /**
   * display contextual menu options
   */

  // function showContextMenus(event) {

  //   var
  //       contextMenus = $('#contextMenus'),
  //       interval,
  //       toggleGroup = $('.toggle-group.menus');

  //   if (event.target.checked) {

  //     toggleGroup.css({height: '95px'});

  //     interval = setInterval(function() {

  //       if (toggleGroup.height() === 95) {

  //         contextMenus.fadeIn('fast');

  //         clearInterval(interval);
  //       }
  //     }, 100);

  //   } else {

  //     contextMenus.fadeOut('fast');

  //     interval = setInterval(function() {

  //       if (contextMenus.is(':hidden')) {

  //         toggleGroup.css({height: '25px'});

  //         clearInterval(interval);
  //       }
  //     }, 100);
  //   }
  // }

  $('.toggle-group.menus').mouseenter(function() {

    var
        contextMenus = $('#contextMenus'),
        interval,
        toggleGroup = $('.toggle-group.menus');

    isHovering = true;

    setTimeout(function() {

      if (isHovering) {

        $(this).css({height: '95px'});
      }
    }.bind(this), 300);

    interval = setInterval(function() {

      if (toggleGroup.height() === 95) {

        contextMenus.fadeIn('fast');

        clearInterval(interval);
      }
    }, 100);

  });

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

  /**
   * Contexual menu functions
   */

  function useDeeJay(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'deejay',
              method: 'create'
          });

      saveChanges();

    } else {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'deejay',
              method: 'remove'
          });

      saveChanges();
    }
  }

  function useDiscogs(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'discogs',
              method: 'create'
          });

      saveChanges();

    } else {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'discogs',
              method: 'remove'
          });

      saveChanges();
    }
  }


  function useInsound(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'insound',
              method: 'create'
          });

      saveChanges();

    } else {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'insound',
              method: 'remove'
          });

      saveChanges();
    }
  }

  function useJuno(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'juno',
              method: 'create'
          });

      saveChanges();

    } else {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'juno',
              method: 'remove'
          });

      saveChanges();
    }
  }

  function useOye(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'oye',
              method: 'create'
          });

      saveChanges();

    } else {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'oye',
              method: 'remove'
          });

      saveChanges();
    }
  }

  function usePbvinyl(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'pbvinyl',
              method: 'create'
          });

      saveChanges();

    } else {

      chrome.runtime.sendMessage({
              request: 'updateContextMenu',
              id: 'pbvinyl',
              method: 'remove'
          });

      saveChanges();
    }
  }

  // Event listeners on toggles
  toggleCollectionUi.addEventListener('change', enableCollectionUi);
  toggleConditions.addEventListener('change', toggleHighlights);
  toggleDarkTheme.addEventListener('change', useDarkTheme);
  toggleDeeJay.addEventListener('change', useDeeJay);
  toggleDiscogs.addEventListener('change', useDiscogs);
  toggleInsound.addEventListener('change', useInsound);
  toggleJuno.addEventListener('change', useJuno);
  toggleOye.addEventListener('change', useOye);
  togglePbvinyl.addEventListener('change', usePbvinyl);
  toggleReleaseDurations.addEventListener('change', trackTotals);
  toggleSortBtns.addEventListener('change', sortGenres);

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
   * Open about page.
   */

  $('body').on('click', '#about', function() {

    chrome.tabs.create({url: '../html/about.html'});

    didSeeUpdate();
  });


  /**
   * Get stored preferences for extension menu
   */

  function init() {

    chrome.storage.sync.get('prefs', function(result) {

      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleConditions.checked = result.prefs.highlightMedia;
      toggleDarkTheme.checked = result.prefs.darkTheme;
      toggleDeeJay.checked = result.prefs.useDeejay;
      toggleDiscogs.checked = result.prefs.useDiscogs;
      toggleInsound.checked = result.prefs.useInsound;
      toggleJuno.checked = result.prefs.useJuno;
      toggleOye.checked = result.prefs.useOye;
      togglePbvinyl.checked = result.prefs.usePbvinyl;
      toggleReleaseDurations.checked = result.prefs.releaseDurations;
      toggleSortBtns.checked = result.prefs.sortButtons;
    });

    checkForUpdate();
  }

  // Start it up
  init();
});
