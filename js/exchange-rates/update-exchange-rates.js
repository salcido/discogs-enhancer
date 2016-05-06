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
      currency = resourceLibrary.getItem('currency'),
      d = new Date(),
      language = resourceLibrary.language(),
      lastChecked = resourceLibrary.getItem('lastChecked'),
      debug = resourceLibrary.options.debug(),
      rates = resourceLibrary.getItem('rates'),
      today = d.toISOString().split('T')[0],
      userCurrency = resourceLibrary.getItem('userCurrency', 'string');

    if (!rates || !lastChecked || lastChecked !== today || typeof rates !== 'object' || userCurrency !== currency) {

      resourceLibrary.setItem('rates', null);

      if (debug) {
        console.log(' ');
        console.log('Getting fresh rates... One moment please.');
      }

      $.ajax({

        url:'https://api.fixer.io/latest?base=' + userCurrency + '&symbols=AUD,CAD,CHF,EUR,SEK,ZAR,GBP,JPY,MXN,NZD,BRL,USD',

        type: 'GET',

        success: function(ratesObj) {

          resourceLibrary.setItem('rates', ratesObj);

          rates = resourceLibrary.getItem('rates');

          resourceLibrary.setItem('lastChecked', today);

          // set last saved currency,
          // if different from userCurrency will
          // trigger exchange rates update
          resourceLibrary.setItem('currency', userCurrency);

          if (debug) {

            console.log('*** Fresh rates ***');
            console.log('Last update:', lastChecked, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
            console.log('rates', resourceLibrary.getItem('rates'));
          }
        },

        error: function() {

          let errorMsg = 'Discogs Enhancer could not get currency exchange rates. Price comparisons may not be accurate. Please try again later.';

          resourceLibrary.appendNotice(errorMsg, 'orange');
        }
      });

    } else {

      if (debug) {

        console.log(' ');
        console.log('Discogs Enhancer: Using cached rates:', lastChecked, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
        console.log('rates', resourceLibrary.getItem('rates'));
      }
    }

    // Store user's lagnuage preference
    resourceLibrary.setItem('language', language);
});
