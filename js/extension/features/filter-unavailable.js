/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will hide items in the Marketplace that
 * are unavailable in the user's country
 */

rl.ready(() => {
  // ========================================================
  // CSS
  // ========================================================
  let rules = `
    .de-hide-unavailable {
      display: none;
    }
  `;
  // ========================================================
  // Function
  // ========================================================
  window.filterUnavailable = function filterUnavailable() {
    document.querySelectorAll('.unavailable').forEach(item => {
      item.classList.add('de-hide-unavailable');
    });
  };
  // ========================================================
  // DOM Setup
  // ========================================================
  if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants')
       && rl.pageIsNot('sellerFeedback', 'settings') ) {

    rl.attachCss('hide-unavailable', rules);
    rl.handlePaginationClicks(window.filterUnavailable);
    window.filterUnavailable();
  }
});
