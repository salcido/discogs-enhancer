/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * These functions are used exclusively for sorting the
 * Explore modals (Genre, Style, Format, Country and Decade)
 */

rl.ready(() => {

  let clicks = 0,
      desc = false,
      storage;

  // ========================================================
  // Functions (Alphabetical)
  // ========================================================

  /**
   * Injects sort button into modal
   * @returns {undefined}
   */
  function appendSortButton() {

    let sortButton = `<div style="text-align: center;">
                        <button id="sortExplore" class="button button-blue">
                          Sort A-Z
                        </button>
                     </div>`;

    document.querySelector('.react-modal-header').insertAdjacentHTML('beforeend', sortButton);
  }

  /**
   * Alphabetizes the links
   * @method compareText
   * @param {string} a1 The string value of the href
   * @param {string} a2 The string value of the href
   * @return {integer}
   */
  function compareText(a1, a2) {

    let x = a1.querySelector('a').href.toLowerCase(),
        y = a2.querySelector('a').href.toLowerCase();

    return x > y ? 1 : (x < y ? -1 : 0);
  }

  /**
   * Adds click event listeners to the `Sort A-Z` button
   * @returns {undefined}
   */
  function registerButtonClicks() {

    document.querySelector('#sortExplore').addEventListener('click', trackClicks);
    // reset `desc` when modal is closed with the 'X' button
    document.querySelector('.react-modal-close-button-icon').addEventListener('click', () => { desc = false; });
  }

  /**
   * Sorts the lists and injects the newly sorted elements
   * into a custom UL element.
   * @param {object} ul The target UL element
   * @param {boolean} sortDescending The sort direction
   * @returns {undefined}
   */
  function sortUnorderedList(ul, sortDescending) {

    let listElms = [...document.querySelectorAll('.react-modal-content div ul.facets_nav li')],
        ulstub = document.createElement('ul'),
        newUl = null;

    listElms.sort(compareText);

    if ( sortDescending ) { listElms.reverse(); }

    ul.innerHTML = '';
    ulstub.className = 'facets_nav';
    ul.append(ulstub);

    newUl = document.querySelector('.react-modal-content div ul.facets_nav');

    listElms.forEach(elem => newUl.insertAdjacentElement('beforeend', elem));
    // shrink modal to small column size (for looks)
    document.querySelector('.react-modal.more_facets_dialog').classList.add('contract');
  }

  /**
   * Tracks the number of times the `Sort A-Z` button has been clicked
   * and calls `sortUnorderedList` accordingly.
   * @returns {undefined}
   */
  function trackClicks() {

    clicks++;
    rl.setButtonText(document.querySelector('#sortExplore'));

    if ( clicks > 2 ) {

      document.querySelector('.react-modal-content div').innerHTML = storage.innerHTML;
      document.querySelector('.react-modal.more_facets_dialog').classList.remove('contract');
      clicks = 0;
      return;
    }

    sortUnorderedList(document.querySelector('.react-modal-content div'), desc);
    desc = !desc;
    return;
  }

  // ========================================================
  // DOM Setup / Init
  // ========================================================

  // Attach listeners to `All` anchors to kick things off...
  [...document.querySelectorAll('.more_facets_link')].forEach(link => {

    link.addEventListener('click', () => {

      desc = false;

      let append = setInterval(() => {

        if ( document.querySelector('.react-modal.more_facets_dialog') ) {

          // Store current state
          storage = document.querySelector('.react-modal-content div').cloneNode(true);

          appendSortButton();
          registerButtonClicks();

          clearInterval(append);
        }
      }, 100);
    });
  });
});
