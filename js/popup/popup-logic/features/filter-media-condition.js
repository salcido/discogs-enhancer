/**
 * Filter Media Condition feature
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

  document.querySelector('.toggle-group.condition').addEventListener('click', function () {
    optionsToggle('.hide-condition', this, '.condition', 100);
  });

  // Save the Filter by Condition Select value to chrome.storage
  document.getElementById('conditionValue').addEventListener('change', async function () {

    let toggle = document.getElementById('toggleFilterMediaCondition'),
        { featureData } = await chrome.storage.sync.get(['featureData']),
        status = document.querySelector('.toggle-group.condition .label .status');

    featureData.mediaCondition = JSON.parse(this.value);
    chrome.storage.sync.set({ featureData });

    if (!toggle.checked) {

      toggle.checked = true;
    }

    clearClasses(colors, status);

    status.textContent = conditions[this.value];
    status.classList.add(colors[this.value]);

    applySave('refresh', event);
  });
}

/**
 * Sets the text value/color of the Filter by Condition
 * setting in the popup menu when it is first rendered
 * @param {boolean} enabled Enabled or disabled state
 * @return {undefined}
 */
export function setupFilterByCondition(enabled) {
  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

    let mediaCondition = featureData.mediaCondition || 7,
        select = document.getElementById('conditionValue'),
        status = document.querySelector('.toggle-group.condition .label .status');

    if ( enabled ) {

      status.textContent = conditions[mediaCondition];
      status.classList.add(colors[mediaCondition]);

    } else {

      status.textContent = 'Disabled';
      status.classList.add('disabled');
    }

    if ( mediaCondition ) {
      select.value = mediaCondition;
    }
  });
}

/**
 * Validates that the user has a condition selected from
 * the select element before letting the user
 * enabled the feature
 * @returns {undefined}
 */
export function toggleHideConditions(event) {
  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
    let mediaCondition = featureData.mediaCondition || 7,
        status = document.querySelector('.toggle-group.condition .label .status');

    if ( !event.target.checked ) {

      status.className = 'status hide disabled';
      status.textContent = 'Disabled';

    } else {

      status.textContent = conditions[mediaCondition];
      status.classList.add(colors[mediaCondition]);
    }

    applySave('refresh', event);
  });
}
