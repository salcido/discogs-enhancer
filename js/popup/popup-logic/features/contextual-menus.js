/**
 * Contextual Menus search feature
 */

import { applySave } from '../utils/utils';

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
            dataName: 'Bandcamp',
            fn: 'searchBandcamp',
            id: 'bandcamp'
          },
          {
            dataName: 'Boomkat',
            fn: 'searchBoomkat',
            id: 'boomkat'
          },
          {
            dataName: 'Clone',
            fn: 'searchClone',
            id: 'clone'
          },
          {
            dataName: 'Decks.de',
            fn: 'searchDecks',
            id: 'decks'
          },
          {
            dataName: 'DeeJay',
            fn: 'searchDeeJay',
            id: 'deejay'
          },
          {
            dataName: 'Discogs',
            fn: 'searchDiscogs',
            id: 'discogs'
          },
          {
            dataName: 'Gramaphone',
            fn: 'searchGramaphone',
            id: 'gramaphone'
          },
          {
            dataName: 'Halcyon',
            fn: 'searchHalcyon',
            id: 'halcyon'
          },
          {
            dataName: 'Hardwax',
            fn: 'searchHardwax',
            id: 'hardwax'
          },
          {
            dataName: 'InSound',
            fn: 'searchInsound',
            id: 'insound'
          },
          {
            dataName: 'Juno',
            fn: 'searchJuno',
            id: 'juno'
          },
          {
            dataName: 'Kristina',
            fn: 'searchKristina',
            id: 'kristina'
          },
          {
            dataName: 'Oye',
            fn: 'searchOye',
            id: 'oye'
          },
          {
            dataName: 'PBVinyl',
            fn: 'searchPbvinyl',
            id: 'pbvinyl'
          },
          {
            dataName: 'Phonica',
            fn: 'searchPhonica',
            id: 'phonica'
          },
          {
            dataName: 'SOTU',
            fn: 'searchSotu',
            id: 'sotu'
          },
          {
            dataName: 'YouTube',
            fn: 'searchYoutube',
            id: 'youtube'
          }
        ];

  // Create contextual menu elements
  menus.forEach(function(menu, i) {

    let
        boxwrap = document.createElement('div'),
        input = document.createElement('input'),
        label = document.createElement('label'),
        span = document.createElement('span');

    boxwrap.className = 'checkbox-wrap';

    input.type = 'checkbox';
    input.id = menu.id;
    input.dataset.name = menu.dataName;
    input.dataset.fn = menu.fn;

    span.textContent = menu.dataName;

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
