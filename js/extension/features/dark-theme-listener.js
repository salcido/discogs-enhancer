/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * An event listener for `prefers-color-scheme` change that
 * adds / removes .de-dark-theme accordingly.
 */
(() => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (event.matches) {
      document.documentElement.classList.add('de-dark-theme');
    } else {
      document.documentElement.classList.remove('de-dark-theme');
    }
  });

  rl.ready(() => {
    rl.waitForElement('#audio-iframe').then(() => {
      let ogSrc = document.querySelector('#audio-iframe').src;
      document.querySelector('#audio-iframe').src = ogSrc + 'theme=dark';
    });
  });
})();
