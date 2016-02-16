document.addEventListener('DOMContentLoaded', function () {

  var toggleDarkMode = document.getElementById('toggleDarkMode'),
      toggleConditions = document.getElementById('toggleConditions'),
      toggleAlphas = document.getElementById('toggleAlphas'),
      notify = document.getElementById('notify'),
      prefs = {};


  /**
   * Save preferences
   */

  function saveChanges(message) {

    message = message || '';

    prefs = {
      'darkMode': toggleDarkMode.checked,
      'highlightMedia': toggleConditions.checked,
      'alphabetize': toggleAlphas.checked
      };

    chrome.storage.sync.set({'prefs': prefs}, function() {

      notify.innerHTML = message;
    });
  }


  /**
   * Toggle dark mode on/off
   */

  function toggleDarkness(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/apply-dark-mode.js'}, function() {

        saveChanges();
      });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/remove-dark-mode.js'}, function() {

        saveChanges();
      });
    }
  }


  /**
   * Toggle release condition highlighting on/off
   */

  function toggleHighlights(event) {

    var response = 'Please refresh the page for changes to take effect';

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

      chrome.tabs.executeScript(null, {file: 'js/alphabetize-lists.js'}, function() {
        
        saveChanges(response);
      });

    } else {

      saveChanges(response);
    }
  }


  /**
   * Get stored preferences for extension menu
   */

  function init() {

    chrome.storage.sync.get('prefs', function(result) {

      toggleDarkMode.checked = result['prefs']['darkMode'];

      toggleConditions.checked = result['prefs']['highlightMedia'];

      toggleAlphas.checked = result['prefs']['alphabetize'];
    });
  }


  // Start it up
  init();


  // Event listeners on toggles
  toggleDarkMode.addEventListener('change', toggleDarkness);

  toggleConditions.addEventListener('change', toggleHighlights);

  toggleAlphas.addEventListener('change', sortGenres);


  // Show credits
  $('#showCredits').on('click', function() {

    $('.credits').toggleClass('hide');
  })
});
