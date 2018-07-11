/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

// TODO: fix notes counter

/**
 * Adds click event listeners to each `.de-notes-show`
 * classed element
 * @returns {undefined}
 */
window.addNoteListeners = function addNoteListeners() {
  let notes = [...document.querySelectorAll('.de-notes-show')];

  notes.forEach(note => {
    note.removeEventListener('click', window.openNoteField);
    note.addEventListener('click', window.openNoteField);
  });
};

/**
 * Opens the note field for editing and adds
 * event listeners to the save and cancel buttons
 * @param {object} event The event object
 * @returns {undefined}
 */
window.openNoteField = function openNoteField(event) {

  let content = event.target.dataset.content || '',
      target = event.target.closest('.notes_field');

  target.classList.add('notes_editing');
  target.querySelector('.notes_textarea').value = content;
  target.querySelector('.notes_textarea').focus();

  window.addCancelListeners(event);
  window.addSaveListeners(event);
};

/**
 * Adds a click event listener to the cancel button
 * @param {object} event The event object
 * @returns {undefined}
 */
window.addCancelListeners = function addCancelListeners(event) {
  let target = event.target.closest('.notes_field').querySelector('#notes_edit_cancel');
  // Remove any previous event listeners first so that
  // multiple reqeusts are not made
  target.removeEventListener('click', window.cancel);
  target.addEventListener('click', window.cancel);
};

/**
 * Removes the `.notes_editing` class from the
 * element which closes the notes textarea.
 * @param {object} event The event object
 * @returns {undefined}
 */
window.cancel = function cancel(event) {
  event.target.closest('.notes_field').classList.remove('notes_editing');
};

/**
 * Adds a click event listener to the save button
 * @param {object} event The event object
 * @returns {undefined}
 */
window.addSaveListeners = function addSaveListeners(event) {
  let target = event.target.closest('.notes_field').querySelector('#notes_edit_save');
  // Remove any previous event listeners first so that
  // multiple reqeusts are not made
  target.removeEventListener('click', window.save);
  target.addEventListener('click', window.save);
};

/**
 * Gathers the new note data to send to Discogs
 * @param {object} event The event object
 * @returns {method}
 */
window.save = function save(event) {

  let colId = event.target.closest('.notes_field').dataset.collId,
      fieldId = event.target.closest('.notes_field').dataset.field,
      folderId = null, // TODO: what is this value for?
      val = event.target.closest('.notes_field').querySelector('.notes_textarea').value,
      notes = event.target.closest('.notes_field').querySelector('.notes_textarea').value,
      notesObj = {
        coll_id: colId,
        field_id: fieldId,
        folder_id: folderId || null,
        val: val,
        notes: notes
      };

  return window.postNotes(notesObj, event);
};

/**
 * Converts an object to a query string for
 * posting notes data to Discogs
 * @param {object} obj The object to strigify
 * @returns {string}
 */
window.queryString = function queryString(obj) {
   let q = Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
   return q;
};

/**
 * Sends the new notes data to Discogs
 * @returns {assignment}
 */
window.postNotes = async function postNotes(notesData, event) {

  let query = window.queryString(notesData),
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
    let res = await response.json();
    console.log('SAVED', res);
    event.target.closest('.notes_field').classList.remove('notes_editing');
    event.target.closest('.notes_field').querySelector('.notes_text').dataset.content = res.content;
    return event.target.closest('.notes_field').querySelector('.notes_text').innerHTML = res.html;
	}
};
