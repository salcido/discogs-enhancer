/**
 * Filter By Condition feature
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

  // Save the Filter by Condition Select value to localStorage
  document.getElementById('conditionValue').addEventListener('change', function () {

    let toggle = document.getElementById('toggleFilterByCondition'),
      itemCondition = localStorage.getItem('itemCondition'),
      status = document.querySelector('.toggle-group.condition .label .status');

    itemCondition = this.value;
    localStorage.setItem('itemCondition', String(itemCondition));

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

  let select = document.getElementById('conditionValue'),
      setting = Number(localStorage.getItem('itemCondition')),
      status = document.querySelector('.toggle-group.condition .label .status');

  if ( enabled ) {

    status.textContent = conditions[setting];
    status.classList.add(colors[setting]);

  } else {

    status.textContent = 'Disabled';
    status.classList.add('disabled');
  }

  if ( setting ) {
    select.value = setting;
  }
}

/**
 * Validates that the user has a condition selected from
 * the select element before letting the user
 * enabled the feature
 * @returns {undefined}
 */
export function toggleHideConditions(event) {

  let setting = Number(localStorage.getItem('itemCondition')),
      status = document.querySelector('.toggle-group.condition .label .status');

  if ( !event.target.checked ) {

    status.className = 'status hide disabled';
    status.textContent = 'Disabled';

  } else {

    status.textContent = conditions[setting];
    status.classList.add(colors[setting]);
  }

  applySave('refresh', event);
}
