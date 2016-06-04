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

    localStorage.setItem('blockList', '[]');

    blockList = JSON.parse(localStorage.getItem('blockList'));
  }

  // set focus on input
  document.getElementById('seller-input').focus();

  // add the seller to the list, duh!
  function addSellerToList() {

    blockList.push($('#seller-input').val().trim());

    blockList = JSON.stringify(blockList);

    localStorage.setItem('blockList', blockList);

    $('.errors').html('');

    return location.reload();
  }

  // Show error if seller is already on the list
  function showError() {

    $('.errors').html( $('#seller-input').val() + ' is already on the block list.' );
  }

  // Iterate over blocklist and insert html into DOM
  blockList.forEach(function(seller) {

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

    if (e.which === 13 && $('#seller-input').val() && blockList.indexOf( $('#seller-input').val() ) === -1) {

      addSellerToList();

      return location.reload();

    } else if (blockList.indexOf( $('#seller-input').val() ) > -1) {

      return showError();
    }
  });

  // Add name to block list
  $('body').on('click', '.btn-success', function() {

    if ($('#seller-input').val() && blockList.indexOf( $('#seller-input').val() ) === -1) {

      addSellerToList();

      return location.reload();

    } else if ( blockList.indexOf($('#seller-input').val()) > -1) {

      return showError();
    }
  });

  // Remove seller name from block list
  $('body').on('click', '.seller-name', function(event) {

    let target = event.target.innerHTML;

    $(event.target).parent().fadeOut(300, function() {

      blockList.forEach(function(seller, i) {

        if (target === seller) {

          blockList.splice(i, 1);

          blockList = JSON.stringify(blockList);

          localStorage.setItem('blockList', blockList);

          return location.reload();
        }
      });
    });
  });
});
