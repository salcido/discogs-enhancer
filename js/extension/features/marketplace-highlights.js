/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {
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

    /*
     * Commenting this out for now. Sleeve conditions are not wrapped in a span like media conditions
     * so it's not easy to isolate their values to colorize/embolden them. I've decided not to use this
     * because it won't be consistent with the Marketplace Highlights since both Media and Sleeve are
     * highlighted there. If Discogs ever updates their markup, this could be pretty rad.

    // Media conditions
    const orderMedia = [...document.querySelectorAll('.order-item-conditions span:nth-child(2)')],
          orderSleeves = [...document.querySelectorAll('.order-item-conditions span:nth-child(4)')]

    addHighlights(orderMedia);
    addHighlights(orderSleeves);

    */
  };

  // Apply styles on ready/prev/next clicks
  if ( resourceLibrary.pageIs('allItems', 'sellRelease', 'myWants', 'seller') ) {

    window.applyStyles();

    let pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a');

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(window.applyStyles);
      });
    });
  }
});
