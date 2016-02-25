/**
 *
 * These functions are used exclusively for sorting the
 * Marketplace sidebar filters: (Currency, Genre, Style,
 * Format, Media Condition and Year)
 *
 */

(function() {

  var desc = false,
      filterTarget = null,
      moreFiltersStorage = null;


  // Inject sort button into modal
  function appendFilterSortButton() {

    var sortFilterButton = '<div style="text-align: center;">' +
                           '<button id="sortFilters" ' +
                           'class="button button_blue" ' +
                           'style="width: 100px;">Sort A-Z</button>' +
                           '</div>',
        // This is so we only append one filter button at the top of the list
        // Two buttons might be more useful on large lists.
        // Still thinking that one over.
        firstHideMoreFilter = $('.hide_more_filters').first();

    $(sortFilterButton).insertAfter(firstHideMoreFilter);
  }



  // Link sorter function
  function compareText(a1, a2) {

    var x = $(a1).find('a').attr('href'),
        y = $(a2).find('a').attr('href');

    return x > y ? 1 : (x < y ? -1 : 0);
  }



  // Sort our lists and create new HTML, then insert
  // the newly sorted list array elements.
  function sortUnorderedFilterList(ul, sortDescending) {

    var
        liHead = null,
        listElms = $('.marketplace_filters.more_filters.marketplace_filters_' + filterTarget + ' ul.facets_nav li'),
        newUl = null,
        vals = [];

    // Grab all the list elements and push them into our array
    listElms.each(function(index) { vals.push(listElms[index]); });

    // Examine the list elements and remove the no_link element
    // assign that to |liHead| for later use
    $(vals).each(function(index) {

      if ( $(vals[index]).hasClass('no_link') ) {

        liHead = vals[index];

        vals.splice(vals[index], 1);
      }
    });

    // The |compareText| function exists in sort-explore-lists.js
    vals.sort(compareText);

    if (sortDescending) { vals.reverse(); }

    // Clear out old markup
    $('#more_filters_container').html('');

    // Insert new markup with custom |modified| class to hook on to
    $('#more_filters_container').append('<ul class="marketplace_filters more_filters marketplace_filters_' + filterTarget + '"><li style="min-width:16%;"><ul class="facets_nav modified">');

    // Hook on to our new list
    newUl = $('ul.facets_nav.modified');

    // Insert newly sorted list elements
    $(vals).each(function(index) {

      newUl.append(vals[index]);

      newUl.prepend(liHead);
    });
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

})();
