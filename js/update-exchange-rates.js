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
      d = new Date(),
      language = $('#i18n_select option:selected').val(),
      lastChecked = localStorage.getItem('lastChecked'),
      currency = localStorage.getItem('currency'),
      rates = JSON.parse(localStorage.getItem('rates')),
      today = d.toISOString().split('T')[0],
      userCurrency = localStorage.getItem('userCurrency');

    if (!rates || !lastChecked || lastChecked !== today || typeof rates !== 'object' || userCurrency !== currency) {

      localStorage.setItem('rates', null);

      console.log('Discogs Enhancer: Getting fresh rates. Last update:', lastChecked, 'Currency:', userCurrency);

      $.ajax({

        url:'https://api.fixer.io/latest?base=' + userCurrency + '&symbols=AUD,CAD,CHF,EUR,SEK,ZAR,GBP,JPY,MXN,NZD,BRL,USD',

        type: 'GET',

        success: function(ratesObj) {

          localStorage.setItem('rates', JSON.stringify(ratesObj));

          rates = JSON.parse(localStorage.getItem('rates'));

          localStorage.setItem('lastChecked', today);

          // set last saved currency,
          // if different from userCurrency will
          // trigger exchange rates update
          localStorage.setItem('currency', userCurrency);
        },

        error: function() {

          let errorMsg = 'Discogs Enhancer could not get currency exchange rates. Price comparisons may not be accurate. Please try again later.';

          resourceLibrary.appendNotice(errorMsg);
        }
      });

    } else {

      if (resourceLibrary.options.debug) {

        console.log('Discogs Enhancer: Using cached rates:', lastChecked, ' ', 'language:', language, 'Currency:', userCurrency);
      }
    }

    // Store user's lagnuage preference
    localStorage.setItem('language', language);
});
