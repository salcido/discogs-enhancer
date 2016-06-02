/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO check blockList for duplicates
// TODO create custom blocklist css
document.addEventListener('DOMContentLoaded', function () {

  let blockList = JSON.parse(localStorage.getItem('blockList'));

  if (!blockList) {

    localStorage.setItem('blockList', '[]');

    blockList = JSON.parse(localStorage.getItem('blockList'));
  }

  // set focus on input
  document.getElementById('seller-input').focus();

  // chrome.storage.sync.get('blockList', function(result) {
  //
  //   if (!result.blockList) {
  //
  //     blockList = ['ducheese', 'ellabrand', 'someDude'];
  //   }
  //
  //   chrome.storage.sync.set({blockList: blockList}, function() {
  //
  //     console.log('blockList created.', blockList);
  //   });
  // });

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

    if (e.which === 13 && $('#seller-input').val() && blockList.indexOf($('#seller-input').val()) === -1) {

      blockList.push($('#seller-input').val().trim());

      blockList = JSON.stringify(blockList);

      localStorage.setItem('blockList', blockList);

      return location.reload();
    }
  });

  // Add name to block list
  $('body').on('click', '.btn-success', function() {

    if ($('#seller-input').val() && blockList.indexOf($('#seller-input').val()) === -1) {

      blockList.push($('#seller-input').val().trim());

      blockList = JSON.stringify(blockList);

      localStorage.setItem('blockList', blockList);

      return location.reload();
    }
  });

  // Remove seller name from block list
  $('body').on('click', '.seller-name', function(event) {

    let target = event.target.innerHTML;

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
