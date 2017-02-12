/**
 * Filter By Condition feature
 */

import { applySave } from '../utils/utils';

// ========================================================
// setupFilterByCondition
// ========================================================
/**
 * Sets the text value/color of the Filter by Condition setting in the popup menu
 * @method   setupFilterByCondition
 * @return   {undefined}
 */
export function setupFilterByCondition() {

  let
      setting = Number(localStorage.getItem('itemCondition')),
      status = document.querySelector('.toggle-group.condition .label .condition-status'),
      conditions = ['Poor (P)',
                    'Fair (F)',
                    'Good (G)',
                    'Good Plus (G+)',
                    'Very Good (VG)',
                    'Very Good Plus (VG+)',
                    'Near Mint (NM/M-)',
                    'Mint (M)'],
      colors = ['poor',
                'fair',
                'good',
                'good-plus',
                'very-good',
                'very-good-plus',
                'near-mint',
                'mint'];

  if (setting === 0 || setting === null) {

    status.textContent = 'Disabled';
    status.className = 'condition-status disabled';

  } else {

    status.textContent = conditions[setting];
    status.className = 'condition-status ' + colors[setting];
  }
}

// ========================================================
// setFilterByConditionValue
// ========================================================
/**
 * Sets the value that will hide items in the
 * Marketplace based on condition
 * @method   setFilterByConditionValue
 * @param    {Object}       event [The event object]
 */
export function setFilterByConditionValue(event) {

  let selectValue = event.target[event.target.selectedIndex].value;

  // Filter is disabled
  if (!selectValue) {

    localStorage.removeItem('itemCondition');

    if (_gaq) {

      _gaq.push(['_trackEvent', 'Marketplace Filter: Disabled', 'Marketplace Filter']);
    }

  // Filter is enabled
  } else {

    // set new value on change
    localStorage.setItem( 'itemCondition', String(selectValue) );

    if (_gaq) {

      let conditions = ['Poor (P)',
                        'Fair (F)',
                        'Good (G)',
                        'Good Plus (G+)',
                        'Very Good (VG)',
                        'Very Good Plus (VG+)',
                        'Near Mint (NM/M-)',
                        'Mint (M)'],

          setting = Number(localStorage.getItem('itemCondition'));

      _gaq.push(['_trackEvent', `Marketplace Filter: ${conditions[setting]}`, 'Marketplace Filter']);
    }
  }

  setupFilterByCondition();
  applySave('refresh', event);
}
