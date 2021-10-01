/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This feature will compare the listed price of a single item with the price
 * suggested by Discogs.
 *
 * The script is initiated with the code that follows the `DOM setup`
 * comment block.
 */

rl.ready(() => {
  if ( rl.pageIs('allItems', 'seller', 'myWants') ) {

    let
        colorizePrices = rl.options.colorize(),
        difference,
        nodeId,
        percentage,
        priceContainer,
        priceKey,
        printPrice,
        suggested,
        symbol,
        target,
        userCurrency = rl.getPreference('userCurrency');

    // ========================================================
    // Functions (In general order of execution)
    // ========================================================

    /**
     * Insert preloader animation
     * (attached to window object to allow use with Everlasting Marketplace option)
     * @method injectPriceLinks
     * @returns {undefined}
     */
    window.injectPriceLinks = function injectPriceLinks() {

      let p = document.querySelectorAll('td.item_price');

      for ( let i = 0; i < p.length; i++ ) {

        let a = document.createElement('a');

        a.className = 'de-price-link';
        a.style = 'margin: 10px auto; display:block; font-weight: bold; white-space: pre;';
        a.textContent = 'Show Price\r\nComparison';

        // Only append price comparison links if they do not yet exist on each item
        if ( p[i].getElementsByClassName('de-price-link').length < 1
             && p[i].getElementsByClassName('de-price').length < 1
             && p[i].getElementsByClassName('de-price-preloader').length < 1 ) {

          p[i].appendChild(a);
        }
      }
    };

    /**
     * Inject price comparisons
     * @param  {string} releaseId The id of the release to look up
     * @param  {array.<object>} container The price/condition
     * @param  {object} targ The target element to gather info from
     * @returns {undefined}
     */
    async function getPrice(releaseId) {
      releaseId = releaseId.split('-')[0];
      target.querySelector('.de-price-link').remove();
      target.insertAdjacentHTML('beforeend', rl.css.pricePreloader);

      try {

        let url = `/sell/post/${releaseId}`,
            response = await fetch(url, { credentials: 'include' });

        let data = await response.text(),
            div = document.createElement('div');

        div.innerHTML = data;
        nodeId = div.querySelector('#dsdata');
        priceKey = rl.prepareObj(nodeId.outerHTML);

        return div;

      } catch (err) {
        handleError();
      }
    }

    /**
     * Make sure the user has Seller permissions
     * @method checkForSellerPermissions
     * @returns {undefined}
     */
    function checkForSellerPermissions(result) {

      if ( result
           && result.innerHTML
           && result.querySelector('#seller-paypal-verification')
           && !priceKey['post:suggestedPrices'] ) {

        document.querySelector('.de-price-preloader').remove();
        target.insertAdjacentHTML('beforeend', rl.css.pleaseRegister);
      }
    }

    /**
     * Calculates the price comparison
     * @method generateComparison
     * @returns {undefined}
     */
    function generateComparison() {

      let actual;

      rl.matchSymbols(priceContainer);
      rl.sanitizePrices(priceContainer);
      rl.convertPrices(priceContainer);

      // Set up comparions values
      actual = priceContainer[0].convertedPrice;

      suggested = priceKey['post:suggestedPrices'][priceContainer[0].mediaCondition];

      difference = suggested - actual;

      percentage = ( (difference / suggested) * 100 ).toFixed(0);

      printPrice = rl.localizeSuggestion(symbol, suggested);
    }

    /**
     * Appends the price comparison to the DOM
     * @method appendPrice
     * @returns {undefined}
     */
    function appendPrice() {

      let amount = '',
          markup,
          spanOuter = document.createElement('span'),
          threshold = rl.options.threshold() || 0;

      target.querySelector('.de-price-preloader').remove();

      // Debugging
      logOutput(percentage, difference, suggested);

      // No data from Discogs
      if ( !isFinite(percentage) ) {

        spanOuter.className = 'converted_price de-price de-suggested-price';
        spanOuter.innerHTML = rl.css.noData;

        target.insertAdjacentElement('beforeend', spanOuter);

        return rl.fade(target);
      }

      amount = rl.getAmountString(percentage, threshold);
      markup = createPriceMarkup(percentage, printPrice, amount);
      target.append(markup);
      rl.fade(target);

      // Colorize the price if it's under the threshold
      if ( amount !== 'more' && colorizePrices ) {
        target.querySelector('.price').classList.add('green');
      }
    }

    /**
     * Generates suggested price markup
     * @method createPriceMarkup
     * @param  {number} perc The percentage of the price difference
     * @param  {string} printPri The suggested price
     * @param  {string} qt Quantity: either 'more', 'less' or ''
     * @returns {object}
     */
    function createPriceMarkup(perc, printPri, qt) {

      let _class = qt === 'more' ? 'red' : 'green',
          desc = qt.length ? 'around ' : 'within ',
          plusmn = qt.length ? '' : '\u00B1',
          spanOuter = document.createElement('span'),
          spanPct = document.createElement('span'),
          spanSug = document.createElement('span'),
          spanPrice = document.createElement('span');

      spanOuter.textContent = desc;
      spanOuter.className = 'converted_price de-price';

      spanPct.textContent = `${plusmn} ${Math.abs(perc)}% ${qt}`;
      spanPct.className = _class;

      spanSug.textContent = 'than suggested:';
      spanSug.className = 'd-block';

      spanPrice.textContent = printPri;

      spanOuter.append(spanPct);
      spanOuter.append(spanSug);
      spanOuter.append(spanPrice);

      return spanOuter;
    }


    /**
     * Logs the values used to create the price comparison
     * when debugging
     * @param  {number} perc percentage
     * @param  {number} diff difference
     * @param  {number} sugg suggested
     * @returns {undefined}
     */
    function logOutput(perc, diff, sugg) {

      let pAmt = perc > 0 ? '% less' : '% more',
          pct = Math.abs(perc),
          value = Math.abs(diff).toFixed(3),
          vAmt = diff > 0 ? ' less' : ' more';

      if ( rl.options.debug() ) {

        console.log('Suggested: ', sugg);
        console.log('Difference: ', value + ' ' + userCurrency + vAmt);
        console.log('Percentage: ', pct + pAmt);
      }
    }

    /**
     * Appends error element to page
     * @returns {undefined}
     */
    function handleError() {

      let s = document.createElement('span');

      s.className = 'd-block';
      s.textContent = 'Error getting price data.';

      if (document.querySelector('.de-price-preloader')) {
        document.querySelector('.de-price-preloader').remove();
      }
      target.insertAdjacentElement('beforeend', s);
    }

    // ========================================================
    // UI Functionality
    // ========================================================

    // Kick off the process when the price link is clicked
    document.body.addEventListener('click', event => {

      if ( event.target.classList.contains('de-price-link') ) {

        let
            link = event.target,
            href = link
                       .closest('.shortcut_navigable')
                       .querySelector('.item_description a.item_release_link').href,
            slash = href.lastIndexOf('/') + 1,
            len = href.length,
            mediaCondition = link.closest('.shortcut_navigable')
                            .querySelector('.item_description .item_condition .condition-label-desktop + span')
                            .textContent.trim(),
            releaseId = href.substring(slash, len),
            price = link.closest('.shortcut_navigable').querySelector('.price').textContent;

        target = event.target.closest('.item_price');
        priceContainer = [{ price: price, mediaCondition: mediaCondition }];

        // Run the comparison process...
        getPrice(releaseId).then(div => {
          if (div && div.querySelector('#main_wrapper')) {
            checkForSellerPermissions(div);
            generateComparison();
            appendPrice();
          } else {
            handleError();
          }
        });
      }
    });

    // Prev/Next clicks
    rl.handlePaginationClicks(window.injectPriceLinks);

    // ========================================================
    // DOM Setup
    // ========================================================

    // Remove mobile clutter
    document.querySelectorAll('.hide_desktop').forEach(elem => elem.remove());

    // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
    document.querySelectorAll('.condition-label-mobile').forEach(elem => elem.remove());

    symbol = rl.getSymbols(userCurrency, symbol);

    window.injectPriceLinks();
  }
});
