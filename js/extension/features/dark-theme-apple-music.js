/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */
(() => {
  rl.ready(() => {
    rl.waitForElement('#audio-iframe').then(() => {
      let ogSrc = document.querySelector('#audio-iframe').src;
      document.querySelector('#audio-iframe').src = ogSrc + 'theme=dark';
    });
  });
})();
