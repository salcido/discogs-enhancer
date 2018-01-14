/**
 * Min, median, max columns
 */

import { applySave } from '../utils';

// ========================================================
// toggleColumns
// ========================================================
/**
 * Toggles the Min, Median, Max column visibility on the Collection page.
 * @method   toggleColumns
 * @param    {Object}     event [The event object]
 * @return   {undefined}
 */
export function toggleColumns(event) {

  if (event.target.checked) {

    chrome.tabs.executeScript(null, { file: 'js/extension/features/hide-min-max-columns.js' },
      function () { applySave(null, event); });

  } else {

    chrome.tabs.executeScript(null, { file: 'js/extension/features/show-min-max-columns.js' },
      function () { applySave(null, event); });
  }
}
