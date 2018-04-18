/**
 * Filter By Condition feature
 */

import { applySave } from '../utils';

// ========================================================
// setupFilterByCondition
// ========================================================
/**
 * Sets the text value/color of the Filter by Condition
 * setting in the popup menu when it is first rendered
 * @param {boolean} enabled Enabled or disabled state
 * @return {undefined}
 */
export function setupFilterByCondition(enabled) {

  let
      setting = Number(localStorage.getItem('itemCondition')),
      status = document.querySelector('.toggle-group.condition .label .status'),
      select = document.getElementById('conditionValue'),
      conditions = ['Poor',
                    'Fair',
                    'Good',
                    'Good Plus',
                    'Very Good',
                    'Very Good Plus',
                    'Near Mint',
                    'Mint'],
      colors = ['poor',
                'fair',
                'good',
                'good-plus',
                'very-good',
                'very-good-plus',
                'near-mint',
                'mint'];

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
 * Removes the condition classes from the select element
 * @param {Array} classes An array of class lists for each condition
 * @param {object} status The status element to remove classes from
 * @returns {undefined}
 */
export function removeClasses(classes, status) {
  for ( let i = 0; i < classes.length; i++ ) {
    status.classList.remove(classes[i]);
  }
}

// ========================================================
// toggleHideConditions
// ========================================================
/**
 * Validates that the user has a condition selected from
 * the select element before letting the user
 * enabled the feature
 * @returns {undefined}
 */
export function toggleHideConditions(event) {

  let setting = Number(localStorage.getItem('itemCondition')),
      status = document.querySelector('.toggle-group.condition .label .status'),
      conditions = ['Poor',
                    'Fair',
                    'Good',
                    'Good Plus',
                    'Very Good',
                    'Very Good Plus',
                    'Near Mint',
                    'Mint'],
      colors = ['poor',
                'fair',
                'good',
                'good-plus',
                'very-good',
                'very-good-plus',
                'near-mint',
                'mint'];

  if ( !event.target.checked ) {

    status.className = 'status hide disabled';
    status.textContent = 'Disabled';

  } else {

    status.textContent = conditions[setting];
    status.classList.add(colors[setting]);
  }

  applySave('refresh', event);

  if ( _gaq ) {

    _gaq.push(['_trackEvent', `Marketplace Filter: ${conditions[setting]}`, 'Marketplace Filter']);
  }
}
