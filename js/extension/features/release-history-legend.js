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

  let
      artistHistory = /\/artist\//g,
      labelHistory = /\/label\//g,
      loc = window.location.href,
      releaseHistory = /\/release\//g;

  if ( artistHistory.test(loc) || releaseHistory.test(loc) || labelHistory.test(loc) ) {

    setTimeout(() => {

      document.querySelector('td[bgcolor="#ffaaaa"]').setAttribute('style', 'color: #ffaaaa !important');

      document.querySelector('td[bgcolor="#ffff77"]').setAttribute('style', 'color: #ffff77 !important');

      document.querySelector('td[bgcolor="#aaffaa"]').setAttribute('style', 'color: #aaffaa !important');

    }, 200);
  }
});
