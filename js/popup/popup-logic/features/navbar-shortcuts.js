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
      forum: false,
      groups: false,
      inventory: false,
      itemsIWant: false,
      listAnItem: false,
      orders: false,
      profile: false,
      purchases: false,
      storefront: false,
      subsAndDrafts: false,
    };

   let navOptionsDiv = document.getElementById('navbarShortcuts'),
       fragment = document.createDocumentFragment(),
       { featureData } = await chrome.storage.sync.get(['featureData']),
       { navbarShortcuts = defaults } = featureData,
       menus = [
           {
            name: 'Forum',
            value: 'forum',
           },
           {
            name: 'Groups',
            value: 'groups',
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
             name: 'List An Item',
             value: 'listAnItem',
           },
           {
            name: 'Orders',
            value: 'orders',
           },
           {
            name: 'Profile',
            value: 'profile'
           },
           {
             name: 'Purchases',
             value: 'purchases',
           },
           {
            name: 'My Storefront',
            value: 'storefront',
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
        forum: false,
        groups: false,
        inventory: false,
        itemsIWant: false,
        listAnItem: false,
        orders: false,
        profile: false,
        purchases: false,
        storefront: false,
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
