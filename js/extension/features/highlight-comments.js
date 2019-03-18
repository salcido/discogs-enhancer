/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will wait until the dashboard has loaded, then iterate over the
 * friend's activity module and highlight any comments that have been
 * made.
 *
 * Currently, this has to be activated using the options modal
 * as it is an undocumented feature that seems only useful to myself.
 * If anyone else is reading this and is curious, look up
 * `dependencies/options/options.js` for more info :)
 */

resourceLibrary.ready(() => {

  let highlightComments = resourceLibrary.options.highlightComments(),
      href = window.location.href;

  // Check if we are on the dashboard
  if ( highlightComments && href.includes('/my') ) {

    // wait for the modules to load
    let int = setInterval(() => {

      // Check if the friend module has been populated
      let friends = document.querySelectorAll('#dashboard_friendactivity tr').length;

      if (friends) {

        // iterate over each comment
        let icons = document.querySelectorAll('.broadcast_table .icon-comment');

        // add the class hook
        icons.forEach(i => i.closest('tr').classList.add('has-comments'));

        // clear the interval
        clearInterval(int);
      }
    }, 13);

    // Clear the interval regardless so the `setInterval` doesn't run forever
    // in case there's no friend module on the dashboard
    setTimeout(() => clearInterval(int), 10000);
  }
});
