/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This rearranges the UI on the collection page
 * to what I think is a better layout and colors the
 * Move and Remove Selected buttons.
 */

resourceLibrary.ready(() => {

  let loc = window.location.href;

  if ( loc.includes('/collection') ) {

    let int = setInterval(() => {

      if ( document.getElementById('move_folder_id_bottom')
           && document.getElementById('move_folder_id_bottom').length ) {

        clearInterval(int);

        let
            bottomButtons = document.querySelector('.release_list_actions.multiple-buttons.bottom .fright'),
            bottomSelectFolder = document.getElementById('move_folder_id_bottom').outerHTML,
            moveButtonMarkup = document.querySelector('[name^="Action.MoveItems"]').outerHTML,
            toFolderString = '&nbsp; to folder: &nbsp;',
            topButtons = document.querySelector('.release_list_actions.multiple-buttons.top .fright'),
            topSelectFolder = document.getElementById('move_folder_id_top').outerHTML;

        // Swap the 'Move Selected' button with the 'Folder' select element on top
        topButtons.innerHTML = '';
        topButtons.insertAdjacentHTML('beforeend', moveButtonMarkup);
        topButtons.insertAdjacentHTML('beforeend', toFolderString);
        topButtons.insertAdjacentHTML('beforeend', topSelectFolder);
        // Swap the 'Move Selected' button with the 'Folder' select element on bottom
        bottomButtons.innerHTML = '';
        bottomButtons.insertAdjacentHTML('beforeend', moveButtonMarkup);
        bottomButtons.insertAdjacentHTML('beforeend', toFolderString);
        bottomButtons.insertAdjacentHTML('beforeend', bottomSelectFolder);

        // Label the 'Folder' select element with "Current folder:"
        document.querySelector('label[for="folder_top"]').textContent = 'Current folder: ';
        document.querySelector('label[for="folder_bottom"]').textContent = 'Current folder: ';
        // Move the 'Random Item' link over to the right
        document.getElementById('random_list_form').style = 'float: right; margin-top: 11px;';
        // Make the 'Remove Selected' buttons red
        [...document.querySelectorAll('.release_list_remove')].forEach(b => b.classList.add('button-red'));
        // Make the 'Move Selected' buttons green
        [...document.querySelectorAll('[name^="Action.MoveItems"]')].forEach(b => b.classList.add('button-green'));
      }
    }, 100);
  }
});
