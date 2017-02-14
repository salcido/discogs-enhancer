/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', function () {

  let blockList = JSON.parse(localStorage.getItem('blockList')) || setNewBlocklist();

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Instantiates a new blocklist object
   *
   * @method setNewBlocklist
   * @return {object}
   */
  function setNewBlocklist() {

    localStorage.setItem('blockList', '{"list":[], "hide": "tag"}');

    return JSON.parse(localStorage.getItem('blockList'));
  }

  /**
   * Adds the seller to the list, duh!
   *
   * @method addSellerToList
   * @return {method}
   */
  function addSellerToList() {

    let input = document.getElementById('seller-input').value;

    input = input.replace(/\s/g,'').trim();

    if (input) {

      blockList.list.push(input);

      blockList = JSON.stringify(blockList);

      localStorage.setItem('blockList', blockList);

      document.querySelectorAll('.errors')[0].textContent = '';

      return location.reload();
    }
  }

  /**
   * Remove the sellers name from the list/localStorage
   *
   * @param    {object}  the event object.
   * @return   {function}
   */
  function removeSellerName(event) {

    let target = event.target.innerHTML;

    event.target.parentNode.classList.add('fadeOut');

    blockList.list.forEach(function(seller, i) {

      if (target === seller) {

        blockList.list.splice(i, 1);

        blockList = JSON.stringify(blockList);

        localStorage.setItem('blockList', blockList);

        return setTimeout(function() { location.reload(); }, 400);
      }
    });
  }

  /**
   * Show error if seller is already on the list
   * @method showError
   * @return {undefined}
   */
  function showError() {

    let input = document.getElementById('seller-input').value;

    document.querySelectorAll('.errors')[0].textContent = `${input} is already on the block list.`;
  }

  /**
   * Checks if index is a string
   *
   * @method isString
   * @param  {string|number|object|boolean|null|undefined}  index
   * @return {Boolean}
   */
  function isString(index) {

    return typeof index === 'string';
  }

  /**
   * Validates the input value from the restore section by
   * checking that it is first parseable and second an Array
   * with strings in each index.
   *
   * @method validateBlocklist
   * @param  {string} list
   * @return {boolean}
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
    if (list && Array.isArray(list)) {

      return list.every(isString);
    }
  }

  // ========================================================
  // DOM setup
  // ========================================================

  // Select the radio button
  switch (true) {

    case blockList.hide === 'tag' :

      document.getElementById('tagSellers').checked = true;
      break;

    case blockList.hide === 'global' :

      document.getElementById('hideSellers').checked = true;
      break;

    case blockList.hide === 'marketplace' :

      document.getElementById('showOnRelease').checked = true;
      break;
  }

  // set focus on input
  document.getElementById('seller-input').focus();

  // Iterate over blocklist and insert html into DOM
  blockList.list.forEach(function(seller) {

    let
        node = document.createElement('div'),
        sellers = document.getElementById('blocked-sellers');

    node.className = 'seller';

    node.innerHTML = '<div class="seller-name">' +
                        '<span class="name">' +
                          seller +
                        '</span>' +
                      '</div>';

    sellers.appendChild(node);
  });

  // keyup event for Enter key
  document.addEventListener('keyup', function(e) {

    let input = document.getElementById('seller-input').value;

    // Enter key is pressed
    if ( e.which === 13 && input && !blockList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

    // name is already on the list
  } else if ( blockList.list.includes( document.getElementById('seller-input').value ) ) {

      return showError();

    } else {

      // clear any previous errors
      document.querySelector('.errors').textContent = '';
    }
  });

  // ========================================================
  // UI Functionality
  // ========================================================

  // Add name to block list
  document.querySelector('.btn-success').addEventListener('click', function() {

    let input = document.getElementById('seller-input').value;

    if ( input && !blockList.list.includes(input) ) {

      addSellerToList();

      return location.reload();

    } else if ( blockList.list.includes(input) ) {

      return showError();
    }
  });

  // Remove seller name from block list
  [...document.querySelectorAll('.seller-name')].forEach(function(name) {
    name.addEventListener('click', removeSellerName);
  });


  // Radiobutton listener
  document.getElementById('block-prefs').addEventListener('change', function(event) {

    blockList = JSON.parse(localStorage.getItem('blockList'));

    blockList.hide = event.target.value;

    blockList = JSON.stringify(blockList);

    localStorage.setItem('blockList', blockList);

    return location.reload();
  });

  // Populate backup form with current blocklist
  document.querySelector('.backup-output').textContent = JSON.stringify(blockList.list);

  // Show/Hide backup form
  document.querySelector('.backup .header').addEventListener('click', function() {

    let backup = document.querySelector('.backup-content');

    if (backup.classList.contains('hide')) {
      backup.classList.remove('hide');
    } else {
      backup.classList.add('hide');
    }

    if (this.classList.contains('open')) {
      this.classList.remove('open');
      this.classList.add('closed');
    } else {
      this.classList.remove('closed');
      this.classList.add('open');
    }
  });

  // Restore functionality
  document.querySelector('.restore .btn-success').addEventListener('click', function() {

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
});
