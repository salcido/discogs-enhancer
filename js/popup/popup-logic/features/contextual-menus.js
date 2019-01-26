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
            fn: 'searchAllDay',
            id: 'allday'
          },
          {
            name: 'Bandcamp',
            fn: 'searchBandcamp',
            id: 'bandcamp'
          },
          {
            name: 'Boomkat',
            fn: 'searchBoomkat',
            id: 'boomkat'
          },
          {
            name: 'Clone',
            fn: 'searchClone',
            id: 'clone'
          },
          {
            name: 'DeeJay',
            fn: 'searchDeeJay',
            id: 'deejay'
          },
          {
            name: 'Discogs',
            fn: 'searchDiscogs',
            id: 'discogs'
          },
          {
            name: 'Earcave',
            fn: 'searchEarcave',
            id: 'earcave'
          },
          {
            name: 'Gramaphone',
            fn: 'searchGramaphone',
            id: 'gramaphone'
          },
          {
            name: 'Halcyon',
            fn: 'searchHalcyon',
            id: 'halcyon'
          },
          {
            name: 'Hardwax',
            fn: 'searchHardwax',
            id: 'hardwax'
          },
          {
            name: 'InSound',
            fn: 'searchInsound',
            id: 'insound'
          },
          {
            name: 'Juno',
            fn: 'searchJuno',
            id: 'juno'
          },
          {
            name: 'Kristina',
            fn: 'searchKristina',
            id: 'kristina'
          },
          {
            name: 'Oye',
            fn: 'searchOye',
            id: 'oye'
          },
          {
            name: 'Phonica',
            fn: 'searchPhonica',
            id: 'phonica'
          },
          {
            name: 'Rush Hour',
            fn: 'searchRushhour',
            id: 'rushhour'
          },
          {
            name: 'SOTU',
            fn: 'searchSotu',
            id: 'sotu'
          },
          {
            name: 'YouTube',
            fn: 'searchYoutube',
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

  if (event.target.checked) {

    chrome.runtime.sendMessage({
      fn: event.target.dataset.fn,
      id: event.target.id,
      method: 'create',
      name: event.target.dataset.name,
      request: 'updateContextMenu'
    });

    applySave(null, event);

  } else {

    chrome.runtime.sendMessage({
      id: event.target.id,
      method: 'remove',
      request: 'updateContextMenu'
    });

    applySave(null, event);
  }
}
