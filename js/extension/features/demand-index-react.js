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

  if ( rl.pageIsNot('release') || !rl.pageIsReact() ) return;

  rl.waitForElement('#release-stats ul li a').then(() => {

    let haves = Number(document.querySelectorAll('#release-stats ul li a')[0].textContent),
        wants = Number(document.querySelectorAll('#release-stats ul li a')[1].textContent),
        li = document.createElement('li'),
        spanA = document.createElement('span'),
        spanB = document.createElement('span'),
        demand = Math.round(wants / haves * 100) - 100,
        isInfiniteOrNaN = !isFinite(demand) || isNaN(demand),
        selector = '#release-stats ul',
        className;

    demand = demand === -100 ? 0 : demand;
    // console.log(Math.round((haves - wants) / haves * -100))
    if ( demand < 0 ) {
      className = 'de-demand-negative';
    } else if ( demand === 0 || isInfiniteOrNaN ) {
      className = '';
    } else {
      className = 'de-demand-positive';
    }

    spanA.textContent = 'Demand:';
    spanA.className = 'de-stats-span';
    spanB.textContent = isInfiniteOrNaN ? ' --' : ` ${demand}%`;
    spanB.classList = className;

    li.appendChild(spanA);
    li.appendChild(spanB);


    // ========================================================
    // CSS
    // ========================================================
    let rules = /*css*/`
        .de-demand-negative {
          color: #BF3A38;
          font-weight: bold;
        }
        .de-demand-positive {
          color: #00b500;
          font-weight: bold;
        }
        .de-stats-span {
          display: table-cell;
          width: 50%;
        }
    `;

    // ========================================================
    // DOM Setup
    // ========================================================
    rl.attachCss('demand-index', rules);
    document.querySelector(selector).appendChild(li);
  });
});
