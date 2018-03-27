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

resourceLibrary.ready(() => {

  let hasPlaylist = document.querySelector('table.playlist'),
      releaseHistoryPage = document.location.href.includes('/history');

  if ( hasPlaylist && !releaseHistoryPage ) {

    let
        arr = [],
        emptyIndexTracks = false,
        hours,
        html,
        minutes,
        result = '',
        resultMinutes,
        seconds,
        totalSeconds;

    // ========================================================
    // Functions
    // ========================================================

    /**
     * Converts hh:mm:ss to seconds
     *
     * @method convertToSeconds
     * @param  {String} str
     * @return {Number}
     */

    function convertToSeconds(str) {

      let p = str.split(':'),
          sec = 0,
          min = 1;

      while ( p.length > 0 ) {

        sec += min * Number(p.pop());

        min *= 60;
      }

      return sec;
    }


    /**
     * Grabs tracktimes from a target and inserts them into an array
     *
     * @method gatherTrackTimes
     * @param  {array} target
     * @return {method}
     */

    function gatherTrackTimes(target) {

      [...target].forEach(time => {

        let trackTime = time.textContent;

        return trackTime === '' ? arr.push('0') : arr.push(trackTime);
      });
    }


    // ========================================================
    // DOM Setup
    // ========================================================

    // Grab all track times from any Index Tracks in the tracklisting
    // and add them to the array.
    [...document.querySelectorAll('tr.index_track td.tracklist_track_duration span')].forEach(time => {

      let trackTime = time.textContent,
          subtracks = [...document.querySelectorAll('.tracklist_track.subtrack .tracklist_track_duration span')].textContent;

      // If there are Index Tracks present but they are empty AND
      // they have subtracks WITH data, set `emptyIndexTracks` to true
      // and use the subtrack data to calculate the total playing time.
      if ( trackTime === '' && subtracks !== '' ) {

        return emptyIndexTracks = true;

      // If there are Index Tracks and subtracks present but they are
      // both empty, don't count them in the total.
      } else if ( trackTime === '' && subtracks === '' ) {

        return arr.push('0');

      } else {

        // Strip any times wrapped in parenthesis and add their numbers
        // to the array
        trackTime = trackTime.replace('(', '').replace(')', '');

        return arr.push(trackTime);
      }
    });

    // Grab the track times from the subtrack entries.
    if ( emptyIndexTracks ) {

      gatherTrackTimes( document.querySelectorAll('.tracklist_track.subtrack .tracklist_track_duration span') );
    }

    // Grab all track times from any td that is not a child of .subtrack
    // and add them to the array.
    gatherTrackTimes( document.querySelectorAll('tr.tracklist_track.track td.tracklist_track_duration span') );

    // Calculate total seconds
    totalSeconds = arr.map(convertToSeconds).reduce((acc, next) => acc + next);

    // calculate hours...
    hours = parseInt(totalSeconds / 3600, 10) % 24;

    // ...mins...
    minutes = parseInt(totalSeconds / 60, 10) % 60;

    // ...and seconds
    seconds = totalSeconds % 60;

    // Assemble the result
    if ( hours ) { result = hours + ':'; }

    if ( minutes !== null ) { // 0 you falsy bastard!

      if ( hours ) {

        resultMinutes = (minutes < 10 ? '0' + minutes : minutes);

        result += resultMinutes + ':';

      } else {

        result += minutes + ':';
      }
    }

    result += ( seconds < 10 ? '0' + seconds : seconds );

    // Don't insert any markup if necessary
    if ( result === '0:00' || result === 'NaN:NaN' ) {

      return;

    } else {

      html = `<div class="section_content de-durations">
                <table>
                  <tbody>
                    <tr class="tracklist_track track_heading">
                      <td class="tracklist_track_pos">
                        <span style="padding-left:5px; font-weight:bold;">Total Time:</span>
                      </td>
                      <td class="track tracklist_track_title"></td>
                      <td width="25" class="tracklist_track_duration">
                        <span style="font-weight:bold;"> ${result} </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>`;

      document.querySelector('#tracklist .section_content').insertAdjacentHTML('beforeend', html);
    }
  }
});
