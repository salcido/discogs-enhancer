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

    let host = document.querySelector('[id^=__header_root_]');

    if (event.matches) {
      document.documentElement.classList.add('de-dark-theme');
      if (host && host.shadowRoot) {
        host.shadowRoot.querySelector('div').classList.add('de-dark-theme');
      }

    } else {
      document.documentElement.classList.remove('de-dark-theme');
      if (host && host.shadowRoot) {
        host.shadowRoot.querySelector('div').classList.remove('de-dark-theme');
      }
    }
  });
})();
