/**
 * Dark theme feature
 */

import { applySave } from '../utils';

// ========================================================
// useDarkTheme
// ========================================================
/**
 * Toggles the dark theme
 * @method   useDarkTheme
 * @param    {Object}     event [The event object]
 * @return   {undefined}
 */
export function useDarkTheme(event) {

  chrome.tabs.executeScript(null, {file: 'js/extension/features/toggle-dark-theme.js'},
    function() { applySave(null, event); });
}
