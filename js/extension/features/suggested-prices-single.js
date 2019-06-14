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
 * This feature will compare the listed price of a single release with the price
 * suggested by Discogs.
 *
 * The script is initiated with the code that follows the `DOM setup / Init`
 * comment block.
 */

resourceLibrary.ready(() => {
  if ( resourceLibrary.pageIs('allItems', 'seller', 'myWants') ) {

    let
        colorizePrices = resourceLibrary.options.colorize(),
        difference,
        nodeId,
        percentage,
        priceContainer,
        priceKey,
        printPrice,
        suggested,
        symbol,
        target,
        userCurrency = resourceLibrary.getPreference('userCurrency');

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Appends the price comparison to the DOM
     * @method appendPrice
     * @returns {undefined}
     */
    function appendPrice() {

      let amount = '',
          markup,
          spanOuter = document.createElement('span'),
          threshold = resourceLibrary.options.threshold() || 0;

      target.querySelector('.de-price-preloader').remove();

      // Debugging
      logOutput(percentage, difference, suggested);

      // No data from Discogs
      if ( !isFinite(percentage) ) {

        spanOuter.className = 'converted_price de-price';
        spanOuter.innerHTML = resourceLibrary.css.noData;

        target.insertAdjacentElement('beforeend', spanOuter);

        return resourceLibrary.fade(target);
      }

      amount = resourceLibrary.getAmountString(percentage, threshold);
      markup = createPriceMarkup(percentage, printPrice, amount);
      target.append(markup);
      resourceLibrary.fade(target);

      // Colorize the price if it's under the threshold
      if ( amount !== 'more' && colorizePrices ) {
        target.querySelector('.price').classList.add('green');
      }
    }

    /**
     * Make sure the user has Seller permissions
     * @method checkForSellerPermissions
     * @returns {undefined}
     */
    function checkForSellerPermissions(result) {

      if ( result.innerHTML.includes(resourceLibrary.unregistered)
           && !priceKey['post:suggestedPrices'] ) {

        document.querySelector('.de-price-preloader').remove();
        target.insertAdjacentHTML('beforeend', resourceLibrary.css.pleaseRegister);
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
     * Calculates the price comparison
     * @method generateComparison
     * @returns {undefined}
     */
    function generateComparison() {

      let actual;

      resourceLibrary.matchSymbols(priceContainer);
      resourceLibrary.sanitizePrices(priceContainer);
      resourceLibrary.convertPrices(priceContainer);

      // Set up comparions values
      actual = priceContainer[0].convertedPrice;

      suggested = priceKey['post:suggestedPrices'][priceContainer[0].mediaCondition];

      difference = suggested - actual;

      percentage = ( (difference / suggested) * 100 ).toFixed(0);

      printPrice = resourceLibrary.localizeSuggestion(symbol, suggested);
    }

    /**
     * Inject price comparisons
     * @param  {string} releaseId The id of the release to look up
     * @param  {array.<object>} container The price/condition
     * @param  {object} targ The target element to gather info from
     * @returns {undefined}
     */
    async function getPrice(releaseId) {

      target.querySelector('.de-price-link').remove();
      target.insertAdjacentHTML('beforeend', resourceLibrary.css.pricePreloader);

      try {

        let url = `/sell/post/${releaseId}`,
            response = await fetch(url, { credentials: 'include' }),
            data = await response.text(),
            div = document.createElement('div');

        div.innerHTML = data;
        nodeId = div.querySelector('#dsdata');
        priceKey = resourceLibrary.prepareObj(nodeId.outerHTML);

      return div;

      } catch (err) {

        let s = document.createElement('span');

        s.className = 'd-block';
        s.textContent = 'Error getting price data.';

        document.querySelector('.de-price-preloader').remove();
        target.insertAdjacentHTML('beforeend', s);
      }
    }

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

      if ( resourceLibrary.options.debug() ) {

        console.log('Suggested: ', sugg);
        console.log('Difference: ', value + ' ' + userCurrency + vAmt);
        console.log('Percentage: ', pct + pAmt);
      }
    }

    // ========================================================
    // UI Functionality
    // ========================================================

    // Kick off the process when the price link is clicked
    document.body.addEventListener('click', event => {

      if ( event.target.classList.contains('de-price-link') ) {

        let
            link = event.target,
            linkHref = link
                       .closest('.shortcut_navigable')
                       .querySelector('.item_description a.item_release_link').href,
            slash = linkHref.lastIndexOf('/') + 1,
            len = linkHref.length,
            mediaCondition = link.closest('.shortcut_navigable')
                            .querySelector('.item_description .item_condition .condition-label-desktop + span')
                            .textContent.trim(),
            releaseId = linkHref.substring(slash, len),
            price = link.closest('.shortcut_navigable').querySelector('.price').textContent;

        target = event.target.closest('.item_price');
        priceContainer = [{ price: price, mediaCondition: mediaCondition }];

        // Run the comparison process...
        getPrice(releaseId).then(div => {
          checkForSellerPermissions(div);
          generateComparison();
          appendPrice();
        });
      }
    });

    // Fire `injectPriceLinks` on prev/next page transitions
    let selector = 'ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a',
        pagination = document.querySelectorAll(selector);

    pagination.forEach(elem => {
      elem.addEventListener('click', () => {
        resourceLibrary.xhrSuccess(() => {
          if ( document.querySelectorAll('.de-price-link').length < 1 ) {
            return window.injectPriceLinks();
          }
        });
      });
    });

    // ========================================================
    // DOM Setup / Init
    // ========================================================

    // Remove mobile clutter
    document.querySelectorAll('.hide_desktop').forEach(elem => elem.remove());

    // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
    document.querySelectorAll('.condition-label-mobile').forEach(elem => elem.remove());

    symbol = resourceLibrary.getSymbols(userCurrency, symbol);

    window.injectPriceLinks();
  }
});
