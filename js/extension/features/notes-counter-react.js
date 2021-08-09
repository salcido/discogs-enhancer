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

 // TODO: If you add an item to your collection and then
 // try to add notes (without refreshing) errors will
 // be thrown in console.
 rl.ready(() => {

  if (!rl.pageIsReact()) return;

  rl.waitForElement('div[class*="collection_"] button[class*="wrapper_"]').then(() => {

    let notesElem = document.querySelector('div[class*="collection_"] button[class*="wrapper_"]'),
        cwBlock = document.querySelector('div[class*="collection_"]');

    // ========================================================
    // Functions
    // ========================================================

    /**
     * Adds and removes the notes counter listeners
     * @returns {undefined}
     */
    window.addNotesCounter = function addNotesCounter() {

      let notes = document.querySelectorAll('div[class*="collection_"] button[class*="wrapper_"]');

      notes.forEach(elem => {
        // Remove existing listeners to as not to duplicate them
        elem.removeEventListener('click', window.activateNotesCounter);
        elem.addEventListener('click', window.activateNotesCounter);
      });
    };

    /**
     * Activates the notes counter when a note field is clicked
     * @returns {undefined}
     */
    window.activateNotesCounter = function activateNotesCounter() {

      let count;
      // Wait for text field to be rendered in the DOM before
      // looking for its length value
      setTimeout(() => {

        let focus = document.querySelector(':focus');

        if ( focus ) {

          let noteValue = focus.value,
              s = document.createElement('span'),
              siblings = [...focus.parentNode.childNodes];

          // Look for existing count spans and remove them if necessary
          siblings.forEach(el => {

            if ( el
                && el.classList
                && el.classList.contains('de-notes-count') ) {

              el.remove();
            }
          });

          // This is necessary to prevent logging an error if
          // a focused element does not have a value
          // e.g.: Folder or Media/Sleeve Condition (select elements)
          count = noteValue ? noteValue.length : '0';

          // append the current character count from field
          s.className = 'de-notes-count';
          s.style = 'padding-left:8px; font-weight: bold;';
          s.textContent = `${count} / 255`;
          focus.parentElement.appendChild(s);
          window.warnOnNoteLimit();

        } else {

          return;
        }
      }, 100);
    };

    /**
     * Counts the characters in the notes fields and
     * adds `.price` to the count element when the
     * count approaches 250.
     * @returns {undefined}
     */
    window.warnOnNoteLimit = function warnOnNoteLimit() {

      let count,
          focus = document.querySelector(':focus');

      if ( focus
            && focus.classList
            && focus.classList.contains('notes_textarea') ) {

        let notesCount = focus.parentElement.querySelector('.de-notes-count');

        // update count value
        count = focus.value.length;

        notesCount.textContent = `${count} / 255`;

        // warn when count total approaches limit
        return count > 240
                ? notesCount.classList.add('price')
                : notesCount.classList.remove('price');
      }
    };

    // ========================================================
    // UI Funcitonality
    // ========================================================

    document.addEventListener('keyup', () => { window.warnOnNoteLimit(); });

    // Remove/reset stuff on save/cancel
    document.body.addEventListener('click', event => {

      let classList = event.target.classList;

      // "wrapper_" is the button that opens the notes field
      // "value_" is the notes field (is returned when there are pre-existing notes)
      if ( Array.from(classList).some((c) => /wrapper_.*/.test(c)) ||
           Array.from(classList).some((c) => /value_.*/.test(c)) ) {
        // add save / cancel classes to buttons

        document.querySelectorAll('div[class*="textedit_"]').forEach(elem => {
          elem.querySelectorAll('button')[0].classList.add('notes_edit_save');
          elem.querySelectorAll('button')[1].classList.add('notes_edit_cancel');
          elem.querySelectorAll('[class*="textarea_"]')[0].classList.add('notes_textarea');
        });
      }

      if ( Array.from(classList).some((c) => /notes_edit_.*/.test(c)) ) {
        // Add the counter event listeners since the elements are destroyed by React
        setTimeout(() => { window.addNotesCounter(); }, 100);
      }

      switch (classList) {

        case 'notes_edit_save':
        case 'notes_edit_cancel':
          event.target.parentElement.querySelector('.de-notes-count').remove();
          break;

        default:
          return;
      }
    });

    // ========================================================
    // DOM Setup / Init
    // ========================================================
    if ( notesElem || cwBlock ) {
      setTimeout(() => { window.addNotesCounter(); }, 100);
    }
  });
});
