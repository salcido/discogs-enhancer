/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  if ($('table.playlist').length) {

    let
        arr = [],
        emptyIndexTracks = false,
        hours,
        html,
        minutes,
        result = '',
        resultMinutes,
        seconds,
        totalSeconds,
        tracksInSeconds;

    // Grab all track times from any Index Tracks in the tracklisting
    // and add them to the array.
    $('tr.index_track td.tracklist_track_duration span').each(function() {

      let trackTime = $(this).text(),
          subtracks = $('.tracklist_track.subtrack .tracklist_track_duration span').text();

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
    if (emptyIndexTracks) {

      $('.tracklist_track.subtrack .tracklist_track_duration span').each(function() {

        let trackTime = $(this).text();

        if ( trackTime === '' ) {

          return arr.push('0');

        } else {

          return arr.push(trackTime);
        }
      });
    }

    // Grab all track times from any td that is not a child of .subtrack
    // and add them to the array.
    $('tr.tracklist_track.track td.tracklist_track_duration span').each(function() {

      let trackTime = $(this).text();

      if ( trackTime === '' ) {

        return arr.push('0');

      } else {

        return arr.push(trackTime);
      }
    });

    function convertToSeconds(str) {

      let p = str.split(':'),
          sec = 0,
          min = 1;

      while (p.length > 0) {

        sec += min * parseInt(p.pop(), 10);

        min *= 60;
      }

      return sec;
    }

    // Make a new array with our converted values
    tracksInSeconds = arr.map(convertToSeconds);

    // Draxx them sklounst
    totalSeconds = tracksInSeconds.reduce(function(curr, next) {

      return curr + next;
    });

    // calculate hours...
    hours = parseInt(totalSeconds / 3600, 10) % 24;

    // ...mins...
    minutes = parseInt(totalSeconds / 60, 10) % 60;

    // ...and seconds
    seconds = totalSeconds % 60;

    // Assemble the result
    if (hours) {

      result = hours + ':';
    }

    if (minutes !== null) { // 0 you falsy bastard!

      if (hours) {

        resultMinutes = (minutes < 10 ? '0' + minutes : minutes);

        result += resultMinutes + ':';

      } else {

        result += minutes + ':';
      }
    }

    result += (seconds < 10 ? '0' + seconds : seconds);

    if (result === '0:00' || result === 'NaN:NaN') {

      return;

    } else {

      html = '<div class="section_content">' +
               '<table>' +
                 '<tbody>' +
                   '<tr class="tracklist_track track_heading">' +
                     '<td class="tracklist_track_pos">' +
                        '<span style="padding-left:5px; font-weight:bold;">Total Time:</span>' +
                     '</td>' +
                     '<td class="track tracklist_track_title"></td>' +
                     '<td width="25" class="tracklist_track_duration">' +
                        '<span style="font-weight:bold;">' + result + '</span>' +
                     '</td>' +
                   '</tr>' +
                 '</tbody>' +
               '</table>' +
             '</div>';

      $(html).insertAfter($('#tracklist .section_content'));
    }
  }
});
