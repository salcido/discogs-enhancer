/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * dark-theme.css will override all styles.
 * This will colorize the legend on the release history page.
 */

rl.ready(() => {
  // TODO: convert to mutation observer
  if ( rl.pageIs('history') ) {

    setTimeout(() => {

      try {

        document.querySelector('td[bgcolor="#ffaaaa"]').setAttribute('style', 'background: #ffaaaa !important; color: #000 !important');

        document.querySelector('td[bgcolor="#ffff77"]').setAttribute('style', 'background: #ffff77 !important; color: #000 !important');

        document.querySelector('td[bgcolor="#aaffaa"]').setAttribute('style', 'background: #aaffaa !important; color: #000 !important');

      } catch (err) { /* just catch the error */ }
    }, 200);
  }
});
