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

  let href = window.location.href,
      threshold = localStorage.getItem('sellerRep') || setSellerRep();

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Sets the initial sellerRep value
   *
   * @method setSellerRep
   */
  function setSellerRep() {

    localStorage.setItem('sellerRep', 50.0);

    return localStorage.getItem('sellerRep');
  }

  // ========================================================
  // DOM manipulation
  // ========================================================

  if (href.indexOf('/sell/mywants') > -1 || href.indexOf('/sell/list') > -1) {

    window.sellersRep = function sellersRep() {

      let ratingVals = $('.star_rating').next(),
          ratings = ratingVals.map(function() { return Number($(this).text().match(/\d+\.+\d/g)); });

      // Make sure we have an array
      ratings = Array.from(ratings);

      // Tag any sellers below threshold
      ratings.forEach(function(rating, i) {

        if (rating < threshold) {

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
