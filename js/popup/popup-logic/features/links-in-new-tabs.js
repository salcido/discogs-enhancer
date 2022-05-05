/**
 * Contextual Menus search feature
 */

import { applySave, sendEvent } from '../utils';

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
export async function createLinkTabElements() {

  let tabOptionsDiv = document.getElementById('linksInTabs'),
      fragment = document.createDocumentFragment(),
      { featureData } = await chrome.storage.sync.get(['featureData']),
      { linksInTabs } = featureData,
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
    input.checked = linksInTabs[menu.value];

    span.textContent = menu.name;

    // Assemble markup
    label.appendChild(input);
    label.appendChild(span);
    boxwrap.appendChild(label);
    fragment.appendChild(boxwrap);
  });

  // Append all contextual menu elements
  tabOptionsDiv.appendChild(fragment);

  // Attach eventListeners
  menus.forEach(menu => {
    document.getElementById(menu.value).addEventListener('change', updateLinkPreference);
  });
}

// ========================================================
// updateLinkPreference
// ========================================================
/**
 * Sets the enabled/disabled preference
 */
function updateLinkPreference(event) {
  chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

    let id = event.target.id;
    featureData.linksInTabs[id] = event.target.checked;

    chrome.storage.sync.set({ featureData }).then(() => {
      applySave('refresh', event);
      sendEvent('Links In New Tabs', id, event.target.checked);
    });
  });
}
