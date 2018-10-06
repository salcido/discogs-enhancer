/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

 // @TODO: maybe double haves and compare it to wants to see if there is a large difference
 // between haves/wants?
resourceLibrary.ready(() => {

  let releaseScanner = resourceLibrary.options.releaseScanner(),
      href = window.location.href,
      interval = 300,
      releases = [...document.querySelectorAll('.card td.image a')].map(r => r.href),
      skittles = [...document.querySelectorAll('.skittles .skittles')],
      button = '<button class="buy_release_button button button-green de-scan-releases">Scan Releases</button>';

  /**
   * Fetches a page and extracts the comment count from it
   * @param {string} url - The URL to fetch data from
   * @returns {number} - The number of comments on the page
   */
  async function fetchRelease(url) {

    try {

      let response = await fetch(url),
          data = await response.text(),
          div = document.createElement('div'),
          reviewCount,
          haves,
          wants,
          moreWants;

      div.innerHTML = data;
      reviewCount = div.querySelectorAll('.review').length || 0;
      haves = Number(div.querySelector('.coll_num').textContent);
      wants = Number(div.querySelector('.want_num').textContent);
      moreWants = wants > haves;

    return { reviewCount, moreWants };

    } catch (err) {

      console.log('Could not fetch release count for: ', url);
    }
  }

  /**
   * Appends preloading spinners to the page while
   * the fetch requests are running.
   * @returns {HTMLElement} - The preloader markup
   */
  function appendSpinners() {
    document.querySelectorAll('.card td.image a').forEach((r,i) => {
      let preloader = '<i class="icon icon-spinner icon-spin de-loader" style="font-style: normal;"></i>';
      return skittles[i].insertAdjacentHTML('beforeend', preloader);
    });
  }

  /**
   * Appends a skittle next to the release that was scanned
   * @param {Object} data - The number of comments and whether there are more wants than haves
   * @param {Number} position - The index position of the individual release in the releases list
   * @returns {HTMLElement | null}
   */
  function appendCount({ reviewCount, moreWants }, position) {

    let badge,
        count,
        color = moreWants ? '#a200ff' : '#585858';

    if ( reviewCount > 0 ) {
      count = reviewCount;
    } else if ( reviewCount <= 0 && moreWants ) {
      count = '0';
    } else if ( reviewCount <= 0 && !moreWants ) {
      count = null;
    }

    badge = `<span class="skittle" style="background:${color} !important;"><span style="color:white !important;">${count}</span></span>`;

    return count ? skittles[position].insertAdjacentHTML('beforeend', badge) : null;
  }

  /**
   * Delays a promise for a specified amount of time
   * @param {Number} ms - The request delay time in milliseconds
   * @returns {Promise}
   */
  function promiseDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Iterates over an array of release urls and appends
   * badges when necessary
   * @param {Array} urls - An array of urls to request
   * @param {Number} delay - The time in milliseconds to delay each request
   * @returns {Array} - An array of comment counts for each URL
   */
  async function requestAllWithDelay(urls, delay) {

    let button = document.querySelector('.de-scan-releases'),
        responses = [],
        index = 0;

    appendSpinners();
    button.disabled = true;
    button.textContent = 'Scanning...';

    for (let url of urls) {

      try {

        let data = await fetchRelease(url);

        document.querySelector('.de-loader').remove();
        appendCount(data, index);
        index++;
        responses.push(data);

      } catch (err) {
        responses.push(null);
      }
      await promiseDelay(delay);
    }

    button.textContent = 'Scan Complete';
    return responses;
  }

  // ========================================================
  // DOM Setup
  // ========================================================
  if (releaseScanner && (href.includes('/artist/') || href.includes('/label/'))) {

    let selector = '.section_content.marketplace_box_buttons_count_1',
        pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]');

    document.querySelector(selector).insertAdjacentHTML('beforeend', button);

    // Event Listeners
    // ------------------------------------------------------
    document.querySelector('.de-scan-releases').addEventListener('click', () => {
      requestAllWithDelay(releases, interval)
        .then(res => console.log(res))
        .catch(err => console.error(err));
    });

    // Previous / Next page clicks
    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(() => {
          let button = document.querySelector('.de-scan-releases');
          button.enabled = true;
          button.textContent = 'Scan Releases';
        });
      });
    });
  }
});
