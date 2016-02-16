/**
 * 
 * DISCOGS ENHANCEMENT SUITE V 1.0
 * @author:  Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 * @discogs: https://www.discogs.com/user/mattsalcido
 * 
 */

var darkMode = null, // boolean; whether dark mode is active
    darkModeElem = null, // dark-mode.css element
    darkStyles = null, // link element by id
    highlights = null, // boolean; whether media highlights are active
    highlightScript = null, // js/apply-highlights.js
    highlightsElem = null, // marketplace-highlights.css element
    sortByAlpha = null, // boolean: whether sorting lists is active
    sortByAlphaScript = null, // js/alphabetize-lists.js
    jQ = null, // jQuery element
    prefs = {}; // preferences object
    

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

//Inject marketplace highlight scripts into DOM
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
 * Sort lists alphabetically 
 * 
 */

function initSortByAlpha() {

  //alphabetize-lists.js
  sortByAlphaScript = document.createElement('script');

  sortByAlphaScript.type = 'text/javascript';

  sortByAlphaScript.src = chrome.extension.getURL('js/alphabetize-lists.js');

  (document.head || document.documentElement).appendChild(sortByAlphaScript);
}

// Get preference and either call initSortByAlpha or not.
// This is done via setTimeout because without it, there's no telling
// when the script will be appended to the DOM and sometimes the necessary 
// page elements have not yet been rendered.
chrome.storage.sync.get('prefs', function(result) {

  sortByAlpha = result.prefs.alphabetize;

  if (sortByAlpha) {

    return setTimeout(function() { initSortByAlpha() }, 400)
  }
});
