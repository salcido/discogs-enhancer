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

$(document).ready(function() {

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
     *
     * @method sellersRep
     * @return {undefined}
     */

    window.sellersRep = function sellersRep() {

      let ratingVals = Array.from( $('.star_rating').next() ),
          ratings = ratingVals.map(val => Number( val.textContent.match(/\d+\.+\d/g) ));

      // Tag any sellers below threshold
      ratings.forEach((rating, i) => {

        if ( rating < threshold ) {

          $('.star_rating').eq(i).addClass('de-seller-rep');
          $('.star_rating').eq(i).next().addClass('de-seller-rep');
        }
      });
    };

    window.sellersRep();

    // ========================================================
    // UI Functionality
    // ========================================================

    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        window.sellersRep();
      });
    });
  }
});
