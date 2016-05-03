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

// TODO write function to hit profile page, get totals, look for differences, then hit buyer/seller pages for updates if necessary.

$(document).ready(function() {

  let
      badge,
      fbBuyer = JSON.parse(localStorage.getItem('fbBuyer')),
      fbSeller = JSON.parse(localStorage.getItem('fbSeller')),
      d = new Date(),
      language = resourceLibrary.language(),
      lastChecked = Number(localStorage.getItem('fbLastChecked')),
      link,
      timeInMillis = d.getTime(),
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      waitTime = lastChecked + 120000;

  if (language === 'en') {

    language = '';

  } else {

    language = language + '/';
  }

  if (!lastChecked || timeInMillis > waitTime || !fbSeller.hasViewed) {

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() ),
            neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
            neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
            total = pos + neu + neg;

        // save initial state of feedback
        if (!fbBuyer || !fbSeller) {

          let
              buyerObj = {
                posCount: pos,
                neuCount: neu,
                negCount: neg,
                total: total,
                hasViewed: true
              },

              sellerObj = {
                posCount: pos,
                neuCount: neu,
                negCount: neg,
                total: total,
                hasViewed: true
              };

          buyerObj = JSON.stringify(buyerObj);

          localStorage.setItem('fbBuyer', buyerObj);

          sellerObj = JSON.stringify(sellerObj);

          localStorage.setItem('fbSeller', sellerObj);

          return;
        }

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeInMillis);

        if (total > fbSeller.total) {

          let
              sellerObj = JSON.parse(localStorage.getItem('fbSeller')),
              posNew = pos - fbSeller.posCount,
              neuNew = neu - fbSeller.neuCount,
              negNew = neg - fbSeller.negCount;

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
      }
    });
  }

  if (!lastChecked || timeInMillis > waitTime || !fbBuyer.hasViewed) {

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

        // save initial state of feedback
        if (!fbBuyer || !fbSeller) {

          let
              buyerObj = {
                posCount: pos,
                neuCount: neu,
                negCount: neg,
                total: total,
                hasViewed: true
              },

              sellerObj = {
                posCount: pos,
                neuCount: neu,
                negCount: neg,
                total: total,
                hasViewed: true
              };

          buyerObj = JSON.stringify(buyerObj);

          localStorage.setItem('fbBuyer', buyerObj);

          sellerObj = JSON.stringify(sellerObj);

          localStorage.setItem('fbSeller', sellerObj);

          return;
        }

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeInMillis);

        if (total > fbSeller.total) {

          let
              sellerObj = JSON.parse(localStorage.getItem('fbSeller')),
              posNew = pos - fbSeller.posCount,
              neuNew = neu - fbSeller.neuCount,
              negNew = neg - fbSeller.negCount;

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

        // if (buyer > fbBuyer.count) {
        //
        //   let buyerObj = JSON.parse(localStorage.getItem('fbBuyer'));
        //
        //   buyerObj.hasViewed = false;
        //
        //   buyerObj = JSON.stringify(buyerObj);
        //
        //   localStorage.setItem('fbBuyer', buyerObj);
        //
        //   count = buyer - fbBuyer.count;
        //
        //   badge = '<li style="position: relative;">' +
        //             '<a id="de-buyer-feedback" class="nav_group_control">' +
        //               '<span class="skittle skittle_collection" style="background: #FF6A23 !important; cursor: pointer;">' +
        //                 '<span class="count" style="color: white !important; background: #FF6A23 !important;">B</span>' +
        //               '</span>' +
        //             '</a>' +
        //             '<ul class="feedback-chart buyer">' +
        //               '<li>' +
        //                 '<h3 class="pos">Positive</h3>' +
        //                 '<h2 class="posCount"></h2>' +
        //               '</li>' +
        //               '<li>' +
        //                 '<h3 class="neu">Neutral</h3>' +
        //                 '<h2 class="neuCount"></h2>' +
        //               '</li>' +
        //               '<li>' +
        //                 '<h3 class="neg">Negative</h3>' +
        //                 '<h2 class="negCount"></h2>' +
        //               '</li>' +
        //             '</ul>' +
        //           '</li>';
        //
        //   $('#activity_menu').append(badge);
        // }
      }
    });
  }

  // Save viewed states
  $('body').on('click', '#de-buyer-feedback, #de-seller-feedback', function() {

    let
        id = this.id,
        pos,
        neu,
        neg,
        newEntryTotals,
        name,
        obj;

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


/* og */

/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// $(document).ready(function() {
//
//   let
//       badge,
//       count,
//       fbBuyer = JSON.parse(localStorage.getItem('fbBuyer')),
//       fbSeller = JSON.parse(localStorage.getItem('fbSeller')),
//       d = new Date(),
//       language = resourceLibrary.language(),
//       lastChecked = Number(localStorage.getItem('fbLastChecked')),
//       link,
//       timeInMillis = d.getTime(),
//       user = $('#site_account_menu').find('.user_image').attr('alt'),
//       waitTime = lastChecked + 120000;
//
//   if (language === 'en') {
//
//     language = '';
//
//   } else {
//
//     language = language + '/';
//   }
//
//   if (!lastChecked || timeInMillis > waitTime || !fbBuyer.hasViewed || !fbSeller.hasViewed) {
//
//     $.ajax({
//
//       url: 'https://www.discogs.com/' + language + 'user/' + user,
//
//       type: 'GET',
//
//       dataType: 'html',
//
//       success: function(response) {
//
//         let
//             buyer = $(response).find('a[href*="buyer_feedback"]').text().trim(),
//             seller = $(response).find('a[href*="seller_feedback"]').text().trim();
//
//         // save initial state of feedback
//         if (!fbBuyer || !fbSeller) {
//
//           let
//               buyerObj = {
//                 count: buyer,
//                 hasViewed: true
//               },
//
//               sellerObj = {
//                 count: seller,
//                 hasViewed: true
//               };
//
//           buyerObj = JSON.stringify(buyerObj);
//
//           localStorage.setItem('fbBuyer', buyerObj);
//
//           sellerObj = JSON.stringify(sellerObj);
//
//           localStorage.setItem('fbSeller', sellerObj);
//
//           return;
//         }
//
//         // Set timestamp when checked
//         localStorage.setItem('fbLastChecked', timeInMillis);
//
//         if (seller > fbSeller.count) {
//
//           let sellerObj = JSON.parse(localStorage.getItem('fbSeller'));
//
//           sellerObj.hasViewed = false;
//
//           sellerObj = JSON.stringify(sellerObj);
//
//           localStorage.setItem('fbSeller', sellerObj);
//
//           count = seller - fbSeller.count;
//
//           badge = '<li>' +
//                     '<a id="de-seller-feedback" class="nav_group_control needs_delegated_tooltip" data-title="New Seller Feedback" aria-label="New Seller Feedback" data-original-title="New Seller Feedback" data-placement="bottom">' +
//                       '<span class="skittle skittle_collection" style="background: #4DD2FF !important; cursor: pointer;">' +
//                         '<span class="count" style="color: white !important; background: #4DD2FF !important;">' + count + '</span>' +
//                       '</span>' +
//                     '</a>' +
//                   '</li>';
//
//           $('#activity_menu').append(badge);
//         }
//
//         if (buyer > fbBuyer.count) {
//
//           let buyerObj = JSON.parse(localStorage.getItem('fbBuyer'));
//
//           buyerObj.hasViewed = false;
//
//           buyerObj = JSON.stringify(buyerObj);
//
//           localStorage.setItem('fbBuyer', buyerObj);
//
//           count = buyer - fbBuyer.count;
//
//           badge = '<li>' +
//                     '<a id="de-buyer-feedback" class="nav_group_control needs_delegated_tooltip" data-title="New Buyer Feedback" aria-label="New Buyer Feedback" data-original-title="New Buyer Feedback" data-placement="bottom">' +
//                       '<span class="skittle skittle_collection" style="background: #FF6A23 !important; cursor: pointer;">' +
//                         '<span class="count" style="color: white !important; background: #FF6A23 !important;">' + count + '</span>' +
//                       '</span>' +
//                     '</a>' +
//                   '</li>';
//
//           $('#activity_menu').append(badge);
//         }
//       }
//     });
//   }
//
//   // Save viewed states
//   $('body').on('click', '#de-buyer-feedback, #de-seller-feedback', function() {
//
//     let
//         id = this.id,
//         inc,
//         name,
//         obj;
//
//     if (id === 'de-buyer-feedback') {
//
//       inc = $('#de-buyer-feedback .count').text().trim();
//
//       link = 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user;
//
//       name = 'fbBuyer';
//
//       obj = JSON.parse(localStorage.getItem('fbBuyer'));
//     }
//
//     if (id === 'de-seller-feedback') {
//
//       inc = $('#de-seller-feedback .count').text().trim();
//
//       link = 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user;
//
//       name = 'fbSeller';
//
//       obj = JSON.parse(localStorage.getItem('fbSeller'));
//     }
//
//     // update obj props
//     obj.hasViewed = true;
//
//     obj.count = Number(obj.count) + Number(inc);
//
//     // prep obj for storage
//     obj = JSON.stringify(obj);
//
//     localStorage.setItem(name, obj);
//
//     window.location.href = link;
//   });
// });
