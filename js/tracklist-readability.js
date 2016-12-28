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
// TODO: add Show/Hide readability dividers link
// TODO: add check for release, master pages
// TODO:
// https://www.discogs.com/Godspeed-You-Black-Emperor-Lift-Your-Skinny-Fists-Like-Antennas-To-Heaven/release/74260?ev=rr
// https://www.discogs.com/Various-Crosswalk-Volume-01/release/7315950
// https://www.discogs.com/Jerry-Goldsmith-Gremlins-Original-Motion-Picture-Soundtrack/release/9436212

$(document).ready(function() {

  let
      // don't insert dividers if headings already exist.
      // using 1 or less because of possible inclusion of track durations feature
      hasNoHeadings = $('.track_heading').length <= 1,

      hasNoIndexTracks = $('.index_track').length === 0,

      // only insert dividers if there are more than 6 tracks
      listLength = $('.playlist tbody tr').length > 6,

      isVinyl = $('.profile').html().indexOf('/search/?format_exact=Vinyl') > -1 || false,

      // Compilations have different markup requirements when rendering track headings...
      isCompilation = $('.tracklist_track_artists').length > 0,

      tracklist = $('.playlist tbody tr'),

      prefix = [],
      sequence = [],
      isSequential = false,

      // ...so only insert the duration markup if it's a compilation
      duration = isCompilation ? '<td width="25" class="tracklist_track_duration"><span></span></td>' : '',
      spacer = '<tr class="tracklist_track track_heading"><td class="tracklist_track_pos"></td><td colspan="2" class="tracklist_track_title">&nbsp;</td>' + duration + '</tr>';

  /**
   * Looks at an array and determins if it's has
   * a continual number sequence like: 1, 2, 3, 4, 5, 6, 7, 8, etc...
   *
   * It's designed to suit tracklists that have positions like:
   * A1, A2, B3, B4, B5, C6, C7, C8 ...
   *
   * @method hasContinualNumberSequence
   * @param  {array} arr [the array to iterate over]
   * @return {Boolean}
   */
  function hasContinualNumberSequence(arr) {

    let count = 0;

    arr.forEach((num, i) => {

      if (num === i + 1) { count++; }
    });

    return count === arr.length ? true : false;
  }

  /**
   * Looks at an array and inserts some markup when the next
   * index of the array differs from the current index.
   *
   * It's designed to find the differences in sides on a
   * tracklist like: A1, A2, *insert html here* B1, B2
   *
   * @method alphabeticalBreaks
   * @param  {array} arr [the array to iterate over]
   * @return {undefined}
   */
  function alphabeticalBreaks(arr) {

    arr.forEach((letter, i) => {

      if ( tracklist[i + 1] && arr[i] !== arr[i + 1] ) {

        $(spacer).insertAfter(tracklist[i]);
      }
    });
  }

  // Draxx them sklounst
  if (hasNoHeadings && hasNoIndexTracks && listLength && isVinyl) {

    let trackpos = $('.tracklist_track_pos').map(function() { return $(this).text(); });

    // Populate our arrays with whatever the prefix is and the remaining numbers
    trackpos.each(function(i, tpos) {

      //console.log(tpos.match(/\D/g), Number(tpos.match(/\d+/g)));

      prefix.push(String(tpos.match(/\D/g)));
      sequence.push(Number(tpos.match(/\d+/g)));
    });

    isSequential = hasContinualNumberSequence(sequence);

    if (isSequential) {

      // if the numbering is sequential, use the alpha-prefixes to
      // determin where to insert the spacer markup
      return alphabeticalBreaks(prefix);

    } else {

      try {

        trackpos.each(function(i, tpos) {
          // if the next track's number is less than the current tracks number (ie: A2, B1 ...)
          if ( trackpos[i + 1].match(/\d+/g) < tpos.match(/\d+/g) ||
               // or the current track has no number and the next one does (ie: A, B1, ...)
               !tpos.match(/\d+/g) && trackpos[i + 1].match(/\d+/g) ) {

            $(spacer).insertAfter(tracklist[i]);
          }
        });
      } catch (e) {
        // just catch the errors and don't throw them
      }
    }
  }
});


// Insert dividers between every different side:
// TODO: make this an option
/*

  if (hasNoHeadings && listLength && isVinyl) {

    let tracklist = $('.playlist tbody tr'),
        // array of strings (ie: ["A1", "A2", "B1", "B2" ...])
        trackpos = $('.tracklist_track_pos').map(function() { return $(this).text(); });

    trackpos.each(function(i, tpos) {

      // If the next track begins with a different letter
      // (ie: A1, A2, B - where B is the next track), insert the spacer.
      //
      // Check for falsy value with `!tracklist[1].classList.contains('track_heading')`
      // in case tracktimes option gets injected before this has run. Prevents a
      // spacer being inserted after the last track and before the tracktime total.
      if ( trackpos[i + 1] &&
           tpos[0] !== trackpos[i + 1][0] &&
           !tracklist[i + 1].classList.contains('track_heading') ) {

        $(spacer).insertAfter(tracklist[i]);
      }
    });
  }

*/
