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

  let { featureData } = await chrome.storage.sync.get(['featureData']),
      initialBlockList = featureData.blockList,
      favoriteList = featureData.favoriteList,
      favoriteListError = 'is on your favorites list. You must remove them from your favorites list before adding them to the block list.',
      blockListError = 'is already on your block list.';

  // ========================================================
  // Functions (Alphabetical)
  // ========================================================

  /**
   * Adds click event listeners to each seller name
   * @returns {undefined}
   */
  function addSellerEventListeners() {
    [...document.getElementsByClassName('seller-name')].forEach(name => {

      name.addEventListener('click', removeSellerName);
    });
  }

  /**
   * Adds the seller to the list
   * @returns {method}
   */
  function addSellerToList() {

    let input = document.getElementById('seller-input').value;

    input = input.replace(/\s/g,'').trim();

    if ( input ) {
      chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
        featureData.blockList.list.push(input);
        // Update chrome.storage
        chrome.storage.sync.set({ featureData }).then(() => {
          document.querySelector('.errors').textContent = '';
          return location.reload();
        });
      });
    }
  }

  /**
   * Checks for an empty seller list and displays
   * a message letting the user know their list is empty.
   * @returns {undefined}
   */
  function checkForEmptySellersList() {

    let sellers = document.querySelectorAll('.blocked-sellers .seller').length,
        noSellers = '<p><em>Your block list is empty.</em></p>';

    if ( !sellers ) {
      document.querySelector('.blocked-sellers').insertAdjacentHTML('beforeend', noSellers);
      document.querySelector('.backup-output').textContent = '';
      document.querySelector('.backup-instructions').textContent = 'You can backup your block list once you add at least one seller to your list using the form above.';
    }
  }

  /**
   * Iterates over the blockList object and injects
   * each name as markup into the DOM
   * @returns {undefined}
   */
  function insertSellersIntoDOM(blockList) {
    // Total count
    document.querySelector('.block-count').textContent = `(${blockList.list.length})`;

    blockList.list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    blockList.list.forEach(seller => {
      let node = document.createElement('div'),
          sellers = document.getElementById('blocked-sellers');

        node.className = 'seller';

        node.innerHTML = `<div class="seller-name" data-name="${seller}">
                            <span class="name">
                              <img src="../../../../img/x.svg" alt="Remove">
                              <div>${seller}</div>
                            </span>
                          </div>`;

        sellers.appendChild(node);
    });
  }

  /**
   * Checks if index is a string
   * @param {any primitive} index
   * @returns {Boolean}
   */
  function isString(index) {
    return typeof index === 'string';
  }

  /**
   * Remove the sellers name from the list/chrome.storage
   * @param {object} event The event object
   * @returns {function}
   */
  function removeSellerName(event) {

    let targetName = event.target.closest('.seller-name').dataset.name;

    event.target.parentNode.classList.add('fadeOut');

    chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

      featureData.blockList.list.forEach((seller, i) => {

        if ( targetName === seller ) {

          featureData.blockList.list.splice(i, 1);
          chrome.storage.sync.set({ featureData });
          initialBlockList = featureData.blockList;

          return setTimeout(() => updatePageData(), 400);
        }
      });
    });
  }

  /**
   * Show error if seller is already on the list
   * @returns {undefined}
   */
  function showError(message) {

    let input = document.getElementById('seller-input').value;

    document.querySelector('.errors').textContent = `${input} ${message}`;
  }

  /**
   * Updates the blocked sellers and the restore array data
   * on the page without refreshing.
   * @returns {undefined}
   */
  function updatePageData() {
    chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
      // remove all the sellers from the DOM
      [...document.getElementsByClassName('seller')].forEach(s => s.remove());
      // Add them back in with the newly updated blocklist data
      insertSellersIntoDOM(featureData.blockList);
      // reattach event listerns to sellers
      addSellerEventListeners();
      // update backup/restore output
      document.querySelector('.backup-output').textContent = JSON.stringify(featureData.blockList.list);
      // check for empty list
      checkForEmptySellersList();
    });
  }

  /**
   * Validates the input value from the restore section by
   * checking that it is first parseable and second an Array
   * with strings in each index.
   * @param  {string} list The block list passed in from chrome.storage
   * @returns {boolean}
   */
  function validateBlocklist(list) {

    let isValid = false;

    try {
      // make sure it's parsable
      list = JSON.parse(list);

    } catch (event) {

      return isValid;
    }

    // make sure every index is a string
    if ( list && Array.isArray(list) ) {

      return list.every(isString);
    }
  }

  // ========================================================
  // UI Functionality
  // ========================================================

  // Add name to block list
  document.querySelector('.btn-green').addEventListener('click', () => {

    let input = document.getElementById('seller-input').value.trim();

    if ( input
         && !initialBlockList.list.includes(input)
         && !favoriteList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

    } else if ( initialBlockList.list.includes(input) ) {

      return showError(blockListError);

    } else if ( favoriteList.list.includes(input) ) {

      return showError(favoriteListError);
    }
  });

  // Radiobutton listener
  document.getElementById('block-prefs').addEventListener('change', event => {

    chrome.storage.sync.get(['featureData']).then(({ featureData }) => {

      featureData.blockList.hide = event.target.value;

      chrome.storage.sync.set({ featureData }).then(() => {
        return location.reload();
      });
    });
  });

  // Restore functionality
  document.querySelector('.restore .btn-green').addEventListener('click', () => {

    let list = document.querySelector('.restore-input').value;

    if ( validateBlocklist(list) ) {

      let restore = {
            list: JSON.parse(list),
            hide: 'tag'
          };

      chrome.storage.sync.get(['featureData']).then(({ featureData }) => {
        featureData.blockList = restore;
        chrome.storage.sync.set({ featureData }).then(() => {
          return location.reload();
        }).catch(err => {
          if ( err.toString().includes('QUOTA_BYTES_PER_ITEM') ) {
            document.querySelector('.quota-errors').classList.remove('hide');
          }
        });
      });

    } else {

      document.querySelector('.restore-errors').classList.remove('hide');
    }
  });

  // keyup event for Enter key
  document.addEventListener('keyup', e => {

    let input = document.getElementById('seller-input').value;

    // Enter key is pressed
    if ( e.which === 13
         && input
         && !initialBlockList.list.includes(input)
         && !favoriteList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

    // name is already on the list
    } else if ( initialBlockList.list.includes(input) ) {

      return showError(blockListError);

    } else if ( favoriteList.list.includes(input) ) {

      return showError(favoriteListError);

    } else {

      // clear any previous errors
      document.querySelector('.errors').textContent = '';
    }
  });

  // ========================================================
  // DOM setup
  // ========================================================

  // Select the radio button on page load
  switch ( initialBlockList.hide ) {

    case 'tag' :
      document.getElementById('tagSellers').checked = true;
      break;

    case 'global' :
      document.getElementById('hideSellers').checked = true;
      break;

    case 'marketplace' :
      document.getElementById('showOnRelease').checked = true;
      break;
  }

  // Reset values on refresh
  document.getElementById('seller-input').value = '';
  document.querySelector('.restore-input').value = '';
  // Focus on input
  document.getElementById('seller-input').focus();
  updatePageData();
});
