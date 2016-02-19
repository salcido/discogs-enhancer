/**
 * 
 * These functions are used exclusively for sorting the 
 * Marketplace sidebar filters: (Currency, Genre, Style, 
 * Format, Media Condition and Year)
 *
 */
var sortFilterButton = '<div style="text-align: center;">' +
                       '<button id="sortFilters" ' +
                       'class="button button_blue" ' +
                       'style="margin-bottom: 10px;' + 
                       'width: 100px;">Sort A-Z</button>' +
                       '</div>',
    filterTarget = null,
    moreFiltersStorage = null,
    desc = false;



// Inject sort button into modal
function appendFilterSortButton() {

  // This is so we only append one filter button at the top of the list
  // Two buttons might be more useful on large lists. 
  // Still thinking that one over.
  var firstHideMoreFilter = $('.hide_more_filters').first();

  $(sortFilterButton).insertAfter(firstHideMoreFilter);
}



// Sort our lists and create new HTML, then insert
// the newly sorted list array elements.
function sortUnorderedFilterList(ul, sortDescending) {

  var lis = $('.marketplace_filters.more_filters.marketplace_filters_' + filterTarget + ' ul.facets_nav li'),
      vals = [],
      liHead = null,
      newUl = null;

  // Grab all the list elements and push them into our array
  for (var i = 0, l = lis.length; i < l; i++) {

      vals.push(lis[i]);
  }

  // Examine the list elements and remove the no_link element
  // assign that to |liHead| for later use
  for (var i = 0, l = vals.length; i < l; i++) {

    if ( $(vals[i]).hasClass('no_link') ) {

      liHead = vals[i];

      vals.splice(vals[i], 1);
    }
  }

  // The |compareText| function exists in alphabetize-explore-lists.js
  vals.sort(compareText);

  if (sortDescending) { vals.reverse(); }

  // Clear out old markup
  $('#more_filters_container').html('');

  // Insert new markup with custom |modified| class to hook on to
  $('#more_filters_container').append('<ul class="marketplace_filters more_filters marketplace_filters_' + filterTarget + '"><li style="min-width:16%;"><ul class="facets_nav modified">');

  // Hook on to our new list
  newUl = $('ul.facets_nav.modified');

  // Insert newly alphabetized list elements
  for (var i = 0, l = vals.length; i < l; i++) {

    newUl.append(vals[i]);

    newUl.prepend(liHead);
  }
}



// Add new button functionalities
function registerFilterButtonClicks() {

  // Injected 'Sort A-Z' button
  $('#sortFilters').click(function() {

    var sortName = ($(this).text() === 'Sort A-Z') ? 'Sort Z-A' : 'Sort A-Z';

    sortUnorderedFilterList($('.marketplace_filters.more_filters.marketplace_filters_' + filterTarget + ' ul.facets_nav'), desc);

    desc = !desc;

    $(this).text(sortName);
    
    return false;
  });

  // '<- All Filters' page link
  $('.hide_more_filters').click(function() {

    // Tear down the button
    $('#sortFilters').remove();

    // Restore the unfiltered markup 
    $('#more_filters_container').html(moreFiltersStorage);

    // Reset |desc| so that subsequent filter calls begin with A-Z
    desc = false;
  });
}



// Map functions to modal dialog buttons
$('.show_more_filters').click(function() {

  var checkForMarkup = null;

  // Find the right UL to filter
  filterTarget = $(this).data('label');

  // Make sure the correct child element exists in |#more_filters_container|
  // before storing it.
  checkForMarkup = setInterval( function() {

    if ( $('.marketplace_filters.more_filters.marketplace_filters_' + filterTarget).length ) {
      // Store current markup of #more_filters_container. If the user does not
      // select a filter, it will be restored when .hide_more_filters is clicked
      moreFiltersStorage = $('#more_filters_container').html();

      clearInterval(checkForMarkup);
    }
  }, 10);

  appendFilterSortButton();

  registerFilterButtonClicks();
});
