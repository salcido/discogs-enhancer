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

  if ( document.querySelector('#header_logo') ) {
    // normal release page
    document.querySelector('#header_logo').href = '/my';
    // Hide Dashboard Icon
    let dashboardIcons = document.querySelectorAll('.icon-dashboard');
    dashboardIcons.forEach(icon => {
      icon.closest('li').style.display = 'none';
    });

  } else if ( document.querySelector('header[class*="_header_"]') ) {
      document.querySelector('a[class*="_home_"]').href = '/my';
      // Hide Dashboard Icon
      let dashboardIcons = document.querySelectorAll('nav[class*="_user_"] a[href="/my"]');
      dashboardIcons.forEach(icon => {
        icon.style.display = 'none';
      });
  } else {
      // React release page
      let selector = 'a[class*="logo_"]';

      rl.waitForElement(selector).then(() => {
        document.querySelector(selector).href = '/my';
        // Hide Dashboard Icon
        let dashboardIcon = document.querySelector('nav[class*="profile_"] a[href^="/my"]');
        dashboardIcon.style.display = 'none';
      });
    }
});
