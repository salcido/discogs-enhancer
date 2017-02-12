/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', function () {

  let select = document.getElementById('nav-select');

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
        version = Array.from(document.getElementsByClassName('version')),
        year = new Date().getFullYear(),
        yearSpan = document.getElementById('year');

    version.forEach(ver => { ver.textContent = 'version ' + manifest.version; });
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

    let features = Array.from(document.getElementsByClassName('feature'));

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
  select.addEventListener('change', function() {

    location.hash = '#' + select.value;

    if (location.hash.length !== 0) {
      // (-50px to adjust for the navbar up top)
      window.scrollTo(window.scrollX, window.scrollY - 80);
    }
  });

  // ======================================================
  // DOM Setup
  // ======================================================

  getVersionAndYear();
  populateNavigation();
});
