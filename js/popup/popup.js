/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

 /**
  * Removes multiple classes from a target
  * @TODO MOVE THIS
  * @method removeClasses
  * @param  {object}      elem      [the target element]
  * @param  {array}      ...remove [classnames to remove]
  * @return {object}
  */

  if ( !Element.prototype.removeClasses ) {

    Element.prototype.removeClasses = function(...remove) {

     remove.forEach(cls => { this.classList.remove(cls); });
    };
  }

 /**
  * Addes multiple classes to a target
  * @TODO MOVE THIS
  * @method addClasses
  * @param  {object}   elem   [the target element]
  * @param  {array}   ...add [classnames to add]
  * @return {object}
  */

  if ( !Element.prototype.addClasses ) {

    Element.prototype.addClasses = function(...add) {

     add.forEach(cls => { this.classList.add(cls); });
    };
  }

window.addEventListener('load', function load() {

  let
      chromeVer = (/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1],
      userCurrency = document.getElementById('currency'),
      prefs = {},
      features = [...document.querySelectorAll('.toggle-group .meta')],
      hideMarketplaceItems = document.getElementById('marketplaceItems'),
      noResults = document.getElementById('noResults'),
      searchbox = document.getElementById('searchbox'),
      toggleBlockSellers = document.getElementById('toggleBlockSellers'),
      toggleCollectionUi = document.getElementById('toggleCollectionUi'),
      toggleHighlights = document.getElementById('toggleHighlights'),
      toggleConverter = document.getElementById('toggleConverter'),
      toggleDarkTheme = document.getElementById('toggleDarkTheme'),
      toggleFeedback = document.getElementById('toggleFeedback'),
      toggleFilterByCountry = document.getElementById('toggleFilterByCountry'),
      toggleEverlastingMarket = document.getElementById('toggleEverlastingMarket'),
      toggleNotesCount = document.getElementById('toggleNotesCount'),
      toggleReadability = document.getElementById('toggleReadability'),
      toggleReleaseDurations = document.getElementById('toggleReleaseDurations'),
      toggleSellerRep = document.getElementById('toggleSellerRep'),
      toggleShortcuts = document.getElementById('toggleShortcuts'),
      toggleSortBtns = document.getElementById('toggleSortBtns'),
      togglePrices = document.getElementById('togglePrices'),

      // ========================================================
      // Contextual menus
      // ========================================================
      // Declared here first for scope and later assigned with
      // setContextualMenuIds()
      // ========================================================
      toggleBandcamp,
      toggleBoomkat,
      toggleClone,
      toggleDecks,
      toggleDeeJay,
      toggleDiscogs,
      toggleGramaphone,
      toggleHalcyon,
      toggleHardwax,
      toggleInsound,
      toggleJuno,
      toggleKristina,
      toggleOye,
      togglePbvinyl,
      togglePhonica,
      toggleSotu,
      toggleYoutube;

  // ========================================================
  // Private Functions
  // ========================================================

  /**
   * Clears the update notification
   *
   * @method   _acknowledgeUpdate
   * @param    {string}          message [The message displayed to the user]
   * @return   {undefined}
   */

  function _acknowledgeUpdate(message) {

    chrome.storage.sync.set({didUpdate: false}, function() { /*noop*/ });
  }

  /**
   * Saves the users preferences
   *
   * @method   _applySave
   * @param    {String}  message [The message displayed to the user]
   * @param    {Object}  event   [The event object]
   * @return   {undefined}
   */

  function _applySave(message, event) {

    let manifest = chrome.runtime.getManifest();

    prefs = {
      blockSellers: toggleBlockSellers.checked,
      collectionUi: toggleCollectionUi.checked,
      converter: toggleConverter.checked,
      darkTheme: toggleDarkTheme.checked,
      everlastingMarket: toggleEverlastingMarket.checked,
      feedback: toggleFeedback.checked,
      filterByCountry: toggleFilterByCountry.checked,
      formatShortcuts: toggleShortcuts.checked,
      hideMarketplaceItems: hideMarketplaceItems.value,
      highlightMedia: toggleHighlights.checked,
      notesCount: toggleNotesCount.checked,
      readability: toggleReadability.checked,
      releaseDurations: toggleReleaseDurations.checked,
      sellerRep: toggleSellerRep.checked,
      sortButtons: toggleSortBtns.checked,
      suggestedPrices: togglePrices.checked,
      userCurrency: userCurrency.value,

      // Contextual menus
      useBandcamp: toggleBandcamp.checked,
      useBoomkat: toggleBoomkat.checked,
      useClone: toggleClone.checked,
      useDecks: toggleDecks.checked,
      useDeejay: toggleDeeJay.checked,
      useDiscogs: toggleDiscogs.checked,
      useGramaphone: toggleGramaphone.checked,
      useHalcyon: toggleHalcyon.checked,
      useHardwax: toggleHardwax.checked,
      useInsound: toggleInsound.checked,
      useJuno: toggleJuno.checked,
      useKristina: toggleKristina.checked,
      useOye: toggleOye.checked,
      usePbvinyl: togglePbvinyl.checked,
      usePhonica: togglePhonica.checked,
      useSotu: toggleSotu.checked,
      useYoutube: toggleYoutube.checked
    };

    chrome.storage.sync.set({prefs: prefs}, function() {

      if (message) {

        let notifications = document.getElementsByClassName('notifications')[0];

        message = ( message === 'refresh' ) ? 'Please refresh the page for changes to take effect.' : message;

        document.getElementById('notify').textContent = message;

        notifications.classList.add('show');
        setTimeout(() => { _fadeOut(notifications); }, 1500);
      }
    });

    // Google Analyitcs
    if (_gaq) {

      let checked = event.target.checked;

      _gaq.push(['_trackEvent', `${event.target.id} : ${checked}`, ` version: ${manifest.version} Chrome: ${chromeVer}`]);
    }
  }

  /**
   * Fades out an element via CSS animation
   *
   * @method _fadeOut
   * @param  {object} elem [the element to fade]
   * @return {undefined}
   */

  function _fadeOut(elem) {

    elem.classList.add('fadeOut');
    elem.classList.remove('fadeIn');

    setTimeout(() => {

      elem.removeClasses('fadeOut', 'show');
      elem.classList.add('hide');
    }, 400);
  }

  /**
   * Fades in an element via CSS animation
   *
   * @method _fadeIn
   * @param  {object} elem [the element to fade]
   * @return {undefined}
   */

  function _fadeIn(elem) {

    elem.removeClasses('fadeOut', 'hide');
    elem.addClasses('fadeIn', 'show');
  }

  /**
   * Returns true when an element has classname 'hide'
   *
   * @method _isHidden
   * @param  {element}  element [the element to examine]
   * @return {Boolean}
   */

  function _isHidden(element) {
    return element.parentNode.className.includes('hide');
  }

  /**
   * Displays the options in the popup menu
   *
   * @method _optionsToggle
   * @param  {object}    options      [the DOM element to display]
   * @param  {object}    toggleGroup  [the actual feature in the popup menu]
   * @param  {number}    height       [the height that `target` will expand to]
   * @param  {string}    parentClass  [the parent class of the animated arrow]
   * @return {undefined}
   */

  function _optionsToggle(options, toggleGroup, parentClass, height) {

    let arrow = document.querySelector(`${parentClass} .arrow`),
        status = document.querySelector(`${parentClass} .status`);

    options = document.querySelector(options);

    // Expand
    // Check the current height and either expand or collapse it
    if (toggleGroup.clientHeight === 50) {

      toggleGroup.style.height = height + 'px';

      arrow.classList.add('rotate90');

      let int = setInterval(function() {

        if ( toggleGroup.clientHeight >= 30 ) {

          _fadeIn(options);

          if (status) { _fadeOut(status); }

          clearInterval(int);
        }
      }, 100);
    }
    // Collapse
    // (don't collapse when clicking these elements)
    else if (event.target.nodeName !== 'INPUT' &&
             event.target.type !== 'checkbox' &&
             event.target.nodeName !== 'LABEL' &&
             event.target.nodeName !== 'SPAN' &&
             event.target.nodeName !== 'A' &&
             event.target.nodeName !== 'SELECT') {

      _fadeOut(options);

      if (status) { status.classList.add('fadeIn'); }

      arrow.classList.remove('rotate90');

      let int = setInterval(function() {

       if (options.offsetParent === null) {

          toggleGroup.style.height = '50px';

         clearInterval(int);
       }
      }, 100);
    }
  }

  /**
   * Updates the Enabled/Disabled status of
   * Filter By Country in the popup
   *
   * @method _setCountryEnabledStatus
   */

  function _setCountryEnabledStatus() {

    let self = document.querySelector('.toggle-group.country .status'),
        filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

    chrome.storage.sync.get('prefs', function(result) {

      if (result.prefs.filterByCountry === true) {

        _setEnabledStatus( self, 'Enabled' );

        // Disable the selects when the feature is enabled
        document.getElementById('filterCountryCurrency').disabled = true;
        document.getElementById('filterCountry').disabled = true;
        document.querySelector('.country-value').textContent = ` \u2011 ${filterByCountryPrefs.currency}`;

      } else {

        _setEnabledStatus( self, 'Disabled' );
        document.querySelector('.country-value').textContent = '';
      }
    });
  }

  /**
   * Sets the enabled/disabled text status on SUBMENUS
   *
   * @method _setEnabledStatus
   * @param  {object}         target [the DOM element]
   * @param  {string}         status [Enabled/Disabled]
   */

  function _setEnabledStatus(target, status) {

    if (status === 'Enabled') {

      target.classList.add('enabled');
      target.classList.remove('disabled');

    } else {

      target.classList.add('disabled');
      target.classList.remove('enabled');
    }

    return target.textContent = status;
  }

  /**
   * Sets the text value/color of the Filter by Condition setting in the popup menu
   *
   * @method   _setupFilterByCondition
   * @return   {undefined}
   */

  function _setupFilterByCondition() {

    let
        setting = Number(localStorage.getItem('itemCondition')),
        status = document.querySelector('.toggle-group.condition .label .condition-status'),
        conditions = ['Poor (P)',
                      'Fair (F)',
                      'Good (G)',
                      'Good Plus (G+)',
                      'Very Good (VG)',
                      'Very Good Plus (VG+)',
                      'Near Mint (NM/M-)',
                      'Mint (M)'],
        colors = ['poor',
                  'fair',
                  'good',
                  'good-plus',
                  'very-good',
                  'very-good-plus',
                  'near-mint',
                  'mint'];

    if (setting === 0 || setting === null) {

      status.textContent = 'Disabled';
      status.className = 'condition-status disabled';

    } else {

      status.textContent = conditions[setting];
      status.className = 'condition-status ' + colors[setting];
    }
  }

  /**
   * Toggles price comparisons and displays an Error
   * if a currency value is not selected.
   *
   * @method   _showPrices
   * @param    {Object}   event [The event object]
   * @return   {undefined}
   */

  function _showPrices(event) {

    if (event.target.checked && userCurrency.value !== '-') {

        userCurrency.disabled = true;
        togglePrices.checked = true;
        userCurrency.className = '';

        _applySave('refresh`', event);

      }

      else if (userCurrency.value === '-') {

        let message =  'Please choose a currency from the select box first.',
            notifications = document.getElementsByClassName('notifications')[0];

        document.getElementById('notify').textContent = message;

        notifications.addClasses('show');

        setTimeout(() => { _fadeOut(notifications); }, 1500);

        togglePrices.checked = false;
        userCurrency.className = 'alert';
        return;

      } else {

        userCurrency.disabled = false;
        _applySave('refresh', event);
    }
  }

  // ========================================================
  // Public Functions
  // ========================================================

  /**
   * Checks extension for any recent updates and sets
   * the `about` button color if an update has occured
   *
   * @method   checkForUpdate
   * @return   {undefined}
   */

  function checkForUpdate() {

    chrome.storage.sync.get('didUpdate', function(result) {

      let about = document.getElementById('about');

      if (result.didUpdate) {

        about.textContent = 'New updates!';
        about.classList.remove('button_green');
        about.classList.add('button_orange');

        chrome.browserAction.setBadgeText({text: ''});

      } else {

        about.textContent = 'About';
        about.classList.add('button_green');
        about.classList.remove('button_orange');
      }
    });
  }

  /**
   * Gets and saves currency preferences
   *
   * @method   getCurrency
   * @return   {undefined}
   */

  function getCurrency() {

    chrome.storage.sync.get('prefs', function(result) {

      // if there is a saved value, set the select with it
      if (result.prefs.userCurrency) {
        userCurrency.value = result.prefs.userCurrency;

        // validation
        if (userCurrency.value !== '-' && togglePrices.checked === true) {
          userCurrency.disabled = true;
        }

      } else {

        togglePrices.checked = false;
        userCurrency.disabled = false;
      }
    });
  }

  /**
   * Saves the sellerRep percentage
   *
   * @method saveSellerRep
   * @return {undefined}
   */

  function saveSellerRep() {

    let
        input = document.getElementById('percent'),
        repValue = document.getElementsByClassName('rep-value')[0],
        self = document.querySelector('.seller-rep .status'),
        toggle = toggleSellerRep;

    // enabled -and- has value entered
    if ( input.value && toggle.checked ) {

      input.disabled = true;
      toggle.disabled = false;
      input.classList.remove('alert');

      // reset value to '100' if user enters a greater value
      if ( input.value > 100 ) { input.value = 100; }

      localStorage.setItem('sellerRep', input.value);

      input.value = localStorage.getItem('sellerRep');

      // Displays percentage value like: - 80%
      repValue.textContent = `\u2011 ${input.value}%`;

      _setEnabledStatus( self, 'Enabled' );
      _applySave('refresh', event);

      if (_gaq) {
        _gaq.push(['_trackEvent', ` Seller Rep Percentage: ${input.value}`, 'Seller Reputation']);
      }

    } else if ( input.value && !toggle.checked ) {

      input.disabled = false;
      repValue.textContent = '';

      _setEnabledStatus( self, 'Disabled' );
      _applySave('refresh', event);

    } else if ( !input.value ) {

      toggle.checked = false;
      input.classList.add('alert');
    }
  }

  /**
   * Adds/removes `hide` class from the
   * features in popup. Also shows/hides
   * the clear button.
   *
   * @method searchFeatures
   * @return {undefined}
   */

  function searchFeatures() {

    setTimeout(() => {

      features.forEach(feature => {

        let clear = document.getElementsByClassName('clear-search')[0],
            query = searchbox.value.toLowerCase(),
            text = feature.textContent.toLowerCase();

        if ( !text.includes(query) ) {

          feature.parentNode.classList.add('hide');

        } else {

          feature.parentNode.classList.remove('hide');
          noResults.classList.add('hide');
        }

        // Show no results notification
        if ( features.every(_isHidden) ) {

          noResults.classList.remove('hide');
        }

        // show/hide the X icon
        return searchbox.value ? clear.classList.remove('hide') : clear.classList.add('hide');
      });
    }, 0);
  }

  /**
   * Set or create the value of the 'Filter By Country' selects based on
   * what is in localStorage
   *
   * @method setCountryFilterValues
   */

  function setCountryFilterValues() {

    let filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

    if ( !filterByCountryPrefs ) {

      let newPrefs = { currency: '-', country: '-' };

      localStorage.setItem('filterByCountry', JSON.stringify(newPrefs));

      filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));
    }

    // currency value
    document.getElementById('filterCountryCurrency').value = filterByCountryPrefs.currency;

    // country value
    document.getElementById('filterCountry').value = filterByCountryPrefs.country;
    _setCountryEnabledStatus();
  }

  /**
   * Sets the value that will hide items in the
   * Marketplace based on condition
   *
   * @method   setHiddenItems
   * @param    {Object}       event [The event object]
   */

  function setHiddenItems(event) {

    let selectValue = event.target[event.target.selectedIndex].value;

    // Filter is disabled
    if (!selectValue) {

      localStorage.removeItem('itemCondition');

      if (_gaq) {

        _gaq.push(['_trackEvent', 'Marketplace Filter: Disabled', 'Marketplace Filter']);
      }

    // Filter is enabled
    } else {

      // set new value on change
      localStorage.setItem( 'itemCondition', String(selectValue) );

      if (_gaq) {

        let conditions = ['Poor (P)',
                          'Fair (F)',
                          'Good (G)',
                          'Good Plus (G+)',
                          'Very Good (VG)',
                          'Very Good Plus (VG+)',
                          'Near Mint (NM/M-)',
                          'Mint (M)'],

            setting = Number(localStorage.getItem('itemCondition'));

        _gaq.push(['_trackEvent', `Marketplace Filter: ${conditions[setting]}`, 'Marketplace Filter']);
      }
    }

    _setupFilterByCondition();
    _applySave('refresh', event);
  }

  /**
   * Sets the value of the seller reputation input
   * when the popup is rendered
   *
   * @method setSellerRep
   * @return {undefined}
   */

  function setSellerRep() {

    let input = document.getElementById('percent'),
        percent = localStorage.getItem('sellerRep') || null,
        repValue = document.getElementsByClassName('rep-value')[0],
        self = document.querySelector('.seller-rep .status');

    if (percent !== null) { input.value = percent; }

    chrome.storage.sync.get('prefs', function(result) {

      if (result.prefs.sellerRep && percent !== null) {

        input.disabled = true;
        // Displays percentage value like: - 80%
        repValue.textContent = `\u2011 ${input.value}%`;
        _setEnabledStatus( self, 'Enabled' );
      }

      else if (result.prefs.sellerRep && percent === null) {

        toggleSellerRep.checked = false;
        _setEnabledStatus( self, 'Disabled' );

      } else {

        _setEnabledStatus( self, 'Disabled' );
      }
    });
  }

  /**
   * Creates contextual menu markup inside the
   * Contextual Menu options feature in the popup.
   *
   * @method setupContextualMenus
   * @return {undefined}
   */

  function setupContextualMenus() {

    let contextMenus = document.getElementById('contextMenus'),
        fragment = document.createDocumentFragment(),
        menus = [
            {
              dataName: 'Bandcamp',
              fn: 'searchBandcamp',
              id: 'bandcamp'
            },
            {
              dataName: 'Boomkat',
              fn: 'searchBoomkat',
              id: 'boomkat'
            },
            {
              dataName: 'Clone',
              fn: 'searchClone',
              id: 'clone'
            },
            {
              dataName: 'Decks.de',
              fn: 'searchDecks',
              id: 'decks'
            },
            {
              dataName: 'DeeJay',
              fn: 'searchDeeJay',
              id: 'deejay'
            },
            {
              dataName: 'Discogs',
              fn: 'searchDiscogs',
              id: 'discogs'
            },
            {
              dataName: 'Gramaphone',
              fn: 'searchGramaphone',
              id: 'gramaphone'
            },
            {
              dataName: 'Halcyon',
              fn: 'searchHalcyon',
              id: 'halcyon'
            },
            {
              dataName: 'Hardwax',
              fn: 'searchHardwax',
              id: 'hardwax'
            },
            {
              dataName: 'InSound',
              fn: 'searchInsound',
              id: 'insound'
            },
            {
              dataName: 'Juno',
              fn: 'searchJuno',
              id: 'juno'
            },
            {
              dataName: 'Kristina',
              fn: 'searchKristina',
              id: 'kristina'
            },
            {
              dataName: 'Oye',
              fn: 'searchOye',
              id: 'oye'
            },
            {
              dataName: 'PBVinyl',
              fn: 'searchPbvinyl',
              id: 'pbvinyl'
            },
            {
              dataName: 'Phonica',
              fn: 'searchPhonica',
              id: 'phonica'
            },
            {
              dataName: 'SOTU',
              fn: 'searchSotu',
              id: 'sotu'
            },
            {
              dataName: 'YouTube',
              fn: 'searchYoutube',
              id: 'youtube'
            }
          ];

    // Create contextual menu elements
    menus.forEach(function(menu, i) {

      let
          boxwrap = document.createElement('div'),
          input = document.createElement('input'),
          label = document.createElement('label'),
          span = document.createElement('span');

      boxwrap.className = 'checkbox-wrap';

      input.type = 'checkbox';
      input.id = menu.id;
      input.dataset.name = menu.dataName;
      input.dataset.fn = menu.fn;

      span.textContent = menu.dataName;

      // Assemble markup
      label.appendChild(input);
      label.appendChild(span);
      boxwrap.appendChild(label);
      fragment.appendChild(boxwrap);
    });

    // Append all contextual menu elements
    contextMenus.appendChild(fragment);

    // Attach eventListeners
    menus.forEach(menu => {
      document.getElementById(menu.id).addEventListener('change', updateContextualMenu);
    });
  }

  /**
   * Assigns values to contexual menu vars
   *
   * @method setContextualMenuIds
   * @return {undefined}
   */

  function setContextualMenuIds() {

    toggleBandcamp = document.getElementById('bandcamp');
    toggleBoomkat = document.getElementById('boomkat');
    toggleClone = document.getElementById('clone');
    toggleDecks = document.getElementById('decks');
    toggleDeeJay = document.getElementById('deejay');
    toggleDiscogs = document.getElementById('discogs');
    toggleGramaphone = document.getElementById('gramaphone');
    toggleHalcyon = document.getElementById('halcyon');
    toggleHardwax = document.getElementById('hardwax');
    toggleInsound = document.getElementById('insound');
    toggleJuno = document.getElementById('juno');
    toggleKristina = document.getElementById('kristina');
    toggleOye = document.getElementById('oye');
    togglePbvinyl = document.getElementById('pbvinyl');
    togglePhonica = document.getElementById('phonica');
    toggleSotu = document.getElementById('sotu');
    toggleYoutube = document.getElementById('youtube');
  }

  /**
   * Validates then enables/disables the CSS for Filter Items by Country
   *
   * @method toggleHideCountries
   * @param  {object}            event [the event object]
   * @return {undefined}
   */

  function toggleHideCountries(event) {

    let country = document.getElementById('filterCountry'),
        currency = document.getElementById('filterCountryCurrency');

    // If everything checks out, enable filtering
    if (validateFilterByCountry() === 'valid' && event.target.checked) {

      currency.disabled = true;
      currency.className = '';

      country.disabled = true;
      country.className = '';

      chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-filter-by-country-css.js'}, function() {

        _applySave('refresh', event);
      });

      // Delay updating the UI so that Chrome has a chance to write the new preference
      setTimeout(_setCountryEnabledStatus, 50);

      if (_gaq) {

        _gaq.push(['_trackEvent', ` Country: ${country.value}, Cur: ${currency.value}`, 'Filter By Country']);
      }
    }
    // If everything checks out, disable filtering
    else if (validateFilterByCountry() === 'valid' && !event.target.checked) {

      currency.disabled = false;
      currency.className = '';

      country.disabled = false;
      country.className = '';

      chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-filter-by-country-css.js'}, function() {

        _applySave(null, event);
      });

      // Delay updating the UI so that Chrome has a change to write the new preference
      setTimeout(_setCountryEnabledStatus, 50);
    }
    // Everything is terrible
    else if (validateFilterByCountry() === 'invalid' && event.target.checked) {

      toggleFilterByCountry.checked = false;

      currency.disabled = false;
      currency.className = 'alert';

      country.disabled = false;
      country.className = 'alert';
    }
  }

  /**
   * Toggles Marketplace highlights
   *
   * @method   toggleMediaHighlights
   * @param    {object}         event [the event object]
   * @return   {undefined}
   */

  function toggleMediaHighlights(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-highlights.js'},
        function() { _applySave( 'refresh', event); });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-highlights.js'},
        function() { _applySave(null, event); });
    }
  }

  /**
   * Tells the user to refresh after updating a preference
   *
   * @method   triggerSave
   * @param    {Object}    event [The event object]
   * @return   {undefined}
   */

  function triggerSave(event) {

    _applySave('refresh', event);
  }

  /**
   * Creates/removes contextual menu items
   *
   * @method   updateContextualMenu
   * @param    {Object}   event [The event object]
   * @return   {undefined}
   */

  function updateContextualMenu(event) {

    if (event.target.checked) {

      chrome.runtime.sendMessage({
        fn: event.target.dataset.fn,
        id: event.target.id,
        method: 'create',
        name: event.target.dataset.name,
        request: 'updateContextMenu'
      });

      _applySave(null, event);

    } else {

      chrome.runtime.sendMessage({
        id: event.target.id,
        method: 'remove',
        request: 'updateContextMenu'
      });

      _applySave(null, event);
    }
  }

  /**
   * Toggles the dark theme
   *
   * @method   useDarkTheme
   * @param    {Object}     event [The event object]
   * @return   {undefined}
   */

  function useDarkTheme(event) {

    if (event.target.checked) {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-dark-theme.js'},
        function() { _applySave(null, event); });

    } else {

      chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-dark-theme.js'},
        function() { _applySave(null, event); });
    }
  }

  /**
   * Validates that a value has been set for both selects in Filter Items By Country
   *
   * @method validateFilterByCountry
   * @return {String}
   */

  function validateFilterByCountry() {

    let currency = document.getElementById('filterCountryCurrency'),
        country = document.getElementById('filterCountry');

    return currency.value !== '-' && country.value !== '-' ? 'valid' : 'invalid';
  }

  // ========================================================
  // UI Event Listeners
  // ========================================================

  // Open the about page
  document.getElementById('about').addEventListener('click', function(event) {

    chrome.tabs.create({url: '../html/about.html'});
    _acknowledgeUpdate();

    if (_gaq) { _gaq.push(['_trackEvent', 'about', 'about clicked']); }
  });

  // Open block sellers page
  document.getElementById('editList').addEventListener('click', function(event) {
    chrome.tabs.create({url: '../html/block-sellers.html'});
  });

  // Open readability config page
  document.getElementById('editReadability').addEventListener('click', function(event) {
    chrome.tabs.create({url: '../html/readability.html'});
  });

  /* CONTEXTUAL MENU SEARCHING OPTIONS */
  document.querySelector('.toggle-group.menus').addEventListener('click', function(event) {
    _optionsToggle('#contextMenus', this, '.menus', 180 );
  });

  /* FILTER BY CONDITION OPTIONS */
  document.querySelector('.toggle-group.condition').addEventListener('click', function(event) {
    _optionsToggle('.hide-condition', this, '.condition', 100 );
  });

  /* FILTER ITEMS BY COUNTRY OPTIONS */
  document.querySelector('.toggle-group.country').addEventListener('click', function(event) {
    _optionsToggle('.hide-country', this, '.country', 115 );
  });

  // Save the Filter Items By Country CURRENCY select value to localStorage
  document.getElementById('filterCountryCurrency').addEventListener('change', function(event) {

    let filterByCountry = JSON.parse(localStorage.getItem('filterByCountry'));

    if (this.value !== '-') {

      filterByCountry.currency = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountry));
    }
  });

  // Save the Filter Items By Country COUNTRY select value to localStorage
  document.getElementById('filterCountry').addEventListener('change', function(event) {

    let filterByCountry = JSON.parse(localStorage.getItem('filterByCountry'));

    if (this.value) {

      filterByCountry.country = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountry));
    }
  });

  /* SELLER REPUTATION */
  document.querySelector('.toggle-group.seller-rep').addEventListener('click', function() {
    _optionsToggle('.hide-percentage', this, '.seller-rep', 100 );
  });

  /* SEARCH FUNCTIONALITY */
  searchbox.addEventListener('keydown', function() {
    searchFeatures();
  });

  // Clear search input
  document.querySelector('.clear-search').addEventListener('mousedown', function() {

    searchbox.value = '';
    searchFeatures();

    // reset the focus
    setTimeout(() => { searchbox.focus(); }, 200);
  });

  // Toggle event listeners
  hideMarketplaceItems.addEventListener('change', setHiddenItems);
  userCurrency.addEventListener('change', function(){ _applySave(null, event); });
  toggleBlockSellers.addEventListener('change', triggerSave);
  toggleCollectionUi.addEventListener('change', triggerSave);
  toggleHighlights.addEventListener('change', toggleMediaHighlights);
  toggleConverter.addEventListener('change', triggerSave);
  toggleDarkTheme.addEventListener('change', useDarkTheme);
  toggleEverlastingMarket.addEventListener('change', triggerSave);
  toggleFeedback.addEventListener('change', triggerSave);
  toggleFilterByCountry.addEventListener('change', toggleHideCountries);
  toggleNotesCount.addEventListener('change', triggerSave);
  toggleReadability.addEventListener('change', triggerSave);
  toggleReleaseDurations.addEventListener('change', triggerSave);
  toggleSellerRep.addEventListener('change', saveSellerRep);
  toggleShortcuts.addEventListener('change', triggerSave);
  toggleSortBtns.addEventListener('change', triggerSave);
  togglePrices.addEventListener('change', _showPrices);

  // ========================================================
  // DOM Setup
  // ========================================================

  /**
   * Sets toggle button values when the popup is rendered
   * and calls necessary methods
   *
   * @method   init
   * @return   {undefined}
   */

  function init() {

    setupContextualMenus();
    setContextualMenuIds();

    // Get the user's preferences and set the toggles accordingly
    chrome.storage.sync.get('prefs', function(result) {

      hideMarketplaceItems.value = localStorage.getItem('itemCondition') || '';
      toggleBlockSellers.checked = result.prefs.blockSellers;
      toggleCollectionUi.checked = result.prefs.collectionUi;
      toggleHighlights.checked = result.prefs.highlightMedia;
      toggleConverter.checked = result.prefs.converter;
      toggleDarkTheme.checked = result.prefs.darkTheme;
      toggleEverlastingMarket.checked = result.prefs.everlastingMarket;
      toggleFeedback.checked = result.prefs.feedback;
      toggleFilterByCountry.checked = result.prefs.filterByCountry;
      toggleNotesCount.checked = result.prefs.notesCount;
      toggleReadability.checked = result.prefs.readability;
      toggleReleaseDurations.checked = result.prefs.releaseDurations;
      toggleSellerRep.checked = result.prefs.sellerRep;
      toggleShortcuts.checked = result.prefs.formatShortcuts;
      toggleSortBtns.checked = result.prefs.sortButtons;
      togglePrices.checked = result.prefs.suggestedPrices;

      // Contextual menus
      toggleBandcamp.checked = result.prefs.useBandcamp;
      toggleBoomkat.checked = result.prefs.useBoomkat;
      toggleClone.checked = result.prefs.useClone;
      toggleDecks.checked = result.prefs.useDecks;
      toggleDeeJay.checked = result.prefs.useDeejay;
      toggleDiscogs.checked = result.prefs.useDiscogs;
      toggleGramaphone.checked = result.prefs.useGramaphone;
      toggleHalcyon.checked = result.prefs.useHalcyon;
      toggleHardwax.checked = result.prefs.useHardwax;
      toggleInsound.checked = result.prefs.useInsound;
      toggleJuno.checked = result.prefs.useJuno;
      toggleKristina.checked = result.prefs.useKristina;
      toggleOye.checked = result.prefs.useOye;
      togglePbvinyl.checked = result.prefs.usePbvinyl;
      togglePhonica.checked = result.prefs.usePhonica;
      toggleSotu.checked = result.prefs.useSotu;
      toggleYoutube.checked = result.prefs.useYoutube;
    });

    checkForUpdate();
    getCurrency();
    _setupFilterByCondition();
    setCountryFilterValues();
    setSellerRep();

    // .mac class will remove scrollbars from the popup menu
    if (navigator.userAgent.includes('Mac OS X')) {

      document.getElementsByTagName('html')[0].addClasses('mac');
    }
    setTimeout(() => { searchbox.focus(); }, 300);
  }

  init();

}, false);
