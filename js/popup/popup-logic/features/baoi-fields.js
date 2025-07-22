/**
 * Media condition hightlights features
 */

import { applySave, getTabId } from '../utils';

// ========================================================
// toggleBAOIfields
// ========================================================
/**
 * Toggles BAOI field CSS
 * @method   toggleBAOIfields
 * @param    {object}         event [the event object]
 * @return   {undefined}
 */
export async function toggleBAOIfields(event) {

  let tabId = await getTabId();

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: () => {
      let link = document.getElementById('baoiFieldsCss');
      if ( link ) { link.disabled = !link.disabled; }
    }
  }, () => { applySave(null, event); });
}
