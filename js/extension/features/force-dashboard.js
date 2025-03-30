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

  let host = document.querySelector('[id^=__header_root_]'),
      shadowRoot = host && host.shadowRoot
                            ? host.shadowRoot.querySelector('div[class^="_amped_"] header')
                            : '',
      headerSelector = shadowRoot
                        ? host.shadowRoot.querySelector('header[class*="_header_"]')
                        : document.querySelector('header[class*="_header_"]'),
      _header = shadowRoot ? shadowRoot : document;

  if ( document.querySelector('#header_logo') ) {
    // normal release page
    document.querySelector('#header_logo').href = '/my';
    document.querySelector('#header_logo').title = 'Go to Dashboard';
    // Hide Dashboard Icon
    let dashboardIcons = document.querySelectorAll('.icon-dashboard');
    dashboardIcons.forEach(icon => {
      icon.closest('li').style.display = 'none';
    });

  } else if ( headerSelector ) {
    // Non-shadow root header
    if ( document.querySelector('header[class*="_header_"]') ) {
      rl.waitForElement('div[id*="__header"] a[class*="_home"]').then(() => {
          document.querySelector('a[class*="_home"]').href = '/my';
          document.querySelector('a[class*="_home"]').title = 'Go to Dashboard';
          // Hide Dashboard Icon
          let dashboardIcons = document.querySelectorAll('nav[class*="_user_"] a[href="/my"]');

          dashboardIcons.forEach(icon => { icon.style.display = 'none'; });
        });
    } else {
      // New shadow root header
      _header.querySelector('a[class*="_home"]').href = '/my';
      _header.querySelector('a[class*="_home"]').title = 'Go to Dashboard';
      // Hide Dashboard Icon
      let dashboardIcons = _header.querySelectorAll('nav[class*="_user_"] a[href="/my"]');

      dashboardIcons.forEach(icon => { icon.style.display = 'none'; });
    }
  } else {
      // React release page
      let selector = 'a[class*="logo_"]';

      rl.waitForElement(selector).then(() => {
        document.querySelector(selector).href = '/my';
        document.querySelector(selector).title = 'Go to Dashboard';
        // Hide Dashboard Icon
        let dashboardIcon = document.querySelector('nav[class*="profile_"] a[href^="/my"]');

        dashboardIcon.style.display = 'none';
      });
    }
});
