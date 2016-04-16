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
            EUR:0.88621
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


    /* JPY to USD */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerJPY);

    resourceLibrary.sanitizePrices(priceContainerJPY);

    let convertJPYtoUSD = resourceLibrary.convertPrices(priceContainerJPY, USD);

    let resultJPYtoUSD = (convertJPYtoUSD[0].convertedPrice === 9.18105031215571) ? 'PASSED' : '*** FAILED ***';

    console.log('1000 JPY to USD result: ', convertJPYtoUSD[0].convertedPrice, resultJPYtoUSD);


    /* USD to JPY */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerUSD);

    resourceLibrary.sanitizePrices(priceContainerUSD);

    var convertUSDtoJPY = resourceLibrary.convertPrices(priceContainerUSD, JPY);

    let resultUSDtoJPY = (convertUSDtoJPY[0].convertedPrice === 1089.2415611010053) ? 'PASSED' : '*** FAILED ***';

    console.log('10.00 USD to JPY result: ', convertUSDtoJPY[0].convertedPrice, resultUSDtoJPY);


    /* USD to EUR */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerUSD);

    resourceLibrary.sanitizePrices(priceContainerUSD);

    let convertUSDtoEUR = resourceLibrary.convertPrices(priceContainerUSD, EUR);

    let resultUSDtoEUR = (convertUSDtoEUR[0].convertedPrice === 8.862105636299184) ? 'PASSED' : '*** FAILED ***';

    console.log('10.00 USD to EUR result: ', convertUSDtoEUR[0].convertedPrice, resultUSDtoEUR);


    /* EUR to USD */
    resetPriceObjs();

    resourceLibrary.matchSymbols(priceContainerEUR);

    resourceLibrary.sanitizePrices(priceContainerEUR);

    let convertEURtoUSD = resourceLibrary.convertPrices(priceContainerEUR, USD);

    let resultEURtoUSD = (convertEURtoUSD[0].convertedPrice) === 11.284007176628563 ? 'PASSED' : '*** FAILED ***';

    console.log('10.00 EUR to USD result: ', convertEURtoUSD[0].convertedPrice, resultEURtoUSD);
  }
});
