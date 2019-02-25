/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * These functions are used exclusively for sorting the
 * user's personal lists.
 */

resourceLibrary.ready(() => {

  let clicks = 0,
      delay = 125,
      desc = false,
      storage;

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Adds an event listener to the `Sort A-Z` button
   * and resets the `desc` value when the modal is dismissed.
   * @returns {undefined}
   */
  function addClickListener() {

    document.querySelector('#sortPLists').addEventListener('click', trackClicks);

    // Reset our `desc` value when canceled or saved.
    [...document.querySelectorAll('.ui-dialog-titlebar-close',
                                  '.lists_list_add_cancel',
                                  '.lists_list_add_save')].forEach(elem => {
                                    elem.addEventListener('click', () => { desc = false; });
                                  });
  }

  /**
   * Alphabetizes the links
   * @param {string} o1 The string value of the option
   * @param {string} o2 The string value of the option
   * @returns {integer}
   */
  function compareOptions(o1, o2) {

    let x = o1.textContent.toLowerCase(),
        y = o2.textContent.toLowerCase();

    return x > y ? 1 : ( x < y ? -1 : 0 );
  }

  /**
   * Waits for the list modal to render the
   * form inside it before adding the `Sort A-Z`
   * button
   * @returns {undefined}
   */
  function injectSortButton() {

    let injectSortButton,
        sortButton = `<div style="position: absolute; left: 295px; top: 10px;">
                        <button id="sortPLists" class="button button-blue">
                          Sort A-Z
                        </button>
                      </div>`;

    injectSortButton = setInterval(() => {

      if ( document.querySelector('#listadd') ) {

        clearInterval(injectSortButton);

        storage = document.querySelector('#list_oldpick').cloneNode(true);

        document.querySelector('#listadd').insertAdjacentHTML('afterend', sortButton);
        addClickListener();
      }
    }, 100);
  }

  /**
   * Sorts the options from A-Z or Z-A
   * @param {boolean} sortDescending The sort direction
   * @returns {undefined}
   */
  function sortOptions(sortDescending) {

    let select = document.querySelector('#list_oldpick'),
        opt = document.createElement('option'),
        optionsArray = [...select.querySelectorAll('option')];

    optionsArray.sort(compareOptions);

    if (sortDescending) { optionsArray.reverse(); }
    // Clear out select element
    [...select.querySelectorAll('option')].forEach(opt => opt.remove());

    // Create temporary option
    opt.textContent = 'Sorting...';
    select.insertAdjacentElement('beforeend', opt);

    // intentional delay for illustrative purposes only
    setTimeout(() => {
      // Remove temporary option
      select.querySelector('option').remove();
      // Insert newly sorted options
      optionsArray.forEach(opt => select.append(opt));
      // Select the first option after reordering
      select.value = select.querySelector('option').value;

    }, delay);
  }

  /**
   * Tracks the `Sort A-Z` button clicks
   * @returns {undefined}
   */
  function trackClicks() {

    let select = document.querySelector('#list_oldpick'),
        opt = document.createElement('option');

    clicks++;
    resourceLibrary.setButtonText(document.querySelector('#sortPLists'));

    if ( clicks > 2 ) {

      [...select.querySelectorAll('option')].forEach(opt => opt.remove());

      opt.textContent = 'Undoing...';
      select.insertAdjacentElement('beforeend', opt);

      // intentional delay for illustrative purposes only
      setTimeout(() => {
        select.innerHTML = storage.innerHTML;
      }, delay);

      clicks = 0;
      return;
    }

    sortOptions(desc);
    desc = !desc;
    return;
  }

  // ========================================================
  // DOM Setup / Init
  // ========================================================
  try {

    document.querySelectorAll('.add_to_list').forEach(link => {

      link.addEventListener('click', () => {
        let waitForListModal = setInterval(() => {
          desc = false;
          // Make sure the select exists
          if ( document.querySelector('#list_oldpick option') ) {
            clearInterval(waitForListModal);
            // Insert our sort button
            injectSortButton();
          }
        }, 100);
      });
    });
  } catch (err) {
    // just catch the error
  }
});
