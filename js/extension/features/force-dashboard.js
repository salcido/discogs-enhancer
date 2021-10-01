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

  if (rl.pageIsReact()) {

    let selector = 'a[class*="logo_"]';

    rl.waitForElement(selector).then(() => {
      document.querySelector(selector).href = '/my';
      // let dashboardIcon = document.querySelector('div[class*="profile_"] a[href^="/my"]');
      // dashboardIcon.style.display = 'none';
    });
  } else {
    // normal release page
    document.querySelector('#header_logo').href = '/my';
    // let dashboardIcons = document.querySelectorAll('.icon-dashboard');
    // dashboardIcons.forEach(icon => {
    //   icon.closest('li').style.display = 'none';
    // });
  }
});
