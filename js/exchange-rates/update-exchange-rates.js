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
      updateRatesObj = resourceLibrary.getItem('updateRatesObj') || null,
      d = new Date(),
      language = resourceLibrary.language(),
      debug = resourceLibrary.options.debug(),
      today = d.toISOString().split('T')[0],
      userCurrency = resourceLibrary.getItem('userCurrency');

  // Create our object if it does not exist
  if (!resourceLibrary.getItem('updateRatesObj')) {

    updateRatesObj = {
      currency: null,
      lastChecked: null,
      rates: null
    };

    // Save it...
    resourceLibrary.setItem('updateRatesObj', updateRatesObj);

    // Get it...
    updateRatesObj = resourceLibrary.getItem('updateRatesObj');
  }

  switch (true) {

    case !updateRatesObj.rates:
    case !updateRatesObj.lastChecked:
    case updateRatesObj.lastChecked !== today:
    case typeof updateRatesObj.rates !== 'object':
    case userCurrency !== updateRatesObj.currency:

      // Remove old prices
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

          updateRatesObj.lastChecked = today;

          // set last saved currency,
          // if different from userCurrency will
          // trigger exchange rates update
          updateRatesObj.currency = userCurrency;

          if (debug) {

            console.log('*** Fresh rates ***');
            console.log('Last update:', updateRatesObj.lastChecked, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
            console.log('rates', updateRatesObj.rates.rates);
          }

          // Save object to localStorage
          resourceLibrary.setItem('updateRatesObj', updateRatesObj);
        },

        error: function() {

          let errorMsg = 'Discogs Enhancer could not get currency exchange rates. Price comparisons may not be accurate. Please try again later.';

          resourceLibrary.appendNotice(errorMsg, 'orange');
        }
      });

      break;

  default:

    if (debug) {

      console.log(' ');
      console.log('Discogs Enhancer: Using cached rates:', updateRatesObj.lastChecked, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
      console.log('rates', updateRatesObj.rates);
    }

    break;
  }

  // Store user's lagnuage preference
  resourceLibrary.setItem('language', language);
});
