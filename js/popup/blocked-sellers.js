/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', function () {

  let blockList = JSON.parse(localStorage.getItem('blockList'));

  if (!localStorage.getItem('blockList')) {

    localStorage.setItem('blockList', '{"list":[], "hide": "false"}');

    blockList = JSON.parse(localStorage.getItem('blockList'));
  }

  // Select the checkbox if necessary
  if (blockList.hide === 'true') {

    $('#hideSellers').prop('checked', true);
  }

  // set focus on input
  document.getElementById('seller-input').focus();

  // add the seller to the list, duh!
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

  // Show error if seller is already on the list
  function showError() {

    $('.errors').text( $('#seller-input').val() + ' is already on the block list.' );
  }

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

    if (e.which === 13 && input && blockList.list.indexOf(input) === -1) {

      addSellerToList();

      return location.reload();

    } else if (blockList.list.indexOf( $('#seller-input').val() ) > -1) {

      return showError();
    }
  });

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

  // Checkbox listener
  $('#hideSellers').on('change', function() {

    blockList = JSON.parse(localStorage.getItem('blockList'));

    blockList.hide = String($('#hideSellers').prop('checked'));

    blockList = JSON.stringify(blockList);

    localStorage.setItem('blockList', blockList);
  });
});
