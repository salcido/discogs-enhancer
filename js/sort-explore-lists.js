/**
 *
 * These functions are used exclusively for sorting the
 * Explore modals (Genre, Style, Format, Country and Decade)
 *
 */

$(document).ready(function() {

  var
      clicks = 1,
      desc = false,
      storage,
      width = '';

  // Inject sort button into modal
  function appendSortButton() {

    var sortButton = '<div style="text-align: center;">' +
                     '<button id="sortExplore" ' +
                     'class="button button_blue" ' +
                     'style="margin-bottom: 10px;' +
                     'width: 100px;">Sort A-Z</button>' +
                     '</div>';

    $('.react-modal-header').append(sortButton);
  }



  // Link sorter function
  function compareText(a1, a2) {

    var x = $(a1).find('a').attr('href'),
        y = $(a2).find('a').attr('href');

    return x > y ? 1 : (x < y ? -1 : 0);
  }

  // Sort our lists and create new HTML, then insert
  // the newly sorted list array elements.
  function sortUnorderedList(ul, sortDescending) {

    var listElms = $('.react-modal-content div ul.facets_nav li'),
        vals = [],
        newUl = null;

    vals = listElms.map(function() { return this; }).get();

    vals.sort(compareText);

    if (sortDescending) { vals.reverse(); }

    ul.html('');

    ul.append('<ul class="facets_nav">');

    newUl = $('.react-modal-content div ul.facets_nav');

    for (var i = 0, l = vals.length; i < l; i++) {

      newUl.append(vals[i]);
    }

    // shrink modal to small column size (for looks)
    $('.react-modal.more_facets_dialog').animate({width: '180px'}, 300, 'swing');
  }


  // Add new button functionality
  function registerButtonClicks() {

    var sortName;

    $('#sortExplore').click(function() {

      if ($(this).text() === 'Sort A-Z') {

        sortName = 'Sort Z-A';

      } else if ($(this).text() === 'Sort Z-A') {

        sortName = 'Undo Sort';

      } else if ($(this).text() === 'Undo Sort') {

        sortName = 'Sort A-Z';
      }

      clicks++;

      if (clicks > 3) {

        $('.react-modal-content div').html(storage.html());

        $('.react-modal.more_facets_dialog').animate({width: width}, 200, 'swing');

        clicks = 1;

        $(this).text(sortName);

        return false;

      } else {

        sortUnorderedList($('.react-modal-content div'), desc);

        desc = !desc;

        $(this).text(sortName);

        return false;
      }
    });

    $('.react-modal-close-button-icon').click(function() {

      desc = false;
    });
  }



  // Map functions to modal dialog buttons
  $('.more_facets_link').click(function() {

    var append = setInterval(function() {

    // Wait for modal to be rendered into the DOM
    // then attach our button
    if ($('.react-modal.more_facets_dialog').length) {

        desc = false;

        width = $('.react-modal.more_facets_dialog').width();

        // Store current state
        storage = $('.react-modal-content div').clone(true);

        appendSortButton();

        registerButtonClicks();

        clearInterval(append);
      }
    }, 100);
  });
});
