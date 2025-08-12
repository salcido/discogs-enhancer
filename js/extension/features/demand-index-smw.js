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

  if (rl.pageIsNot('shopMyWants')) return;

  /**
   * Returns the graphQL response for the SMW marketplace
   * @param {function} callback - The function to execute
   */
  function onGraphQLComplete(callback) {

    let originalFetch = window.fetch;

    window.fetch = async function(...args) {

      let [url, options] = args;

      let isGraphQL = options?.method === 'POST'
            && typeof options?.body === 'string'
            && options.body.includes('"query"');

      let response = await originalFetch.apply(this, args);

      if (isGraphQL) {
        // Clone so we don't consume the body before SMW reads it
        response.clone().json().then(data => {
          try {
            callback({ url, request: options.body, response: data });
          } catch (err) {
            console.error('Discogs Enhancer: Error in onGraphQLComplete callback:', err);
          }
        }).catch(err => {
          console.error('Discogs Enhancer: Failed to parse GraphQL response:', err);
        });
      }

      return response;
    };
  }

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
      .community_summary {
        font-size: .875rem;
      }
  `;

  // ========================================================
  // DOM Setup
  // ========================================================
  rl.attachCss('demand-index', rules);

  if ( rl.pageIs('shopMyWants') ) {

    onGraphQLComplete(({ response }) => {

      let ratings = response.data.releases,
          mpItems = [...document.querySelectorAll('.flex.flex-col.items-start[class*="lg:flex-row"]')];

      ratings.forEach((item, i) => {

        let haves = item.inCollectionCount,
            wants = item.inWantlistCount,
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
        label.className = 'community_summary text-brand-textSecondary';
        span.textContent = isInfiniteOrNaN ? ' --' : ` ${demand}%`;
        span.classList = className;

        demandSpan.className = 'de-demand';
        demandSpan.appendChild(label);
        demandSpan.appendChild(span);

        if (!mpItems[i].parentElement.querySelector('.de-demand')) {
          mpItems[i].parentElement.appendChild(demandSpan);
        }
      });
    });
  }
});
