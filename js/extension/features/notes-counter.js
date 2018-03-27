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
 * This feature will count the number of characters in the notes field.
 *
 * The script is initiated when the user clicks on any element with `.notes_show`
 * or `.notes_text`.
 *
 * 1.) The click event is used to check for siblings with an existing note count. If
 * found, it will be removed and a new one appended in its place.
 * 2.) The count is updated with `keyup` events.
 */

resourceLibrary.ready(() => {

  let notes = [...document.querySelectorAll('.notes_show, .notes_text')];

  notes.forEach(elem => {

    elem.addEventListener('click', () => {

      let count;

      // Wait for text field to be rendered in the DOM before
      // looking for its length value
      setTimeout(() => {

        let focus = document.querySelector(':focus');

        if ( focus ) {

          let notes = focus.value,
              s = document.createElement('span'),
              siblings = [...focus.parentNode.childNodes];

          // Look for existing count spans and remove them if necessary
          siblings.forEach(elem => {

            if ( elem
                 && elem.classList
                 && elem.classList.contains('de-notes-count') ) {

              elem.remove();
            }
          });

          // This is necessary to prevent logging an error if
          // a focused element does not have a value
          // e.g.: Folder or Media/Sleeve Condition (select elements)
          count = notes ? notes.length : '0';

          // append the current character count from field
          s.className = 'de-notes-count';
          s.style = 'display:inline-block; padding:3px;';
          s.textContent = `${count} / 255`;

          focus.parentElement.appendChild(s);

        } else {

          return;
        }
      }, 100);
    });
  });

  // ========================================================
  // UI Funcitonality
  // ========================================================

  // Keyup listener for updating count values
  document.addEventListener('keyup', () => {

    let count,
        focus = document.querySelector(':focus');

    if ( focus.classList.contains('notes_textarea') ) {

      let notesCount = focus.parentElement.querySelector('.de-notes-count');

      // update count value
      count = focus.value.length;

      notesCount.textContent = `${count} / 255`;

      // warn when count total approaches limit
      return count > 240
              ? notesCount.classList.add('price')
              : notesCount.classList.remove('price');
    }
  });

  // Remove/reset stuff on save/cancel
  document.body.addEventListener('click', event => {

    let id = event.target.id;

    switch(id) {

      case 'notes_edit_save':
      case 'notes_edit_cancel':
        event.target.parentElement.querySelector('.de-notes-count').remove();
        break;

      default:
       return;
    }
  });
});
