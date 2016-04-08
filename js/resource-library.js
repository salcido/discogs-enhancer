(function() {

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
     * Calculates prices based on user's currency
     *
     * @instance
     * @param    {array || undefined} source
     * @param    {array} exchange
     * @param    {object} rates
     * @param    {array} pricesArr
     * @param    {sanitizedPrice} string
     * @return   {undefined}
     */

    convertPrices: function(source, exchange, pricesArr, sanitizedPrice) {

      // Current rates from Fixer.io
      let rates = JSON.parse(localStorage.getItem('rates'));

      if (Array.isArray(source)) {

        for (let h = 0; h < pricesArr.length; h++) {

          if (!rates.rates[exchange[h]]) {

            source.push(Number(pricesArr[h]));

          } else {

            source.push(pricesArr[h] / rates.rates[exchange[h]]);
          }
        }

        return source;

      } else {

        if (!rates.rates[exchange]) {

          source = Number(sanitizedPrice);

          return source;

        } else {

          source = sanitizedPrice / rates.rates[exchange];

          return source;
        }
      }
    },

    /**
     * A list of currency exchange acronyms
     *
     * @type {Array}
     */

    exchangeNme: ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'ZAR', 'MXN', 'BRL', 'USD'],

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

      this.exchangeNme.forEach((name, f) => {

        if (name === userCurrency) {

          symbol = this.symbolPrint[f];
        }
      });

      return symbol;
    },

    /**
     * Strips currency symbol from prices
     *
     * @instance
     * @param    {array || string} source
     * @param    {array} container
     * @return   {undefined}
     */

    sanitizePrices: function(source, container, singlePrice) {

      if (Array.isArray(source)) {

        source.forEach(function(price) {

          // extract all digits
          let digits = price.match(/\d+(,\d+)*(\.\d+)?/, 'g')[0];

          if (digits.indexOf(',') > -1) {

            digits = digits.replace(',', '');

            container.push(digits);

          } else {

            container.push(digits);
          }

          return container;
        });

      } else if (typeof singlePrice === 'string') {

        // extract all digits
        let digits = singlePrice.match(/\d+(,\d+)*(\.\d+)?/, 'g')[0];

        if (digits.indexOf(',') > -1) {

          digits = digits.replace(',', '');

          return singlePrice = digits;
        }

        return singlePrice = digits;
      }
    },

    /**
     * Maps price symbol to exchange array
     *
     * @instance
     * @param    {array || string} source
     * @param    {array} symbolRegex
     * @param    {array} exchangeArray
     * @param    {array} exchangeNme
     * @return   {undefined}
     */

    matchSymbols: function(source, exchangeArray) {

      if (Array.isArray(source)) {

        source.forEach((price, i) => {

          for (i = 0; i < this.symbolRegex.length; i++) {

            if (price.match(this.symbolRegex[i], 'g')) {

              exchangeArray.push(this.exchangeNme[i]);
            }
          }
        });

        return exchangeArray;

      } else if (typeof source === 'string') {

        for (let i = 0; i < this.symbolRegex.length; i++) {

          if (source.match(this.symbolRegex[i], 'g')) {

            return this.exchangeNme[i];
          }
        }
      }
    },

    /**
     * Prepares element for parsing into object
     *
     * @instance
     * @param    {string} element
     * @return   {string}
     */

    prepareObj: function(element) {

      element = element.substring(element.indexOf('return')).substring(7);

      element = element.substring(0, element.lastIndexOf('}')).substring(0, element.lastIndexOf(';'));

      element = JSON.parse(element);

      return element;
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
     * An array of symbols that will be used in price estimates injected into the DOM
     *
     * @type {Array}
     */

    symbolPrint: ['€', '£', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', 'ZAR', 'MX$', 'R$', '$'],

    /**
     * Regular expressions for detecting what currency a price is listed in.
     *
     * @type {Array}
     */

    symbolRegex: ['\s*\€', '\s*\£', '\s*\¥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /^\s*NZ\$/, '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/],

    /**
     * Used to see if user is not yet registered as a seller
     *
     * @type {string}
     */

    unregistered: 'Please complete your Seller Settings before listing items for sale.'
  };
}());
