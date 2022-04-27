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
          {
            name: 'All Day',
            id: 'allday'
          },
          {
            name: 'Bandcamp',
            id: 'bandcamp'
          },
          {
            name: 'Beatport',
            id: 'beatport'
          },
          {
            name: 'Boomkat',
            id: 'boomkat'
          },
          {
            name: 'Clone',
            id: 'clone'
          },
          {
            name: 'DeeJay',
            id: 'deejay'
          },
          {
            name: 'Discogs',
            id: 'discogs'
          },
          {
            name: 'Earcave',
            id: 'earcave'
          },
          {
            name: 'Gramaphone',
            id: 'gramaphone'
          },
          {
            name: 'Hardwax',
            id: 'hardwax'
          },
          {
            name: 'Juno',
            id: 'juno'
          },
          {
            name: 'Oye',
            id: 'oye'
          },
          {
            name: 'Phonica',
            id: 'phonica'
          },
          {
            name: 'RateYourMusic',
            id: 'rateyourmusic'
          },
          {
            name: 'Red Eye',
            id: 'redeye'
          },
          {
            name: 'Rush Hour',
            id: 'rushhour'
          },
          {
            name: 'SOTU',
            id: 'sotu'
          },
          {
            name: 'YouTube',
            id: 'youtube'
          }
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
    input.id = menu.id;
    input.dataset.name = menu.name;
    input.dataset.fn = menu.fn;

    span.textContent = menu.name;

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
    document.getElementById(menu.id).addEventListener('change', updateContextualMenu);
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
