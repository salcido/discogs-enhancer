/**
 * Filter Prices feature
 */

import { applySave, optionsToggle, fadeOut, setEnabledStatus } from '../utils';

/**
 * Sets up the event listeners for the Filter Prices UI
 */
export function init() {

  let filterPrices = JSON.parse(localStorage.getItem('filterPrices')) || { minimum: null, maximum: null },
      minimum = document.getElementById('minimum'),
      maximum = document.getElementById('maximum');

  // Open / Close options
  document.querySelector('.toggle-group.filter-prices').addEventListener('click', function () {
    optionsToggle('.hide-filter-prices', this, '.filter-prices', 140);
    updateDisplayValues();
  });

  // Populate inputs with saved values
  minimum.value = filterPrices.minimum;
  maximum.value = filterPrices.maximum;

  // Toggle enabled / disabled status
  document.getElementById('toggleFilterPrices').addEventListener('change', () => setStatus());

  // Set initial enabled / disabled status
  setTimeout(() => {
    setStatus();
    updateDisplayValues();
    setMinMaxValues();
  }, 0);
}

/**
 * Sets the Enabled / Disabled status in the popup menu
 */
function setStatus() {
  let self = document.querySelector('.toggle-group.filter-prices .status'),
      min = document.querySelector('#minimum'),
      max = document.querySelector('#maximum');

  if (document.getElementById('toggleFilterPrices').checked) {
    setEnabledStatus(self, 'Enabled');
    min.disabled = true;
    max.disabled = true;

  } else {
    setEnabledStatus(self, 'Disabled');
    min.disabled = false;
    max.disabled = false;
  }
}

/**
 * Displays the user's settings along side the feature title
 */
function updateDisplayValues() {
  let values = document.querySelector('.min-max-values'),
      userCurrency = document.getElementById('filterPricesCurrency').value || 'USD',
      filterPrices = JSON.parse(localStorage.getItem('filterPrices')) || { minimum: null, maximum: null },
      { minimum, maximum } = filterPrices,
      currCode = {
        AUD: 'A$',
        BRL: 'R$',
        CAD: 'CA$',
        CHF: 'CHF',
        EUR: '&euro;',
        GBP: '&pound;',
        JPY: '&yen;',
        MXN: 'MX$',
        NZD: 'NZ$',
        SEK: 'SEK',
        USD: '$',
        ZAR: 'ZAR',
    };

  if (!document.getElementById('toggleFilterPrices').checked) {
    values.innerHTML = '';
    return;
  }

  if (minimum && !maximum) {
    values.innerHTML = `&#8209; Min: ${currCode[userCurrency]}${minimum}`;
  } else if (maximum && !minimum) {
    values.innerHTML = `&#8209; Max: ${currCode[userCurrency]}${maximum}`;
  } else if (maximum && minimum) {
    values.innerHTML = `&#8209; Min: ${currCode[userCurrency]}${minimum} / Max: ${currCode[userCurrency]}${maximum}`;
  } else {
    values.innerHTML = '';
  }
}

/**
 * Sets the Min / Max values to localStorage and updates the display
 * on the popup
 */
function setMinMaxValues() {
  let filterPrices = JSON.parse(localStorage.getItem('filterPrices')) || { minimum: null, maximum: null },
      min = document.querySelector('#minimum'),
      max = document.querySelector('#maximum');

  min.addEventListener('change', event => {
    filterPrices.minimum = Math.abs(Number(event.target.value));
    localStorage.setItem('filterPrices', JSON.stringify(filterPrices));
    updateDisplayValues();
  });

  max.addEventListener('change', event => {
    filterPrices.maximum = Math.abs(Number(event.target.value));
    localStorage.setItem('filterPrices', JSON.stringify(filterPrices));
    updateDisplayValues();
  });
}

 /**
  * Gets and saves currency preferences
  * @return   {undefined}
  */
 export function getFilterPricesCurrency() {

  let toggleFilterPrices = document.getElementById('toggleFilterPrices'),
      userCurrency = document.getElementById('filterPricesCurrency'),
      min = document.querySelector('#minimum'),
      max = document.querySelector('#maximum');

  chrome.storage.sync.get('prefs', function(result) {

    // if there is a saved value, set the select with it
    if ( result.prefs.userCurrency ) {
      userCurrency.value = result.prefs.userCurrency;

      // validation
      if ( userCurrency.value !== '-' && toggleFilterPrices.checked === true ) {
        userCurrency.disabled = true;
        min.disabled = true;
        max.disabled = true;
      }

    } else {

      toggleFilterPrices.checked = false;
      userCurrency.disabled = false;
      min.disabled = true;
      max.disabled = true;
    }
  });
}

 /**
  * Toggles Filter Prices and displays an Error
  * if a currency value is not selected.
  * @method   validateFilterPrices
  * @param    {Object} event - The event object
  * @return   {undefined}
  */
 export function validateFilterPrices(event) {

  let togglePrices = document.getElementById('toggleFilterPrices'),
      userCurrency = document.getElementById('filterPricesCurrency'),
      min = document.querySelector('#minimum'),
      max = document.querySelector('#maximum');

  if ( event.target.checked && userCurrency.value !== '-' ) {

      userCurrency.disabled = true;
      togglePrices.checked = true;
      min.disabled = true;
      max.disabled = true;
      userCurrency.className = '';

      updateDisplayValues();
      applySave('refresh', event, 'filterPricesCurrency');
    }

    else if ( userCurrency.value === '-' ) {

      let message =  'Please choose a currency from the select box first.',
          notifications = document.querySelector('.notifications');

      document.getElementById('notify').textContent = message;

      notifications.classList.add('show');

      setTimeout(() => { fadeOut(notifications); }, 1500);

      togglePrices.checked = false;
      userCurrency.className = 'alert';
      return;

    } else {

      userCurrency.disabled = false;
      updateDisplayValues();
      applySave('refresh', event, 'filterPricesCurrency');
  }
}
