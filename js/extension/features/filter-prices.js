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

  if ( rl.pageIs('myWants', 'allItems', 'sellRelease') ) {

    let prefs = rl.getPreference('filterPrices') || { minimum: null, maximum: null },
        minimum = prefs.minimum,
        maximum = prefs.maximum;

    /**
     * Grabs all item prices on the page,
     * converts them to the user's currency
     * and hides them accordingly.
     * @returns {undefined}
     */
    window.filterPrices = function filterPrices() {

      let prices = [];
      let items = document.querySelectorAll('.item_price');

      // Gather prices from page
      document.querySelectorAll('.item_price .price').forEach(p => {
        let obj = {};
        obj.price = p.textContent;
        prices.push(obj);
      });

      rl.matchSymbols(prices);
      rl.sanitizePrices(prices);
      rl.convertPrices(prices);

      if (minimum) {
        items.forEach((item, i) => {
          if (prices[i].convertedPrice < minimum) {
            item.closest('.shortcut_navigable').classList.add('de-minimum-price');
          }
        });
      }

      if (maximum) {
        items.forEach((item, i) => {
          if (prices[i].convertedPrice > maximum) {
            item.closest('.shortcut_navigable').classList.add('de-maximum-price');
          }
        });
      }
    };

    // ========================================================
    // DOM Setup
    // ========================================================
    let rules = `
        .de-maximum-price,
        .de-minimum-price {
          display: none;
        }
      `;

    rl.attachCss('price-filters', rules);
    window.filterPrices();
  }
});
