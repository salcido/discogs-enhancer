/**
 * Dark theme feature
 */

import { applySave, getTabId } from '../utils';

// ========================================================
// useDarkTheme
// ========================================================
/**
 * Toggles the dark theme
 * @method   useDarkTheme
 * @param    {Object}     event [The event object]
 * @return   {undefined}
 */
export async function useDarkTheme(event) {

  let tabId = await getTabId();

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['js/extension/features/toggle-dark-theme.js']
  }, () => { applySave(null, event) });
}
