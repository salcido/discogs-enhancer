/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This is the background service worker. It handles setting up the initial
 * feature preferences, badge notifications, and adding / removing
 * contextual menu items.
 *
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Copies all Discogs Enhancer data saved in chrome.storage.sync
   * to the clipboard.
   */
  function copyPrefs() {
    let savedPreferences = {};

    chrome.storage.sync.get(null, function(data) {
      if (chrome.runtime.lastError) {
        document.querySelector('.backup-error').textContent = `Error: ${chrome.runtime.lastError.message}`;
        return;
      } else {
        savedPreferences = data;
        navigator.clipboard.writeText(JSON.stringify(savedPreferences));
        document.querySelector('button.copy-prefs').textContent = 'Copied!';
        document.querySelector('button.copy-prefs').disabled = true;
      }
    });
  }
  /**
   * Overwrites all Discogs Enhancer data in chrome.storage.sync
   */
  function savePrefs() {

    let pastedValue = document.querySelector('#restore').value,
        restorePrefs = null;

    if ( pastedValue === '' ) return;

    try {

      restorePrefs = JSON.parse(pastedValue);

      if ( typeof restorePrefs === 'object'
            && !Array.isArray(restorePrefs)
            && restorePrefs !== null
            && Object.prototype.hasOwnProperty.call(restorePrefs, 'didUpdate')
            && Object.prototype.hasOwnProperty.call(restorePrefs, 'featureData')
            && Object.prototype.hasOwnProperty.call(restorePrefs, 'prefs') ) {

        chrome.storage.sync.set(restorePrefs);

        document.querySelector('button.save-prefs').textContent = 'Saved!';
        document.querySelector('.restore-error').textContent = '';
        document.querySelector('button.save-prefs').disabled = true;
        document.querySelector('.de-group').style.display = 'none';
        document.querySelector('#restore').value = '';

      } else {
        document.querySelector('.restore-error').textContent = 'Preferences cannot be restored because the data is incomplete.';
        document.querySelector('.de-group').style.display = 'block';
      }
    } catch (error) {
        document.querySelector('.restore-error').textContent = `Preferences cannot be restored because the data is malformed. ${error}`;
        document.querySelector('.de-group').style.display = 'block';
    }
  }

  // ========================================================
  // DOM setup
  // ========================================================

  document.querySelector('button.copy-prefs').addEventListener('click', () => {
    copyPrefs();
  });

  document.querySelector('button.save-prefs').addEventListener('click', () => {
    savePrefs();
  });
});
