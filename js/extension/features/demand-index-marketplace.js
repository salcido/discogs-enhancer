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

  if (rl.pageIsNot('allItems', 'seller', 'myWants')) return;

  window.mpDemandIndex = function mpDemandIndex() {
    let mpItems = [...document.querySelectorAll('.community_data_text')];

    mpItems.forEach(item => {

      let
          havesElem = item.querySelector('.have_indicator .community_number') || null,
          wantsElem = item.querySelector('.want_indicator .community_number') || null,
          haves = havesElem ? havesElem.textContent : null,
          wants = wantsElem ? wantsElem.textContent : null,
          demandSpan = document.createElement('span'),
          label = document.createElement('span'),
          span = document.createElement('span'),
          demand = Math.round(wants / haves * 100) - 100,
          isInfiniteOrNaN = !isFinite(demand) || isNaN(demand),
          className;

          if (!haves || !wants) return;

          demand = demand === -100 ? 0 : demand;

          if ( demand < 0 ) {
            className = 'de-demand-negative community_summary';
          } else if ( demand === 0 || isInfiniteOrNaN ) {
            className = '';
          } else {
            className = 'de-demand-positive community_summary';
          }

        label.textContent = 'Demand:';
        label.className = 'community_summary';
        span.textContent = isInfiniteOrNaN ? ' --' : ` ${demand}%`;
        span.classList = className;

        demandSpan.className = 'de-demand';
        demandSpan.appendChild(label);
        demandSpan.appendChild(span);

        if (!item.querySelector('.de-demand')) {
          item.appendChild(demandSpan);
        }
    });
  };

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
  if ( rl.pageIs('allItems', 'seller', 'myWants') ) {
    window.mpDemandIndex();
    rl.handlePaginationClicks(window.mpDemandIndex);
  }
});
