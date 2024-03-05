/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */
rl.ready(() => {

  if ( rl.pageIs('release') ) {

    let collectionAndWantlistButtons = 'div[class*="wrapper_"] div[class*="buttons_"]';

    rl.waitForElement(collectionAndWantlistButtons).then(() => {

      /* Quick and dirty fix to prevent this from running before the sidebar is ready */
      setTimeout(() => {
        let collectionButtons = document.querySelector(collectionAndWantlistButtons);

        let cBox = collectionButtons.closest('div[class*="side_"'),
            info = document.getElementById('release-actions').closest('div[class*="side_"');

        cBox.querySelector('br').remove();

        info.insertAdjacentElement('afterend', cBox);
      }, 100);
    });
  }
});
