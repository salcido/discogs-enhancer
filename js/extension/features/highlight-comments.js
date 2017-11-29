/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let comments = resourceLibrary.options.highlightComments(),
      href = window.location.href;

  if ( comments && href.includes('/my') ) {

    let int = setInterval(function() {

      let friends = document.querySelectorAll('#dashboard_friendactivity tr').length;

      if ( friends ) {

        let icons = document.querySelectorAll('.broadcast_table .icon-comment');

        icons.forEach(i => {

          i.parentElement.parentElement.parentElement.classList.add('has-comments');
        });

        clearInterval(int);
      }
    }, 13);
  }
});
