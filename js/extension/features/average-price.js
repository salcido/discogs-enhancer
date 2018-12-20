/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {

  let href = window.location.href;

  /**
   * Fetches the average price from the history page and injects
   * it into the DOM.
   * @param {String} id - The release ID to look up
   * @returns {HTMLElement}
   */
  async function getAverage(id) {

    try {

      let url = `https://www.discogs.com/sell/history/${id}`,
          response = await fetch(url),
          data = await response.text(),
          div = document.createElement('div'),
          li = document.createElement('li');

      div.innerHTML = data;
      li.style.fontWeight = 'bold';
      li.classList = 'de-average-price';
      li.innerHTML = `<h4>Average:</h4> ${div.querySelector('#page_content ul li:nth-child(2)').textContent.trim().split(' ')[0]}`;

      return document.querySelector('.statistics .section_content ul.last').append(li);

    } catch (err) {

      let li = document.createElement('li');

      li.innerHTML = 'Error fetching price average';
      return document.querySelector('.statistics .section_content ul.last').append(li);
    }
  }

  // ========================================================
  // Init / DOM setup
  // ========================================================

  if ( href.includes('/release/')
       && !href.includes('/edit/')
       && !href.includes('/history')
       && !href.includes('/master/')
       && !href.includes('/sell/')) {

    let releaseId = href.split('/release/')[1],
        neverSold = document.querySelector('.statistics ul.last li:nth-child(2)').textContent.includes('--');

    if ( neverSold ) {
      let li = document.createElement('li');
      li.innerHTML = '<h4>Average:</h4> --';

      return document.querySelector('.statistics .section_content ul.last').append(li);
    }

    // Computer, do the thing
    return getAverage(releaseId);
  }
});

