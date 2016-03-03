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
    elems = [],
    fragment = null,
    jQ = null,
    prefs = {};


// Create jQuery object
jQ = document.createElement('script');

jQ.type = 'text/javascript';

jQ.async = true;

jQ.src = chrome.extension.getURL('js/jquery/jquery-min.js');

// Push into our array
elems.push(jQ);

// create dark theme css element...
darkModeElem = document.createElement('link');

darkModeElem.rel = 'stylesheet';

darkModeElem.type = 'text/css';

darkModeElem.href = chrome.extension.getURL('css/dark-mode.css');

darkModeElem.id = 'darkModeCss';

// Push into our array
elems.push(darkModeElem);

// Append to DOM
fragment = document.createDocumentFragment();

elems.forEach(function(elm) {

  fragment.appendChild(elm);
});

(document.head || document.documentElement).appendChild(fragment.cloneNode(true));



// Enable/disable newly inserted link element based on saved preferences
// or create the prefs object if this is the first time it's been
// run.

darkStyles = document.getElementById(darkModeElem.id);

chrome.storage.sync.get('prefs', function(result) {

  var darkMode = null; // boolean; whether dark mode is active

  if (!result.prefs) {

    prefs = {
      darkMode: true,
      highlightMedia: true,
      sortButtons: true,
      releaseDurations: true
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

  var
      highlightElems = [],
      highlightCss = null, // marketplace-highlights.css element
      highlightFrag = null,
      highlightScript = null; // js/apply-highlights.js


  //apply-highlights.js
  highlightScript = document.createElement('script');

  highlightScript.type = 'text/javascript';

  highlightScript.src = chrome.extension.getURL('js/apply-highlights.js');

  highlightElems.push(highlightScript);


  // marketplace-highlights.css
  highlightCss = document.createElement('link');

  highlightCss.rel = 'stylesheet';

  highlightCss.type = 'text/css';

  highlightCss.href = chrome.extension.getURL('css/marketplace-highlights.css');

  highlightCss.id = 'mediaHighLightsCss';

  highlightElems.push(highlightCss);


  // Append to DOM
  highlightFrag = document.createDocumentFragment();

  highlightElems.forEach(function(elm) {

    highlightFrag.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(highlightFrag.cloneNode(true));
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

  var
      sortElems = [],
      sortFragment = null,
      sortMarketplaceScript = null, // js/sort-marketplace-lists.js
      sortExploreScript = null, // js/sort-explore-lists.js
      sortPersonalListsScript = null; // js/sort-personal-lists.js

  //sort-explore-lists.js
  sortExploreScript = document.createElement('script');

  sortExploreScript.type = 'text/javascript';

  sortExploreScript.src = chrome.extension.getURL('js/sort-explore-lists.js');

  sortElems.push(sortExploreScript);


  //sort-marketplace-lists.js
  sortMarketplaceScript = document.createElement('script');

  sortMarketplaceScript.type = 'text/javascript';

  sortMarketplaceScript.src = chrome.extension.getURL('js/sort-marketplace-lists.js');

  sortElems.push(sortMarketplaceScript);


  // sort-personal-lists.js
  sortPersonalListsScript = document.createElement('script');

  sortPersonalListsScript.type = 'text/javascript';

  sortPersonalListsScript.src = chrome.extension.getURL('js/sort-personal-lists.js');

  sortElems.push(sortPersonalListsScript);


  // Append to DOM
  sortFragment = document.createDocumentFragment();

  sortElems.forEach(function(elm) {

    sortFragment.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(sortFragment.cloneNode(true));
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



// Display release durations
chrome.storage.sync.get('prefs', function(result) {

  var releaseDurations = null; // js/release-durations.js

  if (result.prefs.releaseDurations) {

    releaseDurations = document.createElement('script');

    releaseDurations.type = 'text/javascript';

    releaseDurations.src = chrome.extension.getURL('js/release-durations.js');

    (document.head || document.documentElement).appendChild(releaseDurations);
  }
});
