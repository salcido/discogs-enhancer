/**
 * Dark theme feature
 */

import { applySave, getTabId } from '../utils';

// ========================================================
// useDarkTheme
// ========================================================

/**
 * Toggles the Dark Theme on / off on Discogs.com
 * @param {boolean} enabled - Whether the feature is enabled
 */
function toggleTheme(enabled) {

  let host = document.querySelector('[id^=__header_root_]');

  if (enabled) {
    document.documentElement.classList.add('de-dark-theme');

    if (host && host.shadowRoot) {
      host.shadowRoot.querySelector('div').classList.add('de-dark-theme');
    }

  } else {
    document.documentElement.classList.remove('de-dark-theme');

    if (host && host.shadowRoot) {
      host.shadowRoot.querySelector('div').classList.remove('de-dark-theme');
    }
  }
}

/**
 * Enables / Disables the dark theme
 * @method   useDarkTheme
 * @param    {Object} event [The event object]
 * @return   {undefined}
 */
export async function useDarkTheme(event) {

  let tabId = await getTabId();

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: toggleTheme,
    args: [event.target.checked],
  }, () => { applySave(null, event); });
}

/**
 * Sets the theme's classname to the root documentElement
 * @method selectTheme
 * @param {string} name - The name of the theme to apply
 */
function selectTheme(name) {
  let prefix = 'theme-',
      classes = document.documentElement.className.split(' ').filter(c => !c.startsWith(prefix));

  document.documentElement.className = classes.join(' ').trim();
  document.documentElement.classList.add(`${prefix}${name}`);
}

/**
 * Sets a specific dark theme
 * @method   setDarkTheme
 * @param    {Object} event [The event object]
 * @return   {undefined}
 */
export async function setDarkTheme(event) {

  let tabId = await getTabId(),
      select = document.getElementById('themeSelect');

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: selectTheme,
    args: [select.value]
  }, () => { applySave(null, event); });
}
