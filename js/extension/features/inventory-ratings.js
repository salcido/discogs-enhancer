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
   * Injects the CSS necessary for highlighting items
   * in the Marketplace
   * @returns {undefined}
   */
  function injectCss() {

    let style = document.createElement('style');

    style.type = 'text/css';
    style.id = 'seller-inventory-rating';
    style.rel = 'stylesheet';
    style.textContent = `
    .de-inventory-rating,
    .de-inventory-rating strong {
      color: #bf3a38;
      font-weight: bold;
    }`;

    document.head.append(style);
  }

  /**
   * Iterates over the seller's inventory and
   * adds the `de-inventory-rating` class to an item
   * @returns {undefined}
   */
  function scanRatings() {

    let ratings = document.querySelectorAll('.community_rating');

    if ( !inventoryRatings ) return;

    ratings.forEach(rating => {

      let text = rating.textContent.trim(),
          rgx = /\d./g,
          digits = text.match(rgx),
          value = Number(digits.join(''));

      if ( value > inventoryRatings ) {
        let parent = rating.closest('.shortcut_navigable').querySelector('.item_release_link.hide_mobile');
        rating.classList.add('de-inventory-rating');
        parent.setAttribute('target', '_blank');
        parent.setAttribute('rel', 'noopener');
      }
    });
  }

  // ========================================================
  // DOM Setup
  // ========================================================
  let inventoryRatings = rl.getPreference('inventoryRatings');

  if ( rl.pageIs('seller') ) {
    injectCss();
    scanRatings();
    rl.handlePaginationClicks(scanRatings);
  }
});
