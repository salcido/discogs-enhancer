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

  let host = document.querySelector('[id^=__header_root_]');

  if ( host && host.shadowRoot ) {
    rl.waitForElement('[class*="_listbox_"]', host.shadowRoot).then(() => {
      setTimeout(() => {
        // Modify link
        let shadowRoot = host.shadowRoot.querySelector('header[class^="_header_"]');
        shadowRoot.querySelector('a[class*="_home"]').href = '/my';
        shadowRoot.querySelector('a[class*="_home"]').title = 'Go to Dashboard';
        // Hide Dashboard Icon
        let dashboardIcons = shadowRoot.querySelectorAll('nav[class*="_user_"] a[href="/my"]');
        dashboardIcons.forEach(icon => { icon.style.display = 'none'; });
      }, 100);
    });
  }
});
