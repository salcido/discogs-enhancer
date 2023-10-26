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
});
