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
// TODO handle blocked releases (also in Average Rating function)
  let releasePageRating = document.querySelector('.rating_value'),
      releaseRating = releasePageRating ? releasePageRating.textContent : null,
      sellPageRating = document.querySelector('.rating_value_sm'),
      sellRating = sellPageRating ? sellPageRating.textContent : null;

  if ( releaseRating && releaseRating !== '--' ) {

    let percent = Number(releasePageRating.textContent) / 5 * 100;
    releasePageRating.parentElement.innerHTML += `<span class="de-percentage">(${Math.floor(percent)}%)</span>`;
  }

  if ( sellRating ) {

    let percent = Number(sellPageRating.textContent) / 5 * 100;
    sellPageRating.innerHTML += ` <span class="de-percentage">(${Math.floor(percent)}%)</span>`;
  }
});
