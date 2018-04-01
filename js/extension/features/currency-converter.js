/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

 /**
  * REFACTOR NOTES
  *
  * set vars for each UI element (document.querySelector('#thatCurrency'))
  * Document functions
  * Alphabetize functions
  * Break up convertCurrency into smaller functions
  */

resourceLibrary.ready(() => {

  let
      d = new Date(),
      debug = resourceLibrary.options.debug(),
      language = resourceLibrary.language(),
      lastUsedCurrency = resourceLibrary.getItem('lastUsedCurrency'),
      rates,
      thisSelectedCurrency,
      today = d.toISOString().split('T')[0],
      markup = `<div class="currency-converter">
                  <div class="toggle">¥ € $</div>
                  <div class="top">
                    <div class="ui-wrap">
                      <div class="currency">Convert:</div>
                      <div class="currency-select">
                        <select id="thisCurrency">
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
                        <select id="thatCurrency">
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

    let base = getOptionValue(document.querySelector('#thisCurrency')),
        thatC = getOptionValue(document.querySelector('#thatCurrency'));

    if ( base !== '-' && thatC !== '-' ) {

      return document.querySelector('#errors').textContent = '';
    }
  }

  /**
   * Converts the currencies set by the user
   * @method convertCurrency
   * @returns {undefined}
   */
  function convertCurrency() {

    let
        errors = document.querySelector('#errors'),
        input = document.querySelector('.currency-converter #ccInput'),
        output = document.querySelector('.currency-converter #ccOutput'),
        result,
        symbol,
        symbolIndex,
        thatSelectedCurrency = document.querySelector('#thatCurrency').options[document.querySelector('#thatCurrency').selectedIndex].value,
        thisCurrency = document.querySelector('#thisCurrency').options[document.querySelector('#thisCurrency').selectedIndex].value;

    // Figure out what we are converting to and use that symbol
    resourceLibrary.exchangeList.forEach((exchangeName, i) => {

      if ( exchangeName === thatSelectedCurrency ) {

        return symbolIndex = i;
      }
    });

    // Make sure stuff is selected
    if ( thisCurrency === '-' || thatSelectedCurrency === '-' ) {

      input.value = '';

      output.textContent = '';

      return errors.textContent = 'Please select two currencies.';
    }

    // Calculate the result
    result = ( input.value * rates.rates[thatSelectedCurrency] ).toFixed(2);

    // Grab correct symbol from printSymbol array
    symbol = resourceLibrary.printSymbol[language][symbolIndex];

    // Voilà
    output.textContent =  resourceLibrary.localizeSuggestion(symbol, result, thatSelectedCurrency, language);

    // Let's be reasonable about our conversion values
    if ( input.value.length > 10 || input.value > 9999999 ) {

      input.value = '';

      // ¯\_(ツ)_/¯
      output.textContent = '\u00AF\u005C\u005F\u0028\u30C4\u0029\u005F\u002F\u00AF';

      return;
    }

    if ( input.value === '' ) {

      output.textContent = '';
    }
  }

  /**
   * Enables or disables the UI when the converter
   * is updating the rates
   * @method setUIforUpdating
   * @param {boolean} disable Whether to enable the select/input element
   * @param {string} placeholderText The placeholder text to display during an update
   */
  function setUIforUpdating(disable, placeholderText) {

    document.querySelector('#thatCurrency').disabled = disable;
    document.querySelector('.currency-converter #ccInput').disabled = disable;
    document.querySelector('.currency-converter #ccInput').placeholder = placeholderText;
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
    } catch(err) {

      console.log('Could not get exchange rates for currency converter', err);

      document.querySelector('.currency-converter #ccInput').placeholder = '';
      document.querySelector('#errors').textContent = 'Error. Please try again later.'
    }
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

  // ========================================================
  // DOM Setup
  // ========================================================

  // First thing to do is inject the form into the page
  document.body.insertAdjacentHTML('beforeend', markup);
  // TODO set element vars here

  // Check for existing rates
  if ( !resourceLibrary.getItem('converterRates') ) {

    rates = null;
    thisSelectedCurrency = null;

  } else {

    let sel = document.querySelector('#thisCurrency');

    rates = resourceLibrary.getItem('converterRates');
    thisSelectedCurrency = rates.base;

    // Select the value for thisCurrency if available
    [...sel.options].forEach(o => {
      if ( o.value === rates.base ) {
        o.selected = true;
      }
    });
  }

  // Disable the matching currency in the other select box
  // so that you can't compare EUR to EUR, etc...
  if ( thisSelectedCurrency ) {

    let sel = document.querySelector('#thatCurrency');

    [...sel.options].forEach(o => {
      if ( o.value === thisSelectedCurrency ) {
        o.disabled = true;
      }
    });
  }

  // Remember state for #thatCurrency
  if ( lastUsedCurrency ) {

    let sel = document.querySelector('#thatCurrency');

    [...sel.options].forEach(o => {
      if ( o.value === lastUsedCurrency ) {
        o.selected = true;
      }
    });
  }

  // Disable ability to select '-' option
  // so ajax call does not come back 422 (Unprocessable Entity)
  [...document.querySelector('#thisCurrency').options].forEach(o => {
    if ( o.value === '-' ) {
      o.disabled = true;
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
  document.querySelector('.currency-converter #ccInput').addEventListener('keyup', () => setTimeout(convertCurrency, 0));
  document.querySelector('.currency-converter #ccInput').addEventListener('keydown', () => setTimeout(convertCurrency, 0));

  // ========================================================
  // UI Functionality
  // ========================================================

  // Clear out all data
  document.querySelector('.currency-converter #clear').addEventListener('click', () => {

    let disolve,
        input = document.querySelector('.currency-converter #ccInput'),
        hasDecimal = input.value.includes('.');

    // Strip decimal to stop Chrome from console.warning on invalid number
    if ( hasDecimal ) {

      let amount = input.value;

      amount = amount.replace('.', '');
      input.value = amount;
    }

    // Delete the value from the input in an animated fashion
    disolve = setInterval(() => {

      let output = document.querySelector('.currency-converter #ccOutput'),
          text = input.textContent,
          val = input.value;

      text = val.substring(0, val.length - 1);

      input.value = text;

      output.textContent = input.value;

      if ( val <= 0 && val.length < 1 ) {

        clearInterval(disolve);
      }
    }, 20);
  });


  // Update base value on change
  document.querySelector('#thisCurrency').addEventListener('change', () => {

    let base = document.querySelector('#thisCurrency'),
        baseValue = getOptionValue(base),
        thatC = document.querySelector('#thatCurrency'),
        thatCvalue = getOptionValue(thatC);

    // Reset #thatCurrency if #thisCurrency is the same
    if ( baseValue === thatCvalue ) {

      thatC.options.selectedIndex = 0;
    }

    clearErrors();
    // Disable option if used as base currency
    $('#thatCurrency option[value="' + baseValue + '"]').prop('disabled', true).siblings().prop('disabled', false);
    // Update rates
    getConverterRates(baseValue);
  });


  // Show/Hide converter on click
  document.querySelector('.currency-converter .toggle').addEventListener('click', event => {

    let base = getOptionValue(document.querySelector('#thisCurrency')),
        thatC = getOptionValue(document.querySelector('#thatCurrency')),
        converter = document.querySelector('.currency-converter');

    // Reset #thatCurrency if #thisCurrency is the same
    if ( base === thatC ) {
      document.querySelector('#thatCurrency').options.selectedIndex = 0;
    }

    // Show/Hide the converter
    converter.classList.contains('show-converter')
      ? converter.classList.remove('show-converter')
      : converter.classList.add('show-converter');

    // Set the focus on the input
    document.querySelector('#ccInput').focus();
    // Clear out errors so hiding continues to work as expected
    document.querySelector('#errors').textContent = '';
    // Change the tab text
    return event.target.textContent === '¥ € $'
            ? event.target.textContent = '£ € $ $'
            : event.target.textContent = '¥ € $';
  });


  // Save last known state of #thatCurrency
  document.querySelector('#thatCurrency').addEventListener('change', () => {

    clearErrors();
    convertCurrency();

    resourceLibrary.setItem('lastUsedCurrency', getOptionValue(document.querySelector('#thatCurrency')));
  });
});
