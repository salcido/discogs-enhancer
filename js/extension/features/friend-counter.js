/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview ㊙
 * ---------------------------------------------------------------------------
 *
 * This will count the number of friends you have in your friend list.
 * It is always enabled when using this extension and it's not listed as a
 * feature. I personally find it useful but I'm not sure it has much value
 * for anyone else so it's a secret to everybody!
 */

(function() {

  let appended = false,
      friendPage = window.location.href.includes('/users/friends');

  // ========================================================
  // Setup
  // ========================================================

  let int = setInterval(() => {

    switch ( document.readyState ) {

      case 'interactive':
      case 'complete':

        clearInterval(int);
        init();
    }
  }, 13);

  /**
   * Initializes the feature and sets `appended` to true
   * so it's only executed once.
   * @method init
   * @return {boolean}
   */

  function init() {

    let count = document.querySelectorAll('.linked_username').length;

    if ( friendPage && !appended && count ) {

      document.querySelector('#page_content h1').textContent += ` (${count})`;

      return appended = true;
    }
  }
}());
