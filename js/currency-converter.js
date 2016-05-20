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

  let
      d = new Date(),
      debug = resourceLibrary.options.debug(),
      language = resourceLibrary.language(),
      lastUsedCurrency = resourceLibrary.getItem('lastUsedCurrency'),
      rates,
      thisSelectedCurrency,
      today = d.toISOString().split('T')[0],
      markup = '<div class="currency-converter">' +
                  '<div class="toggle">¥ € $</div>' +
                  '<div class="top">' +
                    '<div class="ui-wrap">' +
                      '<div class="currency">Convert:</div>' +
                      '<div class="currency-select">' +
                        '<select id="thisCurrency">' +
                          '<option value="-">-</option>' +
                          '<option value="AUD">AUD (A$)</option>' +
                          '<option value="BRL">BRL (R$)</option>' +
                          '<option value="CAD">CAD (CA$)</option>' +
                          '<option value="CHF">CHF (CHF)</option>' +
                          '<option value="EUR">EUR (€)</option>' +
                          '<option value="GBP">GBP (£)</option>' +
                          '<option value="JPY">JPY (¥)</option>' +
                          '<option value="MXN">MXN (MX$)</option>' +
                          '<option value="NZD">NZD (NZ$)</option>' +
                          '<option value="SEK">SEK (SEK)</option>' +
                          '<option value="USD">USD ($)</option>' +
                          '<option value="ZAR">ZAR (ZAR)</option>' +
                        '</select>' +
                      '</div>' +
                      '<div class="<value-input></value-input>">' +
                        '<input type="number" id="ccInput" max="999999999" min="0"></input>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +

                  '<div class="bottom">' +
                    '<div class="ui-wrap">' +
                      '<div class="currency">To:</div>' +
                      '<div class="currency-select">' +
                        '<select id="thatCurrency">' +
                          '<option value="-">-</option>' +
                          '<option value="AUD">AUD (A$)</option>' +
                          '<option value="BRL">BRL (R$)</option>' +
                          '<option value="CAD">CAD (CA$)</option>' +
                          '<option value="CHF">CHF (CHF)</option>' +
                          '<option value="EUR">EUR (€)</option>' +
                          '<option value="GBP">GBP (£)</option>' +
                          '<option value="JPY">JPY (¥)</option>' +
                          '<option value="MXN">MXN (MX$)</option>' +
                          '<option value="NZD">NZD (NZ$)</option>' +
                          '<option value="SEK">SEK (SEK)</option>' +
                          '<option value="USD">USD ($)</option>' +
                          '<option value="ZAR">ZAR (ZAR)</option>' +
                        '</select>' +
                      '</div>' +
                      '<div id="clearBtn">' +
                        '<button id="clear" class="button button_blue">Clear</button>' +
                      '</div>' +
                      '<div class="value-output">' +
                        '<span id="ccOutput"></span>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                  '<div>' +
                    '<span id="errors" style="color: red !important;"></span>' +
                  '</div>' +
                '</div>';

  // Draxx them sklounst
  function convertCurrency() {

    let
        errors = $('#errors'),
        input = $('.currency-converter #ccInput'),
        output = $('.currency-converter #ccOutput'),
        result,
        symbol,
        symbolIndex,
        thatSelectedCurrency = $('#thatCurrency option:selected').val(),
        thisCurrency = $('#thisCurrency option:selected').val();

    // Figure out what we are converting to and use that symbol
    resourceLibrary.exchangeList.forEach(function(exchangeName, i) {

      if (exchangeName === thatSelectedCurrency) {

        return symbolIndex = i;
      }
    });

    // Make sure stuff is selected
    if (thisCurrency === '-' || thatSelectedCurrency === '-') {

      input.val('');

      output.text('');

      return errors.text('Please select two currencies.');
    }

    // Calculate the result
    result = (input.val() * rates.rates[thatSelectedCurrency]).toFixed(2);

    // Grab correct symbol from printSymbol array
    symbol = resourceLibrary.printSymbol[language][symbolIndex];

    // Voilà
    output.text( resourceLibrary.localizePrice(symbol, result, thatSelectedCurrency, language) );

    // Let's get serious - serious. I want to get seriousssss.
    if (input.val().length > 10 || input.val() > 9999999) {

      input.val('');

      output.html('&#175;\\\_(&#12484;)_/&#175;');

      return;
    }

    if (input.val() === '') {

      output.text('');
    }
  }

  // Update rates
  function getConverterRates(base) {

    $('#thatCurrency').prop('disabled', true);

    $('.currency-converter #ccInput').prop('disabled', true);

    $('.currency-converter #ccInput').attr('placeholder', 'Updating...');

    $.ajax({

      url:'https://api.fixer.io/latest?base=' + base + '&symbols=AUD,CAD,CHF,EUR,SEK,ZAR,GBP,JPY,MXN,NZD,BRL,USD',

      type: 'GET',

      success: function(ratesObj) {

        resourceLibrary.setItem('converterRates', ratesObj);

        rates = resourceLibrary.getItem('converterRates');

        $('#thatCurrency').prop('disabled', false);

        $('.currency-converter #ccInput').prop('disabled', false);

        $('.currency-converter #ccInput').attr('placeholder', '');

        convertCurrency();

        if (debug) {

          console.log(' ');
          console.log('*** Converter Rates ***');
          console.log('Date: ', rates.date);
          console.log('Base: ', rates.base);
          console.log(rates.rates);
        }
      },

      error: function() {

        let errorMsg = 'Discogs Enhancer could not get currency exchange rates. Price conversions may not be accurate. Please try again later.';

        //resourceLibrary.appendNotice(errorMsg, 'orange');
        console.log(errorMsg);
      }
    });
  }

  // Clear errors
  function clearErrors() {

    let base = $('#thisCurrency option:selected').val(),
        thatC = $('#thatCurrency option:selected').val();

    if (base !== '-' && thatC !== '-') {

      return $('#errors').text('');
    }
  }

  /**
   *
   * DOM Setup
   *
   */

  // Append form
  $('body').append(markup);

  // Check for existing rates
  if (!resourceLibrary.getItem('converterRates')) {

    rates = null;

    thisSelectedCurrency = null;

  } else {

    rates = resourceLibrary.getItem('converterRates');

    thisSelectedCurrency = rates.base;
  }

  // Set default value for #thisCurrency select
  if (thisSelectedCurrency) {

    $('#thisCurrency').val(thisSelectedCurrency);

    $('#thatCurrency option[value="' + thisSelectedCurrency + '"]').prop('disabled', true);
  }

  // Remember state for #thatCurrency
  if (lastUsedCurrency) {

    $('#thatCurrency').val(lastUsedCurrency);
  }

  // Disable ability to select '-' option
  // so ajax call does not come back 422 (Unprocessable Entity)
  $('#thisCurrency option[value="-"]').prop('disabled', true);

  // Check to see how old the rates are and update them if needed
  if (rates && rates.date !== today) {

    if (debug) {

      console.log(' ');
      console.log(' *** Auto-updating Currency Converter rates *** ');
    }

    rates = resourceLibrary.getItem('converterRates');

    getConverterRates(rates.base);
  }


  /**
   *
   * Form Functionality
   *
   */

  $('.currency-converter #ccInput').on('keyup, keydown', function() {
    /* setTimeout is used here because without it, calculations are not performed in
       realtime and, instead, are one calculation behind the last digit entered.
       What is a better way to do this? */
    setTimeout(function() { convertCurrency(); }, 0);
  });


  /**
   *
   * UI Functionality
   *
   */

  // Clear out all data
  $('.currency-converter #clear').on('click', function() {

    let
        disolve,
        hasDecimal = $('.currency-converter #ccInput').val().indexOf('.');

    // Strip decimal to stop Chrome from console.warning on invalid number
    if (hasDecimal) {

      let amount = $('.currency-converter #ccInput').val();

      amount = amount.replace('.', '');

      $('.currency-converter #ccInput').val(amount);
    }

    disolve = setInterval(function() {

      let
          input = $('.currency-converter #ccInput'),
          output = $('.currency-converter #ccOutput'),
          text = input.text(),
          val = input.val();

      text = val.substring(0, val.length - 1);

      input.val(text);

      output.text( input.val() );

      if (val <= 0 && val.length < 1) {

        clearInterval(disolve);
      }
    }, 20);
  });


  // Update base value on change
  $('#thisCurrency').on('change', function() {

    let
        base = $('#thisCurrency option:selected').val(),
        thatC = $('#thatCurrency option:selected').val();

    // Reset #thatCurrency if #thisCurrency is the same
    if (base === thatC) {

      $('#thatCurrency option:eq(0)').prop('selected', true);
    }

    clearErrors();

    // Disable option if used as base currency
    $('#thatCurrency option[value="' + base + '"]').prop('disabled', true).siblings().prop('disabled', false);

    // Update rates
    getConverterRates(base);
  });


  // Show/Hide converter
  $('body').on('click', '.currency-converter .toggle', function() {

    let
        base = $('#thisCurrency option:selected').val(),
        thatC = $('#thatCurrency option:selected').val();

    // Reset #thatCurrency if #thisCurrency is the same
    if (base === thatC) {

      $('#thatCurrency option:eq(0)').prop('selected', true);
    }

    $('.currency-converter').toggleClass('show-converter');

    document.getElementById('ccInput').focus();

    // Clear out errors so hiding continues to work as expected
    $('#errors').text('');

    return $(this).text() === '¥ € $' ? $(this).text('£ € $ $') : $(this).text('¥ € $');
  });


  // Save last known state of #thatCurrency
  $('#thatCurrency').on('change', function() {

    clearErrors();

    convertCurrency();

    resourceLibrary.setItem('lastUsedCurrency', $('#thatCurrency option:selected').val());
  });


  // Keyboard shortcut
  document.addEventListener('keyup', function(e) {

    // Shift + Ctrl + C
    if (e.shiftKey && e.ctrlKey && e.which === 67) {

      let tab = $('.currency-converter .toggle');

      $('.currency-converter').toggleClass('show-converter');

      document.getElementById('ccInput').focus();

      return $(tab).text() === '¥ € $' ? $(tab).text('£ € $ $') : $(tab).text('¥ € $');
    }
  });
});
