/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This will inject the Version and Date strings into the DOM and populate the
 * quick naviation select box with all `.feature` elements. The script begins
 * execution at the bottom below the `Init / DOM Setup` comment block.
 *
 */

document.addEventListener('DOMContentLoaded', function () {

  const clearSearch = document.querySelector('.clear-search'),
        select = document.getElementById('nav-select'),
        search = document.getElementById('search'),
        tabs = document.querySelectorAll('.tabs');


  // ======================================================
  // Functions (Alphabetical)
  // ======================================================

  /**
   * Adds the `.highlight` class to the target element
   *
   * @param {object} value The value from the selected feature
   * @returns {method}
   */
  function addHighlight(value) {

    let target = document.querySelector(`#${value}`);

    return target.classList.add('highlight');
  }

  /**
   * Clears the search query from the input element
   *
   * @returns {undefined}
   */
  function clearSearchField() {
    search.value = '';
    search.focus();
    searchFeatures('');
  }

  /**
   * Appends the version and year to the DOM
   *
   * @method   getVersionAndYear
   * @return   {undefined}
   */

  function getVersionAndYear() {

    let
        manifest = chrome.runtime.getManifest(),
        version = document.querySelector('.version'),
        year = new Date().getFullYear(),
        yearSpan = document.getElementById('year');

    version.textContent = 'version ' + manifest.version;

    yearSpan.textContent = year;
  }

  /**
   * Checks for the `hide` class on an element
   *
   * @param {object} elem The element to examine
   * @returns {boolean}
   */

  function isHidden(elem) {
    return elem.classList.contains('hide');
  }

  /**
   * Lists the number of results returned from
   * the search
   *
   * @returns {assignment}
   */
  function listResults() {

    let features = [...document.querySelectorAll('.feature-block')],
        quantity,
        searchStatus = document.querySelector('.search-status'),
        searchResults = features.filter(elem => !elem.classList.contains('hide'));

    quantity = searchResults.length === 1 ? 'result' : 'results';

    if (!search.value) {
      return searchStatus.textContent = '';
    }

    return searchStatus.textContent = `${searchResults.length} ${quantity}`;
  }

  /**
   * Shows the `no-results` element if all features
   * are hidden
   *
   * @param {Array} features An array of every feature
   * @returns {method}
   */

  function noResultsCheck(features) {

    let noResults = document.querySelector('.no-results');

    if ( features.every(isHidden) ) {

      return noResults.classList.remove('hide');
    }
    return noResults.classList.add('hide');
  }

  /**
   * Populates the select element in the navigation
   * with IDs of any element with a .feature class
   *
   * @method   populateNavigation
   * @return   {undefined}
   */

  function populateNavigation() {

    let features = [...document.querySelectorAll('.feature-block')];

    features.forEach(feature => {

      let option = document.createElement('option');

      option.textContent = feature.querySelector('h2').textContent;
      option.value = feature.querySelector('h2').id;

      select.add(option);
    });
  }

  /**
   * Removes all `.highlight` classes from the h2 elements
   *
   * @method removeHighlight
   * @returns {undefined}
   */

  function removeHighlight() {

    let h2s = [...document.querySelectorAll('.feature-block h2')];

    h2s.forEach(h => h.classList.remove('highlight'));
  }

  /**
   * Searches the features for a matching text
   *
   * @param {string} query The string to search the DOM with
   * @returns {method} Adds or removes the `.hide` class
   */

  function searchFeatures(query) {

    let features = [...document.querySelectorAll('.feature-block')];

    features.forEach(feat => {

      query = query.toLowerCase();

      if ( !feat.textContent.toLowerCase().includes(query) ) {

        return feat.classList.add('hide');
      }

      return feat.classList.remove('hide');
    });

    noResultsCheck(features);
    toggleClearButton();
    listResults();
  }

  /**
   * Sets the `.selected` class on a tab
   *
   * @param {object} target The `.tabs` object that was clicked
   * @returns {method}
   */

  function setTabFocus(target) {

    tabs.forEach(tab => tab.classList.remove('selected'));

    return target.classList.add('selected');
  }

  /**
   * Shows the selected tab's content
   *
   * @param {object} target The tab element that was clicked
   * @returns {undefined}
   */

  function showTabContent(target) {

    let contents = document.querySelectorAll('.tab-content'),
        donate = document.querySelector('.info-wrap .donate'),
        help = document.querySelector('.info-wrap .help'),
        updates = document.querySelector('.info-wrap .updates');

    contents.forEach(tab => tab.classList.add('hide'));

    switch (true) {

      case target.classList.contains('updates'):
        updates.classList.remove('hide');
        break;

      case target.classList.contains('help'):
        help.classList.remove('hide');
        break;

      case target.classList.contains('donate'):
        donate.classList.remove('hide');
        break;
    }
  }

  /**
   * Shows/hides the `.clear-search` button
   *
   * @returns {method}
   */

  function toggleClearButton() {

    if ( search.value !== '' ) {

      return clearSearch.classList.remove('hide');
    }
    return clearSearch.classList.add('hide');
  }

  // ======================================================
  // UI Functionality
  // ======================================================

  // Scroll the page to the selected element
  select.addEventListener('change', () => {

    removeHighlight();
    addHighlight(select.value);

    location.hash = '#' + select.value;

    if ( location.hash.length !== 0 ) {
      // (-80px to adjust for the navbar up top)
      setTimeout(() => window.scrollTo(window.scrollX, window.scrollY - 80), 0);
    }
  });

  // Troubleshooting link in sidebar
  document.querySelector('.t-shoot').addEventListener('click', () => {
    setTimeout(() => window.scrollTo(window.scrollX, window.scrollY - 80), 0);
  });

  // Searches the features for a string match
  search.addEventListener('keydown', event => {

    setTimeout(() => {
      searchFeatures(event.target.value);
    }, 0);
  });

  // Clear the search input
  clearSearch.addEventListener('click', event => {

    event.preventDefault();
    clearSearchField();
  });

  // Escape key listener
  document.addEventListener('keydown', event => {

    if ( event.which === 27 ) {

      event.preventDefault();
      clearSearchField();
    }
  });

  // Tab functionality
  tabs.forEach(tab => {
    tab.addEventListener('click', event => {

      event.preventDefault();
      setTabFocus(event.target);
      showTabContent(event.target);
    });
  });

  // ======================================================
  // Init / DOM Setup
  // ======================================================

  setTimeout(() => { search.focus(); }, 200);
  getVersionAndYear();
  populateNavigation();
});
