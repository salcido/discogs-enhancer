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

    rl.waitForElement('div[class*="wrapper_"] div[class*="buttons_"]').then(() => {

      let collectionButtons = document.querySelector('div[class*="wrapper_"] div[class*="buttons_"]');

        let cBox = collectionButtons.closest('div[class*="side_"'),
            info = document.getElementById('release-actions').closest('div[class*="side_"');

        cBox.querySelector('br').remove();

        info.insertAdjacentElement('afterend', cBox);
    });
  }
});


document.querySelectorAll('div[class*="wrapper_"] div[class*="buttons_"]');
