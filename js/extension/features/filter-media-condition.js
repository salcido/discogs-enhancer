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
 * This feature will hide all items below a specifed condition in the Marketplace.
 *
 * The script is initiated with the code that follows the `DOM manipulation` comment block.
 *
 * 1.) The URL is examined to see if the user is in the Marketplace.
 * 2.) localStorage is queried for a `mediaCondition` item.
 * 3.) The value of `mediaCondition` is used to truncate the length of the `conditions` array which
 * is then iterated over and any remaining values in the array are used to remove items in
 * those conditions from the DOM.
 */

rl.ready(() => {
  // ========================================================
  // Functions
  // ========================================================
  /**
   * Find all instances of selected items in list and hide them
   *
   * @method filterMediaCondition
   * @return {undefined}
   */
  window.filterMediaCondition = function filterMediaCondition() {

    // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
    document.querySelectorAll('.condition-label-mobile').forEach(elem => elem.remove());

    if ( mediaCondition ) {

      let conditions = ['Poor (P)',
                        'Fair (F)',
                        'Good (G)',
                        'Good Plus (G+)',
                        'Very Good (VG)',
                        'Very Good Plus (VG+)',
                        'Near Mint (NM or M-)',
                        'Mint (M)'];

      // Truncate conditions array based on localStorage value
      conditions.length = Number(mediaCondition);

      // Remove offending items from the DOM based on whatever's left in the conditions array
      conditions.forEach(condition => {

        // Create array of media conditions
        let elems = document.querySelectorAll('td.item_description p.item_condition .condition-label-desktop:first-child + span');

        elems.forEach(el => {

          if ( el.textContent.trim() === condition ) {

            el.closest('.shortcut_navigable').classList.add('de-hide-media');
          }
        });
      });

      if ( !currentFilterState.everlastingMarket
            && currentFilterState.filterMediaCondition
            && !document.querySelector('.de-filter-stamp') ) {

        document.querySelectorAll('.pagination').forEach(e => {

          let div = document.createElement('div'),
              mc = mediaCondition ? Number(mediaCondition) : null,
              sc = sleeveCondition && sleeveCondition.value ? Number(sleeveCondition.value) : null;

          div.innerHTML = window.setFilterStateText(mc, sc);
          div.style.margin = '8px 0';
          div.className = 'de-filter-stamp';
          e.insertAdjacentElement('afterend', div);
        });
      }

      // Show message if all results have been removed
      if ( !document.getElementsByClassName('shortcut_navigable').length ) {

        let html = `<tr class="shortcut_navigable">
                      <th>
                        All results have been filtered out.
                      </th>
                    </tr>`;

        document.querySelector('#pjax_container tbody').innerHTML = html;

        document.querySelectorAll('.pagination_total').forEach(e => {
          e.textContent = 'All results have been filtered out.';
        });
      }
    } else {
      return;
    }
  };

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-hide-media {
        display: none;
      }`;

  // ========================================================
  // DOM manipulation
  // ========================================================
  let currentFilterState = rl.getPreference('currentFilterState'),
      mediaCondition = rl.getPreference('mediaCondition'),
      sleeveCondition = rl.getPreference('sleeveCondition');

  if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants')
       && rl.pageIsNot('sellerFeedback', 'settings') ) {

    rl.attachCss('filter-media-condition', rules);
    // hide items when page first loads
    window.filterMediaCondition();
    // Call filterMediaCondition on prev/next clicks
    rl.handlePaginationClicks(window.filterMediaCondition);
  }
});
