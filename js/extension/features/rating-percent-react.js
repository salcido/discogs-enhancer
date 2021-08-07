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
  if (!rl.pageIsReact()) return;

  let selector = '#release-stats ul li:nth-child(3) span';

  rl.waitForElement(selector).then(() => {
    let releasePageRating = document.querySelector(selector);

    if ( releasePageRating && !releasePageRating.textContent.includes('--') ) {

      let percent = Number(releasePageRating.textContent.split(' / ')[0]) / 5 * 100;

      releasePageRating.innerHTML += ` <span class="de-percentage">(${Math.floor(percent)}%)</span>`;
    }
  });
});
