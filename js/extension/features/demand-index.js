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

  if ( rl.pageIsNot('release')
       || !document.querySelector('.coll_num') ) return;

  let haves = Number(document.querySelector('.coll_num').textContent),
      wants = Number(document.querySelector('.want_num').textContent),
      li = document.createElement('li'),
      h4 = document.createElement('h4'),
      span = document.createElement('span'),
      demand = Math.round(wants / haves * 100) - 100,
      isInfiniteOrNaN = !isFinite(demand) || isNaN(demand),
      selector = '.statistics .section_content.toggle_section_content ul',
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

  h4.textContent = 'Demand:';
  span.textContent = isInfiniteOrNaN ? ' --' : ` ${demand}%`;
  span.classList = className;

  li.appendChild(h4);
  li.appendChild(span);


  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-demand-negative {
        color: #BF3A38;
        font-weight: bold;
      }
      .de-demand-positive {
        color: #00b500;
        font-weight: bold;
      }
  `;

  // ========================================================
  // DOM Setup
  // ========================================================
  rl.attachCss('demand-index', rules);
  document.querySelector(selector).appendChild(li);
});
