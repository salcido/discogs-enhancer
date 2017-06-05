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

  let
      itemCondition,
      loc = window.location.href,
      sellPage = /sell\/list/g,
      sellerPage = /seller/g,
      sellRelease = /sell\/release/g,
      wantsPage = /sell\/mywants/g;


  /**
   * Find all instances of selected items in list and hide them
   * @method hideItems
   * @return {undefined}
   */

  window.hideItems = function hideItems() {

    // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
    $('.condition-label-mobile').remove();

    // Get current itemCondition
    itemCondition = JSON.parse(localStorage.getItem('itemCondition'));

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

      // Draxx them sklounst
      conditions.forEach(function(condition) {

        let elem = $('td.item_description p.item_condition').find('.condition-label-desktop:first').next(':contains(' + condition + ')');

        if (elem.length) {

          elem.parent().parent().parent().remove();

          // Update page with filter notice
          $('.pagination_total').text('Some results have been removed.');
        }
      });

      // Show message if all results have been removed
      if (!$('.shortcut_navigable').length) {

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

  if (loc.match(sellPage) || loc.match(sellRelease) || loc.match(sellerPage) || loc.match(wantsPage)) {

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
