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

import { setEnabledStatus, optionsToggle, notify } from '../utils';

const LS_KEY = 'discriminators';
const DEFAULTS = {
  hide: false,
  superscript: true,
  unselectable: true,
  transparent: false,
};

/**
 * Gets the feature's setting values
 * @param {Object} lsObject - the localStorage object that saves the user's preferences
 * @returns {Object} - The user's preferences or the default settings
 */
function getSettings(lsObject) {
  let obj = localStorage.getItem(lsObject) || null;
  if (obj) return JSON.parse(obj);
  localStorage.setItem(LS_KEY, JSON.stringify(DEFAULTS));
  return DEFAULTS;
}

/**
 * Saves the user's preferences to localStorage
 * @param {Object} lsObject - The localStorage object that saves the user's preferences
 * @param {String} key - The name of the preference
 * @param {Boolean} value - The preference value
 * @returns {undefined}
 */
function setSettings(lsObject, key, value) {
  let obj = getSettings(lsObject) || DEFAULTS;
  obj[key] = value;
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

/**
 * Sets the checkbox values when the popup menu is rendered
 * @returns {undefined}
 */
function setCheckboxValues() {
  let settings = getSettings(LS_KEY),
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
  // Expand and show the submenu
  document.querySelector('.toggle-group.discrims').addEventListener('click', function() {
    optionsToggle('#discrims', this, '.discrims', 140);
  });
  // Save the preferences
  for (let prop in getSettings(LS_KEY)) {
    document.getElementById(`${prop}-discrims`).addEventListener('change', function() {
      setSettings(LS_KEY, prop, this.checked);
      notify('refresh');
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
}
