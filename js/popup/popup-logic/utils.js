/**
 * Utitlity methods used by the popup
 */

// ========================================================
// acknowledgeUpdate
// ========================================================
/**
 * Clears the update notification
 * @method   acknowledgeUpdate
 * @return   {undefined}
 */
export function acknowledgeUpdate() {
  chrome.storage.sync.set({didUpdate: false}, function() { /*noop*/ });
}

// ========================================================
// applySave
// ========================================================
/**
 * Saves the users preferences when a toggle is clicked
 *
 * @method   applySave
 * @param    {String}  message [The message displayed to the user]
 * @param    {Object}  event   [The event object]
 * @return   {undefined}
 */
export function applySave(message, event) {

  let prefs = {
        absoluteDate: document.getElementById('toggleAbsoluteDate').checked,
        baoiFields: document.getElementById('toggleBaoiFields').checked,
        blockSellers: document.getElementById('toggleBlockSellers').checked,
        blurryImageFix: document.getElementById('toggleBlurryImageFix').checked,
        collectionNewTabs: document.getElementById('toggleCollectionNewTabs').checked,
        collectionUi: document.getElementById('toggleCollectionUi').checked,
        converter: document.getElementById('toggleConverter').checked,
        darkTheme: document.getElementById('toggleDarkTheme').checked,
        everlastingCollection: document.getElementById('toggleEverlastingCollection').checked,
        everlastingMarket: document.getElementById('toggleEverlastingMarket').checked,
        favoriteSellers: document.getElementById('toggleFavoriteSellers').checked,
        feedback: document.getElementById('toggleFeedback').checked,
        filterByCondition: document.getElementById('toggleFilterByCondition').checked,
        filterByCountry: document.getElementById('toggleFilterByCountry').checked,
        formatShortcuts: document.getElementById('toggleShortcuts').checked,
        hideMinMaxColumns: document.getElementById('toggleMinMaxColumns').checked,
        highlightMedia: document.getElementById('toggleHighlights').checked,
        notesCount: document.getElementById('toggleNotesCount').checked,
        randomItem: document.getElementById('toggleRandomItem').checked,
        readability: document.getElementById('toggleReadability').checked,
        releaseDurations: document.getElementById('toggleReleaseDurations').checked,
        releaseScanner: document.getElementById('toggleReleaseScanner').checked,
        releaseRatings: document.getElementById('toggleReleaseRatings').checked,
        removeFromWantlist: document.getElementById('toggleRemoveFromWantlist').checked,
        sellerRep: document.getElementById('toggleSellerRep').checked,
        sortButtons: document.getElementById('toggleSortBtns').checked,
        suggestedPrices: document.getElementById('togglePrices').checked,
        ytPlaylists: document.getElementById('toggleYtPlaylists').checked,
        userCurrency: document.getElementById('currency').value,

        // Contextual menus
        useAllDay: document.getElementById('allday').checked,
        useBandcamp: document.getElementById('bandcamp').checked,
        useBoomkat: document.getElementById('boomkat').checked,
        useClone: document.getElementById('clone').checked,
        useDeejay: document.getElementById('deejay').checked,
        useDiscogs: document.getElementById('discogs').checked,
        useGramaphone: document.getElementById('gramaphone').checked,
        useHalcyon: document.getElementById('halcyon').checked,
        useHardwax: document.getElementById('hardwax').checked,
        useInsound: document.getElementById('insound').checked,
        useJuno: document.getElementById('juno').checked,
        useKristina: document.getElementById('kristina').checked,
        useOye: document.getElementById('oye').checked,
        usePbvinyl: document.getElementById('pbvinyl').checked,
        usePhonica: document.getElementById('phonica').checked,
        useRushhour: document.getElementById('rushhour').checked,
        useSotu: document.getElementById('sotu').checked,
        useYoutube: document.getElementById('youtube').checked
      };

  chrome.storage.sync.set({prefs: prefs}, function() {

    if ( message ) {

      let notifications = document.getElementsByClassName('notifications')[0];

      message = ( message === 'refresh' ) ? 'Please refresh the page for changes to take effect.' : message;

      document.getElementById('notify').textContent = message;

      notifications.classList.add('show');
      setTimeout(() => { fadeOut(notifications); }, 1500);
    }
  });
  // Google Analyitcs
  if ( ga ) {

    let checked = event.target.checked;

    if ( checked !== undefined ) {

      ga('send', 'event', event.target.id, checked);
    }
  }
}

// ========================================================
// checkForUpdate
// ========================================================
/**
 * Checks extension for any recent updates and sets
 * the `learn` button color if an update has occured
 * @method   checkForUpdate
 * @return   {undefined}
 */

export function checkForUpdate() {

  chrome.storage.sync.get('didUpdate', function(result) {

    let learn = document.getElementById('learn');

    if ( result.didUpdate ) {

      learn.textContent = 'Updates!';
      learn.classList.remove('button_green');
      learn.classList.add('button_orange');

      chrome.browserAction.setBadgeText({text: ''});

    } else {

      learn.textContent = 'Learn';
      learn.classList.add('button_green');
      learn.classList.remove('button_orange');
    }
  });
}

