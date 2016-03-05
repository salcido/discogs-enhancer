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
    collectionUi, // js/better-collection-ui.js
    darkTheme,
    darkStyles,
    elems = [],
    fragment,
    highlightCss, // css/marketplace-highlights.css element
    highlightScript, // js/apply-highlights.js
    initElems = [],
    initFragment,
    jQ,
    prefs = {},
    releaseDurations, // js/release-durations.js
    releaseHistoryScript, // js/release-history-legend.js
    sortExploreScript, // js/sort-explore-lists.js
    sortMarketplaceScript, // js/sort-marketplace-lists.js
    sortPersonalListsScript; // js/sort-personal-lists.js


function appendFragment() {

  fragment = document.createDocumentFragment();

  elems.forEach(function(elm) {

    fragment.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(fragment.cloneNode(true));
}


function enableDarkTheme(preference) {

  darkStyles = document.getElementById(darkTheme.id);

  setTimeout(function() {

    return preference === true ? darkStyles.removeAttribute('disabled') : darkStyles.setAttribute('disabled', true);
  }, 50);
}


chrome.storage.sync.get('prefs', function(result) {

  var useDarkTheme;

  if (!result.prefs) {

    prefs = {
      darkMode: true,
      highlightMedia: true,
      sortButtons: true,
      releaseDurations: true,
      collectionUi: true
      };

    chrome.storage.sync.set({prefs: prefs}, function() {

      console.log('Preferences created.');
    });
  }

  // jQuery
  jQ = document.createElement('script');

  jQ.type = 'text/javascript';

  jQ.async = true;

  jQ.src = chrome.extension.getURL('js/jquery/jquery-min.js');

  initElems.push(jQ);


  // Create dark theme css element...
  darkTheme = document.createElement('link');

  darkTheme.rel = 'stylesheet';

  darkTheme.type = 'text/css';

  darkTheme.href = chrome.extension.getURL('css/dark-mode.css');

  darkTheme.id = 'darkModeCss';

  initElems.push(darkTheme);


  // Append jQuery and darkmode css
  initFragment = document.createDocumentFragment();

  initElems.forEach(function(elm) {

    initFragment.appendChild(elm);
  });

  (document.head || document.documentElement).appendChild(initFragment.cloneNode(true));


  // Enable darkmode if necessary
  useDarkTheme = result.prefs.darkMode;

  enableDarkTheme(useDarkTheme);


  // Assemble remaining stuff for appending
  if (result.prefs.highlightMedia) {

    // apply-highlights.js
    highlightScript = document.createElement('script');

    highlightScript.type = 'text/javascript';

    highlightScript.src = chrome.extension.getURL('js/apply-highlights.js');

    elems.push(highlightScript);


    // marketplace-highlights.css
    highlightCss = document.createElement('link');

    highlightCss.rel = 'stylesheet';

    highlightCss.type = 'text/css';

    highlightCss.href = chrome.extension.getURL('css/marketplace-highlights.css');

    highlightCss.id = 'mediaHighLightsCss';

    elems.push(highlightCss);
  }

  if (result.prefs.sortButtons) {

    // sort-explore-lists.js
    sortExploreScript = document.createElement('script');

    sortExploreScript.type = 'text/javascript';

    sortExploreScript.src = chrome.extension.getURL('js/sort-explore-lists.js');

    elems.push(sortExploreScript);


    // sort-marketplace-lists.js
    sortMarketplaceScript = document.createElement('script');

    sortMarketplaceScript.type = 'text/javascript';

    sortMarketplaceScript.src = chrome.extension.getURL('js/sort-marketplace-lists.js');

    elems.push(sortMarketplaceScript);


    // sort-personal-lists.js
    sortPersonalListsScript = document.createElement('script');

    sortPersonalListsScript.type = 'text/javascript';

    sortPersonalListsScript.src = chrome.extension.getURL('js/sort-personal-lists.js');

    elems.push(sortPersonalListsScript);
  }

  if (result.prefs.darkMode) {

    releaseHistoryScript = document.createElement('script');

    releaseHistoryScript.type = 'text/javascript';

    releaseHistoryScript.src = chrome.extension.getURL('js/release-history-legend.js');

    elems.push(releaseHistoryScript);
  }


  if (result.prefs.releaseDurations) {

    releaseDurations = document.createElement('script');

    releaseDurations.type = 'text/javascript';

    releaseDurations.src = chrome.extension.getURL('js/release-durations.js');

    elems.push(releaseDurations);
  }

  if (result.prefs.collectionUi) {

    collectionUi = document.createElement('script');

    collectionUi.type = 'text/javascript';

    collectionUi.src = chrome.extension.getURL('js/better-collection-ui.js');

    elems.push(collectionUi);
  }

  setTimeout(function() {

    appendFragment(result);

  }, 100);
});
