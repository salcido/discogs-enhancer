/**
 * Filter by Country feature
 */

import { applySave, getTabId } from '../utils';


// ========================================================
// toggleHideCountries
// ========================================================
/**
 * Validates then enables/disables the CSS for Filter Shipping Country
 * @method toggleHideCountries
 * @param  {object} event [the event object]
 * @return {undefined}
 */
export async function toggleHideCountries(event) {

  let tabId = await getTabId();

  chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: () => {
      let link = document.getElementById('filterShippingCountryCss');
      if ( link ) { link.disabled = !link.disabled; }
    }
  }, () => { applySave(null, event); });
}
