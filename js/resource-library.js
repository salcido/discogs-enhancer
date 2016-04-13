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
     * @param    {array} source
     * @return   {array}
     */

    convertPrices: function(source) {

      // Current rates from Fixer.io
      let rates = JSON.parse(localStorage.getItem('rates'));

      source.forEach(function(obj) {

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
     * Maps price symbol to exchange array
     *
     * @instance
     * @param    {array} source
     * @return   {undefined}
     */

    matchSymbols: function(source) {

       source.forEach((obj, i) => {

         for (i = 0; i < this.symbolRegex.length; i++) {

           if (obj.price.match(this.symbolRegex[i], 'g')) {

             obj.exchangeName = this.exchangeNme[i];
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
     * Strips currency symbol from prices
     *
     * @instance
     * @param    {array} source
     * @return   {undefined}
     */

    sanitizePrices: function(source) {

      source.forEach(function(obj) {

        // extract all digits
        let digits = obj.price.match(/\d+(,\d+)*(\.\d+)?/, 'g')[0];

        if (digits.indexOf(',') > -1) {

          digits = digits.replace(',', '');
        }

        obj.sanitizedPrice = digits;
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
