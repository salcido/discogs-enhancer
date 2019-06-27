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

  if ( document.querySelector('.cw_block') ) {

    let { usDateFormat, absoluteDate } = rl.getItem('userPreferences'),
        copies = document.querySelectorAll('.cw_block_timestamp'),
        language = rl.language(),
        monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // ========================================================
    // Functions
    // ========================================================

    /**
     * Sets a data attribute on each span that contains the
     * relative date the item was added to the collection/wantlist
     * @returns {Undefined}
     */
    function storeRelativeDates() {
      let dates = document.querySelectorAll('.cw_block_timestamp span');
      dates.forEach(date => { date.dataset.approx = date.textContent; });
    }

    /**
     * Converts time from 12 hour format to 24 hour format
     * @param {String} time12h - The time in 12 hour format (1:15 PM)
     * @returns {String}
     */
    function convertTo24(time12h) {

      let [time, modifier] = time12h.split(' '),
          [hours, minutes] = time.split(':');

      if ( hours === '12' ) { hours = '00'; }

      if ( modifier === 'PM' ) { hours = parseInt(hours, 10) + 12; }

      return `${hours}:${minutes}`;
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
    * @returns {undefined}
    */
    function renderDate(elem) {

      let timestamp = elem.querySelector('span').title,
          approx = elem.querySelector('span').dataset.approx,
          date = timestamp.split('-'),
          timeRaw = date[2].split(' '),
          time = [timeRaw[1], timeRaw[2]].join(' '),
          monthIndex = monthList.indexOf(date[1]),
          international = `${date[0]} ${getMonth(monthIndex)} 20${timeRaw[0]} ${convertTo24(time)}`,
          american = `${getMonth(monthIndex)} ${date[0]}, 20${timeRaw[0]}, ${time}`,
          specific = usDateFormat ? american : international;

      elem.querySelector('span').textContent = absoluteDate ? specific : approx;
    }

    /**
    * Whether the user wants to see the absolute date
    * @param {Boolean} pref - User's absolute date preference
    * @returns {undefined}
    */
    function savePreference(pref) {
      rl.setPreference('absoluteDate', pref);
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
    if (usDateFormat === undefined) usDateFormat = false;
    if (absoluteDate === undefined) absoluteDate = true;

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

