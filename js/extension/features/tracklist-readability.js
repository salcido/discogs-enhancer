/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// Examples:
// https://www.discogs.com/STL-Night-Grooves/release/1121308
// https://www.discogs.com/Jerry-Goldsmith-Gremlins-Original-Motion-Picture-Soundtrack/release/9436212

// Cassette
// https://www.discogs.com/Casino-Vs-Japan-Frozen-Geometry/release/9108134

// lots of tracks
// https://www.discogs.com/Farmers-Manual-Fsck/release/106658

// multi-formats:
// https://www.discogs.com/Muse-The-Resistance/release/4318500
// https://www.discogs.com/Bunbury-Archivos-Vol-2-Duetos/release/9495721

// Bad example
// https://www.discogs.com/Various-The-Rise-And-Fall-Of-Paramount-Records-1928-1932-Volume-2/release/6265588

$(document).ready(function() {

  if ( document.location.href.includes('/release/') && !document.location.href.includes('/history') ) {

    let
        config = JSON.parse(localStorage.getItem('readability')) || { indexTracks: false,
                                                                      nth: 10,
                                                                      otherMediaReadability: false,
                                                                      otherMediaThreshold: 15,
                                                                      size: 0.5,
                                                                      vcReadability: true,
                                                                      vcThreshold: 8 },
        show = JSON.parse(localStorage.getItem('readabilityDividers')) || setReadabilityTrue(),

        debug = resourceLibrary.options.debug(),

        // don't insert spacers if headings or index tracks already exist.
        // And don't confuse release durations with track headers
        durations = $('.de-durations').length,
        noHeadings = durations ? $('.track_heading').length <= 1 : $('.track_heading').length < 1,
        hasIndexTracks = $('.index_track').length > 0,

        // Compilations have different markup requirements when rendering track headings...
        isCompilation = $('.tracklist_track_artists').length > 0,

        // ...so only insert the duration markup if it's a compilation
        duration = isCompilation ? '<td width="25" class="tracklist_track_duration"><span></span></td>' : '',

        // jQ object of all tracks on a release
        tracklist = $('.playlist tbody tr'),

        // size of dividers inserted between tracks
        size = config.size ? `line-height:${config.size}rem;` : 'line-height:0.5rem',

        prefix = [],
        sequence = [],
        isSequential = false,

        // divider markup to be injected
        display = show ? '' : 'display:none;',
        spacer = `<tr class="tracklist_track track_heading de-spacer" style="${size} ${display}">` +
                    '<td class="tracklist_track_pos"></td>' +
                    '<td colspan="2" class="tracklist_track_title">&nbsp;</td>' +
                    `${duration}` +
                  '</tr>',

        // title of show/hide dividers link
        trigger = show
                  ? '<a class="smallish fright de-spacer-trigger">Hide Dividers</a>'
                  : '<a class="smallish fright de-spacer-trigger">Show Dividers</a>';

    // ========================================================
    // Functions
    // ========================================================

    /**
     * Sets default value for readabilityDividers
     *
     * @method setReadabilityTrue
     * @return {object}
     */
    function setReadabilityTrue() {

      if ( !localStorage.getItem('readabilityDividers') ) {

        localStorage.setItem('readabilityDividers', 'true');
      }

      return JSON.parse(localStorage.getItem('readabilityDividers'));
    }

    /**
     * Examines an array and determines if it has
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

        if ( num === i + 1 ) { count++; }
      });

      return count === arr.length ? true : false;
    }

    /**
     * Examines an array and inserts some markup when the next
     * index of the array differs from the current index.
     *
     * It's designed to find the differences in sides on a
     * tracklist like when the numbers are sequential
     * eg: A1, A2, *insert html here* B3, B4, C5, C6 ...
     *
     * @method insertSpacersBasedOnAlphaDifferences
     * @param  {array} arr [the array to iterate over]
     * @return {undefined}
     */
    function insertSpacersBasedOnAlphaDifferences(arr) {

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

      arr.each(i => {

        if ( i % nth === 0 && i !== 0 ) {

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

        arr.each(i => {

          let current = Number( arr[i].match(/\d+/g) ),
              next = Number( arr[i + 1].match(/\d+/g) );

          // check for 0 value which can be returned when a
          // track is simply listed as A, B, C, etc ...
          if ( next <= current && current !== 0 || !current && next ) {

            if ( i !== tracklist.length - 1 ) {

              $(spacer).insertAfter(tracklist[i]);
            }
          }
        });
      } catch (e) {
        // just catch the errors
      }
    }

    /**
     * When releases have multiple discs or formats, examine
     * the last two characters of each track position and push them
     * into an array.
     *
     * Then iterate over the array and compare the number sequence.
     * If the sequence is interupted, this likely means it's a
     * new disc (etc) so insert the divider at that position.
     *
     * Also, using for-loops because they are crazy fast. Don't hate.
     *
     * @method handleMultiFormatRelease
     * @param  {array} arr [an array of all track positions in a release]
     * @return {undefined}
     */
    function handleMultiFormatRelease(arr) {

      let counter = 1,
          suffix = [];

      for ( let i = 0; i < arr.length; i++ ) {

        if ( !arr[i][arr[i].length - 2] ) {

          break;
        }

        // Get the last two numerical digits from each track position
        let lastTwo = ( arr[i][arr[i].length - 2] + arr[i][arr[i].length - 1] ).match(/\d/g);

        if (lastTwo) {

          suffix.push(lastTwo.join(''));

        } else {

          // if there aren't two digits
          // push '1' so the number sequence will be broken
          // and dividers will be inserted
          suffix.push('1');
        }
      }

      for ( let i = 0; i < suffix.length; i++ ) {

        // using '==' specifcally for coercion
        // (Crockford is heartbroken; Simpspon is proud)
        if ( suffix[i] == counter ) {

          counter++;

        } else if ( suffix[i] && suffix[i] != counter ) {

          $(spacer).insertAfter(tracklist[i - 1]);

          // reset counter and `i` to continue comparison
          counter = 1;
          i--;
        }
      }
    }

    // ========================================================
    // UI Functionality
    // ========================================================

    /**
     * Appends the show/hide dividers trigger
     *
     * @return {undefined}
     */
    function appendUI() {

      if ( !$('.de-spacer-trigger').length ) {

        $('#tracklist .group').append(trigger);
      }

      // Trigger functionality
      $('.de-spacer-trigger').on('click', function() {

        if ($('.de-spacer').is(':visible')) {

          $(this).text('Show Dividers');
          show = false;

        } else {

          $(this).text('Hide Dividers');
          show = true;
        }

        $('.de-spacer').toggle('fast');

        localStorage.setItem('readabilityDividers', JSON.stringify(show));
      });
    }

    // ========================================================
    // DOM Manipulation
    // ========================================================

    // CDs (nuts)
    if ( noHeadings && !hasIndexTracks ) {

      let prefixes = false,
          trackpos = $('.tracklist_track_pos').map(function() { return $(this).text(); });

      // Determine any common CD prefixes in the track positions
      for ( let i = 0; i < trackpos.length; i++ ) {

        if ( trackpos[i].includes('-') ||
             trackpos[i].includes('.') ||
             trackpos[i].includes('CD') ||
             trackpos[i].includes('LP') ||
             trackpos[i].includes('BD') ||
             trackpos[i].includes('VHS') ||
             trackpos[i].includes('DVD') ) {

          prefixes = true;
        }
      }

      // No specialized prefixes
      if ( !prefixes ) {

        // Populate our arrays with whatever the prefix is and the remaining numbers
        trackpos.each(function(i, tpos) {

          // Make sure to match a real value, not null
          if (tpos.match(/\D/g)) {

            prefix.push(String(tpos.match(/\D/g)));
          }

          sequence.push(Number(tpos.match(/\d+/g)));
        });

        isSequential = hasContinualNumberSequence(sequence);

        // if there are both numbers and letters in the track positions
        if ( isSequential && prefix.length ) {

          // if the numbering is sequential (eg: A1, A2, B3, B4, C5, C6, C7 ...),
          // use the alpha-prefixes to determine where to insert the spacer markup
          if ( config && config.vcReadability && tracklist.length > config.vcThreshold ) {

            appendUI();
            insertSpacersBasedOnAlphaDifferences(prefix);

            if (debug) {
              console.log('');
              console.log('Tracklist Readability:');
              console.log('insert Spacers Based On Alpha Differences');
            }
          }

        // There is a number sequence but no prefix (eg: CDs, mp3s, etc)
        } else if ( isSequential && !prefix.length ) {

          if ( config && config.otherMediaReadability && tracklist.length > config.otherMediaThreshold ) {

            if (debug) {
              console.log('');
              console.log('Tracklist Readability:');
              console.log('insert Spacers Every Nth');
            }

            appendUI();
            return insertSpacersEveryNth(tracklist, config.nth);
          }

        } else {

          // If the numbering is not sequential ala
          // Vinyl and Cassettes (eg: A1, A2, B, C1, C2)
          if ( config && config.vcReadability && tracklist.length > config.vcThreshold && !hasIndexTracks ) {

            appendUI();
            insertSpacersBasedOnSides(trackpos);

            if (debug) {
              console.log('');
              console.log('Tracklist Readability:');
              console.log('insert Spacers Based On Sides');
            }
          }
        }

      } else {

        if ( config && config.vcReadability && tracklist.length > config.vcReadability ) {

          appendUI();
          handleMultiFormatRelease(trackpos);

          if (debug) {
            console.log('');
            console.log('Tracklist Readability:');
            console.log('handle Multi-Format Release');
          }
        }
      }
    }

    // Index tracks
    if ( config && noHeadings && config.indexTracks && hasIndexTracks ) {

      appendUI();

      if (debug) {
        console.log('');
        console.log('Tracklist Readability:');
        console.log('handle index tracks');
      }

      tracklist.each(function(i) {

        if ( $(this).hasClass('index_track') && i !== 0 ) {

          $(spacer).insertBefore(tracklist[i]);
          //$(this).addClass('track_heading')
        }
      });
    }
  }
});
