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
      makeId = (str) => str.replace(/ /g, '').toLowerCase(),
      menus = [
            'All Day',
            'Bandcamp',
            'Beatport',
            'Boomkat',
            'CDandLP',
            'Clone',
            'Decks',
            'DeeJay',
            'Discogs',
            'Earcave',
            'eBay',
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
            'Soundcloud',
            'Traxsource',
            'YouTube',
        ];

  // Create contextual menu elements
  menus.forEach(menu => {

    let
        boxwrap = document.createElement('div'),
        input = document.createElement('input'),
        label = document.createElement('label'),
        span = document.createElement('span'),
        id = makeId(menu);

    boxwrap.className = 'checkbox-wrap';

    input.type = 'checkbox';
    input.id = id;
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
    let id = makeId(menu);
    document.getElementById(id).addEventListener('change', updateContextualMenu);
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
