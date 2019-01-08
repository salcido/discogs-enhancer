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

  let countryList = JSON.parse(localStorage.getItem('countryList')) || setNewlist(),
      countryListError = 'is already on your list.';

  // ========================================================
  // Functions (Alphabetical)
  // ========================================================

  /**
   * Adds click event listeners to each country name
   * @returns {undefined}
   */
  function addCountryEventListeners() {
    [...document.getElementsByClassName('country-name')].forEach(name => {

      name.addEventListener('click', removeCountryName);
    });
  }

  /**
   * Adds the country to the list
   * @returns {method}
   */
  function addCountryToList() {

    let input = document.getElementById('country-input').value;

    if ( input ) {

      countryList.list.push(input);

      countryList = JSON.stringify(countryList);

      localStorage.setItem('countryList', countryList);

      document.querySelector('.errors').textContent = '';

      return location.reload();
    }
  }

  /**
   * Checks for an empty country list and displays
   * a message letting the user know their list is empty.
   * @returns {undefined}
   */
  function checkForEmptyCountryList() {

    let countries = document.querySelectorAll('.blocked-country .country').length,
        noCountries = '<p><em>Your list is empty.</em></p>';

    if ( !countries ) {
      document.querySelector('.blocked-country').insertAdjacentHTML('beforeend', noCountries);
      document.querySelector('.backup-output').textContent = '';
      document.querySelector('.backup-instructions').textContent = 'You can backup your block list once you add at least one country to your list using the form above.';
    }
  }

  /**
   * Iterates over the countryList object and injects
   * each name as markup into the DOM
   * @returns {undefined}
   */
  function insertCountriesIntoDOM() {

    countryList.list.forEach(country => {

      let node = document.createElement('div'),
          countries = document.getElementById('blocked-country');

      node.className = 'country';

      node.innerHTML = `<div class="country-name">
                          <span class="name">
                            ${country}
                          </span>
                        </div>`;

      countries.appendChild(node);
    });
  }

  /**
   * Checks if index is a string
   * @param {any primitive} index
   * @returns {Boolean}
   */
  function isString(index) {
    return typeof index === 'string';
  }

  /**
   * Remove the country name from the list/localStorage
   * @param {object} event The event object
   * @returns {function}
   */
  function removeCountryName(event) {

    let targetName = event.target.innerHTML.trim();

    event.target.parentNode.classList.add('fadeOut');

    countryList.list.forEach((country, i) => {

      if ( targetName === country ) {

        countryList.list.splice(i, 1);

        countryList = JSON.stringify(countryList);

        localStorage.setItem('countryList', countryList);

        return setTimeout(() => updatePageData(), 400);
      }
    });
  }

  /**
   * Instantiates a new list object
   * @returns {object}
   */
  function setNewlist() {

    localStorage.setItem('countryList', '{ "list": [], "currency": false, "include": false }');

    return JSON.parse(localStorage.getItem('countryList'));
  }

  /**
   * Show error if the country is already on the list
   * @returns {undefined}
   */
  function showError(message) {

    let input = document.getElementById('country-input').value;

    document.querySelector('.errors').textContent = `${input} ${message}`;
  }

  /**
   * Updates the country list and the restore array data
   * on the page without refreshing.
   * @returns {undefined}
   */
  function updatePageData() {

    countryList = JSON.parse(localStorage.getItem('countryList'));
    // remove all the countries from the DOM
    [...document.getElementsByClassName('country')].forEach(c => c.remove());
    // Add them back in with the newly updated countrylist data
    insertCountriesIntoDOM();
    // reattach event listerns to countries
    addCountryEventListeners();
    // update backup/restore output
    document.querySelector('.backup-output').textContent = JSON.stringify(countryList.list);
    // check for empty list
    checkForEmptyCountryList();
  }

  /**
   * Validates the input value from the restore section by
   * checking that it is first parseable and second an Array
   * with strings in each index.
   * @param  {string} list The country list passed in from localStorage
   * @returns {boolean}
   */
  function validateCountrylist(list) {

    let isValid = false;

    try {
      // make sure it's parsable
      list = JSON.parse(list);

    } catch (event) {

      return isValid;
    }

    // make sure every index is a string
    if ( list && Array.isArray(list) ) {

      return list.every(isString);
    }
  }

  // ========================================================
  // UI Functionality
  // ========================================================

  // Add country to list
  document.querySelector('.btn-green').addEventListener('click', () => {

    let input = document.getElementById('country-input').value;

    if ( input && !countryList.list.includes(input) ) {

      addCountryToList();

      return location.reload();

    } else if ( countryList.list.includes(input) ) {

      return showError(countryListError);
    }
  });

  // Radio button listener
  document.getElementById('country-prefs').addEventListener('change', event => {

    countryList = JSON.parse(localStorage.getItem('countryList'));

    countryList.include = JSON.parse(event.target.value);

    countryList = JSON.stringify(countryList);

    localStorage.setItem('countryList', countryList);

    return location.reload();
  });

  // Checkbox listener
  document.getElementById('currency').addEventListener('change', event => {

    countryList = JSON.parse(localStorage.getItem('countryList'));

    countryList.currency = event.target.checked;

    countryList = JSON.stringify(countryList);

    localStorage.setItem('countryList', countryList);

    return location.reload();
  });

  // Restore functionality
  document.querySelector('.restore .btn-green').addEventListener('click', () => {

    let list = document.querySelector('.restore-input').value;

    if ( validateCountrylist(list) ) {

      let restore = { list: JSON.parse(list), currency: false, include: false };

      localStorage.setItem('countryList', JSON.stringify(restore));

      return location.reload();

    } else {

      document.querySelector('.restore-errors').classList.remove('hide');
    }
  });

  // keyup event for Enter key
  document.addEventListener('keyup', e => {

    let input = document.getElementById('country-input').value;

    // Enter key is pressed
    if ( e.which === 13
         && input
         && !countryList.list.includes(input) ) {

      addCountryToList();

      return location.reload();

    // name is already on the list
    } else if ( countryList.list.includes(input) ) {

      return showError(countryListError);

    } else {

      // clear any previous errors
      document.querySelector('.errors').textContent = '';
    }
  });

  // ========================================================
  // DOM Setup
  // ========================================================

  // Select the radio button on page load
  if ( countryList.include ) {
    document.getElementById('include').checked = true;
  } else {
    document.getElementById('exclude').checked = true;
  }

  // Select the currency checkbox on page load
  if ( countryList.currency ) {
    document.getElementById('currency').checked = true;
  }

  // Focus on input
  document.getElementById('country-input').focus();
  updatePageData();
});
