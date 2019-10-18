/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

rl.ready(() => {

  // ========================================================
  // Functions
  // ========================================================
  /**
   * Modifies all release links to open in a new window
   * @returns {Undefined}
   */
  function modifyReleaseLinks() {

    let collection = '#collection tbody a',
        coverView = '.release-covers a.release-image',
        isCollectionView = document.querySelector('.collection-header .menu-item.first').classList.contains('current'),
        selector = isCollectionView ? collection : coverView,
        links = document.querySelectorAll(selector + ', .tabs-wrap a');

    links.forEach(l => {
      l.setAttribute('target', '_blank');
      l.setAttribute('rel', 'noopener');
    });
  }

  /**
   * Listens for pagination, sorting, or filter link clicks.
   * Waits for the DOM to update before setting new attributes
   * @returns {Undefined}
   */
  function modifyUILinks() {
    // UI click events
    document.body.addEventListener('click', event => {
      if ( event.target.closest('.pagination_page_links') ||
           event.target.closest('.release-table thead') ||
           event.target.closest('.FacetsNav') ||
           event.target.closest('.tab_menu') ||
           event.target.closest('.clear') ) {
        setTimeout(() => modifyReleaseLinks(), 100);
      }
    });
    // Select change events
    document.body.addEventListener('change', event => {
      if ( event.target.type === 'select-one' ) {
        setTimeout(() => modifyReleaseLinks(), 100);
      }
    });
    // Searching with Enter keypress
    document.body.addEventListener('keyup', event => {
      if ( event.key === 'Enter' ) {
        setTimeout(() => modifyReleaseLinks(), 200);
      }
    });
  }

  // ========================================================
  // DOM Setup
  // ========================================================
  let hasRun = false;

  if ( rl.pageIs('collection') ) {

    let reactApp = document.querySelector('#CollectionApp'),
        config = { attributes: true, childList: true, subtree: true },
        observer,
        action;

    action = mutationsList => {
      for ( let mutation of mutationsList ) {

        if ( mutation.type === 'childList' ) {
          mutation.addedNodes.forEach(n => {

            if ( n.classList
                 && n.classList.value === 'pagination'
                 && !hasRun ) {

              hasRun = true;
              // wait for DOM to update
              setTimeout(() => {
                modifyReleaseLinks();
                modifyUILinks();
              }, 100);

              observer.disconnect();
            }
          });
        }
      }
    };

    observer = new MutationObserver(action);
    observer.observe(reactApp, config);
  }
});
