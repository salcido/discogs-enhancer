/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This will attempt to discern where visual dividers should be inserted into
 * the tracklist in an effort to improve its readability.
 *
 * The script is initiated after the `Init / DOM Setup` comment block.
 *
 * Functions are listed alphabetically.
 *
 * NOTE: This code is abysmal. It's terrible to understand and a nightmare
 * to maintain. If this ever breaks I will likely just remove it because I don't
 * want to deal with it again.
 *
 * ---------------------------------------------------------------------------
 * Use Case Examples:
 * ---------------------------------------------------------------------------
 *
 * Vinyl:
 * https://www.discogs.com/STL-Night-Grooves/release/1121308
 * https://www.discogs.com/Jerry-Goldsmith-Gremlins-Original-Motion-Picture-Soundtrack/release/9436212
 *
 * Cassette:
 * https://www.discogs.com/Casino-Vs-Japan-Frozen-Geometry/release/9108134
 *
 * Lots of tracks:
 * https://www.discogs.com/Farmers-Manual-Fsck/release/106658
 *
 * Multi-formats:
 * https://www.discogs.com/Muse-The-Resistance/release/4318500
 * https://www.discogs.com/Bunbury-Archivos-Vol-2-Duetos/release/9495721
 *
 * Bad example:
 * https://www.discogs.com/Various-The-Rise-And-Fall-Of-Paramount-Records-1928-1932-Volume-2/release/6265588
 *
 * TODO:
 * fix: https://www.discogs.com/The-Orb-Moonbuilding-2703-AD/release/7144376
 * fix: https://www.discogs.com/Sly-Robbie-Nils-Petter-Molv%C3%A6r-Eivind-Aarset-Vladislav-Delay-NORDUB/release/11868038
 *
 */

 rl.ready(() => {

  if ( rl.pageIs('release') && rl.pageIsNot('history', 'sellRelease') && rl.pageIsReact() ) {

    let
        { readability } = rl.getPreference('featureData'),
        readabilityDividers = rl.getPreference('readabilityDividers'),
        show = readabilityDividers !== undefined ? readabilityDividers : setReadabilityTrue(),

        debug = rl.options.debug(),

        // don't insert spacers if headings or index tracks already exist.
        // And don't confuse release durations with track headers
        durations = document.querySelector('.de-durations'),
        noHeadings = durations ? document.querySelectorAll('tr[class*="heading_"]').length <= 1 : document.querySelectorAll('tr[class*="heading_"]').length < 1,
        hasIndexTracks = document.querySelectorAll('tr[class*="index_"]').length > 0,

        // Compilations have different markup requirements when rendering track headings...
        // isCompilation = document.querySelectorAll('.tracklist_track_artists').length > 0,
        isCompilation = false,

        // ...so only insert the duration markup if it's a compilation
        duration = isCompilation ? '<td width="25" class="tracklist_track_duration"><span></span></td>' : '',

        // array of all tracks on a release
        tracklist = [...document.querySelectorAll('#release-tracklist tbody tr')],

        // size of dividers inserted between tracks
        size = readability.size ? `line-height:${readability.size}rem;` : 'line-height:0.5rem',

        prefix = [],
        sequence = [],
        isSequential = false,

        // divider markup to be injected
        display = show ? '' : 'hide',
        spacer = `<tr class="tracklist_track track_heading de-spacer ${display}" style="${size}">
                    <td class="tracklist_track_pos"></td>
                    <td colspan="3" class="tracklist_track_title">&nbsp;</td>
                    ${duration}
                  </tr>`;

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Appends the show/hide dividers trigger
     * @return {undefined}
     */
    function appendUI() {

      // add the show/hide trigger if it does not exist
      if ( !document.querySelectorAll('.de-spacer-trigger').length ) {

        // title of show/hide dividers link
        let text = show ? 'Hide' : 'Show',
            styles = 'style="font-size: 12px; width: 115px; text-align: right; cursor: pointer; border: none; background: none;"',
            trigger = `<button class="de-spacer-trigger" ${styles}>${text} Dividers</button>`;

        document.querySelector('#release-tracklist header[class*="header_"]').insertAdjacentHTML('beforeend',trigger);
      }

      // Trigger functionality
      document.querySelector('.de-spacer-trigger').addEventListener('click', event => {

        if ( dividersAreHidden() ) {

          event.target.textContent = 'Hide Dividers';
        } else {
          event.target.textContent = 'Show Dividers';
        }

        [...document.querySelectorAll('.de-spacer')].forEach(elem => {
          elem.classList.contains('hide')
            ? elem.classList.remove('hide')
            : elem.classList.add('hide');
        });

        show = !show;
        rl.setPreference('readabilityDividers', show);
      });
    }

    /**
     * If the insertions don't go as expected this will
     * delete the show/hide trigger from the DOM.
     * @returns {undefined}
     */
    function checkForSpacerErrors() {

      if ( !document.querySelectorAll('.de-spacer').length
           && document.querySelector('.de-spacer-trigger') ) {
        document.querySelector('.de-spacer-trigger').remove();
      }
    }

    /**
     * Checks to see if dividers have a `hide` class on them
     * @returns {boolean}
     */
    function dividersAreHidden() {

      let spacers = document.querySelectorAll('.de-spacer');
      return [...spacers].some(e => e.classList.contains('hide'));
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
     * @method handleMultiFormatRelease
     * @param  {array} tPos [an array of all track positions in a release]
     * @return {undefined}
     */

    function handleMultiFormatRelease(tPos) {

      let counter = 1,
          infLoop = 0,
          suffix = [];

      try {

       for ( let i = 0; i < tPos.length; i++ ) {

          if ( !tPos[i][tPos[i].length - 2] ) {

            break;
          }

          // Get the last two numerical digits from each track position
          let lastTwo = ( tPos[i][tPos[i].length - 2] + tPos[i][tPos[i].length - 1] ).match(/\d/g);

          if ( lastTwo ) {

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
          if ( suffix[i] == counter ) {

            counter++;

          } else if ( suffix[i] && suffix[i] != counter ) {

            tracklist[i - 1].insertAdjacentHTML('afterend', spacer);
            // reset counter and `i` to continue comparison
            counter = 1;
            i--;
            infLoop++;

            if ( infLoop > 500 ) {
              // Need to check to see if we're caught in an infinite loop
              // because of this release: https://www.discogs.com/Various-Blech/release/30565
              // the `218.5` track breaks this feature and causes the browser to hang.
              // I'm not sure exactly how to remedy this so, for now, I'm checking for an
              // infinite loop using a simple counter and then breaking the loop if it
              // exceeds 500. Then remove all the spacers that were inserted because
              // there's a ton of them at that point.
              [...document.getElementsByClassName('de-spacer')].forEach(spcr => spcr.remove());
              checkForSpacerErrors();
              break;
            }
          }
        }
      } catch (err) {

        if (debug) console.log('Could not handleMultiFormatRelease', err);

        checkForSpacerErrors();
      }
      checkForSpacerErrors();
    }

    /**
     * Examines an array and determines if it has
     * a continual number sequence like: 1, 2, 3, 4, 5, 6, 7, 8, etc...
     *
     * It's designed to suit tracklists that have positions like:
     * A1, A2, B3, B4, B5, C6, C7, C8 ...
     *
     * @method hasContinualNumberSequence
     * @param  {array} tPos [an array of all track positions in a release]
     * @return {Boolean}
     */

    function hasContinualNumberSequence(tPos) {

      let count = 0;

      tPos.forEach((num, i) => {

        if ( num === i + 1 ) { count++; }
      });

      return count === tPos.length ? true : false;
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
     * @param  {array} tPos [an array of all track positions in a release]
     * @return {undefined}
     */

    function insertSpacersBasedOnAlphaDifferences(tPos) {

      try {

        tPos.forEach((letter, i) => {

          let current = tPos[i],
              next = tPos[i + 1];

          if ( next && current !== next ) {

            tracklist[i].insertAdjacentHTML('afterend', spacer);
          }
        });
      } catch (err) {

        if (debug) console.log('Could not insertSpacersBasedOnAlphaDifferences', err);
        checkForSpacerErrors();
      }
    }

    /**
     * Inserts a spacer if the next track's number is less than the
     * current tracks number (eg: A2, B1 ...) or the current track
     * has no number and the next one does (eg: A, B1, ...)
     *
     * @method   insertSpacersBasedOnSides
     * @param    {array} tPos [an array of all track positions in a release]
     * @return   {undefined}
     */

    function insertSpacersBasedOnSides(tPos) {

      try {

        tPos.forEach((t,i) => {

          let current = Number( tPos[i].match(/\d+/g) ),
              next = Number( tPos[i + 1].match(/\d+/g) );

          // check for 0 value which can be returned when a
          // track is simply listed as A, B, C, etc ...
          if ( next <= current && current !== 0 || !current && next ) {

            if ( i !== tracklist.length - 1 ) {

              tracklist[i].insertAdjacentHTML('afterend', spacer);
            }
          }
        });
      } catch (err) {

        if (debug) console.log('Could not insertSpacersBasedOnSides', err);
        checkForSpacerErrors();
      }
    }

    /**
     * Inserts a spacer after every nth track
     * Used for releases that are CDs, files, VHS, DVD, etc...
     *
     * @method   insertSpacersEveryNth
     * @param    {array}  tPos [an array of all track positions in a release]
     * @param    {number} nth [the number of tracks before a spacer is inserted]
     * @return   {undefined}
     */

    function insertSpacersEveryNth(tPos, nth) {

      tPos.forEach((t,i) => {

        if ( i % nth === 0 && i !== 0 ) {

          tracklist[i - 1].insertAdjacentHTML('afterend', spacer);
        }
      });
    }

    /**
     * Sets default value for readabilityDividers
     *
     * @method setReadabilityTrue
     * @return {object}
     */

    function setReadabilityTrue() {

      if ( rl.getPreference('readabilityDividers') === undefined ) {

        rl.setPreference('readabilityDividers', true);
      }

      return rl.getPreference('readabilityDividers');
    }

    // ========================================================
    // Init / DOM Setup
    // ========================================================
    rl.waitForElement('tr span[class*="trackTitle_"]').then(() => {


    if ( noHeadings && !hasIndexTracks ) {

      let prefixes = false,
          trackpos = [...document.querySelectorAll('td[class*="trackPos_"]')].map(t => t.textContent );

      // Determine any common prefixes in the track positions
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

      // No specialized prefixes (eg: CD-, BD-, VHS, DVD ...)
      // ---------------------------------------------------------------------------

      if ( !prefixes ) {

        // Populate our arrays with whatever the prefix is and the remaining numbers
        trackpos.forEach(tpos => {

          // Make sure to match a real value, not null
          if ( tpos.match(/\D/g) ) {

            prefix.push(String(tpos.match(/\D/g)));
          }

          sequence.push(Number(tpos.match(/\d+/g)));
        });

        // If there are both numbers and letters in the track positions
        // ---------------------------------------------------------------------------

        isSequential = hasContinualNumberSequence(sequence);

        if ( isSequential && prefix.length ) {

          // if the numbering is sequential (eg: A1, A2, B3, B4, C5, C6, C7 ...),
          // use the alpha-prefixes to determine where to insert the spacer markup
          if ( readability &&
               readability.vcReadability &&
               tracklist.length > readability.vcThreshold ) {

            appendUI();
            insertSpacersBasedOnAlphaDifferences(prefix);

            if (debug) {

              console.log('');
              console.log('Tracklist Readability:');
              console.log('insert Spacers Based On Alpha Differences');
            }
          }

        // There is a number sequence but no prefix (eg: CDs, mp3s, etc)
        // ---------------------------------------------------------------------------

        } else if ( isSequential && !prefix.length ) {

          if ( readability &&
               readability.otherMediaReadability &&
               tracklist.length > readability.otherMediaThreshold ) {

            if (debug) {

              console.log('');
              console.log('Tracklist Readability:');
              console.log('insert Spacers Every Nth');
            }

            appendUI();
            return insertSpacersEveryNth(tracklist, readability.nth);
          }

        } else {

          // Track numbering is not sequential (eg: A1, A2, B, C1, C2)
          // ---------------------------------------------------------------------------

          if ( readability &&
               readability.vcReadability &&
               tracklist.length > readability.vcThreshold &&
               !hasIndexTracks ) {

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

        // Has Prefixes AKA Multi-Format releases (eg: CD + DVD, etc ...)
        // ---------------------------------------------------------------------------

        if ( readability &&
             readability.vcReadability &&
             tracklist.length > readability.vcReadability ) {

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
    // ---------------------------------------------------------------------------

    if ( readability &&
         noHeadings &&
         readability.indexTracks &&
         hasIndexTracks ) {

      appendUI();

      if (debug) {

        console.log('');
        console.log('Tracklist Readability:');
        console.log('handle index tracks');
      }

      tracklist.forEach((trk, i) => {

        if ( trk.classList.contains('index_track') && i !== 0 ) {

          trk.insertAdjacentHTML('beforebegin', spacer);
        }
      });
    }
  });
  }
});
