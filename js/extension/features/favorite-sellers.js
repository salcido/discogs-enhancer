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
             && !name.closest('li').querySelector('.de-favorite-seller') ) {

          let icon = document.createElement('span');

          icon.className = 'de-favorite-seller needs_delegated_tooltip';
          icon.title = `${seller} is on your Favorite Sellers list.`;
          icon.dataset.placement = 'bottom';
          icon.rel = 'tooltip';
          name.closest('li').insertAdjacentElement('beforeend', icon);
        }
      });
    });
  };

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-favorite-seller {
        background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTQuNTkxIDYuNjM3bC0xLTEuMjI5YTEuNTA3IDEuNTA3IDAgMCAxLS4yOTUtLjcwM2wtLjE4Mi0xLjU3YTEuNCAxLjQgMCAwIDAtMS4yMjgtMS4yMjZsLTEuNTY4LS4xODJhMS4zOCAxLjM4IDAgMCAxLS43MjctLjI5NWwtMS4yMjgtMWExLjM2OSAxLjM2OSAwIDAgMC0xLjcyNiAwbC0xLjIyOSAxYy0uMjAzLjE1OS0uNDMuMjUtLjcwMy4yOTVsLTEuNTcuMTgyQTEuNCAxLjQgMCAwIDAgMS45MSAzLjEzN2wtLjE4MiAxLjU2N2ExLjM3NSAxLjM3NSAwIDAgMS0uMjk1LjcyOGwtMSAxLjIyN2ExLjM2OSAxLjM2OSAwIDAgMCAwIDEuNzI3bDEgMS4yMjhjLjE1OS4yMDQuMjUuNDMxLjI5NS43MDRsLjE4MiAxLjU2OWExLjQgMS40IDAgMCAwIDEuMjI4IDEuMjI3bDEuNTY3LjE4MmMuMjczLjAyMi41MjQuMTM2LjcyOC4yOTVsMS4yMjcgMWExLjM2OSAxLjM2OSAwIDAgMCAxLjcyNyAwbDEuMjI4LTFjLjIwNC0uMTYuNDMxLS4yNS43MDQtLjI5NWwxLjU2OS0uMTgyYTEuNCAxLjQgMCAwIDAgMS4yMjctMS4yMjhsLjE4Mi0xLjU2OGMuMDIyLS4yNzIuMTM2LS41MjMuMjk1LS43MjdsMS0xLjIyOGExLjQzMiAxLjQzMiAwIDAgMCAwLTEuNzI2eiIgZmlsbD0iIzAwQjREQiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik02LjExMyAxMS4yMDVMMi44ODcgNy45NzdsMS4zODYtMS4zODYgMS44NCAxLjg0IDQuNjEzLTQuNjEzIDEuMzg3IDEuNDMyeiIvPjwvZz48L3N2Zz4=);
        display: inline-block;
        height: 14px;
        width: 14px;
        margin-left: 3px;
        margin-top: 3px;
        vertical-align: top;
      }
      .de-favorite-seller + .tooltip {
        white-space: normal;
        opacity: 1;
      }
      `;

  // ========================================================
  // DOM manipulation
  // ========================================================
  let favoriteList = rl.getPreference('favoriteList');

  if ( favoriteList && favoriteList.list ) {
    rl.attachCss('favorite-sellers', rules);
    if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {
      window.favoriteSellers();
      rl.handlePaginationClicks(window.favoriteSellers);
    }
  }
});
