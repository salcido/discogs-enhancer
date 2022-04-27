/**
 * Min, median, max columns
 */

import { applySave, getTabId } from '../utils';

// ========================================================
// toggleColumns
// ========================================================
/**
 * Toggles the Min, Median, Max column visibility on the Collection page.
 * @method   toggleColumns
 * @param    {Object}     event [The event object]
 * @return   {undefined}
 */
export async function toggleColumns(event) {

  let tabId = await getTabId();

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['js/extension/features/toggle-min-max-columns.js']
  }, () => { applySave(null, event) });
}
