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
 * This feature will compare the listed prices of a release with the prices
 * suggested by Discogs.
 *
 * The script is initiated with the code that follows the `Init / DOM setup` comment block.
 *
 */

$(document).ready(function() {

  let href = window.location.href;

  if ( href.includes('/sell/release/') ) {

    let
        extract,
        items,
        nodeId,
        priceContainer = [],
        priceKey = {},
        prices,
        releaseId,
        result,
        symbol,
        userCurrency = resourceLibrary.getItem('userCurrency');

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Calculates all the prices and appends them to the DOM
     * @method getAndAppendPrices
     * @return {function|undefined}
     */

    function appendPrices() {

      // Insert price comparisons into each item on the page...
      $('td.item_price').each(function(j) {

        let
            actual = priceContainer[j].convertedPrice,
            colorizePrices = resourceLibrary.options.colorize(),
            suggested = priceKey['post:suggestedPrices'][priceContainer[j].mediaCondition],
            difference = suggested - actual,
            //
            amount = '',
            markup,
            percentage = ( (difference / suggested) * 100 ).toFixed(0),
            printPrice = resourceLibrary.localizeSuggestion(symbol, suggested),
            spanOuter = document.createElement('span'),
            threshold = resourceLibrary.options.threshold() || 0;

        $('.de-preloader').remove();

        if ( resourceLibrary.options.debug() ) {

          let pAmt = percentage > 0 ? '% less' : '% more',
              pct = Math.abs(percentage),
              value = Math.abs(difference).toFixed(3),
              vAmt = difference > 0 ? ' less' : ' more';

          console.log('Suggested: ', suggested);
          console.log('Difference: ', value + ' ' + userCurrency + vAmt);
          console.log('Percentage: ', pct + pAmt);
        }

        // No data from Discogs
        // ---------------------------------------------------------------------------
        if ( !isFinite(percentage) ) {

          spanOuter.className = 'converted_price de-price';
          spanOuter.innerHTML = resourceLibrary.css.noData;

          $(this).append(spanOuter);

          return $(this).find('.de-price').hide().fadeIn(300);
        }

        // Less than suggested
        // ---------------------------------------------------------------------------
        if ( percentage > threshold ) {

          amount = 'less';

        // More than suggested
        // ---------------------------------------------------------------------------
        } else if ( percentage < -threshold ) {

          amount = 'more';

        // Within threshold
        // ---------------------------------------------------------------------------
        } else {

          amount = '';
        }

        markup = makePriceMarkup(percentage, printPrice, amount);

        $(this).append(markup);

        // Fade in the results
        $(this).find('.de-price').hide().fadeIn(300);

        if ( amount !== 'more' && colorizePrices ) {

          $(this).find('.price').addClass('green');
        }
      });
    }


    /**
     * Make sure the user has Seller permissions
     * @method checkForSellerPermissions
     * @return {function | undefined}
     */

    function checkForSellerPermissions() {

      // User does not have seller setup
      if (
           $(result).html(':contains("' + resourceLibrary.unregistered + '")')
           && !priceKey['post:suggestedPrices'] ) {

        $('.de-preloader').remove();

        $('td.item_price').each(function() {

          $(this).append(resourceLibrary.css.pleaseRegister);
        });

        return;
      }

      return getPrices();
    }


    /**
     * Collects the prices / conditions from the DOM
     * @method getPrices
     * @return {function}
     */

    function getPrices() {

      // Grab price / condition data from elements
      prices.each(function(i) {

        priceContainer.push({price: prices[i].textContent, mediaCondition: items[i]}); }
      );

      resourceLibrary.matchSymbols(priceContainer);
      resourceLibrary.sanitizePrices(priceContainer);
      resourceLibrary.convertPrices(priceContainer);

      symbol = resourceLibrary.getSymbols(userCurrency, symbol);

      return appendPrices();
    }


    /**
     * Starts price comparison process
     * @method init
     * @return {function}
     */

    function init() {

      $.ajax({

        url:'https://www.discogs.com/sell/post/' + releaseId,
        type: 'GET',
        dataType: 'html',

        success: function(response) {

          // Clear out old prices if they exist
          $('.de-price').remove();

          // Reset our values
          // Pulls the condition from the tooltip.
          if ( $('.media-condition-tooltip').length ) {

            items = $('.shortcut_navigable .item_description .media-condition-tooltip').map(function() {
                          return $(this).data('condition');
                      }).get();
          } else {
            // If the tooltip is missing, find the Media Condition via span:nth-child(2)
            items = $('.shortcut_navigable .item_description .item_condition span:nth-child(2)').map(function() {
                        return $(this).text().trim();
                      });
          }


          priceContainer = [];

          prices = $('td.item_price span.price');

          result = $(response);

          nodeId = resourceLibrary.findNode(result);

          priceKey = resourceLibrary.prepareObj( $(result[nodeId]).prop('outerHTML') );

          return checkForSellerPermissions();
        }
      });
    }


    /**
     * Generates suggested price markup
     * @method makePriceMarkup
     * @param  {number} percentage The percentage of the price difference
     * @param  {string} printPrice The suggested price
     * @param  {string} qt Either 'more', 'less' or ''
     * @return {object}
     */

    function makePriceMarkup(percentage, printPrice, qt) {

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

      spanPct.textContent = `${plusmn} ${Math.abs(percentage)}% ${qt}`;
      spanPct.className = _class;

      spanSug.textContent = 'than suggested:';
      spanSug.className = 'd-block';

      spanPrice.textContent = printPrice;

      spanOuter.append(spanPct);
      spanOuter.append(spanSug);
      spanOuter.append(spanPrice);

      return spanOuter;
    }


    // ========================================================
    // UI Functionality
    // ========================================================

    // Fire init() on prev/next page transitions
    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        // Only append prices once
        if ( !$('.de-price').length ) {

          init();
        }
      });
    });


    // ========================================================
    // Init / DOM setup
    // ========================================================

    // Remove mobile clutter
    $('.hide_desktop').remove();

    // Insert preloader animation
    $('td.item_price').each(function() {

      $(this).append(resourceLibrary.css.preloader);
    });

    // Grab the releaseId from the URL
    extract = href.match(/([\d]+)/g);
    releaseId = extract[0];

    init();
  }
});
