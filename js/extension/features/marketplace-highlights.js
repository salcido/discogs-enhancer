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
   /**
   * Iterate over the target array and add classes as needed
   * @method addHighlights
   * @return {undefined}
   */
  function addHighlights(target) {

    target.forEach(t => {

      switch (t.textContent.trim()) {
        case 'Mint (M)':
          t.className = 'mint bold';
          break;
        case 'Near Mint (NM or M-)':
          t.className = 'near-mint bold';
          break;
        case 'Very Good Plus (VG+)':
          t.className = 'very-good-plus bold';
          break;
        case 'Very Good (VG)':
          t.className = 'very-good bold';
          break;
        case 'Good Plus (G+)':
          t.className = 'good-plus bold';
          break;
        case 'Good (G)':
          t.className = 'good bold';
          break;
        case 'Fair (F)':
          t.className = 'fair bold';
          break;
        case 'Poor (P)':
          t.className = 'poor bold';
          break;
      }
    });
  }

  /**
   * Find all Marketplace item conditions and apply classes
   * @method applyStyles
   * @return {undefined}
   */
  window.applyStyles = function applyStyles() {

    // Remove mobile clutter
    document.querySelectorAll('.condition-label-mobile').forEach(d => d.remove());

    // Media/sleeve conditions
    const media = document.querySelectorAll('p.item_condition .condition-label-desktop:first-child + span'),
          sleeves = document.querySelectorAll('span.item_sleeve_condition');

    addHighlights(media);
    addHighlights(sleeves);

    // ========================================================
    // Orders Page
    // ========================================================

    // Media conditions
    const orderMedia = [...document.querySelectorAll('.order-item-conditions span:nth-child(2)')],
          orderSleeves = [...document.querySelectorAll('.order-item-conditions span:nth-child(5)')];

    addHighlights(orderMedia);
    addHighlights(orderSleeves);
  };

// ========================================================
// DOM Setup
// ========================================================

  // Apply styles on ready/prev/next clicks
  if ( rl.pageIs('allItems', 'sellRelease', 'myWants', 'seller', 'order') ) {
    window.applyStyles();
    // Prev/Next clicks
    rl.handlePaginationClicks(window.applyStyles);
  }
});
