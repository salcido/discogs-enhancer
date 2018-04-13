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

  chrome.tabs.executeScript(null, { file: 'js/extension/features/toggle-min-max-columns.js' },
    function () { applySave(null, event); });
}
