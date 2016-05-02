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
      badge,
      count,
      fbBuyer = JSON.parse(localStorage.getItem('fbBuyer')),
      fbSeller = JSON.parse(localStorage.getItem('fbSeller')),
      d = new Date(),
      language = resourceLibrary.language(),
      lastChecked = Number(localStorage.getItem('feedbackLastChecked')),
      link,
      timeInMillis = d.getTime(),
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      waitTime = lastChecked + 120000;

  if (language === 'en') {

    language = '';

  } else {

    language = language + '/';
  }

  if (!lastChecked || timeInMillis > waitTime || !fbBuyer.hasViewed || !fbSeller.hasViewed) {

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            buyer = $(response).find('a[href*="buyer_feedback"]').text().trim(),
            seller = $(response).find('a[href*="seller_feedback"]').text().trim();

        // save initial state of feedback
        if (!fbBuyer || !fbSeller) {

          let
              buyerObj = {
                count: buyer,
                hasViewed: true
              },

              sellerObj = {
                count: seller,
                hasViewed: true
              };

          buyerObj = JSON.stringify(buyerObj);

          localStorage.setItem('fbBuyer', buyerObj);

          sellerObj = JSON.stringify(sellerObj);

          localStorage.setItem('fbSeller', sellerObj);

          return;
        }

        // Set timestamp when checked
        localStorage.setItem('feedbackLastChecked', timeInMillis);

        if (seller > fbSeller.count) {

          let sellerObj = JSON.parse(localStorage.getItem('fbSeller'));

          sellerObj.hasViewed = false;

          sellerObj = JSON.stringify(sellerObj);

          localStorage.setItem('fbSeller', sellerObj);

          count = seller - fbSeller.count;

          badge = '<li>' +
                    '<a id="de-seller-feedback" class="nav_group_control needs_delegated_tooltip" data-title="New Seller Feedback" aria-label="New Seller Feedback" data-original-title="New Seller Feedback" data-placement="bottom">' +
                      '<span class="skittle skittle_collection" style="background: #4DD2FF !important; cursor: pointer;">' +
                        '<span class="count" style="color: white !important; background: #4DD2FF !important;">' + count + '</span>' +
                      '</span>' +
                    '</a>' +
                  '</li>';

          $('#activity_menu').append(badge);
        }

        if (buyer > fbBuyer.count) {

          let buyerObj = JSON.parse(localStorage.getItem('fbBuyer'));

          buyerObj.hasViewed = false;

          buyerObj = JSON.stringify(buyerObj);

          localStorage.setItem('fbBuyer', buyerObj);

          count = buyer - fbBuyer.count;

          badge = '<li>' +
                    '<a id="de-buyer-feedback" class="nav_group_control needs_delegated_tooltip" data-title="New Buyer Feedback" aria-label="New Buyer Feedback" data-original-title="New Buyer Feedback" data-placement="bottom">' +
                      '<span class="skittle skittle_collection" style="background: #FF6A23 !important; cursor: pointer;">' +
                        '<span class="count" style="color: white !important; background: #FF6A23 !important;">' + count + '</span>' +
                      '</span>' +
                    '</a>' +
                  '</li>';

          $('#activity_menu').append(badge);
        }
      }
    });
  }

  // Save viewed states
  $('body').on('click', '#de-buyer-feedback, #de-seller-feedback', function() {

    let
        id = this.id,
        inc,
        name,
        obj;

    if (id === 'de-buyer-feedback') {

      inc = $('#de-buyer-feedback .count').text().trim();

      link = 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user;

      name = 'fbBuyer';

      obj = JSON.parse(localStorage.getItem('fbBuyer'));
    }

    if (id === 'de-seller-feedback') {

      inc = $('#de-seller-feedback .count').text().trim();

      link = 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user;

      name = 'fbSeller';

      obj = JSON.parse(localStorage.getItem('fbSeller'));
    }

    // update obj props
    obj.hasViewed = true;

    obj.count = Number(obj.count) + Number(inc);

    // prep obj for storage
    obj = JSON.stringify(obj);

    localStorage.setItem(name, obj);

    window.location.href = link;
  });
});
