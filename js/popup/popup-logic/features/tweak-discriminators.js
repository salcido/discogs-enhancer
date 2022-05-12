/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * Tweak Discriminators Popup logic
 *
 */

import { setEnabledStatus, optionsToggle, notify, sendEvent } from '../utils';
/**
 * Sets the checkbox values when the popup menu is rendered
 * @returns {undefined}
 */
function setCheckboxValues() {
  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
    let settings = featureData.discriminators,
        status = document.querySelector('.toggle-group.discrims .status');
    // Submenu checkboxes
    for (let prop in settings) {
      document.getElementById(`${prop}-discrims`).checked = settings[prop];
    }

    // Enabled/Disabled status
    setTimeout(() => {
      let checked = document.getElementById('toggleTweakDiscrims').checked,
          state = checked ? 'Enabled' : 'Disabled';
      setEnabledStatus(status, state);
    }, 0);

    // Disable checkboxes
    disableBoxes();
  });
}

/**
 * Toggles checkbox enabled/disabled status
 * @returns {undefined}
 */
function disableBoxes() {
  let hide = document.querySelector('#hide-discrims'),
      boxes = ['superscript', 'transparent', 'unselectable'];

  boxes.forEach(box => {
    document.getElementById(`${box}-discrims`).disabled = hide.checked;
  });
}

/**
 * Sets up the event listeners for the Tweak Discriminators UI
 * @returns {undefined}
 */
export function init() {
  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
    let options = featureData.discriminators;
      // Expand and show the submenu
    document.querySelector('.toggle-group.discrims').addEventListener('click', function() {
      optionsToggle('#discrims', this, '.discrims', 140);
    });
    // Save the preferences
    for (let prop in options) {
      document.getElementById(`${prop}-discrims`).addEventListener('change', function() {
        chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
          featureData.discriminators[prop] = this.checked;
          chrome.storage.sync.set({ featureData }).then(() => {
            notify('refresh');
            sendEvent('Tweak Discriminators', prop, this.checked);
          });
        });
      });
    }
    // Set "enabled/disabled" status
    document.getElementById('toggleTweakDiscrims').addEventListener('change', function() {
      let self = document.querySelector('.toggle-group.discrims .status'),
          checked = this.checked,
          state = checked ? 'Enabled' : 'Disabled';
      setEnabledStatus(self, state);
    });
    // Disable checkboxes
    document.getElementById('hide-discrims').addEventListener('change', disableBoxes);
    // Set checkboxes by preference
    setCheckboxValues();
  });
}
