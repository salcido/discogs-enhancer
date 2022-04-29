/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', async () => {

  let { featurePrefs } = await chrome.storage.sync.get(['featurePrefs']),
      initialCountryList = featurePrefs.countryList,
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
      chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {
        featurePrefs.countryList.list.push(input);

        chrome.storage.sync.set({ featurePrefs });

        document.querySelector('.errors').textContent = '';

        return location.reload();
      })
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
  function insertCountriesIntoDOM(countryList) {

    countryList.list.sort();
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
   * Remove the country name from the list/chrome.storage
   * @param {object} event The event object
   * @returns {function}
   */
  function removeCountryName(event) {

    let targetName = event.target.innerHTML.trim();

    event.target.parentNode.classList.add('fadeOut');

    chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {
      featurePrefs.countryList.list.forEach((country, i) => {

        if ( targetName === country ) {

          featurePrefs.countryList.list.splice(i, 1);
          chrome.storage.sync.set({ featurePrefs });

          initialCountryList = featurePrefs.countryList;

          return setTimeout(() => updatePageData(), 400);
        }
      });
    })
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
    chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {
      // remove all the countries from the DOM
      [...document.getElementsByClassName('country')].forEach(c => c.remove());
      // Add them back in with the newly updated countrylist data
      insertCountriesIntoDOM(featurePrefs.countryList);
      // reattach event listerns to countries
      addCountryEventListeners();
      // update backup/restore output
      document.querySelector('.backup-output').textContent = JSON.stringify(featurePrefs.countryList.list);
      // check for empty list
      checkForEmptyCountryList();
    })
  }

  /**
   * Validates the input value from the restore section by
   * checking that it is first parseable and second an Array
   * with strings in each index.
   * @param  {string} list The country list passed in from chrome.storage
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

    if ( input && !initialCountryList.list.includes(input) ) {

      addCountryToList();

      return location.reload();

    } else if ( initialCountryList.list.includes(input) ) {

      return showError(countryListError);
    }
  });

  // Radio button listener
  document.getElementById('country-prefs').addEventListener('change', event => {

    chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {

      featurePrefs.countryList.include = JSON.parse(event.target.value);

      chrome.storage.sync.set({ featurePrefs }).then(() => {
        return location.reload();
      })
    })
  });

  // Checkbox listener
  document.getElementById('currency').addEventListener('change', event => {

    chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {

      featurePrefs.countryList.currency = event.target.checked;

      chrome.storage.sync.set({ featurePrefs }).then(() => {
        return location.reload();
      });
    })
  });

  // Restore functionality
  document.querySelector('.restore .btn-green').addEventListener('click', () => {

    let list = document.querySelector('.restore-input').value;

    if ( validateCountrylist(list) ) {

      let restore = { list: JSON.parse(list), currency: false, include: false };

      chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {
        featurePrefs.countryList = restore;

        chrome.storage.sync.set({ featurePrefs }).then(() => {
          return location.reload();
        })
      })

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
         && !initialCountryList.list.includes(input) ) {

      addCountryToList();

      return location.reload();

    // name is already on the list
    } else if ( initialCountryList.list.includes(input) ) {

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
  if ( initialCountryList.include ) {
    document.getElementById('include').checked = true;
  } else {
    document.getElementById('exclude').checked = true;
  }

  // Select the currency checkbox on page load
  if ( initialCountryList.currency ) {
    document.getElementById('currency').checked = true;
  }

  // Focus on input
  document.getElementById('country-input').focus();
  updatePageData();
});
