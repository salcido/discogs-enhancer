/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', async () => {

  let hasConfig = await chrome.storage.sync.get(['readability']),
      initialConfig = hasConfig ? hasConfig.readability : setDefaultConfig(),
      nth = document.getElementById('nth'),
      otherMedia = document.getElementById('toggleOtherMedia'),
      otherThreshold = document.getElementById('otherMediaThreshold'),
      size = document.getElementById('size'),
      vc = document.getElementById('toggleVCreleases'),
      vcThreshold = document.getElementById('vcThreshold');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Appends options to select elements
   *
   * @method   addOptions
   * @param    {object}   targetId
   * @param    {number}   total
   * @return   {object}
   */
  function addOptions(targetId, total) {

    let fragment = document.createDocumentFragment();

    for (let i = 1; i <= total; i++) {

      let option = document.createElement('option');

      option.text = i;
      option.value = i;
      fragment.appendChild(option);
    }

    return targetId.appendChild(fragment.cloneNode(true));
  }

  /**
   * Sets default values in the config object
   *
   * @method setDefaultConfig
   * @return {object}
   */
  function setDefaultConfig() {

    let defaults = {
          indexTracks: false,
          nth: 10,
          otherMediaReadability: false,
          otherMediaThreshold: 15,
          size: 0.5,
          vcReadability: true,
          vcThreshold: 8
        };

    chrome.storage.sync.set({ readability: defaults }).then(() => {
      chrome.storage.sync.get(['readability']).then(({ readability }) => {
        return readability;
      })
    })
  }

  // ========================================================
  // DOM setup
  // ========================================================

  // Set values based on config
  vc.checked = initialConfig.vcReadability;
  otherMedia.checked = initialConfig.otherMediaReadability;
  size.value = initialConfig.size;

  addOptions(vcThreshold, 30);
  vcThreshold.value = initialConfig.vcThreshold;

  addOptions(otherThreshold, 30);
  otherThreshold.value = initialConfig.otherMediaThreshold;

  addOptions(nth, 30);
  nth.value = initialConfig.nth;

  // ==============================================
  // UI functionality
  // ==============================================

  // Vinyl, cassette, box sets, etc ...

  document.getElementById('toggleVCreleases').addEventListener('click', function(event) {

    chrome.storage.sync.get(['readability']).then(({ readability }) => {
      readability.vcReadability = event.target.checked;
      chrome.storage.sync.set({ readability });
    })
  });

  // Single CD, digital, etc ...
  document.getElementById('toggleOtherMedia').addEventListener('click', function(event) {

    chrome.storage.sync.get(['readability']).then(({ readability }) => {
      readability.otherMediaReadability = event.target.checked;
      chrome.storage.sync.set({ readability });
    })
  });

  // Value changes
  [...document.getElementsByTagName('select')].forEach(function(select) {

    select.addEventListener('change', function(event) {

      chrome.storage.sync.get(['readability']).then(({ readability }) => {
        readability[event.target.id] = JSON.parse(event.target.value);
        chrome.storage.sync.set({ readability });
      })
    });
  });
});
