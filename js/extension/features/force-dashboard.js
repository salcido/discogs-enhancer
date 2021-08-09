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
  try {
    // normal release page
    document.querySelector('#header_logo').href = '/my';
  } catch (e) {
    // react release page
    let selector = 'a[class*="logo_"]';

    rl.waitForElement(selector).then(() => {
      document.querySelector(selector).href = '/my';
    });
  }
});
