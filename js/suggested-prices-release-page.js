/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */


$(document).ready(function() {

  let loc = window.location.href;

  if (loc.indexOf('/sell/release/') > -1) {

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

    // Insert preloader animation
    $('td.item_price').each(function(j) {

      $(this).append(resourceLibrary.css.preloader);
    });


    function getAndAppendPrices() {

      prices.each(function(i) {
        priceContainer.push({price: prices[i].textContent, mediaCondition: items[i]}); }
      );

      resourceLibrary.matchSymbols(priceContainer);
      resourceLibrary.sanitizePrices(priceContainer);
      resourceLibrary.convertPrices(priceContainer);

      symbol = resourceLibrary.getSymbols(userCurrency, symbol);

      // Draxx them sklounst
      $('td.item_price').each(function(j) {

        let
            actual = priceContainer[j].convertedPrice,
            adj = '',
            border = resourceLibrary.css.border,
            color = '',
            colorizePrices = resourceLibrary.options.colorize(),
            green = resourceLibrary.css.colors.green,
            red = resourceLibrary.css.colors.red,
            //
            threshold = resourceLibrary.options.threshold() || 0,
            suggested = priceKey['post:suggestedPrices'][priceContainer[j].mediaCondition],
            difference = suggested - actual,
            printPrice = resourceLibrary.localizePrice(symbol, suggested),
            percentage = ( (difference / suggested) * 100 ).toFixed(0);

        $('.de-preloader').remove();

        if (resourceLibrary.options.debug()) {

          console.log('Suggested: ', suggested);
          console.log('Difference: ', difference > 0 ? Math.abs(difference).toFixed(3) + ' ' + userCurrency + ' less' : Math.abs(difference).toFixed(3) + ' ' + userCurrency + ' more');
          console.log('Percentage: ', percentage > 0 ? Math.abs(percentage) + '% less' : Math.abs(percentage) + '% more');
        }

        // No data from Discogs
        if (!isFinite(percentage)) {

          $(this).append('<span class="converted_price de-price" ' + border + '">' + resourceLibrary.css.noData + '<span style="color:' + color + '!important; font-weight:bold;">');

          return $(this).find('.de-price').hide().fadeIn(300);
        }

        // Less than suggested
        if (percentage > threshold) {

          difference = (suggested - actual).toFixed(2);

          color = green;

          adj = ' less';

          $(this).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + printPrice);

          $(this).find('.de-price').hide().fadeIn(300);

          if (colorizePrices) {

            $(this).find('.price').attr('style', 'color: ' + green + '!important; transition: color 0.3s ease-in-out;');
          }

        // More than suggested
        } else if (percentage < -threshold) {

          difference = (actual - suggested).toFixed(2);

          color = red;

          adj = ' more';

          $(this).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + printPrice);

          $(this).find('.de-price').hide().fadeIn(300);

        // Within threshold
        } else {

          color = green;

          $(this).append('<span class="converted_price de-price" ' + border + '">within <span style="color:' + color + '!important; font-weight:bold;">&plusmn; ' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'of suggested: <br>' + printPrice);

          $(this).find('.de-price').hide().fadeIn(300);

          if (colorizePrices) {

            $(this).find('.price').attr('style', 'color: ' + green + '!important; transition: color 0.3s ease-in-out;');
          }
        }
      });
    }


    // Append results or seller message to items
    function checkForSellerPermissions() {

      // User does not have seller setup
      if ($(result).html(':contains("' + resourceLibrary.unregistered + '")') && !priceKey['post:suggestedPrices']) {

        $('.de-preloader').remove();

        $('td.item_price').each(function(j) {

          $(this).append(resourceLibrary.css.pleaseRegister);
        });

        return;
      }

      getAndAppendPrices();
     }


    // Starts price comparison process
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
          if ($('.media-condition-tooltip').length) {

            items = $('.shortcut_navigable .item_description .media-condition-tooltip').map(function() {
                          return $(this).data('condition');
                      }).get();
          } else {
            //If the tooltip is missing, find the Media Condition via span:nth-child(2)
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


    // Fire init() on prev/next page transitions
    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        // Only append prices once
        if (!$('.de-price').length) {

          init();
        }
      });
    });

    // Remove mobile garbage
    $('.hide_desktop').remove();

    extract = loc.match(/([\d]+)/g);

    releaseId = extract[0];

    init();
  }
});
