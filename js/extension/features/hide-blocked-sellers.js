/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This feature will mark or hide specified users in the Marketplace.
 *
 * The script is initiated with the code that follows the `DOM manipulation` comment block.
 *
 * 1.) The URL is examined to see if the user is in the marketplace.
 * 2.) localStorage is queried for a `blockList` item.
 * 3.) If there is a `blockList` and a URL match the script will either mark or hide the
 * specified user(s) (depending on the string value of `blockList.hide`) via either
 * CSS class or setting the element's display property to `none`.
 */

$(document).ready(function() {

  let
      blockList = JSON.parse(localStorage.getItem('blockList')),
      href = window.location.href,
      sellPage = href.match(/sell\/list/g), // master releases && all items in marketplace
      sellerPage = href.match(/seller/g),
      sellRelease = href.match(/sell\/release/g),
      wantsPage = href.match(/sell\/mywants/g);

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
  // DOM manipulation
  // ========================================================

  if (blockList) {

    switch ( blockList.hide ) {

      // Hide sellers in the Marketplace and on release sale pages
      // ---------------------------------------------------------------------------
      case 'global':

        if ( sellPage || sellRelease || sellerPage || wantsPage ) {

          window.hideSellers();

          // Call hideSellers on prev/next clicks
          $('body').on('click', '.pagination_next, .pagination_previous', function() {

            $(document).ajaxSuccess(function() {

              window.hideSellers();
            });
          });
        }
        return;

      // Hide sellers in the Marketplace only (marked in red elsewhere)
      // ---------------------------------------------------------------------------
      case 'marketplace':

        if (wantsPage) {

          window.hideSellers();

          // Call hideSellers on prev/next clicks
          $('body').on('click', '.pagination_next, .pagination_previous', function() {

            $(document).ajaxSuccess(function() {

              window.hideSellers();
            });
          });

        } else if ( sellRelease || sellPage || sellerPage ) {

          window.tagSellers();

          // Call tagSellers on prev/next clicks
          $('body').on('click', '.pagination_next, .pagination_previous', function() {

            $(document).ajaxSuccess(function() {

              window.tagSellers();
            });
          });
        }
        return;

      // Mark sellers in red everywhere
      // ---------------------------------------------------------------------------
      case 'tag':

        if ( sellPage || sellRelease || sellerPage || wantsPage ) {

          window.tagSellers();

          // Call tagSellers on prev/next clicks
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
