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
        d = new Date(),
        manifest = chrome.runtime.getManifest(),
        version = document.getElementsByClassName('version'),
        year = d.getFullYear(),
        yearSpan = document.getElementById('year');

    for (let i = 0; i < version.length; i++) {

      version[i].textContent = 'version ' + manifest.version;
    }

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

    let features = document.getElementsByClassName('feature');

    for (let i = 0; i < features.length; i++) {

      let option = document.createElement('option');

      option.textContent = features[i].textContent;
      option.value = features[i].id;
      select.add(option);
    }
  }

  // ======================================================
  // UI Functionality
  // ======================================================

  // Scroll the page to the selected element
  select.addEventListener('change', function() {

    location.hash = '#' + select.value;

    if (location.hash.length !== 0) {

      window.scrollTo(window.scrollX, window.scrollY - 50);
    }
  });

  // ======================================================
  // DOM Setup
  // ======================================================

  getVersionAndYear();
  populateNavigation();
});
