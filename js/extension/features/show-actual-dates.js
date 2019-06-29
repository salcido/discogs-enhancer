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

    let { usDateFormat } = rl.getItem('userPreferences'),
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
          date = timestamp.split('-'),
          timeRaw = date[2].split(' '),
          time = [timeRaw[1], timeRaw[2]].join(' '),
          monthIndex = monthList.indexOf(date[1]),
          international = `${date[0]} ${getMonth(monthIndex)} 20${timeRaw[0]} ${convertTo24(time)}`,
          american = `${getMonth(monthIndex)} ${date[0]}, 20${timeRaw[0]}, ${time}`,
          specific = usDateFormat ? american : international;

      elem.querySelector('span').textContent = specific;
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
          display: inline-block;
          width: 50%;
        }`;

      fragment.appendChild(css);
      (document.head || document.documentElement).appendChild(fragment.cloneNode(true));
    }

    // ========================================================
    // DOM setup
    // ========================================================
    if (usDateFormat === undefined) usDateFormat = false;

    attachCss();
    storeRelativeDates();
    copies.forEach(copy => renderDate(copy));

    // Event listeners
    // ------------------------------------------------------
    copies.forEach(copy => {

      let span = copy.querySelector('span'),
          actual = span.textContent;

      copy.addEventListener('mouseover', () => {
        span.textContent = span.dataset.approx;
      });

      copy.addEventListener('mouseleave', () => {
        span.textContent = actual;
      });
    });

    // TODO: remove this later
    rl.removePreference('absoluteDate');
  }
});
/*
// ========================================================
And maybe my issues are not your issues
But everyone has to sleep and everybody carries weight.
You can't escape regret, but you might regret escape
If you closed your eyes and held it, would you recognize the shape?
https://www.discogs.com/master/view/419728
// ========================================================
*/
