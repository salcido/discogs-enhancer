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
 * This feature will add a checkmark icon to specified users in the Marketplace.
 *
 * The script is initiated with the code that follows the `DOM manipulation` comment block.
 *
 * 1.) The URL is examined to see if the user is in the marketplace.
 * 2.) localStorage is queried for a `favoriteList` item.
 * 3.) If there is a `favoriteList` and a URL match the script will add the checkmark to
 * specified seller(s) via CSS class.
 */

rl.ready(() => {

  // ========================================================
  // Functions
  // ========================================================
  /**
   * Adds event listners to the prev and next buttons
   *
   * @method addUiListeners
   * @returns {undefined}
   */
  function addUiListeners() {

    let selector = 'ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a',
        pagination = document.querySelectorAll(selector);

    pagination.forEach(elem => {
      elem.addEventListener('click', () => {
        rl.xhrSuccess(window.favoriteSellers());
      });
    });
  }

  /**
   * Find all instances of sellers in list and
   * add the favorites badge
   *
   * @method favoriteSellers
   * @return {function}
   */
  window.favoriteSellers = function favoriteSellers() {

    favoriteList.list.forEach(seller => {

      let sellerNames = document.querySelectorAll('td.seller_info ul li:first-child a');

      sellerNames.forEach(name => {

        if ( name.textContent.trim() === seller
             && !name.querySelector('.de-favorite-seller') ) {

          let icon = document.createElement('span');

          icon.className = 'de-favorite-seller needs_delegated_tooltip';
          icon.title = 'Favorite Seller';
          icon.dataset.placement = 'bottom';
          icon.rel = 'tooltip';
          name.insertAdjacentElement('beforeend', icon);
        }
      });
    });

    return addUiListeners();
  };

  // ========================================================
  // DOM manipulation
  // ========================================================
  let favoriteList = rl.getPreference('favoriteList');

  if ( favoriteList && favoriteList.list ) {
    if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {
      window.favoriteSellers();
    }
  }
});
