/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

rl.ready(() => {
  if ( rl.pageIs('inventory') ) {

    let opts = rl.getPreference('scan'),
        releases = [...document.querySelectorAll('.left.item_name a[href^="/release"]')].map(r => r.href),
        flags = [...document.querySelectorAll('tr.shortcut_navigable td:nth-child(6)')],
        button = document.createElement('button'),
        { threshold } = rl.getPreference('inventoryScanner'),
        inventoryPrices = [...document.querySelectorAll('tr.shortcut_navigable td:nth-child(7)')]
            .map(r => Number(r.textContent.match(/\d+./g).join('')));

    const BUTTON_INIT = 'Scan Inventory',
          BUTTON_IN_PROGRESS = 'Scanning...',
          BUTTON_COMPLETE = 'Scan Complete',
          PERCENT_BELOW = Number(threshold) / 100 || 0,
          DELAY = opts && opts.int ? Number(opts.int) : 1000;

    // ========================================================
    // Functions
    // ========================================================
    /**
     * Delays a promise for a specified amount of time
     * @param {Number} ms - The request delay time in milliseconds
     * @returns {Promise}
     */
    function promiseDelay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Appends preloading spinners to the page while
     * the fetch requests are running.
     */
    function appendSpinners() {
      flags.forEach(flag => {
        if (flag.className !== 'price_flag') {
          flag.querySelector('div').className = 'icon icon-spinner icon-spin';
          flag.querySelector('div').style = 'font-size: xx-small;';
        }
      });
    }

    /**
     * Appends a "Scan Inventory" button to the
     * first `.action-buttons` element
     */
    function appendButton() {
      let actionButtons = document.querySelector('.action-buttons');

      button.className = 'buy_release_button button button-green de-scan-inventory';
      button.style = 'margin-right: 28px;';
      button.textContent = BUTTON_INIT;

      actionButtons.insertBefore(button, document.querySelector('.action-buttons a'));
    }

    /**
     * Fetches a page and extracts the median price
     * @param {String} url - The URL to fetch data from
     * @returns {Number} - The median price of the item
     */
    async function fetchRelease(url) {

      try {

        let response = await fetch(url),
            data = await response.text(),
            div = document.createElement('div'),
            digits = /\d+./g,
            priceSelector = '.section.statistics .last li:nth-child(3)',
            priceString,
            priceNumber;

        div.innerHTML = data;
        priceString = div.querySelector(priceSelector).textContent.match(digits) || 0;
        priceNumber = Number(priceString.join(''));

        return priceNumber;

      } catch (err) {
        return 0;
      }
    }

    /**
     * Iterates over an array of release urls and appends
     * flags when necessary
     * @param {Array} urls - An array of urls to request
     * @param {Number} delay - The time in milliseconds to delay each request
     * @returns {Array} - An array of median prices for each URL
     */
    async function scanReleases(urls, delay) {

      let responses = [],
          index = 0;

      appendSpinners();

      button.disabled = true;
      button.textContent = BUTTON_IN_PROGRESS;

      for ( let url of urls ) {

        try {

          flags[index].querySelector('div').className = '';

          let medianPrice = await fetchRelease(url),
              offset = medianPrice * PERCENT_BELOW,
              newMedian = medianPrice - offset;

          if (inventoryPrices[index] < newMedian) {
            flags[index].classList.add('green');
          }

          index++;
          responses.push(medianPrice);

        } catch (err) {
          responses.push(null);
        }
        await promiseDelay(delay);
      }

      button.textContent = BUTTON_COMPLETE;
      return responses;
    }

    /**
     * Resets the scanner so that it can be called
     * again on subsequent pages
     */
    function resetScanner() {
      document.querySelector('.de-scan-inventory').textContent = BUTTON_INIT;
      document.querySelector('.de-scan-inventory').disabled = false;

      modifyReleaseURLs();

      releases = [...document.querySelectorAll('.left.item_name a[href^="/release"]')].map(r => r.href);
      flags = [...document.querySelectorAll('tr.shortcut_navigable td:nth-child(6)')];
      inventoryPrices = [...document.querySelectorAll('tr.shortcut_navigable td:nth-child(7)')]
        .map(r => Number(r.textContent.match(/\d+./g).join('')));
    }

    function modifyReleaseURLs() {
      [...document.querySelectorAll('.left.item_name a[href^="/release"]')].forEach(url => {
        url.target = '_blank';
      });
    }

    // ========================================================
    // CSS
    // ========================================================
    let rules = `
          td.green div {
            border-top: 8px solid #60C43F;
            border-right: 8px solid white;
            width: 1px;
          }

          .de-dark-theme td.green div {
            border-top: 8px solid #00ff5a !important;
            border-right: 8px solid rgb(50, 51, 52) !important;
            width: 1px;
          }`;

    // ========================================================
    // DOM Setup
    // ========================================================
    rl.attachCss('inventory-scanner', rules);
    appendButton();
    modifyReleaseURLs();

    document.querySelector('.de-scan-inventory').addEventListener('click', () => {
      scanReleases(releases, DELAY).then(res => res);
    });

    rl.handlePaginationClicks(resetScanner);
  }
});
/**
// ========================================================
Do not stand still, boast yo' skills
Close but no krills, toast for po' nils, post no bills
Coast to coast Joe Shmoe's flows ill, go chill
Not supposed to overdose No-Doz pills
Off pride tykes talk wide through scar meat
Off sides like how Worf rides with Starfleet
https://www.discogs.com/Doom-And-Madlib-Madvillain-Madvillainy/release/242785
// ========================================================
 */
