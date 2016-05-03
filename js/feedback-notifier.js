/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

 // {
 //   posCount: n,
 //   neuCount: n,
 //   negCount: n,
 //   hasViewed: false,
 // }

// TODO write function to hit profile page, get totals, look for differences, then hit buyer/seller pages for updates if necessary. Checking total on profile will return all ratings. Buyer/Seller pages only have data from last 12 months...

$(document).ready(function() {

  let
      fbBuyer = JSON.parse(localStorage.getItem('fbBuyer')),
      fbSeller = JSON.parse(localStorage.getItem('fbSeller')),
      d = new Date(),
      language = resourceLibrary.language(),
      lastChecked = Number(localStorage.getItem('fbLastChecked')),
      timeStamp = d.getTime(),
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      waitTime = lastChecked + 120000;

  // TODO might need an initial setup method that passes in pos/neu/neg totals for initial base reference
  function getSellerUpdates() {

    let
        badge;

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {
console.log('gotSellerUpdates')
        let
            pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() ),
            neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
            neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
            total = pos + neu + neg;

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeStamp);
console.log(total, pos, neu, neg);


console.log(JSON.parse(localStorage.getItem('fbSeller')))
          let
              sellerObj = JSON.parse(localStorage.getItem('fbSeller')),
              posNew = pos - sellerObj.posCount,
              neuNew = neu - sellerObj.neuCount,
              negNew = neg - sellerObj.negCount;

          sellerObj.posCount = posNew;
          sellerObj.neuCount = neuNew;
          sellerObj.negCount = negNew;
          sellerObj.hasViewed = false;

          sellerObj = JSON.stringify(sellerObj);

          localStorage.setItem('fbSeller', sellerObj);

          posNew = posNew > 0 ? posNew : '';

          neuNew = neuNew > 0 ? neuNew : '';

          negNew = negNew > 0 ? negNew : '';

          badge = '<li style="position: relative;">' +
                    '<a id="de-seller-feedback" class="nav_group_control">' +
                      '<span class="skittle skittle_collection" style="background: #4DD2FF !important; cursor: pointer;">' +
                        '<span class="count" style="color: white !important; background: #4DD2FF !important;">S</span>' +
                      '</span>' +
                    '</a>' +
                    '<ul class="feedback-chart seller">' +
                      '<li>' +
                        '<h3 class="pos">Positive</h3>' +
                        '<h2 class="pos-count">' + posNew + '</h2>' +
                      '</li>' +
                      '<li>' +
                        '<h3 class="neu">Neutral</h3>' +
                        '<h2 class="neu-count">' + neuNew + '</h2>' +
                      '</li>' +
                      '<li>' +
                        '<h3 class="neg">Negative</h3>' +
                        '<h2 class="neg-count">' + negNew + '</h2>' +
                      '</li>' +
                    '</ul>' +
                  '</li>';

          $('#activity_menu').append(badge);

      }
    });
  }

  function getBuyerUpdates() {

    let
        badge;

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() ),
            neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
            neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
            total = pos + neu + neg;

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeStamp);

        let
            buyerObj = JSON.parse(localStorage.getItem('fbBuyer')),
            posNew = pos - buyerObj.posCount,
            neuNew = neu - buyerObj.neuCount,
            negNew = neg - buyerObj.negCount;

        buyerObj.posCount = posNew;
        buyerObj.neuCount = neuNew;
        buyerObj.negCount = negNew;
        buyerObj.hasViewed = false;

        buyerObj = JSON.stringify(buyerObj);

        localStorage.setItem('fbBuyer', buyerObj);

        posNew = posNew > 0 ? posNew : '';

        neuNew = neuNew > 0 ? neuNew : '';

        negNew = negNew > 0 ? negNew : '';

        badge = '<li style="position: relative;">' +
                  '<a id="de-buyer-feedback" class="nav_group_control">' +
                    '<span class="skittle skittle_collection" style="background: #FF6A23 !important; cursor: pointer;">' +
                      '<span class="count" style="color: white !important; background: #FF6A23 !important;">B</span>' +
                    '</span>' +
                  '</a>' +
                  '<ul class="feedback-chart buyer">' +
                    '<li>' +
                      '<h3 class="pos">Positive</h3>' +
                      '<h2 class="posCount"></h2>' +
                    '</li>' +
                    '<li>' +
                      '<h3 class="neu">Neutral</h3>' +
                      '<h2 class="neuCount"></h2>' +
                    '</li>' +
                    '<li>' +
                      '<h3 class="neg">Negative</h3>' +
                      '<h2 class="negCount"></h2>' +
                    '</li>' +
                  '</ul>' +
                '</li>';

        $('#activity_menu').append(badge);
      }
    });
  }


  if (language === 'en') {

    language = '';

  } else {

    language = language + '/';
  }

  // setup initial objects
  if (!fbBuyer || !fbSeller) {

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            buyer = Number( $(response).find('a[href*="buyer_feedback"]').text().trim() ),
            seller = Number( $(response).find('a[href*="seller_feedback"]').text().trim() );

        // save initial state of feedback
        let
            buyerObj = {
              posCount: 0,
              neuCount: 0,
              negCount: 0,
              gTotal: buyer,
              hasViewed: true
            },

            sellerObj = {
              posCount: 0,
              neuCount: 0,
              negCount: 0,
              gTotal: seller,
              hasViewed: true
            };

        buyerObj = JSON.stringify(buyerObj);

        localStorage.setItem('fbBuyer', buyerObj);

        sellerObj = JSON.stringify(sellerObj);

        localStorage.setItem('fbSeller', sellerObj);

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeStamp);
      }
    });

    getSellerUpdates();

    getBuyerUpdates();

    return;
  }

  if (!lastChecked || timeStamp > waitTime || !fbBuyer.hasViewed || !fbSeller.hasViewed) {

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
                posCount: 0,
                neuCount: 0,
                negCount: 0,
                gTotal: buyer,
                hasViewed: true
              },

              sellerObj = {
                posCount: 0,
                neuCount: 0,
                negCount: 0,
                gTotal: seller,
                hasViewed: true
              };

          buyerObj = JSON.stringify(buyerObj);

          localStorage.setItem('fbBuyer', buyerObj);

          sellerObj = JSON.stringify(sellerObj);

          localStorage.setItem('fbSeller', sellerObj);

          getSellerUpdates();
          getBuyerUpdates();

          return;
        }

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeStamp);

        // Call update methods
        if (seller > fbSeller.gTotal) {

         getSellerUpdates();
        }

        if (buyer > fbBuyer.gTotal) {

         getBuyerUpdates();
        }
      }
    });
  }


  // Save viewed states
  $('body').on('click', '#de-buyer-feedback, #de-seller-feedback', function() {

    let
        id = this.id,
        link,
        name,
        neg,
        neu,
        newEntryTotals,
        obj,
        pos;

    if (id === 'de-buyer-feedback') {

      link = 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user;

      name = 'fbBuyer';

      obj = JSON.parse(localStorage.getItem('fbBuyer'));
    }

    if (id === 'de-seller-feedback') {

      // get new totals
      pos = Number( $('#de-seller-feedback').next('.feedback-chart').find('.pos-count').text().trim() );

      neu = Number( $('#de-seller-feedback').next('.feedback-chart').find('.neu-count').text().trim() );

      neg = Number( $('#de-seller-feedback').next('.feedback-chart').find('.neg-count').text().trim() );

      newEntryTotals = pos + neu + neg;

      link = 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user;

      name = 'fbSeller';

      obj = JSON.parse(localStorage.getItem('fbSeller'));
    }

    // update obj props
    obj.hasViewed = true;

    obj.posCount = Number(obj.posCount) + Number(pos);

    obj.neuCount = Number(obj.neuCount) + Number(neu);

    obj.negCount = Number(obj.negCount) + Number(neg);

    obj.total = Number(obj.total) + Number(newEntryTotals);

    // prep obj for storage
    obj = JSON.stringify(obj);

    localStorage.setItem(name, obj);

    window.location.href = link;
  });
});
