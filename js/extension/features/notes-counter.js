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

  $('body').on('click', '.notes_show, .notes_text', function(event) {

    let count;

    // Wait for text field to be rendered in the DOM before
    // looking for its length value
    setTimeout(function() {

      if ( $(':focus') ) {

        let notes = $(':focus').val(),
            siblings = $(':focus').siblings();

        // Look for existing count spans and remove them if necessary
        if ( siblings.hasClass('de-notes-count') ) {

          siblings.closest( $('.de-notes-count') ).remove();
        }

        // This is necessary to prevent logging an error if
        // a focused element does not have a value
        // e.g.: Folder or Media/Sleeve Condition (select elements)
        count = notes ? notes.length : '0';

        // append the current character count from field
        if ( !$(':focus').find('.de-notes-count') > -1 ) {

          $(':focus').parent().append(`<span class="de-notes-count" style="display:inline-block; padding:3px;">${count} / 255</span>`);
        }

      } else {

        return;
      }
    }, 100);

    // Keyup listener for updating count values
    $(document).keyup(() => {

      if ( $(':focus').hasClass('notes_textarea') ) {

        let parent = $(':focus').parent();

        // update count value
        count = $(':focus').val().length;

        parent.find('.de-notes-count').text(`${count} / 255`);

        if ( count > 240 ) {

          parent.find('.de-notes-count').addClass('price');

        } else {

          parent.find('.de-notes-count').removeClass('price');
        }
      }
    });
  });

  // ========================================================
  // UI Funcitonality
  // ========================================================

  // Remove/reset stuff on save/cancel
  $('body').on('click', '#notes_edit_save, #notes_edit_cancel', function(event) {

    $(event.target).find('.de-notes-count').remove();
  });
});
