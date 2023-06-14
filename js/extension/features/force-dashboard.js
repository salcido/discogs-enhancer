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
  rl.waitForElement('div[id*="__header"] a[class*="_home"]').then(() => {
    document.querySelector('a[class*="_home"]').href = '/my';
    document.querySelector('a[class*="_home"]').title = 'Go to Dashboard';
    // Hide Dashboard Icon
    let dashboardIcons = document.querySelectorAll('nav[class*="_user_"] a[href="/my"]');

    dashboardIcons.forEach(icon => { icon.style.display = 'none'; });

    /**
     * Currently the new header can crash when the markup is modified.
     * I haven't figured out what's causing it yet so this is a quick fix
     * to inject the correct logo path if the crash happens.
     */
    setTimeout(() => {
      let logo = document.querySelector('img[class*="_logo"]'),
          src = logo.src;

      if (!src.includes('.svg')) {
        logo.src = 'https://www.discogs.com/service/header/public/assets/assets/logo.83221bf3.svg';
      }
    }, 1000);
  });
});
