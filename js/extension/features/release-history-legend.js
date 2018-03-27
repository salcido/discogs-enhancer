/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

/**
 *
 * dark-theme.css will override all styles.
 * This will colorize the legend on the release history page.
 *
 */

resourceLibrary.ready(() => {

  if ( window.location.href.includes('/history') ) {

    setTimeout(() => {

      document.querySelector('td[bgcolor="#ffaaaa"]').setAttribute('style', 'color: #ffaaaa !important');

      document.querySelector('td[bgcolor="#ffff77"]').setAttribute('style', 'color: #ffff77 !important');

      document.querySelector('td[bgcolor="#aaffaa"]').setAttribute('style', 'color: #aaffaa !important');

    }, 200);
  }
});
