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

rl.ready(() => {

  // ========================================================
  // Functions
  // ========================================================
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
             && !name.closest('li').querySelector('.de-blocked-seller-icon') ) {

          let icon = document.createElement('span');
          icon.className = 'de-blocked-seller-icon needs_delegated_tooltip';
          icon.dataset.placement = 'bottom';
          icon.rel = 'tooltip';
          icon.title = `${seller} is on your Blocked Seller list.`;

          name.closest('.shortcut_navigable').classList.add(_class);
          name.closest('li').insertAdjacentElement('beforeend', icon);
        }
      });
    });
  };

  // ========================================================
  // DOM manipulation
  // ========================================================
  let blockList = rl.getPreference('blockList');

  if ( blockList ) {

    switch ( blockList.hide ) {

      // Hide sellers in the Marketplace and on release sale pages
      // ---------------------------------------------------------------------------
      case 'global':

        if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {

          window.blockSellers('hide');
        }
        break;

      // Hide sellers in the Marketplace only (marked in red elsewhere)
      // ---------------------------------------------------------------------------
      case 'marketplace':

        if ( rl.pageIs('myWants') ) {

          window.blockSellers('hide');

        } else if ( rl.pageIs('allItems', 'seller', 'sellRelease') ) {

          window.blockSellers('tag');
        }
        break;

      // Mark sellers in red everywhere
      // ---------------------------------------------------------------------------
      case 'tag':

        if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {

          window.blockSellers('tag');
        }
        break;
    }
    rl.handlePaginationClicks(window.blockSellers);
  }
});
/**
// ========================================================
I am the wizard, the (hush) awkward hawk-eyed wizard
Whose melancholy state of stubborn shows him the hard place
Up close and conjures a lucid quandary
The dreamiest paranoia
Where's the rock, the rock, I wanna fix the rock
Talk it into being my pal
Better yet, my indolent solid-stood apprentice
But thanks, but no thanks but, there is no rock
https://www.discogs.com/master/view/58623
// ========================================================
 */
