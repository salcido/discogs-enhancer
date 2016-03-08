/**
 *
 * dark-theme.css will override all styles.
 * This will colorize the legend on the release history page.
 *
 */

$(document).ready(function() {

  var loc = window.location.href,
      releaseHistory = /discogs.com\/release\//g;

  if (loc.match(releaseHistory)) {

    setTimeout(function() {

      $('td:contains("Removed from old version")').attr('style', 'color: #ffaaaa !important');

      $('td:contains("changed")').attr('style', 'color: #ffff77 !important');

      $('td:contains("Added to new version")').attr('style', 'color: #aaffaa !important');

    }, 200);
  }
});
