/**
 * Media condition hightlights features
 */

import { applySave } from '../utils';

// ========================================================
// toggleMediaHighlights
// ========================================================
/**
 * Toggles Marketplace highlights
 * @method   toggleMediaHighlights
 * @param    {object}         event [the event object]
 * @return   {undefined}
 */
export function toggleMediaHighlights(event) {
  chrome.tabs.executeScript(null, {file: 'js/extension/features/toggle-highlights.js'},
    function() { applySave(null, event); });
}
