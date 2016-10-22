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

  $('body').on('click', '.notes_show, .notes_text', function(event) {

    let count;

    // Wait for text field to be rendered in the DOM before
    // looking for its length value
    setTimeout(function() {

      count = $(':focus');

      if (count) {

        // Look for existing count spans and remove them if necessary
        // TODO figure out why this is throwing an error...
        if ($(':focus').siblings().hasClass('de-notes-count')) {

          $(':focus').siblings().hasClass('de-notes-count').remove();
        }

        // If the focused element has a value, get it's length
        // otherwise, set it to '0'. This is necessary to prevent
        // logging an error if a focused element does not have a value
        // e.g.: Folder or Media/Sleeve Condition (select elements)
        if ($(':focus').val()) {

          count = $(':focus').val().length;

        } else {

          count = '0';
        }

        // append the current character count from field
        if ( !$(':focus').find('.de-notes-count') > -1 ) {

          $(':focus').parent().append('<span class="de-notes-count" style="display:inline-block; padding:3px;">' + count + ' / 255</span>');
        }

      } else {

        return;
      }
    }, 100);

    // Keyup listener for updating count values
    $(document).keyup(function() {

      if ($(':focus').hasClass('notes_textarea')) {

        // update count value
        count = $(':focus').val().length;

        $(':focus').parent().find('.de-notes-count').text(count + ' / 255');

        if (count > 240) {

          $(':focus').parent().find('.de-notes-count').addClass('price');

        } else {

          $(':focus').parent().find('.de-notes-count').removeClass('price');
        }
      }
    });
  });

  // Remove/reset stuff on save/cancel
  $('body').on('click', '#notes_edit_save, #notes_edit_cancel', function(event) {

    $(event.target).find('.de-notes-count').remove();
  });
});
