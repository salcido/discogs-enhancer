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

  if (event.target.checked) {

    chrome.tabs.executeScript(null, {file: 'js/extension/features/apply-dark-theme.js'},
      function() { applySave(null, event); });

  } else {

    chrome.tabs.executeScript(null, {file: 'js/extension/features/remove-dark-theme.js'},
      function() { applySave(null, event); });
  }
}
