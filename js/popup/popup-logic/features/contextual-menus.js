/**
 * Contextual Menus search feature
 */

import { applySave } from '../utils';

// ========================================================
// createContextualMenuElements
// ========================================================
/**
 * Creates contextual menu markup inside the
 * Contextual Menu options feature in the popup.
 * @method createContextualMenuElements
 * @return {undefined}
 */
export function createContextualMenuElements() {

  let contextMenus = document.getElementById('contextMenus'),
      fragment = document.createDocumentFragment(),
      menus = [
            'All Day',
            'Bandcamp',
            'Beatport',
            'Boomkat',
            'CDandLP',
            'Clone',
            'DeeJay',
            'Discogs',
            'Earcave',
            'Gramaphone',
            'Hardwax',
            'Juno',
            'Meditations',
            'Norman',
            'Oye',
            'Phonica',
            'RateYourMusic',
            'Red Eye',
            'Rubadub',
            'Rush Hour',
            'SOTU',
            'YouTube',
        ];

  // Create contextual menu elements
  menus.forEach(menu => {

    let
        boxwrap = document.createElement('div'),
        input = document.createElement('input'),
        label = document.createElement('label'),
        span = document.createElement('span'),
        menuId = menu.replace(/ /g, '').toLowerCase();

    boxwrap.className = 'checkbox-wrap';

    input.type = 'checkbox';
    input.id = menuId
    input.dataset.name = menu;

    span.textContent = menu;

    // Assemble markup
    label.appendChild(input);
    label.appendChild(span);
    boxwrap.appendChild(label);
    fragment.appendChild(boxwrap);
  });

  // Append all contextual menu elements
  contextMenus.appendChild(fragment);

  // Attach eventListeners
  menus.forEach(menu => {
    let menuId = menu.replace(/ /g, '').toLowerCase();
    document.getElementById(menuId).addEventListener('change', updateContextualMenu);
  });
}

// ========================================================
// updateContextualMenu
// ========================================================
/**
 * Creates/removes contextual menu items
 * @method   updateContextualMenu
 * @param    {Object}   event [The event object]
 * @return   {undefined}
 */
function updateContextualMenu(event) {
  let port = chrome.runtime.connect();

  port.postMessage({ request: 'updateContextMenu' });
  applySave(null, event);
}
