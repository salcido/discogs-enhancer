/**
 * Filter by Country feature
 */

import { applySave } from '../utils';


// ========================================================
// toggleHideCountries
// ========================================================
/**
 * Validates then enables/disables the CSS for Filter Shipping Country
 * @method toggleHideCountries
 * @param  {object} event [the event object]
 * @return {undefined}
 */
export function toggleHideCountries(event) {

  let path = 'js/extension/features/toggle-filter-shipping-country-css.js';

      chrome.tabs.executeScript(null, { file: path }, () => {} );
      applySave(null, event);
}
