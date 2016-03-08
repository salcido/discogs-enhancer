document.addEventListener('DOMContentLoaded', function () {

  var toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleConditions = document.getElementById('toggleConditions'),
      toggleSortBtns = document.getElementById('toggleSortBtns'),
      toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      prefs = {};

  /**
   * Save preferences
   */

  function saveChanges(message) {

    prefs = {
      darkTheme: toggleDarkTheme.checked,
      highlightMedia: toggleConditions.checked,
      sortButtons: toggleSortBtns.checked,
      releaseDurations: toggleReleaseDurations.checked,
      collectionUi: toggleCollectionUi.checked
      };

    chrome.storage.sync.set({prefs: prefs}, function() {

      if (message) {

        $('.notify').html(message);

        $('.notifications').removeClass('hide');
      }
    });
  }

  /**
   * Toggle dark mode on/off
   */

  function useDarkTheme(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/apply-dark-theme.js'}, function() {

        saveChanges();
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

  // Event listeners on toggles
  toggleDarkTheme.addEventListener('change', useDarkTheme);

  toggleConditions.addEventListener('change', toggleHighlights);

  toggleSortBtns.addEventListener('change', sortGenres);

  toggleReleaseDurations.addEventListener('change', trackTotals);

  toggleCollectionUi.addEventListener('change', enableCollectionUi);

  /**
   * Open about page.
   */
  $('body').on('click', '#about', function() {

    chrome.tabs.create({url: '../html/about.html'});
  });

  /**
   * Get stored preferences for extension menu
   */

  function init() {

    chrome.storage.sync.get('prefs', function(result) {

      toggleDarkTheme.checked = result.prefs.darkTheme;

      toggleConditions.checked = result.prefs.highlightMedia;

      toggleSortBtns.checked = result.prefs.sortButtons;

      toggleReleaseDurations.checked = result.prefs.releaseDurations;

      toggleCollectionUi.checked = result.prefs.collectionUi;
    });
  }

  // Start it up
  init();
});
