/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

 rl.ready(() => {

  let opts = rl.getPreference('scan'),
      colorize = opts && opts.wants ? opts.wants : null,
      interval = opts && opts.int ? Number(opts.int) : 1000,
      releases,
      ids,
      // skittles is assigned a value in 'DOM Setup' at the bottom: querySelectorAll('td[class*="skittles_"]')
      skittles;

  // ========================================================
  // Functions
  // ========================================================
  /**
   * Iterates over each release URL, assembles the release ID
   * and grabs the href.
   * @returns {undefined}
   */
  function gatherReleaseIds() {

    ids = [];
    releases = [];

    document.querySelectorAll('td[class^="title_"] a').forEach(r => {

      if ( r.href.includes('/release/') || r.href.includes('/master/') ) {

        releases.push(r.href);
        // extract the release ID
        let match = r.href.match(new RegExp('(?<=\/)[0-9]+(?=\-)'));

        if (r.href.includes('/master/')) {
          ids.push(`m${match}`);
        } else {
          ids.push(`r${match}`);
        }
      }
    });

    return ids;
  }

  /**
   * Fetches a page and extracts the comment count from it
   * @param {String} url - The URL to fetch data from
   * @returns {Number} - The number of comments on the page
   */
  async function fetchRelease(url, id) {

    try {

      let response = await fetch(url),
          data = await response.text(),
          div = document.createElement('div'),
          reviewCount,
          haves,
          wants,
          rating,
          votes,
          moreWants;

      div.innerHTML = data;

      let mSelector = 'div[class*="side_3"] div[class*="items_"]',
          rSelector = '#app #release-stats ul li';

      reviewCount = id.includes('m')
                  ? await window.getMasterData(id.match(/\d+/)[0]) // => calls getMasterData from hashes.js
                  : await window.getReleaseData(id.match(/\d+/)[0]),
      haves = id.includes('m')
              ? Number(div.querySelector(`${mSelector} ul li a`)?.textContent || 0)
              : Number(div.querySelectorAll(`${rSelector} a`)[0]?.textContent || 0);
      wants = id.includes('m')
              ? Number(div.querySelector(`${mSelector} ul li a`)?.textContent || 0)
              : Number(div.querySelectorAll(`${rSelector} a`)[1]?.textContent || 0);
      rating = id.includes('m')
              ? div.querySelector(`${mSelector}:last-of-type ul li span:last-of-type`)?.textContent.split(' / ')[0] || 0
              : div.querySelectorAll(`${rSelector}:nth-child(3) span:last-of-type`)[0]?.textContent.split(' / ')[0] || 0;
      votes = id.includes('m')
              ? div.querySelector(`${mSelector}:last-of-type ul li:last-of-type a`)?.textContent || 0
              : div.querySelectorAll(`${rSelector}:nth-child(4) a`)[0]?.textContent || 0;

      // no ratings
      if (rating && rating.includes('--')) rating = 0;

      moreWants = wants > (haves * 1.5);

      return { reviewCount, moreWants, rating, votes };

    } catch (err) {

      console.error('Could not fetch release count for: ', url, err);
    }
  }

  /**
   * Appends preloading spinners to the page while
   * the fetch requests are running.
   * @returns {HTMLElement} - The preloader markup
   */
  function appendSpinners() {

    skittles.forEach((r,i) => {

        let preloader = '<div style="min-height:1rem" class="de-loading"><svg aria-label="loading" viewBox="0 0 1024 1024" class="de-spinner show" role="img"><path d="M301 797q0 30-22 51t-52 22q-29 0-51-22t-22-51q0-31 22-52t51-22 52 22 22 52zm284 117q0 31-21 52t-52 21-52-21-21-52 21-51 52-22 52 22 21 51zM183 512q0 30-22 52t-51 21-52-21-21-52 21-52 52-21 51 21 22 52zm687 285q0 29-22 51t-51 22q-31 0-52-22t-22-51 22-52 52-22 51 22 22 52zM319 227q0 38-27 65t-65 27-64-27-27-65 27-64 64-27 65 27 27 64zm668 285q0 30-21 52t-52 21-51-21-22-52 22-52 51-21 52 21 21 52zM622 110q0 45-32 77t-78 32-78-32-32-77 32-78 78-32 78 32 32 78zm303 117q0 54-38 91t-90 37q-54 0-91-37t-37-91q0-52 37-90t91-38q52 0 90 38t38 90z"></path></svg></div>';

        return skittles[i].insertAdjacentHTML('beforeend', preloader);
    });
  }

  /**
   * Appends a skittle next to the release that was scanned
   * @param {Object} data - The number of comments and whether there are more wants than haves
   * @param {Number} position - The index position of the individual release in the releases list
   * @returns {HTMLElement | null}
   */
  function appendCount(data, position) {

    let badge,
        { reviewCount:count, moreWants } = data;
    // add position to `data` for grabbing the release href to append to the badge markup and make it clickable
    data.position = position;
    badge = createBadge(data);

    return count || colorize && moreWants ? skittles[position].insertAdjacentHTML('beforeend', badge) : null;
  }

  /**
   * Evaluates the data and returns the appropriate badge markup
   * @param {Object} data - An object of release attributes
   * @returns {HTMLElement | null}
   */
  function createBadge(data) {

    let { reviewCount, moreWants, rating, votes, position } = data,
        color = (moreWants && colorize) ? '#a200ff' : '#585858',
        count,
        badge;

    if ( reviewCount > 0 ) {
      count = reviewCount;
    } else if ( reviewCount === 0 && moreWants ) {
      count = '&nbsp;&nbsp;';
    } else if ( reviewCount <= 0 && !moreWants ) {
      count = null;
    }

    badge = `<a href="${releases[position]}" target="_blank" rel="noopener" class="de-scan-badge-wrap">
              <span class="skittle de-scan-badge" style="background:${color} !important;">
                <span style="color:white !important;">${count}</span>
                <div class="tooltip fade top in de-scan-tooltip">
                  <div class="tooltip-arrow"></div>
                  <div class="tooltip-inner">
                    Rating: ${rating} / 5
                    <br>
                    Votes: ${votes}
                  </div>
                </div>
              </span>
            </a>`;

    return badge;
  }

  /**
   * Modifies the links on the page to open them in new tabs
   * @returns {Undefined}
   */
  function openInNewTabs() {

    let anchors = document.querySelectorAll('table[class*="labelReleasesTable_"] tr a');

    anchors.forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
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
   * @param {Array} _releases - An array of release urls to request
   * @param {Number} delay - The time in milliseconds to delay each request
   * @returns {Array} - An array of comment counts for each URL
   */
  async function scanReleases(_releases, ids, delay) {

    let button = document.querySelector('.de-scan-releases'),
        responses = [],
        index = 0;

    appendSpinners();
    openInNewTabs();

    button.disabled = true;
    button.textContent = 'Scanning...';

    for ( let [i, release] of _releases.entries() ) {

      try {

        let data = await fetchRelease(release, ids[i]);

        document.querySelector('.de-loading')?.remove();
        appendCount(data, index);
        index++;
        responses.push(data);

      } catch (err) {

        responses.push(null);
      }

      await promiseDelay(delay);
    }

    button.textContent = 'Scan Complete';

    document.querySelector('.reset-scanner-wrap').classList.remove('hide');

    return responses;
  }

  /**
   * Resets the scanner so that it can be called again on subsequent pages
   */
  function resetScanner() {

    releases = [...document.querySelectorAll('td[class^="title_"] a')]
                .filter(r => r.href.includes('/release/') ||  r.href.includes('/master/'))
                .map(r => r.href);

    document.querySelector('.de-scan-releases').textContent = 'Scan Releases';
    document.querySelector('.de-scan-releases').disabled = false;
    document.querySelector('.reset-scanner-wrap').classList.add('hide');
    document.querySelectorAll('.de-scan-badge-wrap').forEach(badge => badge.remove());

    skittles = document.querySelectorAll('tr[class*="text"] td[class*="skittles_"]');
  }

  // ========================================================
  // CSS
  // ========================================================
  let rules = /*css*/`
      .skittle {
        border-radius: 1.6em;
        border: 1px solid transparent;
        color: #fff;
        cursor: default;
        display: inline-block;
        font-size: .85em;
        font-weight: 700;
        height: 0.9rem;
        line-height: .9rem;
        min-width: 1.6em;
        padding: 0 0.4em;
        position: relative;
        text-align: center;
        text-shadow: rgba(0,0,0,.5) 0 0 1px;
      }

      .de-scan-releases {
        border-radius: 3px;
        border: none;
        font-size: 14px;
        margin-top: 0.5rem;
        padding: 0.5rem;
        width: 100%;
        background: #3d8625;
        color: white;
        cursor: pointer;
      }

      .de-scan-releases:disabled {
        color: gray;
        background: lightgray;
        cursor: default;
      }

      .de-scan-badge {
        cursor: pointer;
        position: relative;
      }

      .de-scan-badge .de-scan-tooltip {
        background: black;
        border-radius: 4px;
        display: none;
        font-weight: normal;
        left: -30px;
        position: absolute;
        top: -45px;
      }

      .de-scan-badge .de-scan-tooltip::after {
        content: "";
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top-color: #000;
        position: absolute;
        top: 3.2em;
        left: 0;
        right: 0;
        margin: auto;
      }

      .de-scan-badge:hover .de-scan-tooltip {
        display: block;
      }

      .de-loading {
        align-items: center;
        color: #888;
        display: -moz-box;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        justify-content: space-around;
      }

      .de-spinner {
        animation: de-spin 1s steps(8,start) infinite;
        height: 1em;
        opacity: 0;
        transition: opacity .2s;
        width: 1em;
      }

      .tooltip-inner {
        padding: 0.3rem;
        border-radius: 4px;
      }

      .show {
        opacity: 1;
      }

      .de-dark-theme .de-loading {
        fill: var(--text-normal) !important;
      }

      @keyframes de-spin {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }

      .reset-scanner-wrap {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 1rem;
      }

      button.reset-scanner {
        color: #2653d9;
        border: none;
        background: none;
        cursor: pointer;
      }
      button.reset-scanner:hover {
        color: #07b;
      }
      .de-dark-theme button.reset-scanner {
        color: var(--link) !important;
      }
      .de-dark-theme button.reset-scanner:hover {
        color: var(--link-hover) !important;
      }

      .hide {
        display: none;
      }
      `;

  // ========================================================
  // DOM Setup
  // ========================================================
  if ( rl.pageIs('history') ) return;

  if ( rl.pageIs('artist') || rl.pageIs('label') ) {

    let buttonDiv = 'div[class*="buttons_"]';

    if ( document.querySelector(buttonDiv) ) {

      // 'td[class*="skittles_"]' needs to exist before the skittles var can have a value
      rl.waitForElement('tr[class*="text"] td[class*="skittles_"]').then(() => {

        let scanText = 'Scan Releases',
            resetText = 'Reset Scanner',
            buttonMarkup = `<button class="buy_release_button button button-green de-scan-releases">${scanText}</button>
                      <div class="reset-scanner-wrap hide">
                        <button class="reset-scanner">${resetText}</button>
                      </div>`;

        skittles = document.querySelectorAll('tr[class*="text"] td[class*="skittles_"]');

        rl.attachCss('scan-badges', rules);

        document.querySelector(buttonDiv).insertAdjacentHTML('afterend', buttonMarkup);

        // Event Listeners
        // ------------------------------------------------------

        // Scan Releases Button
        document.querySelector('.de-scan-releases').addEventListener('click', () => {

          gatherReleaseIds();

          scanReleases(releases, ids, interval)
            .then(res => res)
            .catch(err => console.error(err));
        });

        // Reset Scanner Button
        document.querySelector('button.reset-scanner').addEventListener('click', () => resetScanner());

        // Artist Page UI click event listener
        let buttonSelectors = 'div[class*="innerContainer_"] button, div[class*="facetsContainer_"] button, div[class*="paginationContainer_"] button';

        [...document.querySelectorAll(buttonSelectors)].forEach(button => {
          button.addEventListener('click', () => {
            rl.waitForElement('td[class*="skittles_"]').then(() => resetScanner());
          });
        });

      });
    }
  }
});
/**
// ========================================================
Me and him, we're from different ancient tribes.
And now, we're both almost extinct.
Sometimes you gotta stick with the ancient ways,
the old school ways. I know you understand me.
https://www.discogs.com/Burial-Burial/master/11767
// ========================================================
 */
