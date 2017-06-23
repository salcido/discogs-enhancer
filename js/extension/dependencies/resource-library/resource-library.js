/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * The resourceLibrary holds methods and properties that are shared between
 * features. The `Init / Setup` is the place to put code that needs to run
 * before anything else in the extension.
 *
 * Notes:
 *
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

(function() {

  window.resourceLibrary = {

    /**
     * Appends notification to top of Discogs header
     *
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

      notice.textContent = message;

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
       * TODO Can I delete these?
       * @type {Object}
       */

      colors: {

        green: '#60C43F',

        red: '#BF3A38'
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

      preloader: '<i class="icon icon-spinner icon-spin converted_price de-preloader" style="font-style: normal;"></i>',

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
     * @param    {array} source
     * @return   {array}
     */

    convertPrices: function(source, rates) {

      if ( !rates ) {
        // Current rates from Fixer.io
        rates = this.getItem('updateRatesObj').rates;

        if ( rates === null ) {

          console.log('Currency has recently been changed. Please refresh the page one more time.');
        }
      }

      source.forEach(obj => {

        if ( !obj.isJPY ) {

          let injectionPoint = obj.sanitizedPrice.length - 2;

          obj.sanitizedPrice = obj.sanitizedPrice.splice(injectionPoint, 0, '.');
        }

        for ( let h = 0; h < source.length; h++ ) {

          if ( !rates.rates[obj.exchangeName] ) {

            obj.convertedPrice = Number(obj.sanitizedPrice);

          } else {

            obj.convertedPrice = (obj.sanitizedPrice / rates.rates[obj.exchangeName]);
          }

          this.log('Pre-conversion: ', obj.sanitizedPrice);
          this.log('Converted Price: ', obj.convertedPrice);
        }
      });

      return source;
    },

    /**
     * A list of currency exchange acronyms
     *
     * @type {Array}
     */

    exchangeList: ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'RUB', 'ZAR', 'MXN', 'BRL', 'USD'],

    /**
     * Finds the `dsdata` node
     *
     * @param    {object} obj
     * @return   {object}
     */

    findNode: function(obj) {

      for ( let key in obj ) {

        if ( obj[key].id === 'dsdata' ) {

          return key;
        }
      }
    },

    /**
     * Convenience method so I don't forget to parse
     * my localStorage objects.
     *
     * @param    {string} item: name of the item to be returned
     * @return   {object | string}
     */

    getItem: function(item) {

      try {

        return JSON.parse(localStorage.getItem(item));

      } catch (e) {

        try {

          return localStorage.getItem(item);

        } catch (err) {

          console.warn('Could not getItem without errors. Removing item from localStorage');

          return localStorage.removeItem(item);
        }
      }
    },

    /**
     * Assigns user's currency symbol to price estimates.
     *
     * @param    {string} userCurrency
     * @param    {string} symbol
     * @return   {string} symbol
     */

    getSymbols: function(userCurrency, symbol) {

      let language = this.language();

      this.exchangeList.forEach((name, f) => {

        if ( name === userCurrency ) {

          symbol = this.printSymbol[language][f];
        }
      });

      this.log('Print symbol: ', symbol);

      return symbol;
    },

    /**
     * Detects whether an element is visible on the page
     *
     * @param    {Object}   elem [the element to detect]
     * @return   {Boolean}
     */

    isOnScreen(elem) {

      if ( elem && elem.getBoundingClientRect() ) {

        let elemTop = elem.getBoundingClientRect().top,
            elemBottom = elem.getBoundingClientRect().bottom,
            isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight * 1.7);

        return isVisible;
      }
    },

    /**
     * Returns the currently selected language
     *
     * @return   {string}
     */

    language: function() {

      let id = document.getElementById('i18n_select');

      return id.options[id.selectedIndex].value;
    },

    /**
     * Returns price suggestions in user's localized format
     *
     * @param    {string} symbol
     * @param    {string} price
     * @return   {string}
     */

    // TODO rename to 'localizeSuggestion'
    localizePrice: function(symbol, price, userCurrency, language) {

      let
          maxDigits,
          priceConfig;

      if ( !userCurrency || !language ) {

        userCurrency = localStorage.getItem('userCurrency');

        language = this.language();
      }

      // Use fracitonal values if user's currency is not JPY
      maxDigits = (userCurrency === 'JPY') ? 0 : 2;

      priceConfig = {
        currency: userCurrency,
        maximumFractionDigits: maxDigits,
        minimumFractionDigits: maxDigits
      };

      // Pretty awesome that the Number object has this `toLocaleString` method
      price = Number(price).toLocaleString(language, priceConfig);

      // Return price suggestions in user's locale
      switch (language) {

        case 'en':
        case 'ja':

          this.log('Localized Suggestion: ', symbol + price);

          return symbol + price;

        case 'de':
        case 'fr':
        case 'es':

          this.log('Localized Suggestion: ', price + ' ' + symbol);

          return price + ' ' + symbol;

        case 'it':

          this.log('Localized Suggestion: ', symbol + ' ' + price);

          return symbol + ' ' + price;
      }
    },

    /**
     * Console.logs stuff
     * @method
     * @return {function}
     */

    log: function() {

      if ( this.options.debug() ) {

        return console.log(...arguments);
      }
    },

    /**
     * Maps price symbol to `exchangeList` array, determines if the release
     * is listed in `JPY` and sets the exchange name.
     *
     * @param    {array<object>} source An array of objects representing release data
     * @return   {object}
     */

    matchSymbols: function(source, language) {

      if ( !language ) {

        language = this.language();
      }

       source.forEach((releaseData, i) => {

         // An array of regexs based on the user's language
         let symbol = this.symbolRegex[language];

         for ( i = 0; i < symbol.length; i++ ) {

            if ( releaseData.price.match(symbol[i], 'g') ) {

              // Determine if the release is listed in JPY
              switch ( symbol[i] ) {

                case 's*¥':
                case 's*￥':
                case 's*JP¥':
                case 's*¥JP':

                  releaseData.isJPY = true;
                  break;

                default:

                  releaseData.isJPY = false;
                  break;
              }

              // Set the exchange name
              releaseData.exchangeName = this.exchangeList[i];

              this.log(' ');
              this.log('Exchange name: ', releaseData.exchangeName);
              this.log('isJPY: ', releaseData.isJPY);

              return releaseData;
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

         return JSON.parse(localStorage.getItem('options')).analytics;
       },

       /**
        * Whether or not to change price colors
        *
        * @return {boolean}
        */

       colorize: function() {

         return JSON.parse(localStorage.getItem('options')).colorize;
       },

       /**
        * Whether or not to log values
        *
        * @return {Boolean}
        */

       debug: function() {

         return JSON.parse(localStorage.getItem('options')).debug;
       },

       /**
        * Gets current options state
        *
        * @return {undefined}
        */

       getOptions: function() {

         let
             doc = document,
             options = resourceLibrary.getItem('options'),
             //
             analytics = options.analytics,
             colorize = options.colorize,
             debug = options.debug,
             threshold = options.threshold,
             unitTests = options.unitTests;

         if (analytics) { doc.getElementById('analytics').checked = true; }

         if (colorize) { doc.getElementById('colorize').checked = true; }

         if (debug) { doc.getElementById('debug').checked = true; }

         if (threshold) { doc.getElementById('threshold').value = threshold; }

         if (unitTests) { doc.getElementById('unittests').checked = true; }
       },

       /**
        * Saves selected options on options modal
        *
        * @return {function}
        */

       saveOptions: function() {

         let
             doc = document,
             analytics = doc.getElementById('analytics').checked,
             colorize = doc.getElementById('colorize').checked,
             debug = doc.getElementById('debug').checked,
             options,
             threshold = doc.getElementById('threshold').value,
             unitTests = doc.getElementById('unittests').checked;

         doc.getElementById('saveOptions').disabled = true;

         /* get options object */
         options = JSON.parse(localStorage.getItem('options'));

         /* update values */
         options.analytics = analytics;
         options.colorize = colorize;
         options.debug = debug;
         options.threshold = threshold;
         options.unitTests = unitTests;

         options = JSON.stringify(options);

         /* save that ish */
         localStorage.setItem('options', options);

         resourceLibrary.appendNotice('Options have been successfully saved.', 'limeGreen');

         return location.reload();
       },

       /**
        * The maximum percentage that an item will be ballpark estimated with: ±
        *
        * @return {number}
        */

       threshold: function() {

         let threshold = JSON.parse(localStorage.getItem('options')).threshold;

         return Number(threshold);
       },

       /**
        * Whether or not to run unit tests
        *
        * @return {Boolean}
        */

       unitTests: function() {

         return JSON.parse(localStorage.getItem('options')).unitTests;
       }
     },

    /**
    * Parses the URL passed into it and
    * returns the release/master/artist/forum
    * number.
    *
    * @param    {string} url [the URL passed into the function]
    * @return   {string} num [the parsed id number]
    */

    parseURL: function(url) {

      let urlArr = url.split('/'),
          num = urlArr[urlArr.length - 1];

      if ( num.indexOf('-') > -1 ) {

        num = num.split('-')[0];
      }

      if ( num.indexOf('?') > -1 ) {

        num = num.split('?')[0];
      }

      return num;
    },

    /**
     * Parses element into object
     *
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
     * Symbol indexes correspond to currencies in this order:
     * ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'RUB', 'ZAR', 'MXN', 'BRL', 'USD']
     * @type {object}
     */

    printSymbol: {

      de: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      en: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      es: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'US$'],

      fr: ['€', '£UK', '¥JP', '¥JP', '$AU', '$CA', 'CHF', 'SEK', '$NZ', '₽', 'ZAR', 'MX$', 'R$', '$US'],

      it: ['€', '£', 'JP¥', 'JP¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'US$'],

      ja: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$']
    },

    /**
     * Parses the page url in order to remove any `&page=`
     * query params.
     *
     * @param    {string} url [current page URL]
     * @return   {string}
     */

    removePageParam: function(url) {

      let params;

        if ( url.indexOf('?') > -1 ) {

          let page = /page=/g;

          params = url.split('?')[1].split('&');

          params.forEach(function(param) {

            let target;

            if ( param.match(page) ) {

              target = params.indexOf(param);

              params.splice(target, 1);
            }
        });
     }

     return params && params.length ? '&' + params.join('&') : '';
   },

    /**
     * Strips currency symbol from prices
     *
     * @param    {array} source
     * @return   {obj}
     */

    sanitizePrices: function(source) {

      source.forEach(obj => {

        obj.price = String(obj.price);

        obj.price = obj.price.replace(/&nbsp;/g, '');

        obj.price = obj.price.replace(/ /g, '');

        obj.price = obj.price.replace(/,/g, '');

        obj.price = obj.price.replace(/\./g, '');

        // extract all digits
        let digits = obj.price.match(/\d+(,\d+)*(\.\d+)?/, 'g')[0];

        obj.sanitizedPrice = digits;

        this.log('Sanitized Price:', obj.sanitizedPrice);

        return obj;
      });
    },

    /**
     * Sets text for sort buttons
     *
     * @param    {object} elem
     * @return   {object} elem
     */

    setButtonText: function(elem) {

      if ( elem.text() === 'Sort A-Z' ) {

        elem.text('Sort Z-A');

        return elem;

      } else if ( elem.text() === 'Sort Z-A' ) {

        elem.text('Undo Sort');

        return elem;

      } else if ( elem.text() === 'Undo Sort' ) {

        elem.text('Sort A-Z');

        return elem;
      }
    },

    /**
     * Convenience method so I don't forget to stringify
     * my values before setting them.
     *
     *
     * @param    {string} name
     * @param    {string|object} value
     * @return   {object}
     */

    setItem: function(name, value) {

      value = JSON.stringify(value);

      return localStorage.setItem(name, value);
    },

    /**
     * Regular expressions for determining what currency a price is listed in.
     * RegEx indexes correspond to currencies in this order:
     * ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'RUB', 'ZAR', 'MXN', 'BRL', 'USD']
     * @type {object}
     */

    symbolRegex: {

      de: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /([^C]A\$)/, /(CA\$)/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /\$$/],

      en: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /^\s*NZ\$/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/],

      es: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /(AU\$)/, /(CA\$)/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /(US\$)/],

      fr: ['\s*\€', '\s*\£UK', '\s*\¥JP', '\s*\￥JP', /([^C]\$AU)/, /(\$CA)/, '\s*CHF', '\s*SEK', /(\$NZ)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /(\$US)/],

      it: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*US\$/],

      ja: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /^\s*NZ\$/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/]
    },

    /**
     * Used to determine if user has seller permissions
     *
     * @type {string}
     */

    unregistered: 'Please complete your Seller Settings before listing items for sale.'
  };

  // ========================================================
  // Init / Setup
  // ========================================================

  /* Instantiate default option values if not present */
  if ( !localStorage.getItem('options') ) {

    let options = {
          analytics: true,
          colorize: false,
          debug: false,
          threshold: 2,
          unitTests: false
        };

    options = JSON.stringify(options);

    localStorage.setItem('options', options);
  }

  /**
   * Inserts characters into string
   */

  if ( !('splice' in String.prototype) ) {

    String.prototype.splice = function(index, remove, insert) {

      let chars = this.split('');

      Array.prototype.splice.apply(chars, arguments);

      return chars.join('');
    };
  }
}());