// ========================================================
// fadeIn
// ========================================================
/**
 * Fades in an element via CSS animation
 * @method fadeIn
 * @param  {object} elem [the element to fade]
 * @return {undefined}
 */
export function fadeIn(elem) {

  elem.removeClasses('fadeOut', 'hide');
  elem.addClasses('fadeIn', 'show');
}

// ========================================================
// fadeOut
// ========================================================
/**
 * Fades out an element via CSS animation
 * @method fadeOut
 * @param  {object} elem [the element to fade]
 * @return {undefined}
 */
export function fadeOut(elem) {

  elem.classList.add('fadeOut');
  elem.classList.remove('fadeIn');

  setTimeout(() => {

    elem.removeClasses('fadeOut', 'show');
    elem.classList.add('hide');
  }, 400);
}

// ========================================================
// isHidden
// ========================================================
/**
 * Returns true when an element has classname 'hide'
 * @method isHidden
 * @param  {element}  element [the element to examine]
 * @return {Boolean}
 */
export function isHidden(element) {
  return element.parentNode.classList.contains('hide');
}

// ========================================================
// optionsToggle
// ========================================================
/**
 * Displays the options in the popup menu
 * @method optionsToggle
 * @param  {object}    options      [the DOM element to display]
 * @param  {object}    toggleGroup  [the actual feature in the popup menu]
 * @param  {number}    height       [the height that `target` will expand to]
 * @param  {string}    parentClass  [the parent class of the animated arrow]
 * @return {undefined}
 */
export function optionsToggle(options, toggleGroup, parentClass, height) {

  let arrow = document.querySelector(`${parentClass} .arrow`),
      status = document.querySelector(`${parentClass} .status`);

  options = document.querySelector(options);

  // Expand
  // Check the current height and either expand or collapse it
  if ( toggleGroup.clientHeight === 50 ) {

    toggleGroup.style.height = height + 'px';

    arrow.classList.add('rotate90');

    let int = setInterval(function() {

      if ( toggleGroup.clientHeight >= 30 ) {

        fadeIn(options);

        if (status) { fadeOut(status); }

        clearInterval(int);
      }
    }, 100);
  }
  // Collapse
  // (don't collapse when clicking these elements)
  else if ( event.target.nodeName !== 'INPUT' &&
            event.target.type !== 'checkbox' &&
            event.target.nodeName !== 'LABEL' &&
            event.target.nodeName !== 'SPAN' &&
            event.target.nodeName !== 'A' &&
            event.target.nodeName !== 'SELECT' &&
            !event.target.className.includes('rep-color') &&
            event.target.parentNode.className !== 'rep-color-wrap' ) {

    fadeOut(options);

    if ( status ) { status.classList.add('fadeIn'); }

    arrow.classList.remove('rotate90');

    let int = setInterval(function() {

     if ( options.offsetParent === null ) {

        toggleGroup.style.height = '50px';

       clearInterval(int);
     }
    }, 100);
  }
}

// ========================================================
// searchFeatures
// ========================================================
/**
 * Adds/removes `hide` class from the
 * features in popup. Also shows/hides
 * the clear button.
 * @method searchFeatures
 * @return {undefined}
 */
export function searchFeatures() {

  let features = [...document.querySelectorAll('.toggle-group .meta')],
      noResults = document.getElementById('noResults');

  setTimeout(() => {

    features.forEach(feature => {

      let clear = document.getElementsByClassName('clear-search')[0],
          query = document.getElementById('searchbox').value.toLowerCase(),
          searchbox = document.getElementById('searchbox'),
          text = feature.textContent.toLowerCase();

      if ( !text.includes(query) ) {

        feature.parentNode.classList.add('hide');

      } else {

        feature.parentNode.classList.remove('hide');
        noResults.classList.add('hide');
      }

      // Show no results notification
      if ( features.every(isHidden) ) {

        noResults.classList.remove('hide');
      }

      // show/hide the X icon
      return searchbox.value ? clear.classList.remove('hide') : clear.classList.add('hide');
    });
  }, 0);
}

// ========================================================
// setEnabledStatus
// ========================================================
/**
 * Sets the enabled/disabled text status on SUBMENUS
 * @method setEnabledStatus
 * @param  {object}         target [the DOM element]
 * @param  {string}         status [Enabled/Disabled]
 */
export function setEnabledStatus(target, status) {

  if ( status === 'Enabled' ) {

    target.classList.add('enabled');
    target.classList.remove('disabled');

  } else {

    target.classList.add('disabled');
    target.classList.remove('enabled');
  }

  return target.textContent = status;
}

// ========================================================
// triggerSave
// ========================================================
/**
 * Tells the user to refresh after updating a preference
 *
 * @method   triggerSave
 * @param    {Object}    event [The event object]
 * @return   {undefined}
 */

export function triggerSave(event) {
  applySave('refresh', event);
}
