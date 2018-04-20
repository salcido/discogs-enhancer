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

  const select = document.getElementById('nav-select');

  // ======================================================
  // Functions
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


  // ======================================================
  // Init / DOM Setup
  // ======================================================

  getVersionAndYear();
  populateNavigation();
});
