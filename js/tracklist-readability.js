/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO: Add config option to insert spacer between all sides regardless of numeration
// TODO: create config object
// TODO: check for multiple formats and default to nth?

// Examples:
// https://www.discogs.com/STL-Night-Grooves/release/1121308
// https://www.discogs.com/Prince-Of-Denmark-8/release/9401170
// https://www.discogs.com/Various-Crosswalk-Volume-01/release/7315950
// https://www.discogs.com/Jerry-Goldsmith-Gremlins-Original-Motion-Picture-Soundtrack/release/9436212
// https://www.discogs.com/Casino-Vs-Japan-Frozen-Geometry/release/9108134

$(document).ready(function() {

  if (document.location.href.indexOf('/release/') > -1) {

    let
        // don't insert spacers if headings or index tracks already exist.
        // using 1 or less because of possible inclusion of track durations feature
        noHeadingsOrIndex = $('.track_heading').length < 1 && $('.index_track').length === 0,

        // only insert spacers if there are more than n tracks
        // TODO: value is user definable?
        playlistLength = $('.playlist tbody tr').length,

        // Vinyl, casettes ...
        isMultiSided = $('.profile').html().indexOf('/search/?format_exact=Vinyl') > -1 ||
                       $('.profile').html().indexOf('/search/?format_exact=Cassette') > -1,

        multiSidedThreshold = 8,
        singleSidedThreshold = 15,

        // Compilations have different markup requirements when rendering track headings...
        isCompilation = $('.tracklist_track_artists').length > 0,

        // ...so only insert the duration markup if it's a compilation
        duration = isCompilation ? '<td width="25" class="tracklist_track_duration"><span></span></td>' : '',

        // jQ object of all tracks on a release
        tracklist = $('.playlist tbody tr'),

        prefix = [],
        sequence = [],
        isSequential = false,

        prefs = JSON.parse(localStorage.getItem('readability')),
        display = prefs ? '' : 'style="display:none;"',
        spacer = '<tr class="tracklist_track track_heading de-spacer" ' + display + '><td class="tracklist_track_pos"></td><td colspan="2" class="tracklist_track_title">&nbsp;</td>' + duration + '</tr>',
        trigger = prefs ? '<a class="smallish fright de-spacer-trigger">Hide Dividers</a>' : '<a class="smallish fright de-spacer-trigger">Show Dividers</a>';

    /**
     * Looks at an array and determines if it has
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
     * tracklist like when the numbers are sequential
     * eg: A1, A2, *insert html here* B3, B4, C5, C6 ...
     *
     * @method insertSpacersUsingAlphabet
     * @param  {array} arr [the array to iterate over]
     * @return {undefined}
     */
    function insertSpacersUsingAlphabet(arr) {

      arr.forEach((letter, i) => {

        let current = arr[i],
            next = arr[i + 1];

        if ( next && current !== next ) {

          $(spacer).insertAfter(tracklist[i]);
        }
      });
    }

    /**
     * Inserts a spacer after every nth track
     * Used for releases that are CDs, files, VHS, DVD, etc...
     *
     * @method   insertSpacersEveryNth
     * @param    {array}  arr [the array to iterate over]
     * @param    {number} nth [the number of tracks before a spacer is inserted]
     * @return   {undefined}
     */
    function insertSpacersEveryNth(arr, nth) {

      arr.each((i) => {

        if (i % nth === 0 && i !== 0) {

          $(spacer).insertAfter(tracklist[i - 1]);
        }
      });
    }

    /**
     * Inserts a spacer if the next track's number is less than the
     * current tracks number (eg: A2, B1 ...) or the current track
     * has no number and the next one does (eg: A, B1, ...)
     *
     * @method   insertSpacersBasedOnSides
     * @param    {array} arr [the array to iterate over]
     * @return   {undefined}
     */
    function insertSpacersBasedOnSides(arr) {

      try {

        arr.each(function(i) {

          let current = Number(arr[i].match(/\d+/g)),
              next = Number(arr[i + 1].match(/\d+/g));

          // check for 0 value which can be returned when a
          // track is simply listed as A, B, C, etc ...
          if ( next <= current && current !== 0 || !current && next ) {

            $(spacer).insertAfter(tracklist[i]);
          }
        });
      } catch (e) {
        // just catch the errors
      }
    }

    // =======================================
    // UI functionality
    // =======================================

    // Append trigger element
    $('#tracklist .group').append(trigger);

    // Trigger functionality
    $('.de-spacer-trigger').on('click', function() {

      if ($('.de-spacer').is(':visible')) {

        $(this).text('Show Dividers ');
        localStorage.setItem('readability', false);

      } else {

        $(this).text('Hide Dividers ');
        localStorage.setItem('readability', true);
      }

      $('.de-spacer').toggle('fast');
    });

    // =======================================
    // DOM manipulation
    // =======================================

    // Vinyl and cassettes
    if (noHeadingsOrIndex && playlistLength > multiSidedThreshold && isMultiSided) {

      // Get the track positions from the playlist
      let trackpos = $('.tracklist_track_pos').map(function() { return $(this).text(); });

      // Populate our arrays with whatever the prefix is and the remaining numbers
      trackpos.each(function(i, tpos) {

        // console.log(tpos.match(/\D/g), Number(tpos.match(/\d+/g)));

        prefix.push(String(tpos.match(/\D/g)));
        sequence.push(Number(tpos.match(/\d+/g)));
      });

      isSequential = hasContinualNumberSequence(sequence);

      if (isSequential) {

        // if the numbering is sequential (eg: A1, A2, B3, B4, C5, C6, C7 ...),
        // use the alpha-prefixes to determine where to insert the spacer markup
        return insertSpacersUsingAlphabet(prefix);

      } else {

        // If the numbering is not sequential (eg: A1, A2, B, C1, C2)
        return insertSpacersBasedOnSides(trackpos);
      }
    }

    // Non-sided releases (Digital, CD, etc...)
    if (noHeadingsOrIndex && playlistLength > singleSidedThreshold && !isMultiSided) {

      insertSpacersEveryNth(tracklist, 5);
    }
  }
});

// config object
// {
//   vcThreshold: 8,
//   otherMediaThreshold: 15,
//   vcReadability: true,
//   otherMediaReadability: true,
// }

// Insert spacers between every different side:
// TODO: make this an option
/*

  if (noHeadingsOrIndex && playlistLength && isMultiSided) {

    let tracklist = $('.playlist tbody tr'),
        // array of strings (eg: ["A1", "A2", "B1", "B2" ...])
        trackpos = $('.tracklist_track_pos').map(function() { return $(this).text(); });

    trackpos.each(function(i, tpos) {

      // If the next track begins with a different letter
      // (eg: A1, A2, B - where B is the next track), insert the spacer.
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
