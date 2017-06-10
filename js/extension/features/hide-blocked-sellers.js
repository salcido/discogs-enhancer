/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      blockList = JSON.parse(localStorage.getItem('blockList')),
      loc = window.location.href,
      sellPage = /sell\/list/g, // master releases && all items in marketplace
      sellerPage = /seller/g,
      sellRelease = /sell\/release/g,
      wantsPage = /sell\/mywants/g;

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Find all instances of sellers in list and hide them
   *
   * @method hideSellers
   * @return {undefined}
   */

  window.hideSellers = function hideSellers() {

    blockList.list.forEach(seller => {

      if ( $('td.seller_info:contains(' + seller + ')').length ) {

        $('td.seller_info:contains(' + seller + ')').parent().css({display: 'none'});
      }
    });
  };


  /**
   * Find all instances of sellers in list and tag them
   *
   * @method tagSellers
   * @return {undefined}
   */

  window.tagSellers = function tagSellers() {

    blockList.list.forEach(seller => {

      if ( $('td.seller_info:contains(' + seller + ')').length ) {

        $('td.seller_info:contains(' + seller + ')').parent().addClass('blocked-seller');
      }
    });
  };


  // ========================================================
  // DOM manipulation (Blocking)
  // ========================================================

  if (blockList) {

    switch ( blockList.hide ) {

      // hide when page first loads
      // ---------------------------------------------------------------------------
      case 'global':

        if ( loc.match(sellPage) ||
             loc.match(sellRelease) ||
             loc.match(sellerPage) ||
             loc.match(wantsPage) ) {

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

      // Hide sellers in the marketplace only
      // ---------------------------------------------------------------------------
      case 'marketplace':

        if ( loc.match(wantsPage) ) {

          // hide when page first loads
          window.hideSellers();

          // Call hideSellers on prev/next clicks
          $('body').on('click', '.pagination_next, .pagination_previous', function() {

            $(document).ajaxSuccess(function() {

              window.hideSellers();
            });
          });
        } else if ( loc.match(sellRelease) ||
                    loc.match(sellPage) ||
                    loc.match(sellerPage) ) {

          window.tagSellers();
        }
        return;

      // Mark sellers in red
      // ---------------------------------------------------------------------------
      case 'tag':

        if ( loc.match(sellPage) ||
             loc.match(sellRelease) ||
             loc.match(sellerPage) ||
             loc.match(wantsPage) ) {

          // tag when page first loads
          window.tagSellers();

          // Call hideSellers on prev/next clicks
          $('body').on('click', '.pagination_next, .pagination_previous', function() {

            $(document).ajaxSuccess(function() {

              window.tagSellers();
            });
          });
        }
        return;
    }
  }
});
