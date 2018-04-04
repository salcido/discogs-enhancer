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
 * The script is initiated with the code that follows the `Init / DOM setup`
 * comment block.
 */
// TODO refactor to vanilla js
resourceLibrary.ready(function() {

  let
      loc = window.location.href,
      wantlist = loc.includes('/sell/mywants'),
      allItems = loc.includes('/sell/list'),
      seller = loc.includes('/seller/');


  if ( wantlist || allItems || seller ) {

    let
        colorizePrices = resourceLibrary.options.colorize(),
        difference,
        nodeId,
        percentage,
        priceContainer,
        priceKey,
        printPrice,
        result,
        suggested,
        symbol,
        target,
        userCurrency = resourceLibrary.getItem('userCurrency');

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Appends the price comparison to the DOM
     *
     * @method appendPrice
     * @return {undefined}
     */

    function appendPrice() {

      let
          amount = '',
          markup,
          spanOuter = document.createElement('span'),
          threshold = resourceLibrary.options.threshold() || 0;

      $(target).find('.de-price-preloader').remove();

      // Debugging
      logOutput(percentage, difference, suggested);

      // No data from Discogs
      if ( !isFinite(percentage) ) {

        spanOuter.className = 'converted_price de-price';
        spanOuter.innerHTML = resourceLibrary.css.noData;

        $(target).append(spanOuter);

        return $(target).find('.de-price').hide().fadeIn(300);
      }

      // Less than suggested
      if ( percentage > threshold ) {

        amount = 'less';

      // More than suggested
      } else if ( percentage < -threshold ) {

        amount = 'more';

      // Within threshold
      } else {

        amount = '';
      }

      markup = createPriceMarkup(percentage, printPrice, amount);

      $(target).append(markup);

      // Fade in the results
      $(target).find('.de-price').hide().fadeIn(300);

      if ( amount !== 'more' && colorizePrices ) {

        $(target).find('.price').addClass('green');
      }
    }


    /**
     * Make sure the user has Seller permissions
     *
     * @method checkForSellerPermissions
     * @return {function | undefined}
     */

    function checkForSellerPermissions() {

      if (
           $(result).html(':contains("' + resourceLibrary.unregistered + '")')
           && !priceKey['post:suggestedPrices'] ) {

        $('.de-price-preloader').remove();

        $('td.item_price').each(function() {

          $(target).append(resourceLibrary.css.pleaseRegister);
        });

        return;
      }

      return generateComparison();
    }


    /**
     * Generates suggested price markup
     *
     * @method createPriceMarkup
     * @param  {number} perc The percentage of the price difference
     * @param  {string} printPri The suggested price
     * @param  {string} qt Either 'more', 'less' or ''
     * @return {object}
     */

    function createPriceMarkup(perc, printPri, qt) {

      let
          _class = qt === 'more' ? 'red' : 'green',
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
     *
     * @method generateComparison
     * @return {function}
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

      return appendPrice();
    }


    /**
     * Inject price comparisons
     *
     * @method getAndAppendPrice
     * @param  {string} releaseId The id of the release to look up
     * @param  {array.<object>} container The price/condition
     * @param  {object} targ The target element to gather info from
     * @return {undefined}
     */

    function getPrice(releaseId, container, targ) {

      $(targ).find('.de-price-link').remove();

      $(targ).append(resourceLibrary.css.pricePreloader);

      $.ajax({

        url:'https://www.discogs.com/sell/post/' + releaseId,
        type: 'GET',
        dataType: 'html',

        success: function(response) {

          result = $(response);
          nodeId = resourceLibrary.findNode(result);
          priceKey = resourceLibrary.prepareObj( $(result[nodeId]).prop('outerHTML') );

          // User does not have seller setup
          return checkForSellerPermissions();
        },

        error: function() {

          let s = document.createElement('span');

          s.className = 'd-block';
          s.textContent = 'Error getting price data.';

          $('.de-price-preloader').remove();

          $(targ).append(s);
        }
      });
    }


    /**
     * Insert preloader animation
     * (attached to window object to allow use with Everlasting Marketplace option)
     *
     * @method injectPriceLinks
     * @return {undefined}
     */

    window.injectPriceLinks = function injectPriceLinks() {

      let p = document.querySelectorAll('td.item_price');

      for ( let i = 0; i < p.length; i++ ) {

        let a = document.createElement('a');

        a.className = 'de-price-link';
        a.style = 'margin: 10px auto; display:block; font-weight: bold; white-space: pre;';
        a.textContent = 'Show Price\r\nComparison';

        // Only append price comparison links if they do not yet exist on each item
        if (
             p[i].getElementsByClassName('de-price-link').length < 1
             && p[i].getElementsByClassName('de-price').length < 1 ) {

          p[i].appendChild(a);
        }
      }
    };


    /**
     * Logs the values used to create the price comparison
     *
     * @method logOutput
     * @param  {number} perc percentage
     * @param  {number} diff difference
     * @param  {number} sugg suggested
     * @return {undefined}
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
      return;
    }


    // ========================================================
    // UI Functionality
    // ========================================================

    // init it a bit
    $('body').on('click', '.de-price-link', function(event) {

      let
          link = $(event.target),
          linkHref = link
                     .closest('.shortcut_navigable')
                     .children('.item_description')
                     .find('a.item_release_link')
                     .attr('href'),
          slash = linkHref.lastIndexOf('/') + 1,
          len = linkHref.length,
          itemCondition = link
                          .closest('.shortcut_navigable')
                          .children('.item_description')
                          .children('.item_condition')
                          .find('.condition-label-desktop:first').next().text().trim(),
          releaseId = linkHref.substring(slash, len),
          price = link.closest('.shortcut_navigable').find('.price').text();

      target = $(event.target).closest('.item_price');
      priceContainer = [{ price: price, mediaCondition: itemCondition }];

      getPrice(releaseId, priceContainer, target);
    });


    // Fire `injectPriceLinks` on prev/next page transitions
    let pagination = [...document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]')];

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(() => {

          if ($('.de-price-link').length < 1) {

            return window.injectPriceLinks();
          }
        });
      });
    });


    // ========================================================
    // Init / DOM Setup
    // ========================================================

    // Remove mobile clutter
    $('.hide_desktop').remove();

    // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
    $('.condition-label-mobile').remove();

    symbol = resourceLibrary.getSymbols(userCurrency, symbol);

    window.injectPriceLinks();
  }
});
