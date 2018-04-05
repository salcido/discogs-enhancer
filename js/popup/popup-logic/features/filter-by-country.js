/**
 * Filter by Country feature
 */

import { setEnabledStatus, applySave } from '../utils';

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
      toggleFilterByCountry = document.getElementById('toggleFilterByCountry');

  // If everything checks out, enable filtering
  if (validateFilterByCountry() === 'valid' && event.target.checked) {

    currency.disabled = true;
    currency.className = '';

    country.disabled = true;
    country.className = '';

    chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-filter-by-country-css.js'}, function() {});
    applySave('refresh', event);

    // Delay updating the UI so that Chrome has a chance to write the new preference
    setTimeout(setCountryEnabledStatus, 50);

    if (_gaq) {

      _gaq.push(['_trackEvent', ` Country: ${country.value}, Cur: ${currency.value}`, 'Filter By Country']);
    }
  }
  // If everything checks out, disable filtering
  else if (validateFilterByCountry() === 'valid' && !event.target.checked) {

    currency.disabled = false;
    currency.className = '';

    country.disabled = false;
    country.className = '';

    chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-filter-by-country-css.js'}, function() {});
    applySave(null, event);

    // Delay updating the UI so that Chrome has a change to write the new preference
    setTimeout(setCountryEnabledStatus, 50);
  }
  // Everything is terrible
  else if (validateFilterByCountry() === 'invalid' && event.target.checked) {

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
