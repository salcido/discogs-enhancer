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

    rl.waitForElement('div[class*="collection_"]').then(() => {

      let inCollection = document.querySelector('div[class*="collection_"]');

      if ( inCollection ) {

        let cBox = inCollection.closest('div[class*="side_"'),
            info = document.getElementById('release-actions').closest('div[class*="side_"');

        cBox.querySelector('br').remove();

        info.insertAdjacentElement('afterend', cBox);
      }
    });
  }
});
