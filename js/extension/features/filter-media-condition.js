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

resourceLibrary.ready(() => {

  let
      href = window.location.href,
      currentFilterState = JSON.parse(localStorage.getItem('currentFilterState')),
      mediaCondition = JSON.parse(localStorage.getItem('mediaCondition')),
      sleeveCondition = JSON.parse(localStorage.getItem('sleeveCondition')) || null,
      sellPage = href.match(/sell\/list/g),
      sellerPage = href.match(/seller\//g),
      sellRelease = href.match(/sell\/release/g),
      wantsPage = href.match(/sell\/mywants/g);

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

            el.parentElement.parentElement.parentElement.classList.add('de-hide-media');
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
                        Discogs Enhancer has removed all Marketplace results because they do not meet your filter critera.
                        If this is unwanted please adjust the "Filter Media Condition" setting in Discogs Enhancer.
                      </th>
                    </tr>`;

        document.querySelector('#pjax_container tbody').innerHTML = html;

        document.querySelectorAll('.pagination_total').forEach(e => {
          e.textContent = 'All results have been removed.';
        });
      }
    } else {

      return;
    }
  };

  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( sellPage || sellRelease || sellerPage || wantsPage ) {

    let style = document.createElement('style');

    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.textContent = `
    .de-hide-media {
      display: none;
    }`;

    document.head.append(style);

    // hide items when page first loads
    window.filterMediaCondition();

    // Call filterMediaCondition on prev/next clicks
    let pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a');

    pagination.forEach(elem => {

      elem.addEventListener('click', () => resourceLibrary.xhrSuccess(window.filterMediaCondition));
    });
  }
});
