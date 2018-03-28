
/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {

  let
      d = new Date(),
      debug = resourceLibrary.options.debug(),
      language = resourceLibrary.language(),
      today = d.toISOString().split('T')[0],
      updateRatesObj = resourceLibrary.getItem('updateRatesObj') || setUpdateRatesObj(),
      userCurrency = resourceLibrary.getItem('userCurrency');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Sets the default currency object values
   *
   * @method setUpdateRatesObj
   * @return {object}
   */
  function setUpdateRatesObj() {

    let obj = {
      currency: null,
      rates: null
    };

    // Save it...
    resourceLibrary.setItem('updateRatesObj', obj);

    // Get it again because reasons
    return resourceLibrary.getItem('updateRatesObj');
  }

  /**
   * Updates the exchange rates from Fixer.io
   *
   * @method updateRates
   * @return {object}
   */
  async function updateRates() {

    let url = `https://api.fixer.io/latest?base=${userCurrency}&symbols=AUD,CAD,CHF,EUR,SEK,ZAR,GBP,JPY,MXN,NZD,BRL,USD`;

    try {

      let response = await fetch(url),
          data = await response.json();

      updateRatesObj.rates = data;

      // Set last saved currency
      // If different from userCurrency it will trigger exchange rates update
      updateRatesObj.currency = userCurrency;

      if ( debug ) {

        console.log('*** Fresh rates ***');
        console.log('Last update:', updateRatesObj.rates.date, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
        console.log('rates', updateRatesObj.rates.rates);
      }

      // Save object to localStorage
      resourceLibrary.setItem('updateRatesObj', updateRatesObj);
      updateRatesObj = resourceLibrary.getItem('updateRatesObj');

    } catch (err) {
      return console.log('Discogs Enhancer could not get currency exchange rates. Price comparisons may not be accurate. Please try again later.', err);
    }
  }

  // ========================================================
  // Update functionality
  // ========================================================

  switch (true) {

    // if there's no rates prop it could
    // mean possible data corruption
    case !updateRatesObj.rates:
    case typeof updateRatesObj.rates !== 'object':

      // kill it with fire
      localStorage.removeItem('updateRatesObj');
      updateRatesObj = setUpdateRatesObj();
      updateRates();
      break;

    // Data is stale or user has changed currency
    case updateRatesObj.rates.date !== today:
    case userCurrency !== updateRatesObj.currency:

      // Remove old prices.
      // This will trigger a user alert if something tries to access
      // these rates before they have been returned from fixer.io
      updateRatesObj.rates = null;

      if (debug) {
        console.log(' ');
        console.log('Getting fresh rates... One moment please.');
      }

      updateRates();
      break;

  default:

    if ( debug ) {

      console.log(' ');
      console.log('Discogs Enhancer: Using cached rates:', updateRatesObj.rates.date, ' ', 'language:', language, ' ', 'Currency:', userCurrency);
      console.log('rates', updateRatesObj.rates);
    }

    break;
  }

  // Store user's language preference
  resourceLibrary.setItem('language', language);
});
