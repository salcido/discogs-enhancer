/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO: Similar logic for CD/Digital releases?
$(document).ready(function() {

  let
      // don't insert dividers if headings already exist.
      // using 1 or less because of possible inclusion of track durations feature
      hasNoHeadings = $('.track_heading').length <= 1,
      // only insert dividers if there are more than 6 tracks
      listLength = $('.playlist tbody tr').length > 6,
      isVinyl = $('.profile').html().indexOf('/search/?format_exact=Vinyl') > -1,
      // Compilations have different markup requirements when rendering track headings...
      isCompilation = $('.tracklist_track_artists').length > 0,
      // ...so only insert the duration markup if it's a compilation
      duration = isCompilation ? '<td width="25" class="tracklist_track_duration"><span></span></td>' : '',
      spacer = '<tr class="tracklist_track track_heading"><td class="tracklist_track_pos"></td><td colspan="2" class="tracklist_track_title">&nbsp;</td>' + duration + '</tr>';

  if (hasNoHeadings && listLength && isVinyl) {

    let tracklist = $('.playlist tbody tr'),
        trackpos = $('.tracklist_track_pos').map(function() {
          if ($(this).text().length >= 1 && $(this).text().length < 4) {
            return $(this).text();
          }
        });

    trackpos.each(function(i, tpos) {

      // if the next track begins with a different letter
      // (ie: A1, A2, B - where B is the next track) insert the spacer
      if ( trackpos[i + 1] && tpos[0] !== trackpos[i + 1][0] ) {

        $(spacer).insertAfter(tracklist[i]);
      }
    });
  }
});
