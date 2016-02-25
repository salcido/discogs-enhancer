/**
 *
 * These functions are used exclusively for sorting the
 * user's personal lists.
 *
 */

(function() {

  var desc = false;

  // Link sorter function
  function compareOptions(a1, a2) {

    var t1 = $(a1).text(),
        t2 = $(a2).text();

    return t1 > t2 ? 1 : (t1 < t2 ? -1 : 0);
  }



  function sortPersonalLists(options, sortDescending) {

    var optionsArray = [];

    // The options are rewritten everytime the modal is called
    // so we wait 150ms then sort them.
    setTimeout(function() {

      optionsArray = options.map(function() { return this; }).get();

      optionsArray.sort(compareOptions);

      if (sortDescending) { optionsArray.reverse(); }

      $('#list_oldpick').find('option').remove();

      $(optionsArray).each(function(index) {

        $('#list_oldpick').append(optionsArray[index]);
      });

      // Select the first option after reordering
      // It lets the user know something was done
      // and is just practical ;)
      $('#list_oldpick').val($('#list_oldpick option:first').val());

    }, 150);
  }



  // Add new button functionality
  function registerOptionButtonClicks() {

    $('#sortPLists').click(function() {

      var sortName = ($(this).text() === 'Sort A-Z') ? 'Sort Z-A' : 'Sort A-Z';

      sortPersonalLists($('#list_oldpick option'), desc);

      desc = !desc;

      $(this).text(sortName);

      return false;
    });

    // Reset our |desc| value when canceled or saved.
    $('.ui-dialog-titlebar-close').click(function() { desc = false; });

    $('.lists_list_add_cancel').click(function() { desc = false; });

    $('.lists_list_add_save').click(function() { desc = false; });
  }



  $('.add_to_list').on('click', function() {

    var findList = null,
        sortButton = '<div style="position: absolute; left: 325px; top: 10px;">' +
                     '<button id="sortPLists" ' +
                     'class="button button_blue" ' +
                     'style="margin-bottom: 10px;' +
                     'width: 65px;">Sort A-Z</button>' +
                     '</div>';

    findList = setInterval(function() {

      // Make sure the select exists
      if ($('#list_oldpick option').length) {

        // fire sorting upon first click
        // (would be cool to make this an option in the menu)
        //sortPersonalLists($('#list_oldpick option'), desc);

        // Insert our 'Sort A-Z' button
        setTimeout(function() {

          $(sortButton).insertAfter($('#listadd'));

          registerOptionButtonClicks();

        }, 75);

        clearInterval(findList);
      }
    }, 50);

    desc = !desc;
  });

})();
