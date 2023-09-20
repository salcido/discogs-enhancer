/**
 * inventory-scanner feature
 */

import { applySave, setEnabledStatus, optionsToggle } from '../utils';

/**
 * Sets up the event listeners for the Inventory Scanner UI
 * @returns {undefined}
 */
export function init() {
  // Expand and show the submenu
  document.querySelector('.toggle-group.inventory-scanner-wrap').addEventListener('click', function() {
    optionsToggle('#inventoryScanner', this, '.inventory-scanner-wrap', 110);
  });
  // Set "enabled/disabled" status
  document.getElementById('toggleInventoryScanner').addEventListener('change', function() {
    let self = document.querySelector('.toggle-group.inventory-scanner-wrap .status'),
        status = this.checked ? 'Enabled' : 'Disabled';
    setEnabledStatus(self, status);
  });

  setInventoryThreshold();
}

/**
 * Saves the inventory scanner threshold
 * @return {undefined}
 */
export function saveInventoryThreshold() {

  let
      input = document.getElementById('thresholdValue'),
      savedValue = document.getElementsByClassName('saved-value')[0],
      self = document.querySelector('.inventory-scanner-wrap .status'),
      toggle = document.getElementById('toggleInventoryScanner');

    // enabled -and- has value entered
    if ( input.value && toggle.checked ) {

      input.disabled = true;
      toggle.disabled = false;
      input.classList.remove('alert');

      // Make sure values are above 0 / below 100
      if ( input.value > 99 ) { input.value = 99; }
      if ( input.value < 0 ) { input.value = 0; }

      // Save the value to chrome.storage
      chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
        featureData.inventoryScanner = { threshold: JSON.parse(input.value) };
        chrome.storage.sync.set({ featureData });
      });


      // Displays rating as "- 25%"
      savedValue.innerHTML = `&#8209; ${input.value}%`;

      setEnabledStatus(self, 'Enabled');
      applySave('refresh', event);

    // disabled -and- has value entered
    } else if ( input.value && !toggle.checked ) {

      input.disabled = false;
      savedValue.textContent = '';

      setEnabledStatus(self, 'Disabled');
      applySave('refresh', event);

    // no value entered
    } else if ( !input.value ) {

      toggle.checked = false;
      input.classList.add('alert');
  }
}

/**
 * Sets the value of the inventory scanner input
 * when the popup is rendered
 * @return {undefined}
 */
export async function setInventoryThreshold() {

  let input = document.getElementById('thresholdValue'),
      savedValue = document.querySelector('.saved-value'),
      self = document.querySelector('.inventory-scanner-wrap .status'),
      toggle = document.getElementById('toggleInventoryScanner'),
      { featureData } = await chrome.storage.sync.get(['featureData']),
      { inventoryScanner } = featureData,
      hasThreshold = inventoryScanner && inventoryScanner.threshold,
      threshold = hasThreshold ? inventoryScanner.threshold : null;

  if ( threshold !== null ) { input.value = threshold; }

  chrome.storage.sync.get('prefs', function(result) {
    // Has value saved
    if ( result.prefs.inventoryScanner && threshold !== null ) {

      input.disabled = true;
      input.value = threshold;

      savedValue.innerHTML = `&#8209; ${input.value}%`;
      setEnabledStatus(self, 'Enabled');
    }
    // Has no value saved
    else if ( result.prefs.inventoryScanner && threshold === null ) {

      toggle.checked = false;
      setEnabledStatus(self, 'Disabled');

    } else {
      setEnabledStatus(self, 'Disabled');
    }
  });
}
