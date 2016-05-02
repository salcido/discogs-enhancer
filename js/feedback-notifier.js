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
      countBuyer = localStorage.getItem('countBuyer'),
      countSeller = localStorage.getItem('countSeller'),
      d = new Date(),
      language = resourceLibrary.language(),
      lastChecked = Number(localStorage.getItem('profileCountLastChecked')),
      tenMins = lastChecked + 600000,
      timeInMillis = d.getTime(),
      user = $('#site_account_menu').find('.user_image').attr('alt');

  if (language === 'en') {

    language = '';

  } else {

    language = language + '/';
  }

  if (!lastChecked || timeInMillis > tenMins) {

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            buyer = $(response).find('a[href*="buyer_feedback"]').text(),
            seller = $(response).find('a[href*="seller_feedback"]').text();

        // inital counts
        if (!countBuyer) {

          localStorage.setItem('countBuyer', buyer);
        }

        if (!countSeller) {

          localStorage.setItem('countSeller', seller);
        }

        // Set timestamp when checked
        localStorage.setItem('profileCountLastChecked', timeInMillis);

        // TODO add badges to nav
        if (seller > countSeller) {

          console.log('new seller review');
          localStorage.setItem('countSeller', seller);
        }

        if (buyer > countBuyer) {

          console.log('new buyer review');
          localStorage.setItem('countBuyer', buyer);
        }

        // TODO clear badges when acknowledged
      }
    });
  }
});
