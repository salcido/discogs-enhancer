$(document).ready(function() {

  let
      clear,
      language = resourceLibrary.language(),
      lastUsedCurrency = localStorage.getItem('lastUsedCurrency'),
      rates,
      thisSelectedCurrency,
      markup = '<div class="currency-converter">' +
                  '<div class="toggle">$ € ¥</div>' +
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
      },

      error: function() {

        let errorMsg = 'Discogs Enhancer could not get currency exchange rates. Price conversions may not be accurate. Please try again later.';

        resourceLibrary.appendNotice(errorMsg, 'orange');
      }
    });
  }

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

  /**
   *
   * Form Functionality
   *
   */

  $('.currency-converter #input').on('keyup, keydown', function() {

    setTimeout(function() {

      let
          errors = $('.currency-converter #errors'),
          input = $('.currency-converter #input'),
          inputLength,
          localeResult,
          maxDigits,
          output = $('.currency-converter #output'),
          priceConfig,
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

      // Calculate the result
      result = ( input.val() * rates.rates[thatSelectedCurrency]).toFixed(2);

      // Grab correct symbol from printSymbol array
      symbol = resourceLibrary.printSymbol[language][symbolIndex];

      // Localize result
      maxDigits = (thatSelectedCurrency === 'JPY') ? 0 : 2;

      priceConfig = {
        currency: thatSelectedCurrency,
        maximumFractionDigits: maxDigits,
        minimumFractionDigits: maxDigits
      };

      localeResult = Number(result).toLocaleString(language, priceConfig);

      // Calculate it
      if (language === 'en' || language === 'ja') {

        output.text(symbol + localeResult);
      }

      if (language === 'de' ||
          language === 'fr' ||
          language === 'es') {

        output.text(localeResult + ' ' + symbol);
      }

      if (language === 'it') {

        output.text(symbol + ' ' + localeResult);
      }

      // Check our length
      inputLength = input.val().toString().length;

      // Make sure a currency is selected
      if (thatSelectedCurrency === '-' || thisCurrency === '-') {

        input.val('');

        errors.text('Please select currencies first.');

      } else {

        errors.text('');
      }

      // Let's get serious - serious. I want to get seriousssss.
      if (inputLength > 10 || input.val() > 9999999) {

        input.val('');

        output.text('Seriously?');

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
    }, 0);
  });

  /**
   *
   * UI Functionality
   *
   */

  // Clear out all data
  clear.on('click', function() {

    $('.currency-converter #input').val('');

    $('.currency-converter #output').text('');
  });


  // Update base value on change
  $('#thisCurrency').on('change', function() {

    let base = $('#thisCurrency option:selected').val();

    // Reset #thatCurrency
    $('#thatCurrency option:eq(0)').prop('selected', true);

    // Disable option if used as base currency
    $('#thatCurrency option[value="' + base + '"]').prop('disabled', true).siblings().prop('disabled', false);

    getConverterRates(base);
  });


  // Show/Hide converter
  $('body').on('click', '.currency-converter .toggle', function() {

    $('.currency-converter').toggleClass('show-converter');

    // Clear out errors so hiding continues to work as expected
    $('#errors').text('');
  });


  // Save last known state of #thatCurrency
  $('#thatCurrency').on('change', function() {

    localStorage.setItem('lastUsedCurrency', $('#thatCurrency option:selected').val());
  });
});
