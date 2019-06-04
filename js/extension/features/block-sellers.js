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

resourceLibrary.ready(() => {

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

    let pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a');

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(window.blockSellers(type));
      });
    });
  }

  /**
   * Find all instances of sellers in list and hide them
   *
   * @method blockSellers
   * @param {String} type Either 'hide' or 'tag'
   * @return {function}
   */

  window.blockSellers = function blockSellers(type) {

    let _class = type === 'hide' ? 'hidden-seller' : 'blocked-seller';

    blockList.list.forEach(seller => {

      let sellerNames = document.querySelectorAll('td.seller_info ul li:first-child a');

      sellerNames.forEach(name => {

        if ( name.textContent.trim() === seller
             && !name.querySelector('.de-blocked-seller-icon') ) {

          let icon = document.createElement('span');
          icon.className = 'de-blocked-seller-icon';
          icon.title = `${seller} is on your Blocked Seller list.`;

          name.closest('.shortcut_navigable').classList.add(_class);
          name.insertAdjacentElement('beforeend', icon);
        }
      });
    });

    return addUiListeners(type);
  };

  // ========================================================
  // DOM manipulation
  // ========================================================
  let blockList = JSON.parse(localStorage.getItem('blockList'));

  if ( blockList ) {

    switch ( blockList.hide ) {

      // Hide sellers in the Marketplace and on release sale pages
      // ---------------------------------------------------------------------------
      case 'global':

        if ( resourceLibrary.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {

          window.blockSellers('hide');
        }
        return;

      // Hide sellers in the Marketplace only (marked in red elsewhere)
      // ---------------------------------------------------------------------------
      case 'marketplace':

        if ( resourceLibrary.pageIs('myWants') ) {

          window.blockSellers('hide');

        } else if ( resourceLibrary.pageIs('allItems', 'seller', 'sellRelease') ) {

          window.blockSellers('tag');
        }
        return;

      // Mark sellers in red everywhere
      // ---------------------------------------------------------------------------
      case 'tag':

        if ( resourceLibrary.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {

          window.blockSellers('tag');
        }
        return;
    }
  }
});
