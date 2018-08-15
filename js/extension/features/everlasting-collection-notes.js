/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

// ========================================================
// All of these functions are used with the Everlasting
// Collection feature. When appending new sets of pages
// to the DOM, the event listeners are not updated
// so the new elements will not function. These functions
// recreate the missing functionality on the new DOM
// elements.
// ========================================================

// ========================================================
// Functions (Alphabetical)
// ========================================================

/**
 * Removes the `.notes_editing` class from the
 * element which closes the notes textarea.
 * @param {object} event The event object
 * @returns {undefined}
 */
function cancelNotes(event) {
  event.target.closest('.notes_field').classList.remove('notes_editing');
}

/**
 * Opens the note field for editing and adds
 * event listeners to the save and cancel buttons
 * @param {object} event The event object
 * @returns {undefined}
 */
function openNoteField(event) {

  let content = event.target.dataset.content || '',
      target = event.target.closest('.notes_field');

  target.classList.add('notes_editing');
  target.querySelector('.notes_textarea').value = content;
  target.querySelector('.notes_textarea').focus();
}

/**
 * Sends the new notes data to Discogs
 * @returns {undefined}
 */
async function postNotes(notesData, event) {

  let query = queryString(notesData),
			value = query,
			headers = { 'content-type': 'application/x-www-form-urlencoded' },
			url = 'https://www.discogs.com/list/coll_update',
			initObj = {
				body: value,
				credentials: 'include',
				headers: headers,
				method: 'POST'
			},
			response = await fetch(url, initObj);

	if ( response.ok ) {

    let res = await response.json(),
        target = event.target.closest('.notes_field');

    target.classList.remove('notes_editing');

    // Add the appropriate classes depending on what was edited
    if ( !res.html ) {
      target.classList.add('notes_not_edited');
      target.classList.remove('notes_edited');
    } else {
      target.classList.remove('notes_not_edited');
      target.classList.add('notes_edited');
    }

    target.querySelector('.notes_text').dataset.content = res.content;
    target.querySelector('.notes_text').innerHTML = res.html;
	}
}

/**
 * Converts an object to a query string for
 * posting notes data to Discogs
 * @param {object} obj The object to strigify
 * @returns {string}
 */
function queryString(obj) {
  return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

/**
 * Gathers the new note data to send to Discogs
 * @param {object} event The event object
 * @returns {method}
 */
function saveNotes(event) {

  let colId = event.target.closest('.notes_field').dataset.collId,
      fieldId = event.target.closest('.notes_field').dataset.field,
      folderId, // TODO: what is this value for?
      val = event.target.closest('.notes_field').querySelector('.notes_textarea').value,
      notes = event.target.closest('.notes_field').querySelector('.notes_textarea').value,
      notesObj = {
        coll_id: colId,
        field_id: fieldId,
        folder_id: folderId || null,
        val: val,
        notes: notes
      };

  return postNotes(notesObj, event);
}

// ========================================================
// Event listeners
// ========================================================

resourceLibrary.ready(() => {

  document.querySelector('body').addEventListener('click', event => {

    let target = event.target;

    // cancel button
    if ( target.id === 'notes_edit_cancel' ) {
      return cancelNotes(event);
    }
    // edit/add notes
    if ( target.closest('.de-notes-show') ) {
      return openNoteField(event);
    }
    // save notes
    if ( target.parentElement.previousElementSibling
         && target.parentElement.previousElementSibling.closest('.de-notes-show')
         && target.id == 'notes_edit_save') {
      return saveNotes(event);
    }
  });
});
