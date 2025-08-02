/**
 * Compact Marketplace
 */

 import { applySave, getTabId } from '../utils';

 // ========================================================
 // toggleCompactMarketplace
 // ========================================================
 /**
  * Toggles the compact marketplace css on the Shop my wants page
  * @method   toggleCompactMarketplace
  * @param    {Object}     event [The event object]
  * @return   {undefined}
  */
 export async function toggleCompactMarketplace(event) {

   let tabId = await getTabId();

   chrome.scripting.executeScript({
     target: { tabId: tabId },
     func: () => {
      let link = document.getElementById('compactMarketplaceCss');
      if ( link ) { link.disabled = !link.disabled; }
     }
   }, () => { applySave(null, event); });
 }
