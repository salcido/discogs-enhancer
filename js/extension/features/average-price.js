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

  let href = window.location.href,
      selector = rl.pageIsReact()
                 ? '#release-stats ul:last-of-type'
                 : '.statistics .section_content ul.last';

  /**
   * Fetches the average price from the history page and injects
   * it into the DOM.
   * @param {String} id - The release ID to look up
   * @returns {HTMLElement}
   */
  async function getAverage(id) {

    id = id.split('-')[0];

    try {

      let url = `https://www.discogs.com/sell/history/${id}`,
          response = await fetch(url),
          data = await response.text(),
          div = document.createElement('div'),
          li = document.createElement('li');

      if ( typeof Element.prototype.setHTMLUnsafe === 'function' ) {
        div.setHTMLUnsafe(data);
      } else {
        div.innerHTML = data;
      }
      li.innerHTML = `<span class="de-average-price">Average:</span> <span style="font-weight: bold;">${div.querySelector('#page_content ul li:nth-child(2)').textContent.trim().split(' ')[0]}</span>`;

      return document.querySelector(selector).append(li);

    } catch (err) {

      let li = document.createElement('li');

      li.innerHTML = 'Error';
      return document.querySelector(selector).append(li);
    }
  }

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-average-price {
        display: table-cell;
        width: 50%;
      }
  `;

  // ========================================================
  // Init / DOM setup
  // ========================================================
  rl.attachCss('average-price', rules);

  if ( rl.pageIs('release')
       && rl.pageIsNot('edit', 'history', 'master', 'sell') ) {

    let stats = document.querySelector(selector);

    if (!stats) return;

    let releaseId = href.split('/release/')[1],
        neverSold = stats.textContent.includes('--') || null;

    if ( neverSold ) {
      let li = document.createElement('li');
      li.innerHTML = '<span class="de-average-price">Average:</span> <span>--</span>';

      return document.querySelector(selector).append(li);
    }

    // Computer, do the thing
    return getAverage(releaseId);
  }
});

