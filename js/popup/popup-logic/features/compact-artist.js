/**
 * Compact Artist Pages
 */

 import { applySave, getTabId } from '../utils';

 // ========================================================
 // toggleCompactArtist
 // ========================================================
 /**
  * Toggles the compact artist css on the Artist page
  * @method   toggleCompactArtist
  * @param    {Object}     event [The event object]
  * @return   {undefined}
  */
 export async function toggleCompactArtist(event) {

   let tabId = await getTabId();

   chrome.scripting.executeScript({
     target: { tabId: tabId },
     func: () => {
      let link = document.getElementById('compactArtistCss');
      if ( link ) { link.disabled = !link.disabled; }
     }
   }, () => { applySave(null, event); });
 }
