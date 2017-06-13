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

    let features = [...document.getElementsByClassName('feature')];

    features.forEach(feature => {

      let option = document.createElement('option');

      option.textContent = feature.textContent;
      option.value = feature.id;

      select.add(option);
    });
  }


  // ======================================================
  // UI Functionality
  // ======================================================

  // Scroll the page to the selected element
  select.addEventListener('change', () => {

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
