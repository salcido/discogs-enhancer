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
 * 2.) localStorage is queried for an `sleeveCondition` item.
 * 3.) The value of `sleeveCondition` is used to truncate the length of the `conditions` array which
 * is then iterated over and any remaining values in the array are used to remove items in
 * those conditions from the DOM.
 */

rl.ready(() => {

    let { sleeveCondition } = rl.getPreference('featurePrefs');

    /**
     * Find all instances of selected items in list and hide them
     * @return {undefined}
     */
    window.filterSleeveCondition = function filterSleeveCondition() {

      // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
      document.querySelectorAll('.condition-label-mobile').forEach(elem => elem.remove());

      if ( sleeveCondition ) {

        let conditions = ['Poor (P)',
                          'Fair (F)',
                          'Good (G)',
                          'Good Plus (G+)',
                          'Very Good (VG)',
                          'Very Good Plus (VG+)',
                          'Near Mint (NM or M-)',
                          'Mint (M)'];

        // Truncate conditions array based on localStorage value
        conditions.length = Number(sleeveCondition.value);

        // Remove offending items from the DOM based on whatever's left in the conditions array
        conditions.forEach(condition => {

          let selector = 'td.item_description p.item_condition .condition-label-desktop:nth-child(4) + span',
              elems = document.querySelectorAll(selector),
              noSleeveData = document.querySelectorAll('.item_condition .mplabel:first-child:nth-last-child(3)');

          elems.forEach(el => {

            if ( el.textContent.trim() === condition ) {
              el.closest('.shortcut_navigable').classList.add('de-hide-sleeve');
            }

            if ( sleeveCondition.generic && el.textContent.trim() === 'Generic' ) {
              el.closest('.shortcut_navigable').classList.add('de-hide-sleeve');
            }

            if ( sleeveCondition.noCover && el.textContent.trim() === 'No Cover' ) {
              el.closest('.shortcut_navigable').classList.add('de-hide-sleeve');
            }
          });

          // Handle items where no sleeve condition is listed
          if ( sleeveCondition.generic && sleeveCondition.noCover ) {
            noSleeveData.forEach(s => s.closest('.shortcut_navigable').classList.add('de-hide-sleeve'));
          }
        });

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
        .de-hide-sleeve {
          display: none;
        }`;

    // ========================================================
    // DOM manipulation
    // ========================================================

    if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {

      rl.attachCss('filter-sleeve-condition', rules);
      // hide items when page first loads
      window.filterSleeveCondition();
      // Prev/Next clicks
      rl.handlePaginationClicks(window.filterSleeveCondition);
    }
  });
