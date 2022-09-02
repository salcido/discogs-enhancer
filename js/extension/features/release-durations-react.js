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
 * This will calculate the total time for a release if track durations are
 * present.
 *
 * The script is initiated when a table with `.playlist` exists in the DOM
 * except when viewing a release's edit history page because:
 * https://www.discogs.com/forum/thread/731619
 *
 */

 rl.ready(() => {

  if ( rl.pageIsReact() ) {

    let selector = 'table[class*="tracklist_"] tr';

    rl.waitForElement(selector).then(() => {
      let hasPlaylist = document.querySelector(selector);

      if ( hasPlaylist && rl.pageIsNot('history') ) {

        let
            arr = [],
            days,
            hours,
            html,
            minutes,
            result = '',
            seconds,
            totalSeconds;

        // ========================================================
        // Functions
        // ========================================================

        /**
         * Extracts track durations from the source DOM node array
         * and returns all duration elements in an array.
         *
         * @param {Array} source - DOM node array
         */

        function collectTrackTimes(source) {

          let a = []

          source.forEach(time => {

            let duration = time.querySelector('td[class*="duration_"]')?.textContent;

            if (duration && duration !== '') {

              a.push(time.querySelector('td[class*="duration_"]'))
            }
          })

          return a;
        }

        /**
         * Converts hh:mm:ss to seconds
         *
         * @method convertToSeconds
         * @param  {String} str
         * @return {Number}
         */

        function convertToSeconds(str) {

          str = str?.replace('(', '').replace(')', '');

          let p = str?.split(':'),
              sec = 0,
              min = 1;

          while ( p?.length > 0 ) {

            sec += min * Number(p.pop());

            min *= 60;
          }

          return sec;
        }


        /**
         * Grabs tracktimes from a target and inserts them into an array
         *
         * @method extractDurations
         * @param  {array} target
         * @return {method}
         */

        function extractDurations(target) {

          target.forEach(time => {

            let trackTime = time?.textContent;

            return trackTime === '' ? arr.push('0') : arr.push(trackTime);
          });
        }

        // ========================================================
        // DOM Setup
        // ========================================================

        // Grab all track times
        let tracks = document.querySelectorAll('[data-track-position]'),
            indexTracks = document.querySelectorAll('table[class*="tracklist_"] tr[class*="index_"]'),
            subTracks = document.querySelectorAll('table[class*="tracklist_"] tr[class*="subtrack_"]'),
            headingTracks = document.querySelectorAll('table[class*="tracklist_"] tr[class*="heading_"]'),
            indexTrackTimes = collectTrackTimes(indexTracks),
            subTrackTimes = collectTrackTimes(subTracks),
            headingTrackTimes = collectTrackTimes(headingTracks),
            trackTimes = collectTrackTimes(tracks);

        // https://www.discogs.com/release/1622285-Myron-Cohen-Everybody-Gotta-Be-Someplace

        // TODO: track headings
        // https://www.discogs.com/release/986404-The-5th-Dimension-Portrait
        // https://www.discogs.com/release/305806-Dots-10th-Anniversary-Box-II-Dots-Plus-Unreleased-Material
        // https://www.discogs.com/release/1688717-DJ-Dan-Housing-Project
        // https://www.discogs.com/release/9459-Jeff-Mills-Live-At-The-Liquid-Room-Tokyo
        // https://www.discogs.com/release/5500798-The-Ramsey-Lewis-Trio-Hang-On-Ramsey

        if (indexTrackTimes.length) {
          extractDurations([...indexTrackTimes, ...trackTimes]);
        }

        if (subTrackTimes.length && !indexTrackTimes.length) {
          extractDurations([...subTrackTimes, ...trackTimes]);
        }

        if (!indexTrackTimes.length && !subTrackTimes.length && trackTimes.length) {
          extractDurations([...trackTimes]);
        }

        if (!indexTrackTimes.length && !subTrackTimes.length && !trackTimes.length) {
          extractDurations(headingTrackTimes);
        }

        if (!arr.length) return;
        // Calculate total seconds
        totalSeconds = arr.map(convertToSeconds).reduce((acc, next) => acc + next);

        // calculate days (wtf)...
        days = parseInt(totalSeconds / (3600 * 24), 10);

        // calculate hours...
        hours = parseInt(totalSeconds / 3600, 10) % 24;

        // ...mins...
        minutes = parseInt(totalSeconds / 60, 10) % 60;

        // ...and seconds
        seconds = totalSeconds % 60;

        // Assemble the result
        if ( days && hours !== null ) {

          result += String(days * 24 + hours) + ':';

        } else if ( hours ) {

          result += hours + ':';
        }

        if ( minutes !== null ) {

          if ( hours || days ) {

            result += String(minutes).padStart(2, '0') + ':';

          } else {

            result += minutes + ':';
          }
        }

        result += String(seconds).padStart(2, '0');

        // Don't insert any markup if necessary
        if ( result === '0:00' || result === 'NaN:NaN' ) {

          return;

        } else {

          let inlineStyles = 'style="padding-right:.5rem;"';

          html = `<div class="section_content de-durations index_3D8To" style="margin-top: .3rem;">
                    <table>
                      <tbody>
                        <tr class="tracklist_track track_heading">
                          <td class="tracklist_track_pos">
                            <span style="padding-left:5px; font-weight:bold;">Total Time:</span>
                          </td>
                          <td class="track tracklist_track_title"></td>
                          <td width="25" class="tracklist_track_duration" ${inlineStyles}>
                            <span style="font-weight:bold;"> ${result} </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>`;

          document.querySelector('#release-tracklist div[class*="content_"]').insertAdjacentHTML('beforeend', html);
        }
      }
    });
  }
});
/**
// ========================================================
I'm marvelous like Marvin Haggler in his prime
I carve kids like a dagger with my mind
I start shit with rappers who can't rhyme
I spark spliffs cuz I don't stagger when I'm high
But when I'm drunk I do, punk I do not acknowledge wackness
I gotcha grandma doin' backflips and tumbles
https://www.discogs.com/Blackalicious-Melodica/master/32289
// ========================================================
 */
