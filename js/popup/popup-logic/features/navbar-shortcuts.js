/**
 * Navbar Shortcuts feature
 */

 import { applySave } from '../utils';

 // ========================================================
 // createShortcutElements
 // ========================================================
 /**
  * Creates Shortcut markup inside the Navbar Shortcuts menu
  */
 export async function createShortcutElements() {

    const defaults = {
      collection: false,
      inventory: false,
      itemsIWant: false,
      orders: false,
      purchases: false,
      subsAndDrafts: false,
    };

   let navOptionsDiv = document.getElementById('navbarShortcuts'),
       fragment = document.createDocumentFragment(),
       { featureData } = await chrome.storage.sync.get(['featureData']),
       { navbarShortcuts = defaults } = featureData,
       menus = [
           {
             name: 'Collection',
             value: 'collection',
           },
           {
            name: 'Inventory',
            value: 'inventory',
           },
           {
             name: 'Items I Want',
             value: 'itemsIWant',
           },
           {
            name: 'Orders',
            value: 'orders',
           },
           {
             name: 'Purchases',
             value: 'purchases',
           },
           {
             name: 'Subs & Drafts',
             value: 'subsAndDrafts',
           },
         ];

   // Create menu elements
   menus.forEach(menu => {
     let
         boxwrap = document.createElement('div'),
         input = document.createElement('input'),
         label = document.createElement('label'),
         span = document.createElement('span');

     boxwrap.className = 'checkbox-wrap';

     input.type = 'checkbox';
     input.id = menu.value;
     input.checked = navbarShortcuts[menu.value];

     span.textContent = menu.name;

     // Assemble markup
     label.appendChild(input);
     label.appendChild(span);
     boxwrap.appendChild(label);
     fragment.appendChild(boxwrap);
   });

   // Append all contextual menu elements
   navOptionsDiv.appendChild(fragment);

   // Attach eventListeners
   menus.forEach(menu => {
     document.getElementById(menu.value).addEventListener('change', updateShortcutPreference);
   });
 }

 // ========================================================
 // updateShortcutPreference
 // ========================================================
 /**
  * Sets the enabled/disabled preference
  */
 function updateShortcutPreference(event) {
   chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

    if (!featureData.navbarShortcuts) {
      featureData.navbarShortcuts = {
        collection: false,
        inventory: false,
        itemsIWant: false,
        orders: false,
        purchases: false,
        subsAndDrafts: false,
      };
    }

    let id = event.target.id;

    featureData.navbarShortcuts[id] = event.target.checked;

    chrome.storage.sync.set({ featureData }).then(() => {
      applySave('refresh', event);
    });
  });
 }
