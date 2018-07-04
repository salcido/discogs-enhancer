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
 * This feature will mark any seller who's reputation falls below a specified number.
 *
 * 1.) The URL is examined to see if the user is in the Marketplace.
 * 2.) localStorage is queried for a `threshold` item.
 * 3.) The seller's reputations are pushed into a `ratings` array and iterated over.
 * 4.) If the reputation value is below the specified threshold, the `de-seller-rep`
 * class is added to the seller's rating element in the DOM.
 */

resourceLibrary.ready(() => {

  let
      href = window.location.href,
      threshold = localStorage.getItem('sellerRep'),
      //
      sellPage = href.includes('/sell/list') && threshold,
      sellRelease = href.includes('/sell/release') && threshold,
      wantsPage = href.includes('/sell/mywants') && threshold;

  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( wantsPage || sellPage || sellRelease ) {

    /**
     * Finds all the seller's reputation scores in the DOM and
     * adds a `de-seller-rep` class to them if necessary
     * TODO: delete old CSS file
     * @method sellersRep
     * @return {undefined}
     */

    window.sellersRep = function sellersRep() {

      let ratingVals = [...document.getElementsByClassName('seller_info')],
          ratings = ratingVals.map(val => Number( val.textContent.match(/\d+\.+\d/g) ) );

      // Tag any sellers below threshold
      ratings.forEach((rating, i) => {

        let seller_info = document.getElementsByClassName('seller_info');

        // if you want to tag new sellers as well change this to:
        // if ( rating < threshold ) {
        if ( rating
             && rating < threshold
             && !seller_info[i].querySelector('.de-blocked-seller-icon')
             && !seller_info[i].querySelector('.de-seller-rep-icon') ) {

          let icon = document.createElement('span');

          icon.className = 'de-seller-rep-icon';

          seller_info[i].classList.add('de-seller-rep');
          seller_info[i].querySelector('li:first-child')
                        .insertAdjacentElement('beforeend', icon);
        }
      });
    };

    window.sellersRep();

    // ========================================================
    // UI Functionality
    // ========================================================

    let pagination = [...document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]')];

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(window.sellersRep);
      });
    });
  }
});
