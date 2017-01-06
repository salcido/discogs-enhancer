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

    let input = $('#seller-input').val();

    input = input.replace(/\s/g,'').trim();

    if (input) {

      blockList.list.push(input);

      blockList = JSON.stringify(blockList);

      localStorage.setItem('blockList', blockList);

      $('.errors').text('');

      return location.reload();
    }
  }

  /**
   * Show error if seller is already on the list
   * @method showError
   * @return {undefined}
   */
  function showError() {

    $('.errors').text( $('#seller-input').val() + ' is already on the block list.' );
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

      $('#tagSellers').prop('checked', true);
      break;

    case blockList.hide === 'global' :

      $('#hideSellers').prop('checked', true);
      break;

    case blockList.hide === 'marketplace' :

      $('#showOnRelease').prop('checked', true);
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

    let input = $('#seller-input').val();

    // Enter key is pressed
    if (e.which === 13 && input && blockList.list.indexOf(input) === -1) {

      addSellerToList();

      return location.reload();

    // name is already on the list
    } else if (blockList.list.indexOf( $('#seller-input').val() ) > -1) {

      return showError();

    } else {

      // clear any previous errors
      $('.errors').text('');
    }
  });

  // ========================================================
  // UI Functionality
  // ========================================================

  // Add name to block list
  $('body').on('click', '.btn-success', function() {

    let input = $('#seller-input').val();

    if (input && blockList.list.indexOf(input) === -1) {

      addSellerToList();

      return location.reload();

    } else if ( blockList.list.indexOf( $('#seller-input').val() ) > -1) {

      return showError();
    }
  });

  // Remove seller name from block list
  $('body').on('click', '.seller-name', function(event) {

    let target = event.target.innerHTML;

    $(event.target).parent().fadeOut(300, function() {

      blockList.list.forEach(function(seller, i) {

        if (target === seller) {

          blockList.list.splice(i, 1);

          blockList = JSON.stringify(blockList);

          localStorage.setItem('blockList', blockList);

          return location.reload();
        }
      });
    });
  });

  // Radiobutton listener
  $('#block-prefs').on('change', function(event) {

    console.log(event.target.value);

    blockList = JSON.parse(localStorage.getItem('blockList'));

    blockList.hide = event.target.value;

    blockList = JSON.stringify(blockList);

    localStorage.setItem('blockList', blockList);

    return location.reload();
  });

  // Populate backup form with current blocklist
  $('.backup-output').text(JSON.stringify(blockList.list));

  // Show/Hide backup form
  $('.backup .header').on('click', function() {

    $('.backup-content').toggleClass('hide');

    $(this).toggleClass('open', 'closed');
  });

  // Restore functionality
  $('.restore .btn-success').on('click', function() {

    let list = $('.restore-input').val();

    if ( validateBlocklist(list) ) {

      let restore = {
                      list: JSON.parse(list),
                      hide: 'tag'
                    };

      localStorage.setItem('blockList', JSON.stringify(restore));

      return location.reload();

    } else {

      $('.restore-errors').removeClass('hide');
    }
  });
});
