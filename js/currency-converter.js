/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO
// add swap Functionality. If converting EUR to USD, then EUR is changed to USD, USD changes to EUR?
//
// stop clearing thatCurrency when thisCurrency changes?
//
// pass localeResult stuff into resourceLibrary for locale results

$(document).ready(function() {

  let
      clear,
      language = resourceLibrary.language(),
      lastUsedCurrency = localStorage.getItem('lastUsedCurrency'),
      rates,
      thisSelectedCurrency,
      markup = '<div class="currency-converter">' +
                  '<div class="toggle">¥ € $</div>' +
                  '<div class="top">' +
                    '<div class="ui-wrap">' +
                      '<div class="currency">Convert:</div>' +
                      '<div class="currency-select">' +
                        '<select id="thisCurrency">' +
                          '<option value="-">-</option>' +
                          '<option value="AUD">AUD</option>' +
                          '<option value="BRL">BRL</option>' +
                          '<option value="CAD">CAD</option>' +
                          '<option value="CHF">CHF</option>' +
                          '<option value="EUR">EUR</option>' +
                          '<option value="GBP">GBP</option>' +
                          '<option value="JPY">JPY</option>' +
                          '<option value="MXN">MXN</option>' +
                          '<option value="NZD">NZD</option>' +
                          '<option value="SEK">SEK</option>' +
                          '<option value="USD">USD</option>' +
                          '<option value="ZAR">ZAR</option>' +
                        '</select>' +
                      '</div>' +
                      '<div class="<value-input></value-input>">' +
                        '<input type="number" id="input" max="999999999" min="0"></input>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +

                  '<div class="bottom">' +
                    '<div class="ui-wrap">' +
                      '<div class="currency">To:</div>' +
                      '<div class="currency-select">' +
                        '<select id="thatCurrency">' +
                          '<option value="-">-</option>' +
                          '<option value="AUD">AUD</option>' +
                          '<option value="BRL">BRL</option>' +
                          '<option value="CAD">CAD</option>' +
                          '<option value="CHF">CHF</option>' +
                          '<option value="EUR">EUR</option>' +
                          '<option value="GBP">GBP</option>' +
                          '<option value="JPY">JPY</option>' +
                          '<option value="MXN">MXN</option>' +
                          '<option value="NZD">NZD</option>' +
                          '<option value="SEK">SEK</option>' +
                          '<option value="USD">USD</option>' +
                          '<option value="ZAR">ZAR</option>' +
                        '</select>' +
                      '</div>' +
                      '<div id="clearBtn">' +
                        '<button id="clear" class="button button_blue">Clear</button>' +
                      '</div>' +
                      '<div class="value-output">' +
                        '<span id="output"></span>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                  '<div>' +
                    '<span id="errors" style="color: red !important;"></span>' +
                  '</div>' +
                '</div>';

  // Update rates
  function getConverterRates(base) {

    $('#thatCurrency').prop('disabled', true);

    $('.currency-converter #input').prop('disabled', true);

    $('.currency-converter #input').attr('placeholder', 'Updating...');

    $.ajax({

      url:'https://api.fixer.io/latest?base=' + base + '&symbols=AUD,CAD,CHF,EUR,SEK,ZAR,GBP,JPY,MXN,NZD,BRL,USD',

      type: 'GET',

      success: function(ratesObj) {

        localStorage.setItem('converterRates', JSON.stringify(ratesObj));

        rates = JSON.parse(localStorage.getItem('converterRates'));

        $('#thatCurrency').prop('disabled', false);

        $('.currency-converter #input').prop('disabled', false);

        $('.currency-converter #input').attr('placeholder', '');

        if (resourceLibrary.options.debug()) {

          console.log(' ');

          console.log('*** Converter Rates ***');

          console.log('Date: ', rates.date);

          console.log('Base: ', rates.base);

          console.log(rates.rates);
        }
      },

      error: function() {

        let errorMsg = 'Discogs Enhancer could not get currency exchange rates. Price conversions may not be accurate. Please try again later.';

        resourceLibrary.appendNotice(errorMsg, 'orange');
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

  // Setup clear button
  clear = $('.currency-converter #clear');

  // Check for existing rates
  if (!JSON.parse(localStorage.getItem('converterRates'))) {

    rates = null;

    thisSelectedCurrency = null;

  } else {

    rates = JSON.parse(localStorage.getItem('converterRates'));

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

  /**
   *
   * Form Functionality
   *
   */

  $('.currency-converter #input').on('keyup, keydown', function() {

    setTimeout(function() {

      let
          errors = $('#errors'),
          input = $('.currency-converter #input'),
          output = $('.currency-converter #output'),
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

        return errors.text('Please select two currencies first.');
      }

      // Calculate the result
      result = (input.val() * rates.rates[thatSelectedCurrency]).toFixed(2);

      // Grab correct symbol from printSymbol array
      symbol = resourceLibrary.printSymbol[language][symbolIndex];

      // Voilà
      output.text( resourceLibrary.localizePrice(symbol, result, thisCurrency, language) );

      // Let's get serious - serious. I want to get seriousssss.
      if (input.val().length > 10 || input.val() > 9999999) {

        input.val('');

        output.html('&#175;\\\_(&#12484;)_/&#175;');

        return;
      }

      if (input.val() === '') {

        output.text('');
      }

      // Reset form
      $('body').on('change', '#thatCurrency, #thisCurrency', function() {

        input.val('');

        output.text('');
      });

    }, 0); // <-- What's a better way to do this?
  });

  /**
   *
   * UI Functionality
   *
   */

  // Clear out all data
  clear.on('click', function() {

    let disolve,
        hasDecimal = $('.currency-converter #input').val().indexOf('.');

    // Strip decimal to stop Chrome from console.warning on invalid number
    if (hasDecimal) {

      let amount = $('.currency-converter #input').val();

      amount = amount.replace('.', '');

      $('.currency-converter #input').val(amount);
    }

    disolve = setInterval(function() {

      let
          input = $('.currency-converter #input'),
          len = input.val(),
          val = input.text(),
          output = $('.currency-converter #output');

      val = len.substring(0, len.length - 1);

      input.val(val);

      output.text( input.val() );

      if (len <= 0) {

        clearInterval(disolve);
      }
    }, 20);
  });


  // Update base value on change
  $('#thisCurrency').on('change', function() {

    let base = $('#thisCurrency option:selected').val(),
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

    let base = $('#thisCurrency option:selected').val(),
        thatC = $('#thatCurrency option:selected').val();

    // Reset #thatCurrency if #thisCurrency is the same
    if (base === thatC) {

      $('#thatCurrency option:eq(0)').prop('selected', true);
    }

    $('.currency-converter').toggleClass('show-converter');

    // Clear out errors so hiding continues to work as expected
    $('#errors').text('');

    return $(this).text() === '¥ € $' ? $(this).text('£ € $ $') : $(this).text('¥ € $');
  });


  // Save last known state of #thatCurrency
  $('#thatCurrency').on('change', function() {

    clearErrors();

    localStorage.setItem('lastUsedCurrency', $('#thatCurrency option:selected').val());
  });
});
