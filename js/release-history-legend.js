/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

/**
 *
 * dark-theme.css will override all styles.
 * This will colorize the legend on the release history page.
 *
 */
// TODO fix urls for languages
$(document).ready(function() {

  let
      artistHistory = /discogs.com\/artist\//g,
      loc = window.location.href,
      releaseHistory = /discogs.com\/release\//g;

  if (loc.match(releaseHistory) || loc.match(artistHistory)) {

    setTimeout(function() {

      $('td:contains("Removed from old version")').attr('style', 'color: #ffaaaa !important');

      $('td:contains("changed")').attr('style', 'color: #ffff77 !important');

      $('td:contains("Added to new version")').attr('style', 'color: #aaffaa !important');

    }, 200);
  }
});
