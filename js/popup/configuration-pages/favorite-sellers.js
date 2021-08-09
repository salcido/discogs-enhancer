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

  let hasBlockList = localStorage.getItem('blockList'),
      blockList = hasBlockList ? JSON.parse(hasBlockList) : { list:[], hide: 'tag' },
      hasFavoriteList = localStorage.getItem('favoriteList'),
      favoriteList = hasFavoriteList ? JSON.parse(hasFavoriteList) : setNewfavoriteList(),
      blocklistError = 'is on your block list. You must remove them from your block list before adding them as a favorite.',
      favoriteListError = 'is already on your favorites list.';

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

    input = input.replace(/\s/g, '').trim();

    if ( input ) {
      // ga(type, category, action, label)
      if ( window.ga ) { window.ga('send', 'event', 'favorite seller', input); }

      favoriteList.list.push(input);

      favoriteList = JSON.stringify(favoriteList);

      localStorage.setItem('favoriteList', favoriteList);

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
        noSellers = '<p><em>Your favorite list is empty.</em></p>';

    if ( !sellers ) {
      document.querySelector('.blocked-sellers').insertAdjacentHTML('beforeend', noSellers);
      document.querySelector('.backup-output').textContent = '';
      document.querySelector('.backup-instructions').textContent = 'You can backup your favorites list once you add at least one seller to your list using the form above.';
    }
  }

  /**
   * Iterates over the favoriteList object and injects
   * each name as markup into the DOM
   * @returns {undefined}
   */
  function insertSellersIntoDOM() {

    favoriteList.list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    favoriteList.list.forEach(seller => {

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

    favoriteList.list.forEach((seller, i) => {

      if ( targetName === seller ) {

        favoriteList.list.splice(i, 1);

        favoriteList = JSON.stringify(favoriteList);

        localStorage.setItem('favoriteList', favoriteList);

        return setTimeout(() => updatePageData(), 400);
      }
    });
  }

  /**
   * Instantiates a new favoriteList object
   * @returns {object}
   */
  function setNewfavoriteList() {

    localStorage.setItem('favoriteList', '{"list":[]}');

    return JSON.parse(localStorage.getItem('favoriteList'));
  }

  /**
   * Show error if seller is already on the list
   * @param {string} message The message to show in the error
   * @returns {undefined}
   */
  function showError(message) {

    let input = document.getElementById('seller-input').value;

    document.querySelector('.errors').textContent = `${input} ${message}`;
  }

  /**
   * Updates the favorite sellers and the restore array data
   * on the page without refreshing.
   * @returns {undefined}
   */
  function updatePageData() {

    favoriteList = JSON.parse(localStorage.getItem('favoriteList'));
    // remove all the sellers from the DOM
    [...document.getElementsByClassName('seller')].forEach(s => s.remove());
    // Add them back in with the newly updated favoriteList data
    insertSellersIntoDOM();
    // reattach event listerns to sellers
    addSellerEventListeners();
    // update backup/restore output
    document.querySelector('.backup-output').textContent = JSON.stringify(favoriteList.list);
    // check for empty list
    checkForEmptySellersList();
  }

  /**
   * Validates the input value from the restore section by
   * checking that it is (first) parseable and (second) an Array
   * with strings in each index.
   * @param  {string} list The favorite list passed in from localStorage
   * @returns {boolean}
   */
  function validatefavoriteList(list) {

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

  // Add name to favorite list
  document.querySelector('.btn-green').addEventListener('click', () => {

    let input = document.getElementById('seller-input').value;

    if ( input
         && !favoriteList.list.includes(input)
         && !blockList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

    } else if ( favoriteList.list.includes(input) ) {

      return showError(favoriteListError);

    } else if ( blockList.list.includes(input) ) {

      return showError(blocklistError);
    }
  });

  // Restore functionality
  document.querySelector('.restore .btn-green').addEventListener('click', () => {

    let list = document.querySelector('.restore-input').value;

    if ( validatefavoriteList(list) ) {

      let restore = {
        list: JSON.parse(list),
        hide: 'tag'
      };

      localStorage.setItem('favoriteList', JSON.stringify(restore));

      return location.reload();

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
         && !favoriteList.list.includes(input)
         && !blockList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

      // name is already on the list
    } else if ( favoriteList.list.includes(input) ) {

      return showError(favoriteListError);

    } else if (blockList.list.includes(input)) {

        return showError(blocklistError);

    } else {

      // clear any previous errors
      document.querySelector('.errors').textContent = '';
    }
  });

  // ========================================================
  // DOM setup
  // ========================================================

  // Focus on input
  document.getElementById('seller-input').focus();
  updatePageData();
});
