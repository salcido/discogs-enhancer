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

  window.resourceLibrary = {

    /**
     * Appends notification to top of Discogs header
     *
     * @instance
     * @param    {string} message
     * @return   {undefined}
     */

    appendNotice: function(message) {

      let notice = document.createElement('div');

      notice.id = 'deAlertNotice';

      notice.style = 'background-color: khaki !important;' +
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

      border: 'style="margin-top: 10px !important;' +
              'padding-top: 10px !important;' +
              'border-top: 1px dotted gray !important;"',

      colors: {

        green: '#60C43F',
        red: '#e7413f'
      },

      preloader: '<span class="converted_price de-preloader"></span>',

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

    convertPrices: function(source) {

      // Current rates from Fixer.io
      let rates = JSON.parse(localStorage.getItem('rates'));

      source.forEach(function(obj) {

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
     * @param    {array} arr
     * @param    {string} userCurrency
     * @param    {string} symbol
     * @param    {array} symbolArray
     * @return   {string} symbol
     */

    getSymbols: function(userCurrency, symbol) {

      let language = localStorage.getItem('language');

      this.exchangeList.forEach((name, f) => {

        if (name === userCurrency) {

          symbol = this.printSymbol[language][f];
        }
      });

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

    localizePrice: function(symbol, price) {

      let
          currency = localStorage.getItem('userCurrency'),
          language = localStorage.getItem('language');

          price = Number(price).toLocaleString(language, {currency: currency});

      if (language === 'en' ||
          language === 'ja') {


        return symbol + price;
      }

      if (language === 'de' ||
          language === 'fr' ||
          language === 'es') {


        return price + ' ' + symbol;
      }

      if (language === 'it') {


        return symbol + ' ' + price;
      }
    },

    /**
     * Maps price symbol to `exchangeList` array
     *
     * @instance
     * @param    {array} source
     * @return   {undefined}
     */

    matchSymbols: function(source) {

       source.forEach((obj, i) => {

         for (i = 0; i < this.symbolRegex.length; i++) {

           if (obj.price.match(this.symbolRegex[i], 'g')) {

             if (this.symbolRegex[i] === 's*¥' || this.symbolRegex[i] === 's*￥') {

               obj.isJPY = true;

             } else {

               obj.isJPY = false;
             }

             obj.exchangeName = this.exchangeList[i];
           }
         }
       });
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
     * @type {Array}
     */

    printSymbol: {

      de: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      en: ['€', '£', '¥', '¥', 'AU$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

      es: ['€', '£', 'JP¥', 'JP¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', 'US$'],

      fr: ['€', '£UK', 'JP¥', 'JP¥', '$AU', '$CA', 'CHF', 'SEK', '$NZ', 'ZAR', 'MX$', 'R$', '$US'],

      it: ['€', '£', 'JP¥', 'JP¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', 'US$'],

      ja: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$']
    },

    /**
     * Strips currency symbol from prices
     *
     * @instance
     * @param    {array} source
     * @return   {string}
     */

    sanitizePrices: function(source) {

      source.forEach(function(obj) {

        obj.price = obj.price.replace('&nbsp;', '');

        obj.price = obj.price.replace(',', '');

        obj.price = obj.price.replace('.', '');

        // extract all digits
        let digits = obj.price.match(/\d+(,\d+)*(\.\d+)?/, 'g')[0];

        return obj.sanitizedPrice = digits;
      });
    },

    /**
     * Returns text for sort buttons
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
     * @type {Array}
     */

    symbolRegex: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /^\s*NZ\$/, '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/],

    /**
     * Used to see if user is not yet registered as a seller
     *
     * @type {string}
     */

    unregistered: 'Please complete your Seller Settings before listing items for sale.'
  };

  // http://www.bennadel.com/blog/2160-adding-a-splice-method-to-the-javascript-string-prototype.htm
  if ( !('splice' in String.prototype) ) {

    String.prototype.splice = function(index, howManyToDelete, stringToInsert) {

      let characterArray = this.split('');

      Array.prototype.splice.apply(characterArray, arguments);

      return(characterArray.join(''));
    };
  }
}());
