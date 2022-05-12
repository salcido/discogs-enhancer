/**
 * Media condition hightlights features
 */

import { applySave, getTabId } from '../utils';

// ========================================================
// toggleYtPlaylists
// ========================================================
/**
 * Toggles BAOI field CSS
 * @method   toggleYtPlaylists
 * @param    {object}         event [the event object]
 * @return   {undefined}
 */
export async function toggleYtPlaylists(event) {

  let tabId = await getTabId();

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['js/extension/features/toggle-youtube-playlists.js']
  }, () => { applySave(null, event) });
}
