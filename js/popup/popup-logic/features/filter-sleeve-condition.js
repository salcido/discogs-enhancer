/**
 * Filter Sleeve Condition feature
 */

import { applySave, optionsToggle } from '../utils';

/**
 * These arrays corespond to the `.status` string [conditions] and
 * the `.status` element's classes [colors] that change when the condition
 * select element is changed.
 */
const conditions = ['Poor','Fair','Good','Good Plus','Very Good','Very Good Plus','Near Mint','Mint'];
const colors = ['poor','fair','good','good-plus','very-good','very-good-plus','near-mint','mint'];

/**
 * Removes the condition classes from the select element
 * @param {Array} classes An array of class lists for each condition
 * @param {object} status The status element to remove classes from
 * @returns {undefined}
 */
export function clearClasses(classes, status) {
  for (let i = 0; i < classes.length; i++) {
    status.classList.remove(classes[i]);
  }
}

/**
 * Sets up the event listeners for the Filter By Condition UI
 */
export function init() {

  document.querySelector('.toggle-group.sleeve-condition').addEventListener('click', function () {
    optionsToggle('.hide-sleeve-condition', this, '.sleeve-condition', 135);
  });

  // Save the Filter by Condition Select value to chrome.storage
  document.getElementById('sleeveConditionValue').addEventListener('change', function () {

    let toggle = document.getElementById('toggleFilterSleeveCondition'),
        status = document.querySelector('.toggle-group.sleeve-condition .label .status');

    chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
      featureData.sleeveCondition.value = JSON.parse(this.value);

      chrome.storage.sync.set({ featureData }).then(() => {

        if ( !toggle.checked ) {
          toggle.checked = true;
        }

        clearClasses(colors, status);

        status.textContent = conditions[this.value];
        status.classList.add(colors[this.value]);
        applySave('refresh', event);
      });
    });
  });

  // Checkbox listeners
  document.getElementById('generic').addEventListener('change', function (event) {
    chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
      featureData.sleeveCondition.generic = this.checked;
      chrome.storage.sync.set({ featureData }).then(() => {
        applySave('refresh', event);
      });
    });
  });

  document.getElementById('no-cover').addEventListener('change', function (event) {
    chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
      featureData.sleeveCondition.noCover = this.checked;
      chrome.storage.sync.set({ featureData }).then(() => {
        applySave('refresh', event);
      });
    });
  });
}

/**
 * Sets the text value/color of the Filter Sleeve Condition
 * setting in the popup menu when it is first rendered
 * @param {boolean} enabled Enabled or disabled state
 * @return {undefined}
 */
export function setupFilterSleeveCondition(enabled) {
  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

    let { sleeveCondition } = featureData,
        generic = document.getElementById('generic'),
        noCover = document.getElementById('no-cover'),
        select = document.getElementById('sleeveConditionValue'),
        status = document.querySelector('.toggle-group.sleeve-condition .label .status');

    if (enabled) {

      status.textContent = conditions[sleeveCondition.value];
      status.classList.add(colors[sleeveCondition.value]);

    } else {

      document.getElementById('toggleFilterSleeveCondition').checked = false;
      status.textContent = 'Disabled';
      status.classList.add('disabled');
    }

    select.value = sleeveCondition.value;
    generic.checked = sleeveCondition.generic;
    noCover.checked = sleeveCondition.noCover;
  });
}

/**
 * Validates that the user has a condition selected from
 * the select element before letting the user
 * enable the feature
 * @returns {undefined}
 */
export function toggleSleeveConditions(event) {
  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

    let { sleeveCondition } = featureData,
        status = document.querySelector('.toggle-group.sleeve-condition .label .status');

    if ( !event.target.checked ) {

      status.className = 'status hide disabled';
      status.textContent = 'Disabled';

    } else {

      status.textContent = conditions[sleeveCondition.value];
      status.classList.add(colors[sleeveCondition.value]);
      chrome.storage.sync.set({ featureData }).then(() => {
        return applySave('refresh', event);
      });
    }

    applySave('refresh', event);
  });
}
