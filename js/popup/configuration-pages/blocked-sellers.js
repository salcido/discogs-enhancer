/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', () => {

  let blockList = JSON.parse(localStorage.getItem('blockList')) || setNewBlocklist();

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

      blockList.list.push(input);

      blockList = JSON.stringify(blockList);

      localStorage.setItem('blockList', blockList);

      document.querySelector('.errors').textContent = '';

      return location.reload();
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
  function insertSellersIntoDOM() {

    blockList.list.forEach(seller => {

      let node = document.createElement('div'),
          sellers = document.getElementById('blocked-sellers');

      node.className = 'seller';

      node.innerHTML = `<div class="seller-name">
                          <span class="name">
                            ${seller}
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
   * Remove the sellers name from the list/localStorage
   * @param {object} event The event object
   * @returns {function}
   */
  function removeSellerName(event) {

    let targetName = event.target.innerHTML.trim();

    event.target.parentNode.classList.add('fadeOut');

    blockList.list.forEach((seller, i) => {

      if ( targetName === seller ) {

        blockList.list.splice(i, 1);

        blockList = JSON.stringify(blockList);

        localStorage.setItem('blockList', blockList);

        return setTimeout(() => updatePageData(), 400);
      }
    });
  }

  /**
   * Instantiates a new blocklist object
   * @returns {object}
   */
  function setNewBlocklist() {

    localStorage.setItem('blockList', '{"list":[], "hide": "tag"}');

    return JSON.parse(localStorage.getItem('blockList'));
  }

  /**
   * Show error if seller is already on the list
   * @returns {undefined}
   */
  function showError() {

    let input = document.getElementById('seller-input').value;

    document.querySelector('.errors').textContent = `${input} is already on your block list.`;
  }

  /**
   * Updates the blocked sellers and the restore array data
   * on the page without refreshing.
   * @returns {undefined}
   */
  function updatePageData() {

    blockList = JSON.parse(localStorage.getItem('blockList'));
    // remove all the sellers from the DOM
    [...document.getElementsByClassName('seller')].forEach(s => s.remove());
    // Add them back in with the newly updated blocklist data
    insertSellersIntoDOM();
    // reattach event listerns to sellers
    addSellerEventListeners();
    // update backup/restore output
    document.querySelector('.backup-output').textContent = JSON.stringify(blockList.list);
    // check for empty list
    checkForEmptySellersList();
  }

  /**
   * Validates the input value from the restore section by
   * checking that it is first parseable and second an Array
   * with strings in each index.
   * @param  {string} list The block list passed in from localStorage
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

    let input = document.getElementById('seller-input').value;

    if ( input && !blockList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

    } else if ( blockList.list.includes(input) ) {

      return showError();
    }
  });

  // Radiobutton listener
  document.getElementById('block-prefs').addEventListener('change', event => {

    blockList = JSON.parse(localStorage.getItem('blockList'));

    blockList.hide = event.target.value;

    blockList = JSON.stringify(blockList);

    localStorage.setItem('blockList', blockList);

    return location.reload();
  });

  // Restore functionality
  document.querySelector('.restore .btn-green').addEventListener('click', () => {

    let list = document.querySelector('.restore-input').value;

    if ( validateBlocklist(list) ) {

      let restore = {
                      list: JSON.parse(list),
                      hide: 'tag'
                    };

      localStorage.setItem('blockList', JSON.stringify(restore));

      return location.reload();

    } else {

      document.querySelector('.restore-errors').classList.remove('hide');
    }
  });

  // keyup event for Enter key
  document.addEventListener('keyup', e => {

    let input = document.getElementById('seller-input').value;

    // Enter key is pressed
    if ( e.which === 13 && input && !blockList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

    // name is already on the list
  } else if ( blockList.list.includes(input) ) {

      return showError();

    } else {

      // clear any previous errors
      document.querySelector('.errors').textContent = '';
    }
  });

  // ========================================================
  // DOM setup
  // ========================================================

  // Select the radio button on page load
  switch ( blockList.hide ) {

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

  // Focus on input
  document.getElementById('seller-input').focus();
  updatePageData();
});
