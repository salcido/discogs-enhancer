/**
 * Contextual Menus search feature
 *
 * TODO:
 * - Save link preferences to localStorage
 * - Pass prefs to frontend via background.js
 * - Only save enabled boolean to chrome.storage
 */

import { applySave } from '../utils';

const defaults = {
  artists: false,
  collection: false,
  dashboard: false,
  labels: false,
  lists: false,
  marketplace: false,
  releases: false,
  wantlist: false,
};

// ========================================================
// createLinkTabElements
// ========================================================
/**
 * Creates contextual menu markup inside the
 * Contextual Menu options feature in the popup.
 */
export function createLinkTabElements() {
  // TODO: rename linkTabs to someting more descriptive
  let linkTabs = document.getElementById('linksInTabs'),
      fragment = document.createDocumentFragment(),
      prefs = getPreferences(),
      menus = [
          {
            name: 'Artists',
            value: 'artists',
          },
          {
            name: 'Collection',
            value: 'collection',
          },
          {
            name: 'Dashboard',
            value: 'dashboard',
          },
          {
            name: 'Labels',
            value: 'labels',
          },
          {
            name: 'Lists',
            value: 'lists',
          },
          {
            name: 'Marketplace',
            value: 'marketplace',
          },
          {
            name: 'Releases',
            value: 'releases',
          },
          {
            name: 'Wantlist',
            value: 'wantlist'
          },
        ];

  // Create contextual menu elements
  menus.forEach(menu => {
    let
        boxwrap = document.createElement('div'),
        input = document.createElement('input'),
        label = document.createElement('label'),
        span = document.createElement('span');

    boxwrap.className = 'checkbox-wrap';

    input.type = 'checkbox';
    input.id = menu.value;
    input.checked = prefs[menu.value];

    span.textContent = menu.name;

    // Assemble markup
    label.appendChild(input);
    label.appendChild(span);
    boxwrap.appendChild(label);
    fragment.appendChild(boxwrap);
  });

  // Append all contextual menu elements
  linkTabs.appendChild(fragment);

  // Attach eventListeners
  menus.forEach(menu => {
    document.getElementById(menu.value).addEventListener('change', updateLinkPreference);
  });
}

/**
 * Returns the saved preferences as an object
 */
function getPreferences() {
  let prefs = JSON.parse(localStorage.getItem('linksInTabs')) || defaults;
  return prefs;
}

function setPreferences(prefs) {
  localStorage.setItem('linksInTabs', JSON.stringify(prefs));
}

// ========================================================
// updateLinkPreference
// ========================================================
/**
 * Sets the enabled/disabled preference
 */
function updateLinkPreference(event) {

  let prefs = getPreferences(),
      id = event.target.id;

  prefs[id] = event.target.checked;
  setPreferences(prefs);

  applySave('refresh', event);
}
