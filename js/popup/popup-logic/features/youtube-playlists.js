/**
 * Media condition hightlights features
 */

import { applySave } from '../utils';

// ========================================================
// toggleYtPlaylists
// ========================================================
/**
 * Toggles BAOI field CSS
 * @method   toggleYtPlaylists
 * @param    {object}         event [the event object]
 * @return   {undefined}
 */
export function toggleYtPlaylists(event) {
  chrome.tabs.executeScript(null, { file: 'js/extension/features/toggle-youtube-playlists.js' },
    function () { applySave(null, event); });
}
