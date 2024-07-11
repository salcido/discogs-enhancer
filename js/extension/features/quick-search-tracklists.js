/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * --------------------------------------------------------
 * Lets you search for the track on Google in a new tab
 * by clicking the release tracklist.
 * --------------------------------------------------------
 */
 rl.ready(() => {

  let variousArtists = document.querySelectorAll('td[class*=artist_] span'),
      subtracks = document.querySelectorAll('[class*="subtrack_"]');

  // Wrap track titles in spans when subtracks are present so that click events are fired correctly
  if (subtracks) {
    rl.waitForElement('[class*="trackTitle_"]').then(() => {
      document.querySelectorAll('[class*="subtrack_"] td[class*="trackTitle_"]').forEach((elem) => {
        let text = elem.firstChild.textContent;
        elem.firstChild.textContent = '';
        elem.insertAdjacentHTML('afterbegin', `<span class="trackTitle_">${text}</span>`);
      });
    });
  }

  // VARIOUS ARTISTS PAGES
  if (variousArtists.length) {
    // RELEASE PAGES WITH ARTISTS
    document.body.addEventListener('click', (event) => {
      if ( event?.target?.classList.length
           && event?.target?.classList[0]?.includes('trackTitle_')) {

             let artist = event.target.parentElement.previousElementSibling,
                 artistText = artist?.textContent?.replace('–', '').replaceAll('*', ''),
                 trackTitle = event.target.textContent;
        // Only fire if track title span is clicked on
        if ( artistText && event.target.tagName === 'SPAN' ) {

          let searchString = encodeURIComponent(`${artistText} - ${trackTitle}`);

          window.open('https://www.google.com/search?udm=14&q=' + searchString);
        }
      }

      // MASTER RELEASE PAGES
      if ( event?.target?.classList.length
           && event?.target?.classList[0]?.includes('trackTitleWithArtist_')
           || event?.target.tagName === 'SPAN'
              && event?.target?.parentElement?.classList[0]?.includes('trackTitleWithArtist_')) {

            let artist = event.target.parentElement.previousElementSibling,
                artistText = artist?.textContent?.replace('–', '').replaceAll('*', ''),
                trackTitle = event.target.textContent;
        // Only fire if track title span is clicked on
        if ( artistText && event?.target.tagName === 'SPAN' ) {

          let searchString = encodeURIComponent(`${artistText} - ${trackTitle}`);

          window.open('https://www.google.com/search?udm=14&q=' + searchString);
        }
      }

    });
  // ARTISTS PAGES
  } else {
    // Tracklists without Artists
    document.body.addEventListener('click', (event) => {
      // Only fire if track title span is clicked on
      if ( event?.target?.classList.length
           && event?.target?.classList[0]?.includes('trackTitle_')
           && event.target.tagName === 'SPAN') {
             // Get artist name from document title to avoid including descriminators
             let artist = document.title.split(' –')[0],
                 searchString = encodeURIComponent(`${artist} - ${event.target.textContent}`);

             window.open('https://www.google.com/search?udm=14&q=' + searchString);
      }
      // MASTER RELEASE PAGES
      if ( event?.target.tagName === 'SPAN'
           && event?.target?.parentElement?.classList[0]?.includes('trackTitleNoArtist_')) {
             // Get artist name from document title to avoid including descriminators
             let artist = document.title.split(' -')[0],
                 searchString = encodeURIComponent(`${artist} - ${event.target.textContent}`);

             window.open('https://www.google.com/search?udm=14&q=' + searchString);
      }
    });
  }

  let rules = /*css*/`
    span[class*="trackTitle_"]:hover,
    td[class*="trackTitleWithArtist_"]:hover,
    td[class*="trackTitleNoArtist_"] span:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  `;

  rl.attachCss('quick-search-tracks', rules);
 });
