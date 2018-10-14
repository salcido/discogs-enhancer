/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

resourceLibrary.ready(() => {

  let href = window.location.href,
      hasRun = false;

  /**
   * Modifies all release links to open in a new window
   * @returns {Undefined}
   */
  function modifyLinks() {
    let links = document.querySelectorAll('#collection tbody a');
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
  function modifyPagination() {
    document.body.addEventListener('click', event => {
      if ( event.target.closest('.pagination_page_links') ||
           event.target.closest('.release-table thead') ||
           event.target.closest('.FacetsNav') ) {
        setTimeout(() => modifyLinks(), 100);
      }
    });
  }

  // ========================================================
  // DOM Setup
  // ========================================================

  if ( href.includes('/collection') ) {

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
                modifyLinks();
                modifyPagination();
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
