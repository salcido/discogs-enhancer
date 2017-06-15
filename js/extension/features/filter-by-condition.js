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
 * 2.) localStorage is queried for an `itemCondition` item.
 * 3.) The value of `itemCondition` is used to truncate the length of the `conditions` array which
 * is then iterated over and any remaining values in the array are used to remove items in
 * those conditions from the DOM.
 */

$(document).ready(function() {

  let
      href = window.location.href,
      itemCondition = JSON.parse(localStorage.getItem('itemCondition')),
      sellPage = href.match(/sell\/list/g),
      sellerPage = href.match(/seller/g),
      sellRelease = href.match(/sell\/release/g),
      wantsPage = href.match(/sell\/mywants/g);


  /**
   * Find all instances of selected items in list and hide them
   *
   * @method hideItems
   * @return {undefined}
   */

  window.hideItems = function hideItems() {

    // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
    $('.condition-label-mobile').remove();

    if (itemCondition) {

      let conditions = ['Poor (P)',
                        'Fair (F)',
                        'Good (G)',
                        'Good Plus (G+)',
                        'Very Good (VG)',
                        'Very Good Plus (VG+)',
                        'Near Mint (NM or M-)',
                        'Mint (M)'];

      conditions.length = Number(itemCondition);

      // Remove offending items from the DOM
      conditions.forEach(function(condition) {

        let elem = $('td.item_description p.item_condition').find('.condition-label-desktop:first').next(':contains(' + condition + ')');

        if ( elem.length ) {

          elem.parent().parent().parent().remove();

          // Update page with filter notice
          $('.pagination_total').text('Some results have been removed.');
        }
      });

      // Show message if all results have been removed
      if ( !$('.shortcut_navigable').length ) {

        let html = '<tr class="shortcut_navigable"><th>Discogs Enhancer has removed all Marketplace results because they do not meet your filter critera. If you do not want this effect please change the "Hide Marketplace Items Below" setting in Discogs Enhancer.</th></tr>';

        $('#pjax_container tbody').html(html);

        $('.pagination_total').text('All results have been removed.');
      }
    } else {

      return;
    }
  };

  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( sellPage || sellRelease || sellerPage || wantsPage ) {

    // hide items when page first loads
    window.hideItems();

    // Call hideItems on prev/next clicks
    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        window.hideItems();
      });
    });
  }
});
