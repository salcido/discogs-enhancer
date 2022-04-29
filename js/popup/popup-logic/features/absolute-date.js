/**
 * Absolute Date feature
 */

import { setEnabledStatus, optionsToggle } from '../utils';

/**
 * Sets up the event listeners for the Absolute Date UI
 */
export function init() {

  // Expand and show the submenu
  document.querySelector('.toggle-group.absolute').addEventListener('click', function() {
    optionsToggle('#absolute', this, '.absolute', 110 );
  });

  // Save the Use US Date format preference
  document.getElementById('usFormat').addEventListener('change', function () {
    chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {
      featurePrefs.usDateFormat = this.checked;
      chrome.storage.sync.set({ featurePrefs });
    })
  });

  // Setup example US date format
  let today  = new Date(),
      options = { year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: 'numeric' },
      dateString = today.toLocaleDateString('en-US', options);

  document.querySelector('.date-example').textContent = `e.g.: Added ${dateString}`;

  // Set "enabled/disabled" status
  document.getElementById('toggleAbsoluteDate').addEventListener('change', function() {

    let self = document.querySelector('.toggle-group.absolute .status');

    if ( this.checked ) {
      setEnabledStatus( self, 'Enabled' );
    } else {
      setEnabledStatus( self, 'Disabled' );
    }
  });
}

/**
 * Updates the Enabled/Disabled status of
 * Filter By Country in the popup
 * @method setAbsoluteDateStatus
 */
export function setAbsoluteDateStatus() {

  let self = document.querySelector('.toggle-group.absolute .status');

  chrome.storage.sync.get('prefs', result => {

    if ( result.prefs.absoluteDate ) {
      setEnabledStatus( self, 'Enabled' );
    } else {
      setEnabledStatus( self, 'Disabled' );
    }
    // Setup US Date Format checkbox preference
    chrome.storage.sync.get(['featurePrefs']).then(({ featurePrefs }) => {
      document.getElementById('usFormat').checked = JSON.parse(featurePrefs.usDateFormat);
    })
  });
}
