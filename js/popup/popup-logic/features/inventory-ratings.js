/**
 * inventory-ratings feature
 */

import { applySave, setEnabledStatus, optionsToggle } from '../utils';

/**
 * Sets up the event listeners for the Inventory Ratings UI
 * @returns {undefined}
 */
export function init() {

  // Expand and show the submenu
  document.querySelector('.toggle-group.inventory').addEventListener('click', function() {
    optionsToggle('#inventoryRatings', this, '.inventory', 110);
  });

  // Set "enabled/disabled" status
  document.getElementById('toggleInventoryRatings').addEventListener('change', function() {

    let self = document.querySelector('.toggle-group.inventory .status'),
        status = this.checked ? 'Enabled' : 'Disabled';

    setEnabledStatus( self, status );
  });

  setInventoryRatings();
}

/**
 * Saves the inventory rating
 * @method saveInventoryRatings
 * @return {undefined}
 */
export function saveInventoryRatings(event) {

  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

    let
        input = document.getElementById('ratingsValue'),
        inventoryValue = document.getElementsByClassName('inventory-value')[0],
        self = document.querySelector('.inventory .status'),
        toggle = document.getElementById('toggleInventoryRatings');

      // enabled -and- has value entered
      if ( input.value && toggle.checked ) {

        input.disabled = true;
        toggle.disabled = false;
        input.classList.remove('alert');

        featureData.minimumRating = JSON.parse(input.value)
        chrome.storage.sync.set({ featureData });

        let { minimumRating } = featureData;
        input.value = minimumRating;

        // Displays rating as "- 4.45"
        inventoryValue.innerHTML = `&#8209; ${input.value}`;

        setEnabledStatus( self, 'Enabled' );
        applySave('refresh', event);

      } else if ( input.value && !toggle.checked ) {

        input.disabled = false;
        inventoryValue.textContent = '';

        setEnabledStatus(self, 'Disabled');
        applySave('refresh', event);

      } else if ( !input.value ) {

        toggle.checked = false;
        input.classList.add('alert');
      }
  })
}

/**
 * Sets the value of the inventory rating input
 * when the popup is rendered
 * @method setInventoryRating
 * @return {undefined}
 */
export async function setInventoryRatings() {

  let input = document.getElementById('ratingsValue'),
      { featureData } = await chrome.storage.sync.get(['featureData']),
      { minimumRating } = featureData,
      ratingDisplay = document.querySelector('.inventory-value'),
      self = document.querySelector('.inventory .status'),
      toggle = document.getElementById('toggleInventoryRatings');

  if ( minimumRating ) { input.value = minimumRating; }

  chrome.storage.sync.get('prefs', function(result) {

    if ( result.prefs.inventoryRatings && minimumRating !== null ) {

      input.disabled = true;
      input.value = minimumRating;
      ratingDisplay.innerHTML = `&#8209; ${input.value}`;
      setEnabledStatus( self, 'Enabled' );

    } else if ( result.prefs.inventoryRatings && minimumRating === null ) {

      toggle.checked = false;
      setEnabledStatus( self, 'Disabled' );

    } else {

      setEnabledStatus( self, 'Disabled' );
    }
  });
}
