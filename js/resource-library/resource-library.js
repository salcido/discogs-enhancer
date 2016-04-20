/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

(function() {

  /**
   * Each object in `priceContainer` array
   * looks something like this:

     {
      convertedPrice: 17.037037037037038,
      exchangeName: "EUR",
      isJPY: false,
      mediaCondition: "Mint (M)",
      price: "€14.95",
      sanitizedPrice: "14.95"
    }

   */


  // instantiate default option values if not present
  if (!localStorage.getItem('analytics')) { localStorage.setItem('analytics', 'true'); }

  if (!localStorage.getItem('colorize')) { localStorage.setItem('colorize', 'false'); }

  if (!localStorage.getItem('debug')) { localStorage.setItem('debug', 'false'); }

  if (!localStorage.getItem('threshold')) { localStorage.setItem('threshold', '2'); }

  if (!localStorage.getItem('unitTests')) { localStorage.setItem('unitTests', 'false'); }


  window.resourceLibrary = {

    /**
     * Appends notification to top of Discogs header
     *
     * @instance
     * @param    {string} message
     * @return   {undefined}
     */

    appendNotice: function(message, color) {

      let notice = document.createElement('div');

      notice.id = 'deAlertNotice';

      notice.style = 'background-color:' + color + ' !important;' +
                     'text-align: center;' +
                     'color: black !important;' +
                     'font-size: 20px;' +
                     'padding: 20px;' +
                     'cursor: pointer;';

      notice.innerHTML = message;

      document.getElementById('site_headers_super_wrap').appendChild(notice);

      document.getElementById('deAlertNotice').addEventListener('click', function() { this.remove(); });

      setTimeout(function() {

        document.getElementById('deAlertNotice').remove();

      }, 7000);
    },

    /**
     * Common HTML/CSS values
     *
     * @type {Object}
     */

    css: {

      /**
       * The border that separates prices from suggestion comparisons
       *
       * @type {string}
       */

      border: 'style="margin-top: 10px !important;' +
              'padding-top: 10px !important;' +
              'border-top: 1px dotted gray !important;"',

      /**
       * Common colors used in price comparisons
       *
       * @type {Object}
       */

      colors: {

        green: '#60C43F',

        red: '#e7413f'
      },

      /**
       * Displayed when Discogs has no price suggestion data on an item
       *
       * @type {string}
       */

      noData: 'Discogs<br>does not have<br>price data on<br>this item.',

      /**
       * Preloader markup
       *
       * @type {string}
       */

      preloader: '<span class="converted_price de-preloader"></span>',

      /**
       * Displayed when a user has price comparisons enabled but does
       * not have seller privileges
       *
       * @type {string}
       */

      pleaseRegister: '<span class="converted_price" ' +
                      'style="margin-top: 10px !important; ' +
                      'border-top: 1px dotted gray !important; '+
                      'padding-top: 5px !important;">' +
                      'Discogs Enhancer:' +
                      '<br>Please ' +
                      '<a href="/settings/seller/">' +
                      'register as <br>a Seller ' +
                      '</a>' +
                      'to see <br>Price Suggestions' +
                      '</span>'
    },

    /**
     * Converts prices to user's currency
     *
     * @instance
     * @param    {array} source
     * @return   {array}
     */

    convertPrices: function(source, rates) {

      if (!rates) {

        // Current rates from Fixer.io
        rates = JSON.parse(localStorage.getItem('rates'));

        if (rates === null) {

          resourceLibrary.appendNotice('Discogs Enhancer: Currency has recently been changed. Please refresh the page one more time.', 'orange');
        }
      }

      source.forEach((obj) => {

        if (!obj.isJPY) {

          let injectionPoint = obj.sanitizedPrice.length - 2;

          obj.sanitizedPrice = obj.sanitizedPrice.splice(injectionPoint, 0, '.');
        }

        for (let h = 0; h < source.length; h++) {

          if (!rates.rates[obj.exchangeName]) {

            obj.convertedPrice = Number(obj.sanitizedPrice);

          } else {

            obj.convertedPrice = (obj.sanitizedPrice / rates.rates[obj.exchangeName]);
          }

          if (this.options.debug()) {

            console.log('Pre-conversion: ', obj.sanitizedPrice);

            console.log('Converted Price: ', obj.convertedPrice);
          }
        }
      });

      return source;
    },

    /**
     * A list of currency exchange acronyms
     *
     * @type {Array}
     */

    exchangeList: ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'ZAR', 'MXN', 'BRL', 'USD'],

    /**
     * Finds the `dsdata` node
     *
     * @instance
     * @param    {object} obj
     * @return   {object}
     */

    findNode: function(obj) {

      for (let key in obj) {

        if (obj[key].id === 'dsdata') {

          return key;
        }
      }
    },

    /**
     * Assigns user's currency symbol to price estimates.
     *
     * @instance
     * @param    {string} userCurrency
     * @param    {string} symbol
     * @return   {string} symbol
     */

    getSymbols: function(userCurrency, symbol) {

      let language = localStorage.getItem('language');

      this.exchangeList.forEach((name, f) => {

        if (name === userCurrency) {

          symbol = this.printSymbol[language][f];
        }
      });

      if (this.options.debug()) {

        console.log('Print symbol: ', symbol);
      }

      return symbol;
    },

    /**
     * Returns price suggestions in user's localized format
     *
     * @instance
     * @param    {string} symbol
     * @param    {string} price
     * @return   {string}
     */

    localizePrice: function(symbol, price, currency, language) {

      if (!currency && !language) {

        currency = localStorage.getItem('userCurrency');

        language = localStorage.getItem('language');
      }

      price = String(price);


      price = Number(price).toLocaleString(language, {
                                             currency: currency,
                                             maximumFractionDigits: 2,
                                             minimumFractionDigits: 2
                                          });

      if (language === 'en' || language === 'ja') {

        if (this.options.debug()) {

          console.log('Localized Price: ', symbol + price);
        }

        if (currency === 'JPY') {

          return symbol + Number(price).toFixed(0);
        }

        return symbol + price;
      }

      if (language === 'de' ||
          language === 'fr' ||
          language === 'es') {

        if (this.options.debug()) {

          console.log('Localized Price: ', price + ' ' + symbol);
        }

        return price + ' ' + symbol;
      }

      if (language === 'it') {

        if (this.options.debug()) {

          console.log('Localized Price: ', symbol + ' ' + price);
        }

        return symbol + ' ' + price;
      }
    },

    /**
     * Maps price symbol to `exchangeList` array
     *
     * @instance
     * @param    {array} source
     * @return   {obj}
     */

    matchSymbols: function(source, language) {

      if (!language) {

        language = localStorage.getItem('language');
      }

       source.forEach((obj, i) => {

         for (i = 0; i < this.symbolRegex[language].length; i++) {

           if (obj.price.match(this.symbolRegex[language][i], 'g')) {

             if (this.symbolRegex[language][i] === 's*¥' ||
                 this.symbolRegex[language][i] === 's*￥') {

               obj.isJPY = true;

             } else {

               obj.isJPY = false;
             }

             obj.exchangeName = this.exchangeList[i];

             if (this.options.debug()) {

               console.log(' ');

               console.log('Exchange name: ', obj.exchangeName);

               console.log('isJPY: ', obj.isJPY);
             }

             return obj;
           }
         }
       });
     },

     /**
      * Config values for various features
      *
      * @type {Object}
      */

     options: {

       /**
        * Whether or not to use analytics
        *
        * @return {boolean}
        */
       analytics: function() {

         return JSON.parse(localStorage.getItem('analytics'));
       },

       /**
        * Whether or not to change price colors
        *
        * @return {boolean}
        */

       colorize: function() {

         return JSON.parse(localStorage.getItem('colorize'));
       },

       /**
        * Whether or not to log values
        *
        * @return {Boolean}
        */

       debug: function() {

         return JSON.parse(localStorage.getItem('debug'));
       },

       /**
        * The maximum percentage that an item will be ballpark estimated with: ±
        *
        * @return {number}
        */

       threshold: function() {

         return Number(localStorage.getItem('threshold'));
       },

       /**
        * Whether or not to run unit tests
        *
        * @return {Boolean}
        */

       unitTests: function() {

         return JSON.parse(localStorage.getItem('unitTests'));
       }
     },

    /**
     * Parses element into object
     *
     * @instance
     * @param    {string} element
     * @return   {object}
     */

    prepareObj: function(element) {

      element = element.substring(element.indexOf('return')).substring(7);

      element = element.substring(0, element.lastIndexOf('}')).substring(0, element.lastIndexOf(';'));

      element = JSON.parse(element);

      return element;
    },

    /**
     * Symbols that will be used in price estimates injected into the DOM
     *
     * @type {object}
     */

    printSymbol: {

      de: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      en: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      es: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', 'US$'],

      fr: ['€', '£UK', '¥JP', '¥JP', '$AU', '$CA', 'CHF', 'SEK', '$NZ', 'ZAR', 'MX$', 'R$', '$US'],

      it: ['€', '£', 'JP¥', 'JP¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', 'US$'],

      ja: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$']
    },

    /**
     * Strips currency symbol from prices
     *
     * @instance
     * @param    {array} source
     * @return   {obj}
     */

    sanitizePrices: function(source) {

      source.forEach((obj) => {

        obj.price = String(obj.price);

        obj.price = obj.price.replace('&nbsp;', '');

        obj.price = obj.price.replace(' ', '');

        obj.price = obj.price.replace(',', '');

        obj.price = obj.price.replace('.', '');

        // extract all digits
        let digits = obj.price.match(/\d+(,\d+)*(\.\d+)?/, 'g')[0];

        obj.sanitizedPrice = digits;

        if (this.options.debug()) {

          console.log('Sanitized Price:', obj.sanitizedPrice);
        }

        return obj;
      });
    },

    /**
     * Sets text for sort buttons
     *
     * @instance
     * @param    {object} elem
     * @return   {object} elem
     */

    setButtonText: function(elem) {

      if (elem.text() === 'Sort A-Z') {

        elem.text('Sort Z-A');

        return elem;

      } else if (elem.text() === 'Sort Z-A') {

        elem.text('Undo Sort');

        return elem;

      } else if (elem.text() === 'Undo Sort') {

        elem.text('Sort A-Z');

        return elem;
      }
    },

    /**
     * Regular expressions for determining what currency a price is listed in
     *
     * @type {object}
     */

    symbolRegex: {

      de: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /([^C]A\$)/, /(CA\$)/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*ZAR', /(MX\$)/, /(R\$)/, /\$$/],

      en: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /^\s*NZ\$/, '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/],

      es: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /(AU\$)/, /(CA\$)/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*ZAR', /(MX\$)/, /(R\$)/, /(US\$)/],

      fr: ['\s*\€', '\s*\£UK', '\s*\¥JP', '\s*\￥JP', /([^C]\$AU)/, /(\$CA)/, '\s*CHF', '\s*SEK', /(\$NZ)/, '\s*ZAR', /(MX\$)/, /(R\$)/, /(\$US)/],

      it: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*US\$/],

      ja: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /^\s*NZ\$/, '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/]
    },

    /**
     * Used to determine if user has seller permissions
     *
     * @type {string}
     */

    unregistered: 'Please complete your Seller Settings before listing items for sale.'
  };

  /**
   * Inserts characters into string
   *
   * Credit: http://www.bennadel.com/blog/2160-adding-a-splice-method-to-the-javascript-string-prototype.htm
   */

  if ( !('splice' in String.prototype) ) {

    String.prototype.splice = function(index, howManyToDelete, stringToInsert) {

      let characterArray = this.split('');

      Array.prototype.splice.apply(characterArray, arguments);

      return(characterArray.join(''));
    };
  }
}());
