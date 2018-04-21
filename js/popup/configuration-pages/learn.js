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
        search = document.getElementById('search');


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

  // Searches the features for a string match
  search.addEventListener('keydown', event => {

    setTimeout(() => {
      searchFeatures(event.target.value);
    }, 0);
  });

  // Clear the search input
  clearSearch.addEventListener('click', event => {

    event.preventDefault();
    search.value = '';
    search.focus();
    searchFeatures('');
  });

  // ======================================================
  // Init / DOM Setup
  // ======================================================

  setTimeout(() => { search.focus(); }, 200);
  getVersionAndYear();
  populateNavigation();
});
