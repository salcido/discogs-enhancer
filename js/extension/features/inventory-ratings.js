/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */
rl.ready(() => {
  // ========================================================
  // Functions
  // ========================================================
  /**
   * Iterates over the seller's inventory and
   * adds the `de-inventory-rating` class to an item
   * @returns {undefined}
   */
  function scanRatings() {

    let ratings = document.querySelectorAll('.community_rating');

    if ( !minimumRating ) return;

    ratings.forEach(rating => {

      let text = rating.textContent.trim(),
          rgx = /\d./g,
          digits = text.match(rgx),
          value = Number(digits.join(''));

      if ( value > minimumRating ) {
        let parent = rating.closest('.shortcut_navigable').querySelector('.item_release_link.hide_mobile');
        rating.classList.add('de-inventory-rating');
        parent.setAttribute('target', '_blank');
        parent.setAttribute('rel', 'noopener');
      }
    });
  }

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-inventory-rating,
      .de-inventory-rating strong {
        color: #bf3a38;
        font-weight: bold;
      }`;

  // ========================================================
  // DOM Setup
  // ========================================================
  let minimumRating = rl.getPreference('minimumRating');

  if ( rl.pageIs('seller') ) {
    rl.attachCss('seller-inventory-rating', rules);
    scanRatings();
    rl.handlePaginationClicks(scanRatings);
  }
});
