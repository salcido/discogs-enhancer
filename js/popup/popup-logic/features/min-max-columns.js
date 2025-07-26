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
    target: { tabId: tabId },
    func: () => {
      let link = document.getElementById('minMaxColumnsCss');
      if ( link ) { link.disabled = !link.disabled; }
    },
  }, () => { applySave(null, event); });
}
