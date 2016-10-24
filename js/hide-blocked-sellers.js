/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      blockList = JSON.parse(localStorage.getItem('blockList')),
      loc = window.location.href,
      sellPage = /sell\/list/g,
      sellerPage = /seller/g,
      sellRelease = /sell\/release/g,
      wantsPage = /sell\/mywants/g;

  // Find all instances of sellers in list and hide them
  window.hideSellers = function hideSellers() {

    blockList.list.forEach(function(seller) {

      if ($('td.seller_info:contains(' + seller + ')').length) {

        $('td.seller_info:contains(' + seller + ')').parent().css({display: 'none'});
      }
    });
  };

  // Find all instances of sellers in list and tag them
  window.tagSellers = function tagSellers() {

    blockList.list.forEach(function(seller) {

      if ($('td.seller_info:contains(' + seller + ')').length) {

        $('td.seller_info:contains(' + seller + ')').parent().addClass('blocked-seller');
      }
    });
  };

  // Draxx them sklounst
  switch (true) {

    case blockList && blockList.hide === 'global':

      if (loc.match(sellPage) || loc.match(sellRelease) || loc.match(sellerPage) || loc.match(wantsPage)) {

        // hide when page first loads
        window.hideSellers();

        // Call hideSellers on prev/next clicks
        $('body').on('click', '.pagination_next, .pagination_previous', function() {

          $(document).ajaxSuccess(function() {

            window.hideSellers();
          });
        });
      }
      return;

    case blockList && blockList.hide === 'marketplace':

      if (loc.match(sellPage) || loc.match(sellerPage) || loc.match(wantsPage)) {

        // hide when page first loads
        window.hideSellers();

        // Call hideSellers on prev/next clicks
        $('body').on('click', '.pagination_next, .pagination_previous', function() {

          $(document).ajaxSuccess(function() {

            window.hideSellers();
          });
        });
      } else if (loc.match(sellRelease)) {

        window.tagSellers();
      }
      return;

    case blockList && blockList.hide === 'tag':

      if (loc.match(sellPage) || loc.match(sellRelease) || loc.match(sellerPage) || loc.match(wantsPage)) {

        window.tagSellers();
      }
      return;
  }
});
