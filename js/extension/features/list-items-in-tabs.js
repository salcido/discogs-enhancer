/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * --------------------------------------------------------
 * Opens list items in new tabs
 * --------------------------------------------------------
 */
rl.ready(() => {
  if ( rl.pageIs('lists') ) {
    let items = document.querySelectorAll('#listitems .listitem_title.hide_mobile a');
    items.forEach(i => {
      i.target = '_blank';
      i.classList = 'de-list-new-tabs';
    });
  }
});
