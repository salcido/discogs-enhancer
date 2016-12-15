/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      d = new Date(),
      debug = resourceLibrary.options.debug(),
      language = resourceLibrary.language(),
      today = d.toISOString().split('T')[0],
      updateRatesObj = resourceLibrary.getItem('updateRatesObj') || null,
      userCurrency = resourceLibrary.getItem('userCurrency');

  // Create our object if it does not exist
  if (!resourceLibrary.getItem('updateRatesObj')) {

    updateRatesObj = {
      currency: null,
      rates: null
    };

    // Save it...
    resourceLibrary.setItem('updateRatesObj', updateRatesObj);

    // Get it again because reasons
    updateRatesObj = resourceLibrary.getItem('updateRatesObj');
  }

  switch (true) {
    case !updateRatesObj.rates:
    case updateRatesObj.rates.date !== today:
    case typeof updateRatesObj.rates !== 'object':
    case userCurrency !== updateRatesObj.currency:

      // Remove old prices.
      // This will trigger a user alert if something tries to access
      // these rates before they have been returned from fixer.io
      updateRatesObj.rates = null;

      if (debug) {
        console.log(' ');
        console.log('Getting fresh rates... One moment please.');
      }

      $.ajax({

        url:'https://api.fixer.io/latest?base=' + userCurrency + '&symbols=AUD,CAD,CHF,EUR,SEK,ZAR,GBP,JPY,MXN,NZD,BRL,USD',

        type: 'GET',

        success: function(response) {

          updateRatesObj.rates = response;

          // set last saved currency,
          // if different from userCurrency will
          // trigger exchange rates update
          updateRatesObj.currency = userCurrency;

          if (debug) {

            console.log('*** Fresh rates ***');
            console.log('Last update:', updateRatesObj.rates.date, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
            console.log('rates', updateRatesObj.rates.rates);
          }

          // Save object to localStorage
          resourceLibrary.setItem('updateRatesObj', updateRatesObj);
        },

        error: function() {

          let errorMsg = 'Discogs Enhancer could not get currency exchange rates. Price comparisons may not be accurate. Please try again later.';

          console.log(errorMsg);
        }
      });

      break;

  default:

    if (debug) {

      console.log(' ');
      console.log('Discogs Enhancer: Using cached rates:', updateRatesObj.rates.date, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
      console.log('rates', updateRatesObj.rates);
    }

    break;
  }

  // Store user's lagnuage preference
  resourceLibrary.setItem('language', language);
});
