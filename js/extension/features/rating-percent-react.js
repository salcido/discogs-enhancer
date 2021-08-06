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

  let releasePageRating = document.querySelector('#release-stats ul li:nth-child(3) span'),
      releaseRating = releasePageRating ? releasePageRating.textContent : null;

  if ( releaseRating && releaseRating !== '--' ) {

    let percent = Number(releasePageRating.textContent.split(' / ')[0]) / 5 * 100;
    releasePageRating.innerHTML += ` <span class="de-percentage">(${Math.floor(percent)}%)</span>`;
  }
});
