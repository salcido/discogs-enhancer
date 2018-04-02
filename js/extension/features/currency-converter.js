/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {

  let
      d = new Date(),
      debug = resourceLibrary.options.debug(),
      errors,
      language = resourceLibrary.language(),
      lastUsedCurrency = resourceLibrary.getItem('lastUsedCurrency'),
      rates,
      input,
      output,
      baseCurrency,
      userCurrency,
      today = d.toISOString().split('T')[0],
      markup = `<div class="currency-converter">
                  <div class="toggle">¥ € $</div>
                  <div class="top">
                    <div class="ui-wrap">
                      <div class="currency">Convert:</div>
                      <div class="currency-select">
                        <select id="baseCurrency">
                          <option value="-">-</option>
                          <option value="AUD">AUD (A$)</option>
                          <option value="BRL">BRL (R$)</option>
                          <option value="CAD">CAD (CA$)</option>
                          <option value="CHF">CHF (CHF)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="MXN">MXN (MX$)</option>
                          <option value="NZD">NZD (NZ$)</option>
                          <option value="RUB">RUB (&#8381;)</option>
                          <option value="SEK">SEK (SEK)</option>
                          <option value="USD">USD ($)</option>
                          <option value="ZAR">ZAR (ZAR)</option>
                        </select>
                      </div>
                      <div class="<value-input></value-input>">
                        <input type="number" id="ccInput" max="999999999" min="0"></input>
                      </div>
                    </div>
                  </div>

                  <div class="bottom">
                    <div class="ui-wrap">
                      <div class="currency">To:</div>
                      <div class="currency-select">
                        <select id="userCurrency">
                          <option value="-">-</option>
                          <option value="AUD">AUD (A$)</option>
                          <option value="BRL">BRL (R$)</option>
                          <option value="CAD">CAD (CA$)</option>
                          <option value="CHF">CHF (CHF)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="MXN">MXN (MX$)</option>
                          <option value="NZD">NZD (NZ$)</option>
                          <option value="RUB">RUB (&#8381;)</option>
                          <option value="SEK">SEK (SEK)</option>
                          <option value="USD">USD ($)</option>
                          <option value="ZAR">ZAR (ZAR)</option>
                        </select>
                      </div>
                      <div id="clearBtn">
                        <button id="clear" class="button button-blue">Clear</button>
                      </div>
                      <div class="value-output">
                        <span id="ccOutput"></span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span id="errors" style="color: red !important;"></span>
                  </div>
                </div>`;

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Clears the errors in the currency converter
   * @method clearErrors
   * @returns {string}
   */
  function clearErrors() {

    if ( baseCurrency !== '-' && userCurrency !== '-' ) {
      return errors.textContent = '';
    }
  }

  /**
   * Converts the currencies set by the user
   * @method convertCurrency
   * @returns {undefined}
   */
  function convertCurrency() {

    let result,
        symbol,
        symbolIndex = getExchangeSymbol();

    // Make sure stuff is selected
    if ( baseCurrency.value === '-' || userCurrency.value === '-' ) {

      input.value = '';
      output.textContent = '';

      return errors.textContent = 'Please select two currencies.';
    }

    // Calculate the result
    result = ( input.value * rates.rates[userCurrency.value] ).toFixed(2);
    // Grab correct symbol from printSymbol array
    symbol = resourceLibrary.printSymbol[language][symbolIndex];
    // Voilà
    output.textContent =  resourceLibrary.localizeSuggestion(symbol, result, userCurrency.value, language);

    // Let's be reasonable about our conversion values
    if ( input.value.length > 10 || input.value > 9999999 ) {

      input.value = '';
      // ¯\_(ツ)_/¯
      return output.textContent = '\u00AF\u005C\u005F\u0028\u30C4\u0029\u005F\u002F\u00AF';
    }

    if ( input.value === '' ) { output.textContent = ''; }
  }

  /**
   * Deletion animation that runs when clear is pressed.
   * @method disolveAnimation
   * @returns {undefined}
   */
  function disolveAnimation() {

    let disolve = setInterval(() => {

      let text = input.textContent,
          val = input.value;

      text = val.substring(0, val.length - 1);
      input.value = text;
      output.textContent = input.value;

      if ( val <= 0 && val.length < 1 ) {

        clearInterval(disolve);
      }
    }, 20);
  }

  /**
   * Fetches the current exchange rates from fixer.io based on the
   * value set in the converter.
   * @method getConverterRates
   * @param {string} base The exchange name of the currency
   * @returns {object}
   */
  async function getConverterRates(base) {

    let url = `https://api.fixer.io/latest?base=${base}&symbols=AUD,CAD,CHF,EUR,SEK,ZAR,GBP,JPY,MXN,NZD,RUB,BRL,USD`;

    setUIforUpdating(true, 'Updating...');

    try {

      let response = await fetch(url),
          data = await response.json();

      resourceLibrary.setItem('converterRates', data);
      rates = resourceLibrary.getItem('converterRates');

      setUIforUpdating(false, '');
      convertCurrency();

      if ( debug ) {

        console.log(' ');
        console.log('*** Converter Rates ***');
        console.log('Date: ', rates.date);
        console.log('Base: ', rates.base);
        console.log(rates.rates);
      }
    } catch ( err ) {

      console.log('Could not get exchange rates for currency converter', err);

      input.placeholder = '';
      errors.textContent = 'Error. Please try again later.'
    }
  }

  /**
   * Returns the index number from the exchangeList array
   * that matches the user's currency value which is used
   * to look up the currency symbol to display in the
   * converter.
   * @method getExchangeSymbol
   * @returns {integer}
   */
  function getExchangeSymbol() {

    let idx;

    resourceLibrary.exchangeList.forEach((exchangeName, i) => {
      if ( exchangeName === userCurrency.value ) {
        idx = i;
      }
    });

    return idx;
  }

  /**
   * Returns the value of the selected option from a select element
   * @method getOptionValue
   * @param {object} elem The select element to get the option value from
   * @returns {string}
   */
  function getOptionValue(elem) {
    return elem.options[elem.options.selectedIndex].value;
  }

  /**
   * Enables or disables the UI when the converter
   * is updating the rates
   * @method setUIforUpdating
   * @param {boolean} disable Whether to enable the select/input element
   * @param {string} placeholderText The placeholder text to display during an update
   */
  function setUIforUpdating(disable, placeholderText) {

    userCurrency.disabled = disable;
    output.disabled = disable;
    input.placeholder = placeholderText;
  }

  // ========================================================
  // DOM Setup / Init
  // ========================================================

  // First thing to do is inject the form into the page
  document.body.insertAdjacentHTML('beforeend', markup);

  // UI Element selectors
  userCurrency = document.querySelector('#userCurrency');
  baseCurrency = document.querySelector('#baseCurrency');
  input = document.querySelector('.currency-converter #ccInput');
  output = document.querySelector('.currency-converter #ccOutput');
  errors = document.querySelector('#errors');

  // Check for existing rates
  if ( !resourceLibrary.getItem('converterRates') ) {

    rates = null;

  } else {

    rates = resourceLibrary.getItem('converterRates');
    // Select the value for `baseCurrency` if available
    [...baseCurrency.options].forEach(opt => {
      if ( opt.value === rates.base ) {
        opt.selected = true;
      }
    });
  }

  // Disable the matching currency in the other select box
  // so that you can't compare EUR to EUR, etc...
  if ( rates.base ) {

    [...userCurrency.options].forEach(opt => {
      if ( opt.value === rates.base ) {
        opt.disabled = true;
      }
    });
  }

  // Remember state for #userCurrency
  if ( lastUsedCurrency ) {

    [...userCurrency.options].forEach(opt => {
      if ( opt.value === lastUsedCurrency ) {
        opt.selected = true;
      }
    });
  }

  // Disable ability to select '-' option
  // so ajax call does not come back 422 (Unprocessable Entity)
  [...baseCurrency.options].forEach(opt => {
    if ( opt.value === '-' ) {
      opt.disabled = true;
    }
  });

  // Check to see how old the rates are and update them if needed
  if ( rates && rates.date !== today ) {

    if ( debug ) {

      console.log(' ');
      console.log(' *** Auto-updating Currency Converter rates *** ');
    }

    rates = resourceLibrary.getItem('converterRates');
    getConverterRates(rates.base);
  }

  // ========================================================
  // Form Functionality
  // ========================================================

  // Calculate currency value on each key stroke.
  // `setTimeout` is used here because without it, calculations are not performed in
  // realtime and, instead, are one calculation behind the last digit entered.
  input.addEventListener('keydown', () => setTimeout(convertCurrency, 0));

  // ========================================================
  // UI Functionality
  // ========================================================

  // Clear out all data
  document.querySelector('.currency-converter #clear').addEventListener('click', () => {

    let disolve,
        hasDecimal = input.value.includes('.');

    // Strip decimal to stop Chrome from console.warning on invalid number
    if ( hasDecimal ) { input.value = input.value.replace('.', ''); }
    // Delete the value from the input in an animated fashion
    disolveAnimation();
  });

  // Update base value on change
  document.querySelector('#baseCurrency').addEventListener('change', () => {

    let baseValue = getOptionValue(baseCurrency),
        userValue = getOptionValue(userCurrency);

    // Reset #userCurrency if #baseCurrency is the same
    if ( baseValue === userValue ) {
      userCurrency.options.selectedIndex = 0;
    }

    clearErrors();
    // Disable option if used as base currency
    [...userCurrency.options].forEach(opt => {
      return opt.value === baseValue ? opt.disabled = true : opt.disabled = false;
    });
    // Update rates
    getConverterRates(baseValue);
  });

  // Show/Hide converter on click
  document.querySelector('.currency-converter .toggle').addEventListener('click', event => {

    let baseValue = getOptionValue(baseCurrency),
        userValue = getOptionValue(userCurrency),
        converter = document.querySelector('.currency-converter');

    // Reset #userCurrency if #baseCurrency is the same
    if ( baseValue === userValue ) {
      userCurrency.options.selectedIndex = 0;
    }

    // Show/Hide the converter
    converter.classList.contains('show-converter')
      ? converter.classList.remove('show-converter')
      : converter.classList.add('show-converter');

    // Set the focus on the input
    input.focus();
    // Clear out errors so hiding continues to work as expected
    errors.textContent = '';
    // Change the tab text
    return event.target.textContent === '¥ € $'
            ? event.target.textContent = '£ € $ $'
            : event.target.textContent = '¥ € $';
  });

  // Save last known state of #userCurrency
  userCurrency.addEventListener('change', () => {

    clearErrors();
    convertCurrency();

    resourceLibrary.setItem('lastUsedCurrency', getOptionValue(userCurrency));
  });
});
