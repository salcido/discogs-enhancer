/**
 * Media condition hightlights features
 */

import { applySave } from '../utils';

// ========================================================
// toggleBAOIfields
// ========================================================
/**
 * Toggles BAOI field CSS
 * @method   toggleBAOIfields
 * @param    {object}         event [the event object]
 * @return   {undefined}
 */
export function toggleBAOIfields(event) {
  chrome.tabs.executeScript(null, {file: 'js/extension/features/toggle-baoi-fields.js'},
    function() { applySave(null, event); });
}
