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

/**
 * Sets the theme's classname to the root documentElement
 * @method selectTheme
 * @param {string} name - The name of the theme to apply
 */
function selectTheme(name) {
  let prefix = "theme-",
      classes = document.documentElement.className.split(' ').filter(c => !c.startsWith(prefix));

  document.documentElement.className = classes.join(' ').trim();
  document.documentElement.classList.add(`${prefix}${name}`);
}

/**
 * Sets a specific dark theme
 * @method   setDarkTheme
 * @param    {Object}  event [The event object]
 * @return   {undefined}
 */
export async function setDarkTheme(event) {

  let tabId = await getTabId(),
      select = document.getElementById('themeSelect')

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: selectTheme,
    args: [select.value]
  }, () => { applySave(null, event) });
}
