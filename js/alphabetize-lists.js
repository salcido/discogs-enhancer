/**
 * 
 * Shamelessly stolen from http://jsfiddle.net/barmar/U7ubX/
 * and modified by me.
 * 
 */

var sortButton = '<div style="text-align: center;">' +
                 '<button id="sortEm" ' +
                 'class="button button_blue" ' +
                 'style="margin-bottom: 10px;' + 
                 'width: 100px;">Sort A-Z</button>' +
                 '</div>',
    desc = false;


// Inject sort button into modal
function appendSortButton() {

  $('.react-modal-header').append(sortButton);
}



// Add new button functionality
function registerButtonClicks() {

  $('#sortEm').click(function() {

    var sortName = ($(this).text() === 'Sort A-Z') ? 'Sort Z-A' : 'Sort A-Z';

    sortUnorderedList($('.react-modal-content div'), desc);

    desc = !desc;

    $(this).text(sortName);

    return false;
  });

  $('.react-modal-close-button-icon').click(function() {

    desc = false;
  });
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

  var lis = $('.react-modal-content div ul.facets_nav li'),
      vals = [],
      newUl = null;

  for (var i = 0, l = lis.length; i < l; i++) {

      vals.push(lis[i]);
  }

  vals.sort(compareText);

  if (sortDescending) { vals.reverse(); }

  ul.html('');

  ul.append('<ul class="facets_nav">');

  newUl = $('.react-modal-content div ul.facets_nav');

  for (var i = 0, l = vals.length; i < l; i++) {

    newUl.append(vals[i]);
  }

  // shrink modal to small column size (for looks)
  $('.react-modal.more_facets_dialog').animate({width: "180px"}, 300, 'swing');
}



// Map functions to modal dialog buttons
$('.more_facets_link').click(function() {

  // These are delayed to make sure they exist in 
  // the DOM first.
  setTimeout(function() { appendSortButton(); }, 100)

  setTimeout(function() { registerButtonClicks(); },200)
});