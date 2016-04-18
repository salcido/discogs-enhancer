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

      let test = resourceLibrary.localizePrice(symbol, value, exchangeName, language, expected);

      if (test === expected && typeof test === 'string') {

        console.log('%c PASSED ', 'color: limegreen', language.toUpperCase() + ' localizePrice: ', test);

      } else {

        console.log( '%c FAILED ', 'color: deeppink', language.toUpperCase() + ' localizePrice should be ' + expected, 'value returned was: ', test);
      }
    }

    /* USD */
    testLocalization('$', '10.00', 'USD', 'en', '$10.00');

    /* EUR */
    testLocalization('€', '10.00', 'EUR', 'de', '10,00 €');

    /* JPY */
    testLocalization('¥', '1000', 'JPY', 'ja','¥1,000');


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

    /* JPY */
    testSanitizer([{price: '¥1,000'}], '1000');

    /* EUR */
    testSanitizer([{price: '10,00 €'}], '1000');

    /* USD */
    testSanitizer([{price: '$10.99'}], '1099');

    /* print symbol tests */

    let printSymbol = {

      de: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      en: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      es: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', 'US$'],

      fr: ['€', '£UK', 'JP¥', 'JP¥', '$AU', '$CA', 'CHF', 'SEK', '$NZ', 'ZAR', 'MX$', 'R$', '$US'],

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

    let
        en1 = [{price: 'A$20.00'}],
        en2 = [{price: '$20.00'}],
        en3 = [{price: '€20.00'}],
        en4 = [{price: '£20.00'}],
        en5 = [{price: 'CA$20.00'}],
        en6 = [{price: '¥2000'}],

        es1 = [{price: '20,00 US$'}],
        es2 = [{price: '20,00 AU$'}],
        es3 = [{price: 'JP¥20.00'}],
        es4 = [{price: '20,00 €'}],
        es5 = [{price: '20,00 £'}],
        es6 = [{price: '20,00 CA$'}],

        de1 = [{price: '20,00 $'}],
        de2 = [{price: '20,00 A$'}],
        de3 = [{price: '¥2.000'}],
        de4 = [{price: '20,00 €'}],
        de5 = [{price: '20,00 £'}],
        de6 = [{price: '20,00 CA$'}],

        fr1 = [{price: '20,00 $US'}],
        fr2 = [{price: '20,00 $AU'}],
        fr3 = [{price: '¥JP2 000'}],
        fr4 = [{price: '20,00 €'}],
        fr5 = [{price: '20,00 £UK'}],
        fr6 = [{price: '20,00 $CA'}],

        it1 = [{price: 'US$ 20,00'}],
        it2 = [{price: 'A$ 20,00'}],
        it3 = [{price: 'JP¥2.000'}],
        it4 = [{price: '€ 20,00'}],
        it5 = [{price: '£ 20,00'}],
        it6 = [{price: 'CA$ 20,00'}],

        ja1 = [{price: '$20.00'}],
        ja2 = [{price: 'A$20.00'}],
        ja3 = [{price: '¥2000'}],
        ja4 = [{price: '€20.00'}],
        ja5 = [{price: '£20.00'}],
        ja6 = [{price: 'CA$20.00'}],
        ja7 = [{price: 'NZ$20.00'}];


    console.log('/// Testing match symbol method ///');


    function testSymbols(obj, language, exchangeName) {

      resourceLibrary.matchSymbols(obj, language);

      if (obj[0].exchangeName === exchangeName) {

        return console.log('%c PASSED ', 'color: limegreen', 'Exchange Name correctly matched');

      } else {

        return console.log('%c FAILED ', 'color: deeppink', 'Exchange name for ' + obj[0].price + ' was not found');
      }
    }

    // EN tests
    testSymbols(en1, 'en', 'AUD');
    testSymbols(en2, 'en', 'USD');
    testSymbols(en3, 'en', 'EUR');
    testSymbols(en4, 'en', 'GBP');
    testSymbols(en5, 'en', 'CAD');
    testSymbols(en6, 'en', 'JPY');

    // ES tests
    testSymbols(es1, 'es', 'USD');
    testSymbols(es2, 'es', 'AUD');
    testSymbols(es3, 'es', 'JPY');
    testSymbols(es4, 'es', 'EUR');
    testSymbols(es5, 'es', 'GBP');
    testSymbols(es6, 'es', 'CAD');

    // DE tests
    testSymbols(de1, 'de', 'USD');
    testSymbols(de2, 'de', 'AUD');
    testSymbols(de3, 'de', 'JPY');
    testSymbols(de4, 'de', 'EUR');
    testSymbols(de5, 'de', 'GBP');
    testSymbols(de6, 'de', 'CAD');

    // FR tests
    testSymbols(fr1, 'fr', 'USD');
    testSymbols(fr2, 'fr', 'AUD');
    testSymbols(fr3, 'fr', 'JPY');
    testSymbols(fr4, 'fr', 'EUR');
    testSymbols(fr5, 'fr', 'GBP');
    testSymbols(fr6, 'fr', 'CAD');

    // IT tests
    testSymbols(it1, 'it', 'USD');
    testSymbols(it2, 'it', 'AUD');
    testSymbols(it3, 'it', 'JPY');
    testSymbols(it4, 'it', 'EUR');
    testSymbols(it5, 'it', 'GBP');
    testSymbols(it6, 'it', 'CAD');

    // JA tests
    testSymbols(ja1, 'ja', 'USD');
    testSymbols(ja2, 'ja', 'AUD');
    testSymbols(ja3, 'ja', 'JPY');
    testSymbols(ja4, 'ja', 'EUR');
    testSymbols(ja5, 'ja', 'GBP');
    testSymbols(ja6, 'ja', 'CAD');
    testSymbols(ja7, 'ja', 'NZD');
  }
});
