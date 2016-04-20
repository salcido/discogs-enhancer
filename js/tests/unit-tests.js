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

  let unitTests = resourceLibrary.options.unitTests();

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


    function testCurrencyConversion(source, language, exchangeObj, expectedValue) {

      resourceLibrary.matchSymbols(source, language);

      resourceLibrary.sanitizePrices(source);

      let convert = resourceLibrary.convertPrices(source, exchangeObj);

      let result = (convert[0].convertedPrice === expectedValue);

      if (result) {

        console.log('%c PASSED ', 'color: limegreen', 'Price conversion successful.');

      } else {

        console.log( '%c FAILED ', 'color: deeppink', source[0].price);
      }
    }

    /* JPY to USD */
    resetPriceObjs();
    testCurrencyConversion(priceContainerJPY, 'en', USD, 9.18105031215571);

    /* USD to JPY */
    resetPriceObjs();
    testCurrencyConversion(priceContainerUSD, 'en', JPY, 1089.2415611010053);


    /* USD to EUR */
    resetPriceObjs();
    testCurrencyConversion(priceContainerUSD, 'en', EUR, 8.862105636299184);


    /* EUR to USD */
    resetPriceObjs();
    testCurrencyConversion(priceContainerEUR, 'en', USD, 11.284007176628563);


    /**
     * localizePrice tests
     */

    console.log('/// Testing localizePrice method ///');


    function testLocalization(symbol, value, exchangeName, language, expected) {

      let result = resourceLibrary.localizePrice(symbol, value, exchangeName, language, expected);

      if (result === expected) {

        console.log('%c PASSED ', 'color: limegreen', language.toUpperCase() + ' localizePrice: ', result);

      } else {

        console.log( '%c FAILED ', 'color: deeppink', language.toUpperCase() + ' localizePrice should be ' + expected, 'value returned was: ', result);
      }
    }

    testLocalization('$', '10.00', 'USD', 'en', '$10.00');

    testLocalization('€', '10.00', 'EUR', 'de', '10,00 €');

    testLocalization('¥', '1020', 'JPY', 'ja', '¥1,020');

    testLocalization('US$', '44.00', 'EUR', 'it', 'US$ 44,00');

    testLocalization('A$', '35.00', 'AUD', 'it', 'A$ 35,00');
    /**
     * sanitizePrices tests
     */

    console.log('/// Testing sanitizePrices method ///');


    function testSanitizer(array, expected) {

      resourceLibrary.sanitizePrices(array);

      if (array[0].sanitizedPrice === expected && typeof array[0].sanitizedPrice === 'string') {

        console.log('%c PASSED ', 'color: limegreen', 'sanitized price: ', array[0].sanitizedPrice, 'expected: ', expected);

      } else {

        console.log( '%c FAILED ', 'color: deeppink', 'sanitized price: ', array[0].sanitizedPrice, 'should have been: ', expected);
      }
    }

    testSanitizer([{price: '¥1,000'}], '1000');

    testSanitizer([{price: '10,00 €'}], '1000');

    testSanitizer([{price: '$10.99'}], '1099');

    testSanitizer([{price: 'US$ 10.99'}], '1099');

    testSanitizer([{price: '$AU 54,96'}], '5496');

    testSanitizer([{price: '£157,000.65'}], '15700065');

    testSanitizer([{price: 'JP¥1&nbsp;000'}], '1000');

    testSanitizer([{price: 'JP¥1 000'}], '1000');

    testSanitizer([{price: '$0.96'}], '096');


    /* print symbol tests */

    let printSymbol = {

      de: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      en: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      es: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', 'US$'],

      fr: ['€', '£UK', '¥JP', '¥JP', '$AU', '$CA', 'CHF', 'SEK', '$NZ', 'ZAR', 'MX$', 'R$', '$US'],

      it: ['€', '£', 'JP¥', 'JP¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', 'US$'],

      ja: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$']
    };

    console.log('/// Testing printSymbol arrays ///');

    for (let prop in printSymbol) {

      let count = 0;

      printSymbol[prop].forEach(function(sym, i) {

        if (sym === resourceLibrary.printSymbol[prop][i]) { count++; }
      });

      if (count === 13) {

        console.log('%c PASSED ', 'color: limegreen', 'All printSymbols were correctly retrieved');

      } else {

        console.log('%c FAILED ', 'color: deeppink', 'Symbols were not retrieved correctly for language: ', prop);
      }
    }


    /* match symbol tests */

    console.log('/// Testing match symbol method ///');


    function testSymbols(obj, language, exchangeName) {

      resourceLibrary.matchSymbols(obj, language);

      if (obj[0].exchangeName === exchangeName) {

        return console.log('%c PASSED ', 'color: limegreen', 'Exchange Name found for ' + obj[0].exchangeName + ' in ' + language.toUpperCase());

      } else {

        return console.log('%c FAILED ', 'color: deeppink', 'Exchange name for ' + obj[0].price + ' was not found in locale ' + language.toUpperCase());
      }
    }

    // EN tests
    testSymbols([{price: 'A$20.00'}], 'en', 'AUD');
    testSymbols([{price: '$20.00'}], 'en', 'USD');
    testSymbols([{price: '€20.00'}], 'en', 'EUR');
    testSymbols([{price: '£20.00'}], 'en', 'GBP');
    testSymbols([{price: 'CA$20.00'}], 'en', 'CAD');
    testSymbols([{price: '¥2000'}], 'en', 'JPY');
    testSymbols([{price: 'R$20.00'}], 'en', 'BRL');
    testSymbols([{price: 'CHF20.00'}], 'en', 'CHF');
    testSymbols([{price: 'SEK20.00'}], 'en', 'SEK');
    testSymbols([{price: 'NZ$20.00'}], 'en', 'NZD');
    testSymbols([{price: 'MX$20.00'}], 'en', 'MXN');
    testSymbols([{price: 'ZAR20.00'}], 'en', 'ZAR');

    // ES tests
    testSymbols([{price: '20,00 US$'}], 'es', 'USD');
    testSymbols([{price: '20,00 AU$'}], 'es', 'AUD');
    testSymbols([{price: 'JP¥20.00'}], 'es', 'JPY');
    testSymbols([{price: '20,00 €'}], 'es', 'EUR');
    testSymbols([{price: '20,00 £'}], 'es', 'GBP');
    testSymbols([{price: '20,00 CA$'}], 'es', 'CAD');
    testSymbols([{price: '20,00 R$'}], 'es', 'BRL');
    testSymbols([{price: '20,00 CHF'}], 'es', 'CHF');
    testSymbols([{price: '20,00 SEK'}], 'es', 'SEK');
    testSymbols([{price: '20,00 NZ$'}], 'es', 'NZD');
    testSymbols([{price: '20,00 MX$'}], 'es', 'MXN');
    testSymbols([{price: '20,00 ZAR'}], 'es', 'ZAR');

    // DE tests
    testSymbols([{price: '20,00 $'}], 'de', 'USD');
    testSymbols([{price: '20,00 A$'}], 'de', 'AUD');
    testSymbols([{price: '¥2.000'}], 'de', 'JPY');
    testSymbols([{price: '20,00 €'}], 'de', 'EUR');
    testSymbols([{price: '20,00 £'}], 'de', 'GBP');
    testSymbols([{price: '20,00 CA$'}], 'de', 'CAD');
    testSymbols([{price: '20,00 R$'}], 'de', 'BRL');
    testSymbols([{price: '20,00 CHF'}], 'de', 'CHF');
    testSymbols([{price: '20,00 SEK'}], 'de', 'SEK');
    testSymbols([{price: '20,00 NZ$'}], 'de', 'NZD');
    testSymbols([{price: '20,00 ZAR'}], 'de', 'ZAR');

    // FR tests
    testSymbols([{price: '20,00 $US'}], 'fr', 'USD');
    testSymbols([{price: '20,00 $AU'}], 'fr', 'AUD');
    testSymbols([{price: '¥JP2 000'}], 'fr', 'JPY');
    testSymbols([{price: '20,00 €'}], 'fr', 'EUR');
    testSymbols([{price: '20,00 £UK'}], 'fr', 'GBP');
    testSymbols([{price: '20,00 $CA'}], 'fr', 'CAD');
    testSymbols([{price: '20,00 R$'}], 'fr', 'BRL');
    testSymbols([{price: '20,00 CHF'}], 'fr', 'CHF');
    testSymbols([{price: '20,00 SEK'}], 'fr', 'SEK');
    testSymbols([{price: '20,00 $NZ'}], 'fr', 'NZD');
    testSymbols([{price: '20,00 MX$'}], 'fr', 'MXN');
    testSymbols([{price: '20,00 ZAR'}], 'fr', 'ZAR');

    // IT tests
    testSymbols([{price: 'US$ 20,00'}], 'it', 'USD');
    testSymbols([{price: 'A$ 20,00'}], 'it', 'AUD');
    testSymbols([{price: 'JP¥2.000'}], 'it', 'JPY');
    testSymbols([{price: '€ 20,00'}], 'it', 'EUR');
    testSymbols([{price: '£ 20,00'}], 'it', 'GBP');
    testSymbols([{price: 'CA$ 20,00'}], 'it', 'CAD');
    testSymbols([{price: 'R$ 20,00'}], 'it', 'BRL');
    testSymbols([{price: 'CHF 20,00'}], 'it', 'CHF');
    testSymbols([{price: 'SEK 20,00'}], 'it', 'SEK');
    testSymbols([{price: 'NZ$ 20,00'}], 'it', 'NZD');
    testSymbols([{price: 'MX$ 20,00'}], 'it', 'MXN');
    testSymbols([{price: 'ZAR 20,00'}], 'it', 'ZAR');

    // JA tests
    testSymbols([{price: '$20.00'}], 'ja', 'USD');
    testSymbols([{price: 'A$20.00'}], 'ja', 'AUD');
    testSymbols([{price: '¥2000'}], 'ja', 'JPY');
    testSymbols([{price: '€20.00'}], 'ja', 'EUR');
    testSymbols([{price: '£20.00'}], 'ja', 'GBP');
    testSymbols([{price: 'CA$20.00'}], 'ja', 'CAD');
    testSymbols([{price: 'NZ$20.00'}], 'ja', 'NZD');
    testSymbols([{price: 'R$20.00'}], 'ja', 'BRL');
    testSymbols([{price: 'CHF20.00'}], 'ja', 'CHF');
    testSymbols([{price: 'SEK20.00'}], 'ja', 'SEK');
    testSymbols([{price: 'MX$20.00'}], 'ja', 'MXN');
    testSymbols([{price: 'ZAR20.00'}], 'ja', 'ZAR');
  }
});
