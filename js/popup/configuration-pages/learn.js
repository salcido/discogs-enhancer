/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', () => {

  let clearSearch = document.querySelector('.clear-search'),
      debounce = null,
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
   * Injects the `.news-item` markup when an update is returned
   * @param {object} updateData The data returned from the updates endpoint
   * @returns {undefined}
   */

  function appendNewsItem(updateData) {

    let d = document.createElement('div'),
        p = document.createElement('p'),
        type = document.createElement('span'),
        title = document.createElement('span'),
        content = document.createElement('span'),
        selector = document.querySelector('.info-wrap .updates');

    if ( updateData.content ) {

      d.className = 'news-item';

      type.className = 'issue';
      type.textContent = 'Extension issue: ';

      title.className = 'item-title';
      title.textContent = updateData.title || null;

      content.className = 'text';
      content.textContent = updateData.content;

      p.append(type);
      p.append(title);
      p.append(content);
      d.append(p);

      return selector.insertAdjacentElement('afterbegin', d);
    }
    return;
  }

  /**
   * Queries the `updates` endpoint for any urgent
   * updates.
   * @returns {object}
   */

  async function checkForIssues() {

    let url = 'https://discogs-enhancer.com/updates',
        request = await fetch(url),
        data = await request.json();

    return data;
  }

  /**
   * Checks the URL for a hash and scrolls the document
   * to the specified ID.
   * @returns {Undefined}
   */

  function checkForURLHash() {

    if ( location.hash ) {
      document.querySelector(`${location.hash}`).scrollIntoView();
      // (-80px to adjust for space up top)
      setTimeout(() => window.scrollTo(window.scrollX, window.scrollY - 80), 0);
    }
  }

  /**
   * Clears the search query from the input element
   *
   * @returns {undefined}
   */

  function clearSearchField() {

    search.value = '';
    search.focus();
    select.innerHTML = '<option>Select a feature</option>';
    searchFeatures('');
  }

  /**
   * Appends the version and year to the DOM
   *
   * @method   getVersionAndYear
   * @return   {undefined}
   */

  function getVersionAndYear() {

    let manifest = chrome.runtime.getManifest(),
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

    if ( !search.value ) {
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

  function populateNavigation(features) {

    let noResults = document.createElement('option'),
        selectFeature = document.createElement('option');

    noResults.textContent = 'No results';
    selectFeature.textContent = 'Select a feature';

    if ( features.length !== 0 ) {

      if ( search.value.length === 0 ) select.add(selectFeature);

      return features.forEach(feature => {

        let option = document.createElement('option');

        option.textContent = feature.querySelector('h2').textContent;
        option.value = feature.querySelector('h2').id;

        select.add(option);
      });
    }
    return select.add(noResults);
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
    updateNavigation(features);
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

    let tabContents = document.querySelectorAll('.tab-content');
    // Hide everything first
    tabContents.forEach(content => content.classList.add('hide'));
    // Show selected tab-content
    tabContents.forEach(content => {
      target.classList.forEach(targetClass => {
        if ( content.classList.contains(targetClass) ) {
          content.classList.remove('hide');
        }
      });
    });
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

  /**
   * Updates the select element to display a ToC of sorts
   * when searching.
   *
   * @param {Array} features Array of all the features
   * @returns {method}
   */

  function updateNavigation(features) {

    let visibleFeatures = features.filter(f => !f.classList.contains('hide')),
        length = visibleFeatures.length;

    select.innerHTML = '';

    populateNavigation(visibleFeatures);

    if ( length !== features.length
          && length !== 1
          && length !== 0 ) {

      select.size = length;
      // wrapped in setTimeout so select element will animate
      return setTimeout(() => { select.style.height = length * 33; }, 0);
    }

    select.size = 1;
    return setTimeout(() => { select.style.height = '35px'; }, 0);
  }

  // ======================================================
  // UI Functionality
  // ======================================================

  //  Scroll the page to the selected element
  // ------------------------------------------------------
  select.addEventListener('change', () => {

    removeHighlight();
    addHighlight(select.value);

    location.hash = '#' + select.value;

    if ( location.hash ) {
      // (-80px to adjust for space up top)
      setTimeout(() => window.scrollTo(window.scrollX, window.scrollY - 80), 0);
    }
  });


  // Troubleshooting link in sidebar
  // ------------------------------------------------------
  document.querySelector('.t-shoot').addEventListener('click', () => {
    setTimeout(() => window.scrollTo(window.scrollX, window.scrollY - 80), 0);
  });

  // Searches the features for a string match
  // ------------------------------------------------------
  search.addEventListener('keydown', event => {

    clearTimeout(debounce);

    debounce = setTimeout(() => {
      searchFeatures(event.target.value);
    }, 300);
  });

  // Clear the search input
  // ------------------------------------------------------
  clearSearch.addEventListener('click', event => {

    event.preventDefault();
    clearSearchField();
  });

  // Escape key listener
  // ------------------------------------------------------
  document.addEventListener('keydown', event => {

    if ( event.which === 27 ) {

      event.preventDefault();
      clearSearchField();
    }
  });

  // Tab functionality
  // ------------------------------------------------------
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

  getVersionAndYear();
  populateNavigation([...document.querySelectorAll('.feature-block')]);

  setTimeout(() => {
    search.focus();
    checkForURLHash();
  }, 200);

  // Check for extension issues
  checkForIssues().then(res => appendNewsItem(res)).catch(err => console.warn('error getting updates', err));
});
