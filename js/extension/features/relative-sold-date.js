/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This feature will show the relative time an item
 * was last sold on the Release page.
 */

rl.ready(() => {
  if ( rl.pageIs('release') ) {
    // ========================================================
    // Functions
    // ========================================================

    /**
     * Returns the approximate relative time that has passed
     * since `date`.
     * @param {String} date - A date string: XX-MMM-YY
     * @returns {String}
     */
    function getRelativeTime(date) {

      let current = Date.now(),
          previous = new Date(date).getTime(),
          msPerMinute = 60 * 1000,
          msPerHour = msPerMinute * 60,
          msPerDay = msPerHour * 24,
          msPerMonth = msPerDay * 30,
          msPerYear = msPerDay * 365,
          elapsed = current - previous;

      if (elapsed <= msPerDay) {
        return 'Today';
      }

      if (elapsed < msPerMonth) {
        let duration = Math.floor(elapsed/msPerDay),
            units = duration > 1 ? 'days' : 'day';
        return `${duration} ${units} ago`;
      }

      if (elapsed < msPerYear) {
        let duration = elapsed/msPerMonth,
            rounded = (Math.floor(duration * 10) / 10).toFixed(2),
            floored = Math.floor(duration),
            units = floored > 1 ? 'months' : 'month',
            over = rounded > Math.floor(duration) ? 'Over' : '';

        return `${over} ${floored} ${units} ago`;
      }

      let duration = elapsed/msPerYear,
          rounded = (Math.floor(duration * 4) / 4).toFixed(2),
          floored = Math.floor(duration),
          units = floored > 1 ? 'years' : 'year',
          over = rounded > Math.floor(duration) ? 'Over' : '';

      return `${over} ${floored} ${units} ago`;
    }

    /**
     * Toggles between the relative/actual last sold dates
     * @param {String} rawDate - The raw date the item was sold
     * @param {String} relative - The relative time the item was sold
     * @returns {undefined}
     */
    function addMouseListeners(rawDate, relative) {

      lastSold.style.display = 'inline-block';
      lastSold.style.fontSize = getFontSize(relative.length);

      lastSold.addEventListener('mouseover', () => {
        lastSold.textContent = rawDate;
        lastSold.style.width = '60%';
      });

      lastSold.addEventListener('mouseleave', () => {
        lastSold.textContent = relative;
        lastSold.style.width = 'auto';
      });
    }

    /**
     * Determines the date's font-size value
     * @returns {String}
     */
    function getFontSize(length) {
      let size;
      switch(true) {
        case length <= 16:
          size = 'inherit';
          break;

        case length == 17:
          size = 'small';
          break;

        case length > 17:
          size = 'smaller';
          break;
      }
      return size;
    }

  // ========================================================
  // DOM Setup
  // ========================================================
    let lastSold = document.querySelector('.last_sold a'),
        rawDate = lastSold && lastSold.textContent ? lastSold.textContent : null,
        relative = rawDate ? getRelativeTime(rawDate) : '';

    if (rawDate && relative) {
      lastSold.textContent = relative;
      lastSold.classList.add('de-last-sold');
      addMouseListeners(rawDate, relative);
    }
  }
});
