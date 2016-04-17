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

  let unitTests = resourceLibrary.options.unitTests;

  if (unitTests) {

    /**
     * Price conversion tests
     */
    let
        priceObjJPY = {},

        priceObjUSD = {},

        priceObjEUR = {},

        priceContainerJPY = [],

        priceContainerUSD = [],

        priceContainerEUR = [],

      USD = {
         base:'USD',
         date:'2016-04-15',
         rates:{
            AUD: 1.2981,
            BRL: 3.4905,
            CAD: 1.2881,
            CHF: 0.96765,
            GBP: 0.7052,
            JPY: 108.92,
            MXN: 17.54,
            NZD: 1.4475,
            SEK: 8.1445,
            ZAR: 14.571,
            EUR: 0.88621
         }
      },

      EUR = {
      	base: 'EUR',
      	date: '2016-04-15',
      	rates: {
      		AUD: 1.4648,
      		BRL: 3.9387,
      		CAD: 1.4535,
      		CHF: 1.0919,
      		GBP: 0.79575,
      		JPY: 122.91,
      		MXN: 19.7927,
      		NZD: 1.6334,
      		SEK: 9.1902,
      		USD: 1.1284,
      		ZAR: 16.4424
      	}
      },

      JPY = {
      	base: 'JPY',
      	date: '2016-04-15',
      	rates: {
      		AUD: 0.011918,
      		BRL: 0.032045,
      		CAD: 0.011826,
      		CHF: 0.0088837,
      		GBP: 0.0064742,
      		MXN: 0.16103,
      		NZD: 0.013289,
      		SEK: 0.074772,
      		USD: 0.0091807,
      		ZAR: 0.13378,
      		EUR: 0.008136
      	}
      };

    function resetPriceObjs() {

      priceObjJPY = {
         mediaCondition: 'Mint (M)',
         price: '¥1000'
      };

      priceObjUSD = {
         mediaCondition: 'Mint (M)',
         price: '$10.00'
      };

      priceObjEUR = {
         mediaCondition: 'Mint (M)',
         price: '€10.00'
      };

      priceContainerJPY = [priceObjJPY];

      priceContainerUSD = [priceObjUSD];

      priceContainerEUR = [priceObjEUR];
    }

    console.log('/// Testing convertPrices method ///');

    /* JPY to USD */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerJPY);

    resourceLibrary.sanitizePrices(priceContainerJPY);

    let convertJPYtoUSD = resourceLibrary.convertPrices(priceContainerJPY, USD);

    let resultJPYtoUSD = (convertJPYtoUSD[0].convertedPrice === 9.18105031215571);

    if (resultJPYtoUSD) {

      console.log('%c PASSED ', 'color: limegreen', '1000 JPY to USD result: ', convertJPYtoUSD[0].convertedPrice);

    } else {

      console.log( '%c FAILED ', 'color: deeppink', '1000 JPY to USD result: ', convertJPYtoUSD[0].convertedPrice);
    }


    /* USD to JPY */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerUSD);

    resourceLibrary.sanitizePrices(priceContainerUSD);

    var convertUSDtoJPY = resourceLibrary.convertPrices(priceContainerUSD, JPY);

    let resultUSDtoJPY = (convertUSDtoJPY[0].convertedPrice === 1089.2415611010053);

    if (resultUSDtoJPY) {

      console.log('%c PASSED ', 'color: limegreen', '10.00 USD to JPY result: ', convertUSDtoJPY[0].convertedPrice);

    } else {

      console.log( '%c FAILED ', 'color: deeppink', '10.00 USD to JPY result: ', convertUSDtoJPY[0].convertedPrice);
    }


    /* USD to EUR */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerUSD);

    resourceLibrary.sanitizePrices(priceContainerUSD);

    let convertUSDtoEUR = resourceLibrary.convertPrices(priceContainerUSD, EUR);

    let resultUSDtoEUR = (convertUSDtoEUR[0].convertedPrice === 8.862105636299184);

    if (resultUSDtoEUR) {

      console.log('%c PASSED ', 'color: limegreen', '10.00 USD to EUR result: ', convertUSDtoEUR[0].convertedPrice);

    } else {

      console.log( '%c FAILED ', 'color: deeppink', '10.00 USD to EUR result: ', convertUSDtoEUR[0].convertedPrice);
    }


    /* EUR to USD */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerEUR);

    resourceLibrary.sanitizePrices(priceContainerEUR);

    let convertEURtoUSD = resourceLibrary.convertPrices(priceContainerEUR, USD);

    let resultEURtoUSD = (convertEURtoUSD[0].convertedPrice === 11.284007176628563);

    if (resultEURtoUSD) {

      console.log('%c PASSED ', 'color: limegreen', '10.00 EUR to USD result: ', convertEURtoUSD[0].convertedPrice);

    } else {

      console.log( '%c FAILED ', 'color: deeppink', '10.00 EUR to USD result: ', convertEURtoUSD[0].convertedPrice);
    }

    /**
     * localizePrice tests
     */

    let
        priceUSD,
        priceJPY,
        priceEUR;

    console.log('/// Testing localizePrice method ///');

    /* USD */
    priceUSD = resourceLibrary.localizePrice('$', '10.00', 'USD', 'en');

    if (priceUSD === '$10.00' && typeof priceUSD === 'string') {

      console.log('%c PASSED ', 'color: limegreen', 'US localizePrice: ', priceUSD);

    } else {

      console.log( '%c FAILED ', 'color: deeppink', 'US localizePrice should be $10.00, value returned was: ', priceUSD);
    }

    /* EUR */
    priceEUR = resourceLibrary.localizePrice('€', '10.00', 'EUR', 'de');

    if (priceEUR === '10,00 €' && typeof priceEUR === 'string') {

      console.log('%c PASSED ', 'color: limegreen', 'DE localizePrice: ', priceEUR);

    } else {

      console.log( '%c FAILED ', 'color: deeppink', 'DE localizePrice should be 10,00 €, value returned was: ', priceEUR);
    }

    /* JPY */
    priceJPY = resourceLibrary.localizePrice('¥', '1000', 'JPY', 'ja');

    if (priceJPY === '¥1,000' && typeof priceJPY === 'string') {

      console.log('%c PASSED ', 'color: limegreen', 'JA localizePrice: ', priceJPY);

    } else {

      console.log( '%c FAILED ', 'color: deeppink', 'JA localizePrice should be ¥1,000, value returned was: ', priceJPY);
    }
  }

  /**
   * sanitizePrices tests
   */

  let
      sanitizeJPY = [{price: '¥1,000'}],
      sanitizeEUR = [{price: '10,00 €'}],
      sanitizeUSD = [{price: '$10.99'}];

  console.log('/// Testing sanitizePrices method ///');

  /* JPY */
  resourceLibrary.sanitizePrices(sanitizeJPY);

  if (sanitizeJPY[0].sanitizedPrice === '1000' && typeof sanitizeJPY[0].sanitizedPrice === 'string') {

    console.log('%c PASSED ', 'color: limegreen', 'JPY sanitized price: ', sanitizeJPY[0].sanitizedPrice);

  } else {

    console.log( '%c FAILED ', 'color: deeppink', 'JPY sanitized price 1000, value returned was: ', sanitizeJPY[0].sanitizedPrice);
  }

  /* EUR */
  resourceLibrary.sanitizePrices(sanitizeEUR);

  if (sanitizeEUR[0].sanitizedPrice === '1000' && typeof sanitizeEUR[0].sanitizedPrice === 'string') {

    console.log('%c PASSED ', 'color: limegreen', 'EUR sanitized price: ', sanitizeEUR[0].sanitizedPrice);

  } else {

    console.log( '%c FAILED ', 'color: deeppink', 'EUR sanitized price 1000, value returned was: ', sanitizeEUR[0].sanitizedPrice);
  }

  /* USD */
  resourceLibrary.sanitizePrices(sanitizeUSD);

  if (sanitizeUSD[0].sanitizedPrice === '1099' && typeof sanitizeUSD[0].sanitizedPrice === 'string') {

    console.log('%c PASSED ', 'color: limegreen', 'USD sanitized price: ', sanitizeUSD[0].sanitizedPrice);

  } else {

    console.log( '%c FAILED ', 'color: deeppink', 'USD sanitized price 1000, value returned was: ', sanitizeUSD[0].sanitizedPrice);
  }
});
