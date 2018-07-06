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

resourceLibrary.ready(() => {

  let
      favoriteList = JSON.parse(localStorage.getItem('favoriteList')),
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
   * @returns {undefined}
   */

  function addUiListeners() {

    let pagination = [...document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]')];

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(window.favoriteSellers());
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

      let sellerNames = [...document.querySelectorAll('td.seller_info ul li:first-child')];

      sellerNames.forEach(name => {

        if ( name.textContent.includes(seller)
             && !name.querySelector('.de-favorite-seller') ) {

          let icon = document.createElement('span');

          icon.className = 'de-favorite-seller';
          icon.title = `${seller} is on your Favorite Seller list.`;
          name.insertAdjacentElement('beforeend', icon);
        }
      });
    });

    return addUiListeners();
  };


  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( favoriteList ) {
    if ( sellPage || sellRelease || sellerPage || wantsPage ) {
      window.favoriteSellers();
    }
  }
});
