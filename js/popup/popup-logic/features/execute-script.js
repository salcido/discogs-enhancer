import { applySave, getCurrentTab } from '../utils';

// ========================================================
// executeScript
// ========================================================
/**
 * Executes logic outside of popup
 * @method   executeScript
 * @param    {Object}     event [The event object]
 * @return   {undefined}
 */
export async function executeScript(event, func) {
    const tab = await getCurrentTab();

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: func
    });

    applySave(null, event);
}