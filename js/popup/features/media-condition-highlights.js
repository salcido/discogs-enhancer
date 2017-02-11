/**
 * Media condition hightlights features
 */

import { applySave } from '../utils/utils';

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

  if (event.target.checked) {

    chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-highlights.js'},
      function() { applySave( 'refresh', event); });

  } else {

    chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-highlights.js'},
      function() { applySave(null, event); });
  }
}
