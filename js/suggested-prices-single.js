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
        userCurrency = localStorage.getItem('userCurrency');

    // Insert preloader animation
    function injectPriceLinks() {

      let p = document.querySelectorAll('td.item_price');

      for (let i = 0; i < p.length; i++) {

        let a = document.createElement('a');

        a.className = 'de-price-link';

        a.style = 'margin: 10px auto; display:block; font-weight: bold;';

        a.innerHTML = 'Show Price<br>Comparison';

        p[i].appendChild(a);
      }
    }

    // Inject price comparisons
    function getAndAppendPrice(releaseId, container, target) {

      let
          adj = '',
          border = resourceLibrary.css.border,
          color = '',
          green = resourceLibrary.css.colors.green,
          red = resourceLibrary.css.colors.red,
          //
          actual,
          suggested,
          difference,
          percentage;

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
          actual = priceContainer[0].convertedPrice.toFixed(2);

          suggested = priceKey['post:suggestedPrices'][priceContainer[0].mediaCondition].toFixed(2);

          difference = suggested - actual;

          percentage = ( (difference / suggested) * 100 ).toFixed(0);

          $(target).find('.de-preloader').remove();

          // Append text to DOM
          if (percentage > 2) {

            difference = (suggested - actual).toFixed(2);

            color = green;

            adj = ' less';

            $(target).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + symbol + suggested);

            $(target).find('.de-price').hide().fadeIn(300);

          } else if (percentage < -2) {

            difference = (actual - suggested).toFixed(2);

            color = red;

            adj = ' more';

            $(target).append('<span class="converted_price de-price" ' + border + '">around <span style="color:' + color + '!important; font-weight:bold;">' + Math.abs(percentage) + '%' + adj + '</span><br>' + 'than suggested: <br>' + symbol + suggested);

            $(target).find('.de-price').hide().fadeIn(300);

          } else {

            color = green;

            $(target).append('<span class="converted_price de-price" ' + border + '">about <span style="color:' + color + '!important; font-weight:bold;"> the same price</span><br>' + 'as suggested: <br>' + symbol + suggested);

            $(target).find('.de-price').hide().fadeIn(300);
          }
        },

        error: function() {

          resourceLibrary.appendNotice('Discogs Enhancer: There was an error getting price data. Please try again later.');
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
                          .find('span.item_media_condition')
                          .text(),
          releaseId = linkHref.substring(slash, len),
          price = link.closest('.shortcut_navigable').find('.price').html(),
          target = $(event.target).closest('.item_price');

          priceContainer = [{
                              price: price,
                              mediaCondition: itemCondition
                           }];

      getAndAppendPrice(releaseId, priceContainer, target);
    });


    // Fire `injectPriceLinks` on prev/next page transitions
    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        if ($('.de-price-link').length < 1) {

          return injectPriceLinks();
        }
      });
    });

    // Remove mobile clutter
    $('.hide_desktop').remove();

    symbol = resourceLibrary.getSymbols(userCurrency, symbol);

    injectPriceLinks();
  }
});
