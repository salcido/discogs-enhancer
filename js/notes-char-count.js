/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let count;

  $('body').on('click', '.notes_show, .notes_text', function(event) {

    let target = event.target;

    count = 0;

    // Wait for text field to be rendered in the DOM before
    // looking for its length value
    setTimeout(function() {

      count = $(target).parent().parent().find($('.notes_textarea')).val();

      if (count) {
        // This span is being appended twice. Not sure why? Remove it if it exists.
        if ($('.de-notes-count')) {

          $('.de-notes-count').remove();
        }

        // append the current character count from field
        $('.notes_edit').append('<span class="de-notes-count">' + count.length + '/255</span>');

      } else {

        return;
      }
    }, 100);

    // Keyup listener for updating count values
    $(document).keyup(function() {

      if ($(':focus').hasClass('notes_textarea')) {

        // update count value
        count = $(':focus').val().length;

        $('.de-notes-count').text(count + '/255');
      }
    });
  });

  // Remove/reset stuff on save/cancel
  $('body').on('click', '#notes_edit_save, #notes_edit_cancel', function() {

    $('.de-notes-count').remove();

    count = '';
  });
});
