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

  if ( rl.pageIs('release') ) {

    rl.waitForElement('div[class*="collection_"]').then(() => {

      let { usDateFormat } = rl.getItem('userPreferences'),
          copies = document.querySelectorAll('div[class*="collection_"]'),
          language = rl.language(),
          monthList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

      // ========================================================
      // Functions
      // ========================================================
      /**
       * Sets a data attribute on each span that contains the
       * relative date the item was added to the collection/wantlist
       * @returns {Undefined}
       */
      function storeRelativeDates() {
        let dates = document.querySelectorAll('div[class*="collection_"] span[class*="added_"]');
        dates.forEach(date => { date.dataset.approx = date.textContent; });
      }

      /**
       * Converts time from 12 hour format to 24 hour format
       * @param {String} time12h - The time in 12 hour format (1:15 PM)
       * @returns {String}
       */
      function convertTo24(time12h) {

        let [time, modifier] = time12h.split(' '),
            [hours, minutes,] = time.split(':');

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
        // '5/4/2015, 11:41:51 PM'
        let timestamp = elem.querySelector('span[class*="added_"]').title,
            date = timestamp.split('/'),
            timeRaw = date[2].split(' '),
            year = timeRaw[0],
            [hours, mins] = timeRaw[1].split(':'),
            meridiem = timeRaw[2],
            time = `${hours}:${mins} ${meridiem}`,
            monthIndex = monthList.indexOf(date[0]),
            international = `Added ${date[0]} ${getMonth(monthIndex)} ${year} ${convertTo24(time)}`,
            american = `Added ${getMonth(monthIndex)} ${date[1]}, ${year} ${time}`,
            specific = usDateFormat ? american : international;

        elem.querySelector('span').textContent = specific;
      }

      // ========================================================
      // CSS
      // ========================================================
      let rules = `
          div[class*="collection_"] span[class*="added_"] {
            display: inline-block;
            width: auto;
            font-size: smaller;
          }`;

      // ========================================================
      // DOM setup
      // ========================================================
      if ( usDateFormat === undefined ) usDateFormat = false;

      rl.attachCss('date-toggle', rules);
      storeRelativeDates();
      copies.forEach(copy => renderDate(copy));

      // Event listeners
      // ------------------------------------------------------
      copies.forEach(copy => {

        let span = copy.querySelector('span[class*="added_"'),
            actual = span.textContent;

        copy.querySelector('span[class*="added_"').addEventListener('mouseover', () => {
          span.textContent = span.dataset.approx;
        });

        copy.querySelector('span[class*="added_"').addEventListener('mouseleave', () => {
          span.textContent = actual;
        });
      });
    });
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
