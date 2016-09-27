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

  let
      loc = window.location.href,
      wantlist = loc.indexOf('/sell/mywants'),
      allItems = loc.indexOf('/sell/list'),
      seller = loc.indexOf('/seller/');

  if (wantlist > -1 || allItems > -1 || seller > -1) {

    let
        nodeId,
        priceContainer,
        priceKey,
        result,
        symbol,
        userCurrency = resourceLibrary.getItem('userCurrency');

    // Insert preloader animation
    // attached to window object to allow use with
    // Everlasting Marketplace option
    window.injectPriceLinks = function injectPriceLinks() {

      let p = document.querySelectorAll('td.item_price');

      for (let i = 0; i < p.length; i++) {

        let a = document.createElement('a');

        a.className = 'de-price-link';
        a.style = 'margin: 10px auto; display:block; font-weight: bold;';
        a.innerHTML = 'Show Price<br>Comparison';

        if (p[i].getElementsByClassName('de-price-link').length < 1) {

          p[i].appendChild(a);
        }
      }
    };

    // Inject price comparisons
    function getAndAppendPrice(releaseId, container, target) {

      let
          adj = '',
          border = resourceLibrary.css.border,
          color = '',
          colorizePrices = resourceLibrary.options.colorize(),
          green = resourceLibrary.css.colors.green,
          red = resourceLibrary.css.colors.red,
          //
          threshold = resourceLibrary.options.threshold() || 0,
          actual,
          suggested,
          difference,
          percentage,
          printPrice;

      $(target).find('.de-price-link').remove();

      $(target).append(resourceLibrary.css.preloader);

      $.ajax({

        url:'https://www.discogs.com/sell/post/' + releaseId,

        type: 'GET',

        dataType: 'html',

        success: function(response) {

          result = $(response);
          nodeId = resourceLibrary.findNode(result);
          priceKey = resourceLibrary.prepareObj( $(result[nodeId]).prop('outerHTML') );

          // User does not have seller setup
          if ($(result).html(':contains("' + resourceLibrary.unregistered + '")') && !priceKey['post:suggestedPrices']) {

            $('.de-preloader').remove();

            $(target).append(resourceLibrary.css.pleaseRegister);

            return;
          }

          resourceLibrary.matchSymbols(priceContainer);
          resourceLibrary.sanitizePrices(priceContainer);
          resourceLibrary.convertPrices(priceContainer);

          // Set up comparions values
          actual = priceContainer[0].convertedPrice;

          suggested = priceKey['post:suggestedPrices'][priceContainer[0].mediaCondition];

          difference = suggested - actual;

          percentage = ( (difference / suggested) * 100 ).toFixed(0);

          printPrice = resourceLibrary.localizePrice(symbol, suggested);

          $(target).find('.de-preloader').remove();

          if (resourceLibrary.options.debug()) {

            console.log('Suggested: ', suggested);

            console.log('Difference: ', difference > 0 ? Math.abs(difference).toFixed(3) + ' ' + userCurrency + ' less' : Math.abs(difference).toFixed(3) + ' ' + userCurrency + ' more');

            console.log('Percentage: ', percentage > 0 ? Math.abs(percentage) + '% less' : Math.abs(percentage) + '% more');
          }

          // No data from Discogs
          if (!isFinite(percentage)) {

            $(target).append('<span class="converted_price de-price" ' + border + '">' + resourceLibrary.css.noData + '<span style="color:' + color + '!important; font-weight:bold;">');

            return $(target).find('.de-price').hide().fadeIn(300);
          }

          // Less than suggested
          if (percentage > threshold) {

            difference = (suggested - actual).toFixed(2);

            color = green;

            adj = ' less';

            $(target).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + printPrice);

            $(target).find('.de-price').hide().fadeIn(300);

            if (colorizePrices) {

              $(target).find('.price').attr('style', 'color: ' + green + '!important; transition: color 0.3s ease-in-out;');
            }

          // More than suggested
          } else if (percentage < -threshold) {

            difference = (actual - suggested).toFixed(2);

            color = red;

            adj = ' more';

            $(target).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + printPrice);

            $(target).find('.de-price').hide().fadeIn(300);

          // Within threshold
          } else {

            color = green;

            $(target).append('<span class="converted_price de-price" ' + border + '">within <span style="color:' + color + '!important; font-weight:bold;">&plusmn; ' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'of suggested: <br>' + printPrice);

            $(target).find('.de-price').hide().fadeIn(300);

            if (colorizePrices) {

              $(target).find('.price').attr('style', 'color: ' + green + '!important; transition: color 0.3s ease-in-out;');
            }
          }
        },

        error: function() {

          console.log('There was an error getting price data. Please try again later.');
        }
      });
    }


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
          price = link.closest('.shortcut_navigable').find('.price').html(),
          target = $(event.target).closest('.item_price');

          priceContainer = [{ price: price, mediaCondition: itemCondition }];

      getAndAppendPrice(releaseId, priceContainer, target);
    });


    // Fire `injectPriceLinks` on prev/next page transitions
    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        if ($('.de-price-link').length < 1) {

          return window.injectPriceLinks();
        }
      });
    });

    // Remove mobile clutter
    $('.hide_desktop').remove();

    symbol = resourceLibrary.getSymbols(userCurrency, symbol);

    window.injectPriceLinks();
  }
});
