/**
 * Filter by Country feature
 */

import { setEnabledStatus, applySave, optionsToggle } from '../utils';

/**
 * Sets up the event listeners for the Filter By Country UI
 */
export function init() {

  document.querySelector('.toggle-group.country').addEventListener('click', function () {
    optionsToggle('.hide-country', this, '.country', 115);
  });

  // Save the Filter Items By Country CURRENCY select value to localStorage
  document.getElementById('filterCountryCurrency').addEventListener('change', function () {

    let filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

    if ( this.value !== '-' ) {

      filterByCountryPrefs.currency = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountryPrefs));
    }
  });

  // Save the Filter Items By Country COUNTRY select value to localStorage
  document.getElementById('filterCountry').addEventListener('change', function () {

    let filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

    if ( this.value ) {

      filterByCountryPrefs.country = this.value;
      localStorage.setItem('filterByCountry', JSON.stringify(filterByCountryPrefs));
    }
  });
}

// ========================================================
// setCountryEnabledStatus
// ========================================================
/**
 * Updates the Enabled/Disabled status of
 * Filter By Country in the popup
 * @method setCountryEnabledStatus
 */
export function setCountryEnabledStatus() {

  let self = document.querySelector('.toggle-group.country .status'),
      filterByCountryPrefs = JSON.parse(localStorage.getItem('filterByCountry'));

  chrome.storage.sync.get('prefs', result => {

    if ( result.prefs.filterByCountry ) {

      setEnabledStatus( self, 'Enabled' );

      // Disable the selects when the feature is enabled
      document.getElementById('filterCountryCurrency').disabled = true;
      document.getElementById('filterCountry').disabled = true;
      document.querySelector('.country-value').textContent = ` \u2011 ${filterByCountryPrefs.currency}`;

    } else {

      setEnabledStatus( self, 'Disabled' );
      document.querySelector('.country-value').textContent = '';
    }
  });
}


// ========================================================
// setCountryFilterValues
// ========================================================
/**
 * Set or create the value of the 'Filter By Country' selects based on
 * what is in localStorage
 * @method setCountryFilterValues
 */
export function setCountryFilterValues() {

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

  setCountryEnabledStatus();
}


// ========================================================
// toggleHideCountries
// ========================================================
/**
 * Validates then enables/disables the CSS for Filter Items by Country
 * @method toggleHideCountries
 * @param  {object} event [the event object]
 * @return {undefined}
 */
export function toggleHideCountries(event) {

  let country = document.getElementById('filterCountry'),
      currency = document.getElementById('filterCountryCurrency'),
      path,
      tag,
      toggleFilterByCountry = document.getElementById('toggleFilterByCountry');

  // If everything checks out, enable filtering
  if ( validateFilterByCountry() === 'valid'
       && event.target.checked ) {

    path = 'js/extension/features/toggle-filter-by-country-css.js';

    currency.disabled = true;
    currency.className = '';

    country.disabled = true;
    country.className = '';

    chrome.tabs.executeScript(null, {file: path}, () => {} );
    applySave(null, event);

    // Delay updating the UI so that Chrome has a chance to write the new preference
    setTimeout(setCountryEnabledStatus, 50);

    if ( _gaq ) {

      tag = ` Country: ${country.value}, Cur: ${currency.value}`;

      _gaq.push(['_trackEvent', tag, 'Filter By Country']);
    }
  }
  // If everything checks out, disable filtering
  else if ( validateFilterByCountry() === 'valid'
            && !event.target.checked ) {

    path = 'js/extension/features/toggle-filter-by-country-css.js';

    currency.disabled = false;
    currency.className = '';

    country.disabled = false;
    country.className = '';

    chrome.tabs.executeScript(null, {file: path}, () => {});
    applySave(null, event);

    // Delay updating the UI so that Chrome has a change to write the new preference
    setTimeout(setCountryEnabledStatus, 50);
  }
  // Everything is terrible
  else if ( validateFilterByCountry() === 'invalid'
            && event.target.checked ) {

    toggleFilterByCountry.checked = false;

    currency.disabled = false;
    currency.className = 'alert';

    country.disabled = false;
    country.className = 'alert';
  }
}


// ========================================================
// validateFilterByCountry
// ========================================================
/**
 * Validates that a value has been set for both selects in Filter Items By Country
 * @method validateFilterByCountry
 * @return {String}
 */
export function validateFilterByCountry() {

  let currency = document.getElementById('filterCountryCurrency'),
      country = document.getElementById('filterCountry');

  return currency.value !== '-' && country.value !== '-' ? 'valid' : 'invalid';
}
