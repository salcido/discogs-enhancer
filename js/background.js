/**
 *
 * DISCOGS ENHANCEMENT SUITE
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 * @discogs: https://www.discogs.com/user/mattsalcido
 *
 */

var
    darkModeElem = null,
    darkStyles = null,
    jQ = null,
    prefs = {};



/**
 *
 * Inject jQuery into DOM
 *
 */

jQ = document.createElement('script');

jQ.type = 'text/javascript';

jQ.async = true;

jQ.src = chrome.extension.getURL('js/jquery/jquery-min.js');

(document.head || document.documentElement).appendChild(jQ);



/**
 *
 * CSS Injection Section ;)
 *
 */

// create link element...
darkModeElem = document.createElement('link');

darkModeElem.rel = 'stylesheet';

darkModeElem.type = 'text/css';

darkModeElem.href = chrome.extension.getURL('css/dark-mode.css');

darkModeElem.id = 'darkModeCss';

// ...and insert it into the DOM
(document.head || document.documentElement).appendChild(darkModeElem);

darkStyles = document.getElementById(darkModeElem.id);



// Enable/disable newly inserted link element based on saved preferences
// or create the prefs object if this is the first time it's been
// run.
chrome.storage.sync.get('prefs', function(result) {

  var darkMode = null; // boolean; whether dark mode is active

  if (!result.prefs) {

    prefs = {
      darkMode: true,
      highlightMedia: true,
      sortButtons: true
      };

    chrome.storage.sync.set({prefs: prefs}, function() {

      console.log('Preferences created.');
    });
  }

  darkMode = result.prefs.darkMode;

  return darkMode === true
          ? darkStyles.removeAttribute('disabled')
          : darkStyles.setAttribute('disabled', true);
});



/**
 *
 * Highlight Sales Item Conditions
 *
 */

//Inject marketplace highlight script into DOM
function initHighlights() {

  var highlightScript = null, // js/apply-highlights.js
      highlightCss = null; // marketplace-highlights.css element


  //apply-highlights.js
  highlightScript = document.createElement('script');

  highlightScript.type = 'text/javascript';

  highlightScript.src = chrome.extension.getURL('js/apply-highlights.js');

  (document.head || document.documentElement).appendChild(highlightScript);

  // marketplace-highlights.css
  highlightCss = document.createElement('link');

  highlightCss.rel = 'stylesheet';

  highlightCss.type = 'text/css';

  highlightCss.href = chrome.extension.getURL('css/marketplace-highlights.css');

  highlightCss.id = 'mediaHighLightsCss';

  (document.head || document.documentElement).appendChild(highlightCss);
}

// Get preference setting and either call initHighlights or not
chrome.storage.sync.get('prefs', function(result) {

  var highlights = result.prefs.highlightMedia;

  return highlights === true ? initHighlights() : $.noop();
});



/**
 *
 * Sort hella stuff
 *
 */

function initSortButtons() {

  var sortMarketplaceScript = null, // js/sort-marketplace-lists.js
      sortExploreScript = null, // js/sort-explore-lists.js
      sortPersonalListsScript = null; // js/sort-personal-lists.js

  //sort-explore-lists.js
  sortExploreScript = document.createElement('script');

  sortExploreScript.type = 'text/javascript';

  sortExploreScript.src = chrome.extension.getURL('js/sort-explore-lists.js');

  (document.head || document.documentElement).appendChild(sortExploreScript);


  //sort-marketplace-lists.js
  sortMarketplaceScript = document.createElement('script');

  sortMarketplaceScript.type = 'text/javascript';

  sortMarketplaceScript.src = chrome.extension.getURL('js/sort-marketplace-lists.js');

  (document.head || document.documentElement).appendChild(sortMarketplaceScript);


  // sort-personal-lists.js
  sortPersonalListsScript = document.createElement('script');

  sortPersonalListsScript.type = 'text/javascript';

  sortPersonalListsScript.src = chrome.extension.getURL('js/sort-personal-lists.js');

  (document.head || document.documentElement).appendChild(sortPersonalListsScript);
}

// Get preference and either call initSortButtons or not.
// This is done via setTimeout because without it, there's no telling
// when the script will be appended to the DOM and sometimes the necessary
// page elements have not yet been rendered.
chrome.storage.sync.get('prefs', function(result) {

  var sortButtons = result.prefs.sortButtons;

  if (sortButtons) {

    return setTimeout(function() { initSortButtons(); }, 400);
  }
});



// dark-mode.css will override all styles.
// This will colorize the legend on the release history page.
chrome.storage.sync.get('prefs', function(result) {

  var releaseHistoryScript = null; // js/release-history-legend.js

  if (result.prefs.darkMode) {

    //release-history-legend.js
    releaseHistoryScript = document.createElement('script');

    releaseHistoryScript.type = 'text/javascript';

    releaseHistoryScript.src = chrome.extension.getURL('js/release-history-legend.js');

    (document.head || document.documentElement).appendChild(releaseHistoryScript);
  }
});
