/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  if ($('table.playlist').length) {

    var
        arr = [],
        hours,
        html,
        minutes,
        result = '',
        resultMinutes,
        seconds,
        totalSeconds,
        tracksInSeconds;

    // Assemble our array of track times to be totaled
    $('td.tracklist_track_duration span').each(function() {

      let
          metaTimeInfo = /[^\w:]/g,
          trackTime = $(this).text();

      if ($(this).text() === '') {

        return arr.push('0');

      } else {

        // Only push legit trackTime values into array - aka: 05:23 but not (05:23), etc...
        // See this release for an example of why this is needed:
        // https://www.discogs.com/The-Orb-The-Orbs-Adventures-Beyond-The-Ultraworld/release/8385901
        return !metaTimeInfo.test(trackTime) ? arr.push(trackTime) : arr.push('0');
      }
    });


    function convertToSeconds(str) {

      var p = str.split(':'),
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
