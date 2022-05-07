/**
 * Contextual Menus search feature
 */

import { applySave } from '../utils';
import { ContextMenuOption } from '../../../shared/constants.js'

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
    fragment = document.createDocumentFragment();

  for (const option in ContextMenuOption) {
    const menu = ContextMenuOption[option];

    let
      boxwrap = document.createElement('div'),
      input = document.createElement('input'),
      label = document.createElement('label'),
      span = document.createElement('span');

    boxwrap.className = 'checkbox-wrap';

    input.type = 'checkbox';
    input.id = menu.id;
    input.dataset.name = menu.name;

    span.textContent = menu.name;

    // Assemble markup
    label.appendChild(input);
    label.appendChild(span);
    boxwrap.appendChild(label);
    fragment.appendChild(boxwrap);
  }

  // Append all contextual menu elements
  contextMenus.appendChild(fragment);

  for (const option in ContextMenuOption) {
    const menu = ContextMenuOption[option];

    document.getElementById(menu.id).addEventListener('change', updateContextualMenu);
  }
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