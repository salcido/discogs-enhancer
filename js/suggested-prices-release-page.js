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
        convertedPrices,
        exchangeArray,
        extract,
        itemConditions,
        itemPrices,
        items,
        nodeId,
        priceObj = {},
        prices,
        releaseId,
        result,
        sanitizedPrices,
        symbol,
        userCurrency = localStorage.getItem('userCurrency');

    // Remove mobile garbage
    $('.hide_desktop').remove();

    extract = loc.match(/([\d]+)/g);

    releaseId = extract[0];


    // Insert preloader animation
    $('td.item_price').each(function(j) {

      $(this).append(resourceLibrary.css.preloader);
    });


    function getAndAppendPrices() {

      prices.each(function(i) { itemPrices.push(prices[i].innerHTML); });

      items.each(function(i) { itemConditions.push(items[i].innerHTML); });

      resourceLibrary.matchSymbols(itemPrices, exchangeArray);

      resourceLibrary.sanitizePrices(itemPrices, sanitizedPrices, null);

      convertedPrices = resourceLibrary.convertPrices(convertedPrices, exchangeArray, sanitizedPrices);

      symbol = resourceLibrary.getSymbols(userCurrency, symbol);


      // Draxx them sklounst
      $('td.item_price').each(function(j) {

        let
            actual = convertedPrices[j].toFixed(2),
            adj = '',
            border = resourceLibrary.css.border,
            color = '',
            green = resourceLibrary.css.colors.green,
            red = resourceLibrary.css.colors.red,
            suggested = priceObj['post:suggestedPrices'][itemConditions[j]].toFixed(2),
            difference = suggested - actual,
            percentage = ( (difference / suggested) * 100 ).toFixed(0);

        $('.de-preloader').remove();

        if (percentage > 2) {

          difference = (suggested - actual).toFixed(2);

          color = green;

          adj = ' less';

          $(this).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + symbol + suggested);

          $(this).find('.de-price').hide().fadeIn(300);

        } else if (percentage < -2) {

          difference = (actual - suggested).toFixed(2);

          color = red;

          adj = ' more';

          $(this).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + symbol + suggested);

          $(this).find('.de-price').hide().fadeIn(300);

        } else {

          color = green;

          $(this).append('<span class="converted_price de-price" ' + border + '">about <span style="color:' + color + '!important; font-weight:bold;"> the same price</span><br>' + 'as suggested: <br>' + symbol + suggested);

          $(this).find('.de-price').hide().fadeIn(300);
        }
      });
    }


    // Append results or seller message to items
    function checkForSellerPermissions() {

      // User does not have seller setup
      if ($(result).html(':contains("' + resourceLibrary.unregistered + '")') && !priceObj['post:suggestedPrices']) {

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
          convertedPrices = [];
          exchangeArray = [];
          itemConditions = [];
          itemPrices = [];
          items = $('.shortcut_navigable .item_description .item_condition span.item_media_condition');
          prices = $('td.item_price span.price');
          sanitizedPrices = [];

          result = $(response);

          nodeId = resourceLibrary.findNode(result);

          priceObj = resourceLibrary.prepareObj( $(result[nodeId]).prop('outerHTML') );

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

    init();
  }
});
