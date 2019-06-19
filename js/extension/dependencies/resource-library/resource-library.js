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
 * features. The `Init / Setup` block is the place to put code that needs to run
 * before anything else in the extension.
 *
 * Notes:
 *
 * Each release object in `priceContainer` || `source` array
 * will ultimately look something like this:

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

  // ========================================================
  // Init / Setup
  // ========================================================

  // Instantiate default option values if not present
  if ( !localStorage.getItem('options') ) {

    let options = {
          analytics: true,
          colorize: false,
          comments: false,
          debug: false,
          quicksearch: '',
          threshold: 2,
          unitTests: false
        };

    options = JSON.stringify(options);

    localStorage.setItem('options', options);
  }

 /**
  * Array.splice method applied to Strings.
  *
  * @param    {number} index Where to begin in the string
  * @param    {number} remove The number of chracters to remove from the string
  * @param    {string} insert The string to insert
  * @return   {string}
  */

  if ( !('splice' in String.prototype) ) {
    // eslint-disable-next-line no-unused-vars
    String.prototype.splice = function(index, remove, insert) {

      let chars = this.split('');

      Array.prototype.splice.apply(chars, arguments);

      return chars.join('');
    };
  }

  // ========================================================
  // Begin resourceLibrary
  // ========================================================

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
       * Displayed when Discogs has no price suggestion data on an item
       *
       * @type {string}
       */

      noData: 'Discogs<br>does not have<br>price data on<br>this item.',

      /**
       * Preloader markup for anything not suggested-price related
       * Has `de-preloader` class
       *
       * @type {string}
       */

      preloader: '<i class="icon icon-spinner icon-spin converted_price de-preloader" style="font-style: normal;"></i>',

      /**
       * Preloader markup for suggested prices
       * Has `de-price-preloader` class
       *
       * @type {string}
       */

      pricePreloader: '<i class="icon icon-spinner icon-spin converted_price de-price-preloader" style="font-style: normal;"></i>',

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
     * @param    {array<object>} source an array of releaes objects
     * @param    {object} data the exchange rates data
     * @return   {array}
     */

    convertPrices: function(source, data) {

      if ( !data ) {
        // Current rates from discogs-enhancer.com
        data = this.getPreference('exchangeRates').data;

        if ( data === null ) {

          console.log('Currency has recently been changed. Please refresh the page one more time.');
        }
      }

      source.forEach(obj => {

        if ( !obj.isJPY ) {

          let injectionPoint = obj.sanitizedPrice.length - 2;

          obj.sanitizedPrice = obj.sanitizedPrice.splice(injectionPoint, 0, '.');
        }

        for ( let h = 0; h < source.length; h++ ) {

          if ( !data.rates[obj.exchangeName] ) {

            obj.convertedPrice = Number(obj.sanitizedPrice);

          } else {

            obj.convertedPrice = (obj.sanitizedPrice / data.rates[obj.exchangeName]);
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
     * Fades the `.de-price` element in by adding the
     * 'show' class
     * @param {object} elem The target element to fade in
     * @returns {method}
     */

    fade: function(elem) {

      return setTimeout(() => {

        [...elem.querySelectorAll('.de-price')].forEach(el => {

          if ( !el.classList.contains('show') ) {

            el.classList.add('show');
          }
        });
      }, 100);
    },

    /**
     * Determins the 'more' or 'less' word to use in the
     * price comparison string.
     * @param {number} percentage The +/- percent an item is priced at
     * @param {number} threshold The number the item has to exceed to be listed in red
     * @returns {string}
     */

    getAmountString: function(percentage, threshold) {

      let amount;

      // Less than suggested
      if ( percentage > threshold ) {

        amount = 'less';

        // More than suggested
      } else if ( percentage < -threshold ) {

        amount = 'more';

        // Within threshold
      } else {

        amount = '';
      }

      return amount;
    },

    /**
     * Gets the specified cookie
     * @param cname {string} The name of the cookie to get
     * @returns {string}
     */

    getCookie: function(cname) {

    let name = cname + '=',
        ca = document.cookie.split(';');

      for (let i = 0; i < ca.length; i++) {

        let c = ca[i];

        while ( c.charAt(0) === ' ' ) {

          c = c.substring(1);
        }

        if ( c.indexOf(name) === 0 ) {

          return c.substring(name.length, c.length);
        }
      }

      return '';
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
     * Returns a preference from the userPreferences object
     * @param {String} preference - the name of the preference to return
     * @returns {String|Boolean|Array|Number|Object}
     */
    getPreference: function(preference) {

      let userPreferences = this.getItem('userPreferences');

      if (userPreferences && userPreferences[preference]) {
        return userPreferences[preference];
      }

      return null;
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
            isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight * 2);

        return isVisible;
      }
    },

    /**
     * Returns the currently selected language
     *
     * @return   {string}
     */

    language: function() {

      let id = document.getElementById('i18n_select'),
          language = id.options[id.selectedIndex].value;

      language = language === 'pt_BR' ? 'pt' : language;

      return language;
    },

    /**
     * Returns price suggestions in user's localized format
     *
     * @param    {string} symbol The currency symbol
     * @param    {string} price The suggested price of the release
     * @param    {string} userCurrency The user's currency exchange name
     * @param    {string} language The user's language setting
     * @return   {string}
     */

    localizeSuggestion: function(symbol, price, userCurrency, language) {

      let maxDigits,
          priceConfig;

      if ( !userCurrency || !language ) {

        userCurrency = this.getPreference('userCurrency');

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
        case 'it':
        case 'ru':

          this.log('Localized Suggestion: ', price + ' ' + symbol);

          return price + ' ' + symbol;

        case 'pt':

          this.log('Localized Suggestion: ', symbol + ' ' + price);

          return symbol + ' ' + price;
      }
    },

    /**
     * Console.logs stuff
     *
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
       * Whether or not to highlight comments on the dashboard
       *
       * @return {Boolean}
       */

      highlightComments: function() {

        return JSON.parse(localStorage.getItem('options')).comments;
      },

      /**
       * Gets current options state
       *
       * @return {undefined}
       */

      getOptions: function() {

        let options = resourceLibrary.getItem('options'),
            { analytics,
              colorize,
              comments,
              debug,
              quicksearch,
              threshold,
              unitTests } = options;

        if (analytics) { document.getElementById('analytics').checked = true; }

        if (colorize) { document.getElementById('colorize').checked = true; }

        if (comments) { document.getElementById('comments').checked = true; }

        if (debug) { document.getElementById('debug').checked = true; }

        if (quicksearch) { document.getElementById('quicksearch').value = quicksearch; }

        if (threshold) { document.getElementById('threshold').value = threshold; }

        if (unitTests) { document.getElementById('unittests').checked = true; }
      },

      /**
       * Saves selected options on options modal
       *
       * @return {function}
       */

      saveOptions: function() {

        let
            analytics = document.getElementById('analytics').checked,
            colorize = document.getElementById('colorize').checked,
            debug = document.getElementById('debug').checked,
            comments = document.getElementById('comments').checked,
            options,
            quicksearch = document.getElementById('quicksearch').value,
            threshold = document.getElementById('threshold').value,
            unitTests = document.getElementById('unittests').checked;

        document.getElementById('saveOptions').disabled = true;

        /* get options object */
        options = JSON.parse(localStorage.getItem('options'));

        /* update values */
        options.analytics = analytics;
        options.colorize = colorize;
        options.comments = comments;
        options.debug = debug;
        options.quicksearch = quicksearch;
        options.threshold = threshold;
        options.unitTests = unitTests;

        options = JSON.stringify(options);

        /* save that ish */
        localStorage.setItem('options', options);

        resourceLibrary.appendNotice('Options have been successfully saved.', 'limeGreen');

        return location.reload();
      },

      quickSearch: function() {

        let quicksearch = this.getItem('quicksearch');

        return quicksearch;
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
     * Checks the page URL and returns `true` if anything in `pages`
     * IS found in the URL string
     * @param  {String} pages - Thte type of page to check for
     * @returns {Boolean}
     */
    pageIs: function(...pages) {
      let href = window.location.href;
      return pages.some(page => href.includes(this.pageKeys[page]));
    },

    /**
     * Checks the page URL and returns `true` if anything in `pages`
     * IS NOT found in the URL string
     * @param  {String} pages - Thte type of page to check for
     * @returns {Boolean}
     */
    pageIsNot: function(...pages) {
      let href = window.location.href;
      return pages.every(page => !href.includes(this.pageKeys[page]));
    },

    /**
     * Key/value pairs for quickly IDing pages in Discogs.
     * Used in conjunction with `pageIs` and `pageIsNot`
     * methods above.
     * #WIP
     */
    pageKeys: {
      'allItems': '/sell/list',
      'artist': '/artist/',
      'buy': '/buy/',
      'buyerFeedback': '/buyer_feedback/',
      'cart': '/sell/cart/',
      'collection': '/collection',
      'dashboard': '/my',
      'edit': '/edit/',
      'friends': '/users/friends',
      'history': '/history',
      'label': '/label/',
      'lists': '/lists/',
      'master': '/master/',
      'myWants': '/sell/mywants',
      'order': '/sell/order/',
      'purchases': '/sell/purchases',
      'release': '/release/',
      'reviews': '/reviews',
      'sell': '/sell/',
      'seller': '/seller',
      'sellerFeedback': '/seller_feedback/',
      'sellItem': '/sell/item/',
      'sellMaster': '/sell/list',
      'sellRelease': '/sell/release',
    },

    /**
     * Returns the total number of results from the Marketplace
     *
     * @method paginationTotal
     * @param {string} pagination The text from the .pagination_total element
     * @returns {string}
     */
    paginationTotal: function(pagination) {

      let total,
          lang = this.language();

      switch (lang) {

        // German
        case 'de':
          total = pagination.split('von')[1];
          break;

        // Italian
        case 'it':
          total = pagination.split('di')[1];
          break;

        // Spanish, French, Portuguese
        case 'es':
        case 'fr':
        case 'pt':
          total = pagination.split('de')[1];
          break;

        // Japanese
        case 'ja':
          total = pagination.split('中')[0];
          break;

        // Russian
        case 'ru':
          total = pagination.split('из')[1];
          break;

        // English
        default:
          total = pagination.split('of')[1];
          break;
      }

      return total;
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

      if (url) {

        let urlArr = url.split('/'),
            num = urlArr[urlArr.length - 1];

        if ( num.includes('-') ) {

          num = num.split('-')[0];
        }

        if ( num.includes('?') ) {

          num = num.split('?')[0];
        }

        return num;
      }
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
     * Symbols that will be used in price estimates injected into the DOM.
     *
     * Symbol indexes correspond to currencies in this order:
     * ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'RUB', 'ZAR', 'MXN', 'BRL', 'USD']
     * @type {object}
     */

    printSymbol: {

      de: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      en: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      es: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'US$'],

      fr: ['€', '£UK', '¥JP', '¥JP', '$AU', '$CA', 'CHF', 'SEK', '$NZ', '₽', 'ZAR', 'MX$', 'R$', '$US'],

      it: ['€', '£', 'JP¥', 'JP¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'USD'],

      ja: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      pt: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'US$'],

      ru: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$']
    },

    /**
     * Checks the `readyState` of the document before executing
     * the callback.
     *
     * @param    {function} fn [the code to be run when the DOM is ready]
     * @return   {undefined}
     */

    ready: function(fn) {

      if ( document.readyState !== 'loading' ) {

        fn();

      } else {

        document.addEventListener('DOMContentLoaded', fn);
      }
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
     * Strips currency symbol, spaces and other characters
     * from release prices
     *
     * @param    {array<object>} source An array of release objects
     * @return   {object}
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
     * @param    {object} elem The button to set the text on
     * @return   {object} elem
     */

    setButtonText: function(elem) {

      switch(elem.textContent.trim()) {

        case 'Sort A-Z':
          elem.textContent = 'Sort Z-A';
          return elem;

        case 'Sort Z-A':
          elem.textContent = 'Undo Sort';
          return elem;

        case 'Undo Sort':
          elem.textContent = 'Sort A-Z';
          return elem;
      }
    },

    /**
     * Convenience method so I don't forget to stringify
     * my values before setting them.
     *
     *
     * @param    {string} name The name to set
     * @param    {string|object} value The value to set
     * @return   {function}
     */

    setItem: function(name, value) {

      value = JSON.stringify(value);

      return localStorage.setItem(name, value);
    },

    /**
     * Sets feature data on the `userPreferences` object
     * @param {String} name - The prop name to set
     * @param {Object|Array|Number|String} value - The prop value to set
     * @returns {undefined}
     */
    setPreference: function(name, value) {

      let userPreferences = this.getItem('userPreferences');

      userPreferences[name] = value;

      this.setItem('userPreferences', userPreferences);
    },

    setScanner: function() {

      let obj = {
        wants: true,
        int: 300
      };

      return this.setPreference('scan', obj);
    },

    /**
     * Regular expressions for determining what currency a price is listed in.
     *
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

      ja: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*SEK', /^\s*NZ\$/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/],

      pt: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /(AU\$)/, /(CA\$)/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /(US\$)/],

      ru: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /([^C]A\$)/, /(CA\$)/, '\s*CHF', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /\$$/],
    },

    /**
     * Helper method for testing user feedback feature
     * @param {Object} obj - User feedback object
     * @returns {undefined}
     */
    testFeedback: function() {
      let obj = this.getPreference('feedback'),
          { buyer, seller } = obj;

      buyer.gTotal -= 1;
      seller.gTotal -= 1;
      buyer.posCount -= 1;
      seller.posCount -= 1;

      this.setPreference('feedback', obj);
      console.log('Test initiated. Check back in two minutes.');
    },

    /**
     * Used to determine if user has seller permissions
     * @type {string}
     */
    unregistered: 'Please complete your Seller Settings before listing items for sale.',

    /**
     * Hooks into `XMLHttpRequest` so that functions can be called
     * after a successful XHR.
     * @param {function} fn the callback function to execute
     * @returns {method}
     */
    xhrSuccess: function(fn) {

      let proxied = window.XMLHttpRequest.prototype.send;

      window.XMLHttpRequest.prototype.send = () => {

        let pointer = this,
            intervalId;

        intervalId = window.setInterval(() => {

          if (pointer.readyState !== 4) { return; }

          fn();

          clearInterval(intervalId);
        }, 1);

        return proxied.apply(this, [].slice.call(arguments));
      };
    }
  };
}());
