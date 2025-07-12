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
 * The resourceLibrary (aka `rl`) holds methods and properties that are shared between
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
  window.resourceLibrary = window.rl = {

    /**
     * Appends notification to top of Discogs header
     * @param    {string} message
     * @returns   {undefined}
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
      //TODO: delete this when the header shit is settled
      let selector = document.querySelector('#site_headers_super_wrap')
                      ? '#site_headers_super_wrap'
                      : 'div[id*="__header_"]';

      document.querySelector(selector).appendChild(notice);
      document.getElementById('deAlertNotice').addEventListener('click', function() { this.remove(); });

      setTimeout(() => {
        document.getElementById('deAlertNotice').remove();
      }, 7000);
    },

    /**
     * Creates a CSS element and attaches it to the DOM
     * @param {String} id - The ID of the CSS element
     * @param {String} rules - The CSS markup
     * @returns {undefined}
     */
    attachCss: function(id, rules) {
      let css = document.createElement('style'),
          fragment = document.createDocumentFragment();

      css.id = id;
      css.rel = 'stylesheet';
      css.type = 'text/css';
      css.textContent = rules;

      fragment.appendChild(css);
      (document.head || document.documentElement).appendChild(fragment.cloneNode(true));
    },

    /**
     * Common HTML/CSS values
     * @type {Object}
     */
    css: {

      /**
       * The border that separates prices from suggestion comparisons
       * @type {string}
       */
      border: 'style="margin-top: 10px !important;' +
              'padding-top: 10px !important;' +
              'border-top: 1px dotted gray !important;"',

      /**
       * Displayed when Discogs has no price suggestion data on an item
       * @type {string}
       */
      noData: 'Discogs<br>does not have<br>price data on<br>this item.',

      /**
       * Preloader markup for anything not suggested-price related
       * Has `de-preloader` class
       * @type {string}
       */
      preloader: '<i class="icon icon-spinner icon-spin converted_price de-preloader" style="font-style: normal;"></i>',

      /**
       * Preloader markup for suggested prices
       * Has `de-price-preloader` class
       * @type {string}
       */
      pricePreloader: '<i class="icon icon-spinner icon-spin converted_price de-price-preloader" style="font-style: normal;"></i>',

      /**
       * Displayed when a user has price comparisons enabled but does
       * not have seller privileges
       * @type {string}
       */
      pleaseRegister: '<span class="converted_price de-suggested-price" ' +
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
     * Calls any other Marketplace filtering features
     * the user might have enabled.
     * @method callOtherMarketplaceFeatures
     * @returns {undefined}
     */
    callOtherMarketplaceFeatures: function() {

      let { blockList, favoriteList } = rl.getPreference('featureData'),
          sellersInCart = rl.getPreference('sellersInCart'),
          marketplaceQuerySelector =  'td.seller_info ul li:first-child a';

      // apply Marketplace Highlights
      if ( window.applyStyles ) window.applyStyles();
      // apply price comparisons
      if ( window.injectPriceLinks ) window.injectPriceLinks();

      // apply price comparisons
      if ( window.appendPrices ) {
        window.releasePricesInit(); // only used when viewing a single release
        window.appendPrices();
      }

      // Hide/tag sellers in marketplace
      if ( blockList && window.blockSellersPopover ) window.blockSellersPopover();

      if ( blockList && blockList.hide === 'global' && window.blockSellers ||
           blockList && blockList.hide === 'marketplace' && window.blockSellers ) {

        window.blockSellers('hide', marketplaceQuerySelector);
      }

      if ( blockList && blockList.hide === 'tag' && window.blockSellers ) {

        window.blockSellers('tag', marketplaceQuerySelector);
      }

      // Favorite sellers
      if ( favoriteList && window.favoriteSellers ) window.favoriteSellers();
      // filter marketplace media condition
      if ( window.filterMediaCondition ) window.filterMediaCondition();
      // filter marketplace sleeve condition
      if ( window.filterSleeveCondition ) window.filterSleeveCondition();

      // Filter shipping country
      if ( window.filterCountries ) {
        let { countryList } = rl.getPreference('featureData'),
            include = countryList.include,
            useCurrency = countryList.currency;
        window.filterCountries(include, useCurrency);
      }

      // Tag sellers by reputation
      if ( window.sellersRep ) window.sellersRep();
      // Release ratings
      if ( window.insertRatingsLink ) window.insertRatingsLink();
      // Remove from wantlist
      if ( window.insertRemoveLinks ) window.insertRemoveLinks();
      // Seller Items in Cart
      if ( window.sellerItemsInCart ) window.sellerItemsInCart(sellersInCart);
      // Filter Unavailable Items
      if ( window.filterUnavailable ) window.filterUnavailable();
      // Filter Prices
      if ( window.filterPrices ) window.filterPrices();
      // Demand Index
      if ( window.mpDemandIndex ) window.mpDemandIndex();
      // Open links in new tabs
      window.modifyLinks();
    },

    /**
     * Converts prices to user's currency
     * @param    {array<object>} source an array of release objects
     * @param    {object} data the exchange rates data
     * @returns   {array}
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
          obj.sanitizedPrice = Number(obj.sanitizedPrice/100).toFixed(2);
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
     * @type {Array}
     */
    exchangeList: ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'DKK', 'SEK', 'NZD', 'RUB', 'ZAR', 'MXN', 'BRL', 'USD'],

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
     * Determines the 'more' or 'less' word to use in the
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
     * @param    {string} item: name of the item to be returned
     * @returns   {object | string}
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
     * @param    {string} userCurrency
     * @param    {string} symbol
     * @returns   {string} symbol
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
     * Handles Prev/Next clicks in the Marketplace when
     * Everlasting Marketplace is disabled. Discogs uses
     * the jQuery pjax library to load pages in the Marketplace.
     * This method hooks on to the existing `pjax:end` event
     * and executes the functions passed to it.
     * @param {Object} fn - The function to call on `pjax:end`
     * @returns {undefined}
     */
    handlePaginationClicks: function(fn, ...args) {
      let checkjQ = setInterval(() => {
        if ( Object.prototype.hasOwnProperty.call(window, '$')
             && typeof window.$ === 'function') {
          clearInterval(checkjQ);
          window.$(document).on('pjax:end', () => fn(...args));
        }
      }, 13);
    },

    /**
     * Checks if an element is hidden from view.
     * @param {HTMLElement} elem - The element to check visibility
     * @returns {Boolean}
     */
    isHidden: function(elem) {
      return (elem.offsetParent === null);
    },

    /**
     * Detects whether an element is visible on the page
     * @param    {Object}   elem [the element to detect]
     * @returns   {Boolean}
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
     * @returns   {string}
     */
    language: function() {

      let id = document.getElementById('i18n_select') || null,
          hasValue = id ? id.options[id.selectedIndex] && id.options[id.selectedIndex].value : null,
          language = hasValue ? id.options[id.selectedIndex].value : 'en';

      language = (language === 'pt_BR') ? 'pt' : language;

      return language;
    },

    /**
     * Returns price suggestions in user's localized format
     * @param    {string} symbol The currency symbol
     * @param    {string} price The suggested price of the release
     * @param    {string} userCurrency The user's currency exchange name
     * @param    {string} language The user's language setting
     * @returns   {string}
     */
    localizeSuggestion: function(symbol, price, userCurrency, language) {

      let maxDigits,
          priceConfig;

      if ( !userCurrency || !language ) {
        userCurrency = this.getPreference('userCurrency');
        language = this.language();
      }

      // Use fractional values if user's currency is not JPY
      maxDigits = (userCurrency === 'JPY') ? 0 : 2;

      priceConfig = {
        currency: userCurrency,
        maximumFractionDigits: maxDigits,
        minimumFractionDigits: maxDigits
      };

      price = Number(price).toLocaleString(language, priceConfig);

      // Return price suggestions in user's locale
      switch (language) {

        case 'en':
        case 'ja':
        case 'ko':

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
     * @method
     * @returns {function}
     */
    log: function() {

      if ( this.options.debug() ) {

        return console.log(...arguments);
      }
    },

    /**
     * Maps price symbol to `exchangeList` array, determines if the release
     * is listed in `JPY` and sets the exchange name.
     * @param    {array<object>} source An array of objects representing release data
     * @returns   {object}
     */
    matchSymbols: function(source, language) {

      if ( !language ) { language = this.language(); }

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
     * @type {Object}
     */
    options: {

      /**
       * Whether to change price colors
       * @returns {boolean}
       */
      colorize: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            colorize = hasOptions ? hasOptions.colorize : false;
        return colorize;
      },

      /**
       * Whether to log values
       * @returns {Boolean}
       */
      debug: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            debug = hasOptions ? hasOptions.debug : false;
        return debug;
      },

      /**
       * Whether to highlight comments on the dashboard
       * @returns {Boolean}
       */
      highlightComments: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            comments = hasOptions ? hasOptions.comments : false;
        return comments;
      },

      oldpages: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            oldpages = hasOptions ? hasOptions.oldpages : false;
        return oldpages;
      },

      /**
       * Gets current options state
       * @returns {undefined}
       */
      getOptions: function() {

        let options = resourceLibrary.getPreference('options'),
            { colorize,
              comments,
              debug,
              itemsIWant,
              oldpages,
              quicksearch,
              threshold,
              unitTests } = options;

        if (colorize) { document.getElementById('colorize').checked = true; }

        if (comments) { document.getElementById('comments').checked = true; }

        if (debug) { document.getElementById('debug').checked = true; }

        if (itemsIWant) { document.getElementById('itemsIWant').value = itemsIWant; }

        if (oldpages) { document.getElementById('oldpages').checked = true; }

        if (quicksearch) { document.getElementById('quicksearch').value = quicksearch; }

        if (threshold) { document.getElementById('threshold').value = threshold; }

        if (unitTests) { document.getElementById('unittests').checked = true; }
      },

      /**
       * Saves selected options on options modal
       * @returns {function}
       */
      saveOptions: function() {

        let options,
            colorize = document.getElementById('colorize').checked,
            comments = document.getElementById('comments').checked,
            debug = document.getElementById('debug').checked,
            itemsIWant = document.getElementById('itemsIWant').value,
            oldpages = document.getElementById('oldpages').checked,
            quicksearch = document.getElementById('quicksearch').value,
            threshold = document.getElementById('threshold').value,
            unitTests = document.getElementById('unittests').checked;

        document.getElementById('saveOptions').disabled = true;

        /* get options object */
        options = resourceLibrary.getPreference('options');

        /* update values */
        options.colorize = colorize;
        options.comments = comments;
        options.debug = debug;
        options.itemsIWant = itemsIWant;
        options.oldpages = oldpages;
        options.quicksearch = quicksearch;
        options.threshold = threshold;
        options.unitTests = unitTests;

        /* save that ish */
        resourceLibrary.setPreference('options', options);
        resourceLibrary.appendNotice('Options have been successfully saved.', 'limeGreen');

        return location.reload();
      },

      /**
       * An additional string appended to the Items I Want shortcut
       * @returns {String}
       */
      itemsIWant: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            itemsIWant = hasOptions ? hasOptions.itemsIWant : '';
        return itemsIWant;
      },

      /**
       * An additional string appended to the quick-search google query
       * @returns {String}
       */
      quicksearch: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            quicksearch = hasOptions ? hasOptions.quicksearch : '';
        return quicksearch;
      },

      /**
       * The maximum percentage that an item will be ballpark estimated with: ±
       * @returns {number}
       */
      threshold: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            threshold = hasOptions ? hasOptions.threshold : 2;
        return Number(threshold);
      },

      /**
       * Whether to run unit tests
       * @returns {Boolean}
       */
      unitTests: function() {
        let hasOptions = resourceLibrary.getPreference('options'),
            unitTests = hasOptions ? hasOptions.unitTests : false;
        return unitTests;
      }
    },

    /**
     * Checks the page URL and returns `true` if anything in `pages`
     * IS found in the URL string
     * @param  {String} pages - The type of page to check for
     * @returns {Boolean}
     */
    pageIs: function(...pages) {
      let href = window.location.href;
      return pages.some(page => href.includes(this.pageKeys[page]));
    },

    /**
     * Checks the page URL and returns `true` if anything in `pages`
     * IS NOT found in the URL string
     * @param  {String} pages - The type of page to check for
     * @returns {Boolean}
     */
    pageIsNot: function(...pages) {
      let href = window.location.href;
      return pages.every(page => !href.includes(this.pageKeys[page]));
    },

    /**
     * Returns a boolean based on the #app selector
     * @returns {Boolean}
     */
    pageIsReact: function() {
      return Boolean(document.querySelector('#app'));
    },

    /**
     * Key/value pairs for quickly IDing pages in Discogs.
     * Used in conjunction with `pageIs` and `pageIsNot`
     * methods above.
     * @type {Object}
     * #WIP
     */
    pageKeys: {
      'addRelease': '/release/add',
      'allItems': '/sell/list',
      'artist': '/artist/',
      'buy': '/buy/',
      'buyerFeedback': '/buyer_feedback/',
      'cart': '/sell/cart/',
      'collection': '/collection',
      'dashboard': '/my',
      'drafts': '/drafts',
      'edit': '/edit/',
      'friends': '/users/friends',
      'history': '/history',
      'inventory': '/sell/manage',
      'label': '/label/',
      'lists': '/lists/',
      'master': '/master/',
      'messages': '/messages/view/',
      'myWants': '/sell/mywants',
      'order': '/sell/order/',
      'orders': '/sell/orders',
      'purchases': '/sell/purchases',
      'release': '/release/',
      'reviews': '/reviews',
      'sell': '/sell/',
      'seller': '/seller',
      'sellerFeedback': '/seller_feedback/',
      'sellItem': '/sell/item/',
      'sellMaster': '/sell/list',
      'sellRelease': '/sell/release',
      'settings': '/settings/',
      'stats': '/stats/',
      'update': '/update',
      'videos': '/videos/',
      'wantlist': '/mywantlist',
    },

    /**
     * Returns the total number of results from the Marketplace
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

        // Korean
        case 'ko':
          total = pagination.split('중')[0].trim();
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
     * @param    {string} url [the URL passed into the function]
     * @returns   {string} num [the parsed id number]
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
        // handle URLs with trailing /
        // e.g.: https://developer.chrome.com/docs/extensions/mv3/intro/
        if ( num === '' ) {
          num = urlArr[urlArr.length - 2];
        }

        return num;
      }
    },

    /**
     * Parses element into object
     * @param    {string} element
     * @returns   {object}
     */
    prepareObj: function(element) {

      element = element.substring(element.indexOf('return')).substring(7);

      element = element.substring(0, element.lastIndexOf('}')).substring(0, element.lastIndexOf(';'));

      element = JSON.parse(element);

      return element;
    },

    /**
     * Symbols that will be used in price estimates injected into the DOM.
     * Symbol indexes correspond to currencies in this order:
     * ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'RUB', 'ZAR', 'MXN', 'BRL', 'USD']
     * @type {object}
     */
    printSymbol: {

      de: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      en: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      es: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'US$'],

      fr: ['€', '£UK', '¥JP', '¥JP', '$AU', '$CA', 'CHF', 'DKK', 'SEK', '$NZ', '₽', 'ZAR', 'MX$', 'R$', '$US'],

      it: ['€', '£', 'JP¥', 'JP¥', 'A$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'USD'],

      ja: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$'],

      ko: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'US$'],

      pt: ['€', '£', 'JP¥', 'JP¥', 'AU$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', 'US$'],

      ru: ['€', '£', '¥', '¥', 'A$', 'CA$', 'CHF', 'DKK', 'SEK', 'NZ$', '₽', 'ZAR', 'MX$', 'R$', '$']
    },

    /**
     * Checks the `readyState` of the document before executing
     * the callback.
     * @param    {function} fn [the code to be run when the DOM is ready]
     * @returns   {undefined}
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
     * @param    {string} url [current page URL]
     * @returns   {string}
     */
    removePageParam: function(url) {

      let params;

      if ( url.indexOf('?') > -1 ) {

        let page = /page=/g;

        params = url.split('?')[1].split('&');
        params.forEach(param => {

          let target;

          if (param.match(page)) {
            target = params.indexOf(param);
            params.splice(target, 1);
          }
        });
      }

      return params && params.length ? '&' + params.join('&') : '';
    },

    /**
     * Deletes a preference from the `userPreferences` object
     * @param {String} preference - The preference to be deleted
     * @returns {null}
     */
    removePreference: function(preference) {

      let userPreferences = this.getItem('userPreferences');

      if (userPreferences && userPreferences[preference]) {
          delete userPreferences[preference];
          this.setItem('userPreferences', userPreferences);
      }
    },

    /**
     * Strips currency symbol, spaces and other characters
     * from release prices
     * @param    {array<object>} source An array of release objects
     * @returns   {object}
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
     * @param    {object} elem The button to set the text on
     * @returns   {object} elem
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
     * @param    {string} name The name to set
     * @param    {string|object} value The value to set
     * @returns   {function}
     */
    setItem: function(name, value) {
      value = JSON.stringify(value);
      return localStorage.setItem(name, value);
    },

    /**
     * Sets up a MutationObserver to look for specific
     * DOM elements to be rendered.
     * @param {String} selector - querySelector string
     * @param {String} target - Document or shadowRoot
     * @returns {Promise}
     */
    setObserver: function(selector, target = document) {
      return new Promise(resolve => {
        if ( target.querySelector(selector) ) {
          return resolve(target.querySelector(selector));
        }

        let observer = new MutationObserver(() => {
          if ( target.querySelector(selector) ) {

            observer.disconnect();
            return resolve(target.querySelector(selector));
          }
        });

        observer.observe(target.body, {
          childList: true,
          subtree: true
        });
      });
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
     * RegEx indexes correspond to currencies in this order:
     * ['EUR', 'GBP', 'JPY', 'JPY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'RUB', 'ZAR', 'MXN', 'BRL', 'USD']
     * @type {object}
     */
    symbolRegex: {

      de: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /([^C]A\$)/, /(CA\$)/, '\s*CHF', '\s*DKK', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /\$$/],

      en: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*DKK', '\s*SEK', /^\s*NZ\$/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/],

      es: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /(AU\$)/, /(CA\$)/, '\s*CHF', '\s*DKK', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /(US\$)/],

      fr: ['\s*\€', '\s*\£UK', '\s*\¥JP', '\s*\￥JP', /([^C]\$AU)/, /(\$CA)/, '\s*CHF', '\s*DKK', '\s*SEK', /(\$NZ)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /(\$US)/],

      it: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*DKK', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*US\$/],

      ja: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*DKK', '\s*SEK', /^\s*NZ\$/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*\$/],

      ko: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /^\s*A\$/, /^\s*CA\$/, '\s*CHF', '\s*DKK', '\s*SEK', /^\s*NZ\$/, '\s*RUB', '\s*ZAR', /^\s*MX\$/, /^\s*R\$/, /^\s*US\$/],

      pt: ['\s*\€', '\s*\£', '\s*JP\¥', '\s*JP\￥', /(AU\$)/, /(CA\$)/, '\s*CHF', '\s*DKK', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /(US\$)/],

      ru: ['\s*\€', '\s*\£', '\s*\¥', '\s*\￥', /([^C]A\$)/, /(CA\$)/, '\s*CHF', '\s*DKK', '\s*SEK', /(NZ\$)/, '\s*RUB', '\s*ZAR', /(MX\$)/, /(R\$)/, /\$$/],
    },

    /**
     * Helper method for testing user feedback feature
     * @param {Object} obj - User feedback object
     * @returns {undefined}
     */
    testFeedback: function() {
      let obj = this.getPreference('feedback'),
          username = this.username(),
          { buyer, seller } = obj[username];

      buyer.gTotal -= 1;
      seller.gTotal -= 1;
      buyer.posCount -= 1;
      seller.posCount -= 1;

      this.setPreference('feedback', obj);
      console.log('Test initiated. This window will reload in 2 minutes.');
      setTimeout(() => { location.reload(); }, 120000);
    },

    /**
     * Updates the `page` query param in the URL
     * @param {Number} pageNum - The page number
     * @returns {undefined}
     */
    updatePageParam: function(pageNum) {
      if ('URLSearchParams' in window) {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', pageNum);
        let path = `${window.location.pathname}?${searchParams.toString()}`;
        history.pushState(null, '', path);
      }
    },

    /**
     * Returns the username of the logged in user
     * @returns {String}
     */
    username: function() {
      let name;

      try {
        name = this.getCookie('ck_username') || window.dsdata().username;

      } catch (error) {

        return null;
      }

      if (!name) return;

      return name;
    },

    /**
     * Mutation Observer generally used to monitor anything that loads async
     * within the new React-based pages.
     * @param    {string} selector - the DOM selector string you're looking for
     * @param    {string} target - either Document or shadowRoot
     * @returns   {Promise}
     */
      waitForElement: function(selector, target) {
        return new Promise((resolve) => {
          let int = setInterval(() => {
            if (document.hasFocus()) {
              clearInterval(int);
              return resolve(this.setObserver(selector, target));
            }
          }, 100);
        });
      },
  };
}());
