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
 * specified user(s) (depending on the string value of `blockList.hide`) via CSS class.
 */
// TODO refactor to vanilla js
resourceLibrary.ready(function() {

  let
      blockList = JSON.parse(localStorage.getItem('blockList')),
      href = window.location.href,
      sellPage = href.includes('/sell/list'), // master releases && all items in marketplace
      sellerPage = href.includes('/seller/'),
      sellRelease = href.includes('/sell/release/'),
      wantsPage = href.includes('/sell/mywants');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Adds event listners to the prev and next buttons
   *
   * @method addUiListeners
   * @param  {String} type  Either 'hide' or 'tag'
   * @returns {undefined}
   */

  function addUiListeners(type) {

    let pagination = [...document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]')];

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(window.modifySellers(type));
      });
    });
  }

  /**
   * Find all instances of sellers in list and hide them
   *
   * @method modifySellers
   * @param {String} type Either 'hide' or 'tag'
   * @return {function}
   */

  window.modifySellers = function modifySellers(type) {

    let _class = type === 'hide' ? 'hidden-seller' : 'blocked-seller';

    blockList.list.forEach(seller => {
// TODO refactor to vanilla js
      if ( $('td.seller_info:contains(' + seller + ')').length ) {

        $('td.seller_info:contains(' + seller + ')').parent().addClass(_class);
      }
    });

    return addUiListeners(type);
  };


  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( blockList ) {

    switch ( blockList.hide ) {

      // Hide sellers in the Marketplace and on release sale pages
      // ---------------------------------------------------------------------------
      case 'global':

        if ( sellPage || sellRelease || sellerPage || wantsPage ) {

          window.modifySellers('hide');
        }
        return;

      // Hide sellers in the Marketplace only (marked in red elsewhere)
      // ---------------------------------------------------------------------------
      case 'marketplace':

        if ( wantsPage ) {

          window.modifySellers('hide');

        } else if ( sellRelease || sellPage || sellerPage ) {

          window.modifySellers('tag');
        }
        return;

      // Mark sellers in red everywhere
      // ---------------------------------------------------------------------------
      case 'tag':

        if ( sellPage || sellRelease || sellerPage || wantsPage ) {

          window.modifySellers('tag');
        }
        return;
    }
  }
});
