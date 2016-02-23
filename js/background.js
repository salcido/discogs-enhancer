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
    // boolean; whether dark mode is active
    darkMode = null,

    // dark-mode.css element
    darkModeElem = null,

    // link element by id
    darkStyles = null,

    // boolean; whether media highlights are active
    highlights = null,

    // js/apply-highlights.js
    highlightScript = null,

    // marketplace-highlights.css element
    highlightsElem = null,

    // js/release-history-legend.js
    releaseHistoryScript = null,

    // boolean: whether sorting lists is active
    sortByAlpha = null,

    // js/alphabetize-explore-lists.js
    sortByAlphaScript = null,

    // js/alphabetize-marketplace-lists.js
    sortByAlphaFilterScript = null,

    // js/alphabetize-personal-lists.js
    sortPersonalListsScript = null,

    // jQuery element
    jQ = null,

    // preferences object
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

  if (!result.prefs) {

    prefs = {
      'darkMode': true,
      'highlightMedia': true,
      'alphabetize': true
      };

    chrome.storage.sync.set({'prefs': prefs}, function() {

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

  //apply-highlights.js
  highlightScript = document.createElement('script');

  highlightScript.type = 'text/javascript';

  highlightScript.src = chrome.extension.getURL('js/apply-highlights.js');

  (document.head || document.documentElement).appendChild(highlightScript);

  // marketplace-highlights.css
  highlightsElem = document.createElement('link');

  highlightsElem.rel = 'stylesheet';

  highlightsElem.type = 'text/css';

  highlightsElem.href = chrome.extension.getURL('css/marketplace-highlights.css');

  highlightsElem.id = 'mediaHighLightsCss';

  (document.head || document.documentElement).appendChild(highlightsElem);
}

// Get preference setting and either call initHighlights or not
chrome.storage.sync.get('prefs', function(result) {

  highlights = result.prefs.highlightMedia;

  return highlights === true ? initHighlights() : $.noop();
});



/**
 *
 * Sort hella stuff alphabetically 
 * 
 */

function initSortByAlpha() {

  //alphabetize-explore-lists.js
  sortByAlphaScript = document.createElement('script');

  sortByAlphaScript.type = 'text/javascript';

  sortByAlphaScript.src = chrome.extension.getURL('js/alphabetize-explore-lists.js');

  (document.head || document.documentElement).appendChild(sortByAlphaScript);

  //alphabetize-marketplace-lists.js
  sortByAlphaFilterScript = document.createElement('script');

  sortByAlphaFilterScript.type = 'text/javascript';

  sortByAlphaFilterScript.src = chrome.extension.getURL('js/alphabetize-marketplace-lists.js');

  (document.head || document.documentElement).appendChild(sortByAlphaFilterScript);

  // alphabetize-personal-lists.js
  sortPersonalListsScript = document.createElement('script');

  sortPersonalListsScript.type = 'text/javascript';

  sortPersonalListsScript.src = chrome.extension.getURL('js/alphabetize-personal-lists.js');

  (document.head || document.documentElement).appendChild(sortPersonalListsScript);
}

// Get preference and either call initSortByAlpha or not.
// This is done via setTimeout because without it, there's no telling
// when the script will be appended to the DOM and sometimes the necessary 
// page elements have not yet been rendered.
chrome.storage.sync.get('prefs', function(result) {

  sortByAlpha = result.prefs.alphabetize;

  if (sortByAlpha) {

    return setTimeout(function() { initSortByAlpha() }, 400);
  }
});



// dark-mode.css will override all styles. 
// This will colorize the legend on the release history page.
chrome.storage.sync.get('prefs', function(result) {

  if (result.prefs.darkMode) {

    //release-history-legend.js
    releaseHistoryScript = document.createElement('script');

    releaseHistoryScript.type = 'text/javascript';

    releaseHistoryScript.src = chrome.extension.getURL('js/release-history-legend.js');

    (document.head || document.documentElement).appendChild(releaseHistoryScript);
  }
});



// Show the update page
chrome.runtime.onInstalled.addListener(function(details) {

    // Might add one for 'install'
    if (details.reason === "update") {

        chrome.tabs.create({url: "html/updates.html"});
    }
});
