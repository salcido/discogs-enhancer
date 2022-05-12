/**
 * Media condition hightlights features
 */

import { applySave, getTabId } from '../utils';

// ========================================================
// toggleMediaHighlights
// ========================================================
/**
 * Toggles Marketplace highlights
 * @method   toggleMediaHighlights
 * @param    {object}         event [the event object]
 * @return   {undefined}
 */
export async function toggleMediaHighlights(event) {

  let tabId = await getTabId();

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['js/extension/features/toggle-highlights.js']
  }, () => { applySave(null, event) });
}
