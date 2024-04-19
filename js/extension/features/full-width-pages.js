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
  if ( rl.pageIs('collection', 'wantlist', 'order', 'orders', 'inventory', 'purchases') ) {
    document.querySelector('body').classList.add('no_width_limit');
  }

  if ( rl.pageIs('collection') ) {

    let styleSheet = document.createElement('style'),
        css = `
          #app #page [class*="content_"] {
            max-width: 100% !important;
          }

          #app #page [class*="collectionContainer_"] [class*="dataGridContainer_"] {
            max-width: 100% !important;
          }
        `;

    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
  }
});
