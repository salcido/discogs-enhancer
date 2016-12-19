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

$(document).ready(function() {

  let
      artistHistory = /\/artist\//g,
      loc = window.location.href,
      releaseHistory = /\/release\//g;

  if (artistHistory.test(loc) || releaseHistory.test(loc)) {

    setTimeout(function() {

      $('td[bgcolor="#ffaaaa"]').attr('style', 'color: #ffaaaa !important');

      $('td[bgcolor="#ffff77"]').attr('style', 'color: #ffff77 !important');

      $('td[bgcolor="#aaffaa"]').attr('style', 'color: #aaffaa !important');

    }, 200);
  }
});
