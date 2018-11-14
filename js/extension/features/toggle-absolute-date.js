/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// Option title: Show Absolute Dates, Absolute Date Toggle,
// Note: August 20, 2009 12:00 AM earlist date
// @TODO: Learn page docs
// @TODO: fix when have multiple releases:
// https://www.discogs.com/Attaboy-Busted-Wagon/release/1627
resourceLibrary.ready(() => {

  if ( document.querySelector('.cw_block') ) {

    let absoluteDate = JSON.parse(localStorage.getItem('absoluteDate')) || false,
        usDateFormat = JSON.parse(localStorage.getItem('usDateFormat')) || false,
        copies = document.querySelectorAll('.cw_block_timestamp'),
        language = resourceLibrary.language(),
        monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // ========================================================
    // Functions
    // ========================================================

    /**
     * Sets a data attribute on each span that contains the
     * relative date the time was added to the collection/wantlist
     * @returns {Undefined}
     */
    function storeRelativeDates() {
      let dates = document.querySelectorAll('.cw_block_timestamp span');
      dates.forEach(date => date.dataset.approx = date.textContent);
    }

    /**
    * Returns the localized month
    * @param {Number} monthIndex - The index of the month from the `monthList` array
    * @returns {String} - The localized month string
    */
    function getMonth(monthIndex) {
      let objDate = new Date();
      objDate.setMonth(monthIndex);
      return objDate.toLocaleString(language, { month: 'long' });
    }

    /**
    * Renders the date format into the DOM
    * @returns {String}
    */
    function renderDate(elem) {

      let timestamp = elem.querySelector('span').title,
          approx = elem.querySelector('span').dataset.approx,
          data = timestamp.split('-'),
          monthIndex = monthList.indexOf(data[1]),
          international = `${data[0]} ${getMonth(monthIndex)} 20${data[2]}`,
          american = `${getMonth(monthIndex)} ${data[0]}, 20${data[2]}`,
          specific = usDateFormat ? american : international;

      return elem.querySelector('span').textContent = absoluteDate ? specific : approx;
    }

    /**
    * Whether the user want's to see the absolute date
    * @param {Boolean} pref - User's absolute date preference
    * @returns {Method}
    */
    function savePreference(pref) {
      return localStorage.setItem('absoluteDate', pref);
    }

    // ========================================================
    // CSS
    // ========================================================

    /**
    * Appends a style element to the DOM
    * @returns {Undefined}
    */
    function attachCss() {

      let css = document.createElement('style'),
          fragment = document.createDocumentFragment();

      css.id = 'date-toggle';
      css.rel = 'stylesheet';
      css.type = 'text/css';
      css.textContent = `
        .cw_block_timestamp span {
          cursor: pointer;
        }
        .cw_block_timestamp span:hover {
          text-decoration: underline;
        }`;

      fragment.appendChild(css);
      (document.head || document.documentElement).appendChild(fragment.cloneNode(true));
    }

    // ========================================================
    // DOM setup
    // ========================================================

    attachCss();
    storeRelativeDates();
    copies.forEach(copy => renderDate(copy));

    // Event listeners
    // ------------------------------------------------------
    copies.forEach(copy => {
      copy.addEventListener('click', () => {
        absoluteDate = !absoluteDate;
        copies.forEach(copy => renderDate(copy));
        savePreference(absoluteDate);
      });
    });
  }
});

