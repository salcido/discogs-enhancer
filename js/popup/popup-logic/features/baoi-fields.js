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
    files: ['js/extension/features/toggle-baoi-fields.js']
  }, () => { applySave(null, event); });
}
