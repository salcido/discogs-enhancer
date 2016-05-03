/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO write function to hit profile page, get totals, look for differences, then hit buyer/seller pages for updates if necessary. Checking total on profile will return all ratings. Buyer/Seller pages only have data from last 12 months...

$(document).ready(function() {

  let
      fbBuyer = JSON.parse(localStorage.getItem('fbBuyer')),
      fbSeller = JSON.parse(localStorage.getItem('fbSeller')),
      colorSeller = '#4DD2FF',
      colorBuyer = '#FF6A23',
      d = new Date(),
      language = resourceLibrary.language(),
      lastChecked = Number(localStorage.getItem('fbLastChecked')),
      timeStamp = d.getTime(),
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      waitTime = lastChecked + 10000; //120000;

  /**
   * Appends badges to menu bar
   *
   * @instance
   * @param    {number} posDiff
   * @param    {number} neuDiff
   * @param    {number} negDiff
   * @param    {string} color
   * @param    {string} id
   * @return   {undefined}
   */
  function appendBadge(type, posDiff, neuDiff, negDiff) {

    let
        badge,
        color,
        id,
        initial;

    if (type === 'seller') {

      id = 'de-seller-feedback';
      color = colorSeller;
      initial = 'S';
    }

    if (type === 'buyer') {

      id = 'de-buyer-feedback';
      color = colorBuyer;
      initial = 'B';
    }

    badge = '<li style="position: relative;">' +
              '<span id="' + id + '">' +
                '<a class="nav_group_control ' + id + '">' +
                  '<span class="skittle skittle_collection" style="background: ' + color + ' !important; cursor: pointer;">' +
                    '<span class="count" style="color: white !important; background: ' + color + ' !important;">' + initial + '</span>' +
                  '</span>' +
                '</a>' +
                '<ul class="feedback-chart ' + type + '">' +
                  '<li class="pos-reviews">' +
                    '<h3 class="pos">Positive</h3>' +
                    '<h2 class="pos-count">' + posDiff + '</h2>' +
                  '</li>' +
                  '<li class="neu-reviews">' +
                    '<h3 class="neu">Neutral</h3>' +
                    '<h2 class="neu-count">' + neuDiff + '</h2>' +
                  '</li>' +
                  '<li class="neg-reviews">' +
                    '<h3 class="neg">Negative</h3>' +
                    '<h2 class="neg-count">' + negDiff + '</h2>' +
                  '</li>' +
                '</ul>' +
              '</span>' +
            '</li>';

    $('#activity_menu').append(badge);
  }


  /**
   * Gets Buyer/Seller number updates from profile
   *
   * @instance
   * @param    {number} gTotal
   * @return   {function}
   */
  function getUpdates(type, gTotal) {

    let
       nameCaps,
       obj,
       objName,
       url;

    if (type === 'seller') {

      nameCaps = 'Seller';
      obj = JSON.parse(localStorage.getItem('fbSeller'));
      objName = 'fbSeller';
      url = 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user;
    }

    if (type === 'buyer') {

      nameCaps = 'Buyer';
      obj = JSON.parse(localStorage.getItem('fbBuyer'));
      objName = 'fbBuyer';
      url = 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user;
    }

    $.ajax({

      url: url,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
           neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
           negDiff = neg - obj.negCount,

           neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
           neuDiff = neu - obj.neuCount,

           pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() ),
           posDiff = pos - obj.posCount,

           total = pos + neu + neg;

        // assign new diff values to obj
        obj.posDiff = posDiff;
        obj.neuDiff = neuDiff;
        obj.negDiff = negDiff;
        obj.hasViewed = false;
        obj.gTotal = gTotal;

        // Save obj updates
        obj = JSON.stringify(obj);
        localStorage.setItem(objName, obj);

        // Calcuate values to pass to `appendBadge()`
        posDiff = posDiff > 0 ? posDiff : '';

        neuDiff = neuDiff > 0 ? neuDiff : '';

        negDiff = negDiff > 0 ? negDiff : '';

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeStamp);

        if (resourceLibrary.options.debug()) {

          console.log(' ');

          console.log('*** Got ' + nameCaps + ' Updates ***');

          console.log('pos: ', pos, 'neu: ', neu, 'neg: ', neg, 'total: ', total);

          console.log(objName + ' obj: ', JSON.parse(localStorage.getItem(objName)));
        }

        return appendBadge(type, posDiff, neuDiff, negDiff);
      }
    });
  }

  /**
   * Updates the `fbBuyer`/`fbSeller` objects after user clicks on notifications
   *
   * @instance
   * @param    {string} name
   * @param    {object} obj
   * @return   {method}
   */
  function updateObj(name, obj) {

    // update obj props; obj.gTotal is set during poll for changes
    obj.posCount = Number(obj.posCount) + Number(obj.posDiff);

    obj.posDiff = 0;

    obj.neuCount = Number(obj.neuCount) + Number(obj.neuDiff);

    obj.neuDiff = 0;

    obj.negCount = Number(obj.negCount) + Number(obj.negDiff);

    obj.negDiff = 0;

    obj.hasViewed = true;

    // prep obj for storage
    obj = JSON.stringify(obj);

    // save updated obj
    return localStorage.setItem(name, obj);
  }

  // Set language for URL formation
  language = (language === 'en' ? '' : language + '/');

  /**
   * Creates the fbBuyer/fbSeller objects when none exist.
   *
   * @instance
   * @param    {object} !fbBuyer || !fbSeller
   * @return   {undefined}
   */
  if (!fbBuyer || !fbSeller) {

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            buyer = Number( $(response).find('a[href*="buyer_feedback"]').text().trim() ),
            seller = Number( $(response).find('a[href*="seller_feedback"]').text().trim() );

        // save initial feedback objects
        let
            buyerObj = {
              posCount: 0,
              posDiff: 0,
              neuCount: 0,
              neuDiff: 0,
              negCount: 0,
              negDiff: 0,
              gTotal: buyer,
              hasViewed: true
            },

            sellerObj = {
              posCount: 0,
              posDiff: 0,
              neuCount: 0,
              neuDiff: 0,
              negCount: 0,
              negDiff: 0,
              gTotal: seller,
              hasViewed: true
            };

        buyerObj = JSON.stringify(buyerObj);

        localStorage.setItem('fbBuyer', buyerObj);

        sellerObj = JSON.stringify(sellerObj);

        localStorage.setItem('fbSeller', sellerObj);
      }
    }).then(function() {

      // Get seller numbers
      // TODO add check if user is actually a seller.
      $.ajax({

        url: 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user,

        type: 'GET',

        dataType: 'html',

        success: function(response) {

          let
              sellerObj = JSON.parse(localStorage.getItem('fbSeller')),
              neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
              neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
              pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() );

          // assign new values to obj
          sellerObj.posCount = pos;
          sellerObj.neuCount = neu;
          sellerObj.negCount = neg;
          sellerObj.hasViewed = true;

          // Save obj updates
          sellerObj = JSON.stringify(sellerObj);
          localStorage.setItem('fbSeller', sellerObj);
        }
      }).then(function() {

        // Get buyer numbers
        // TODO add check if user is actually a buyer.
        $.ajax({

          url: 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user,

          type: 'GET',

          dataType: 'html',

          success: function(response) {

            let
                buyerObj = JSON.parse(localStorage.getItem('fbBuyer')),
                neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
                neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
                pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() );

            // assign new values to obj
            buyerObj.posCount = pos;
            buyerObj.neuCount = neu;
            buyerObj.negCount = neg;
            buyerObj.hasViewed = true;

            // Save obj updates
            buyerObj = JSON.stringify(buyerObj);
            localStorage.setItem('fbBuyer', buyerObj);

            // Set timestamp when checked
            localStorage.setItem('fbLastChecked', timeStamp);
          }
        });
      });
    });

    return;
  }

  // TODO create method to append badges if have not been acknowledged
  if (!fbSeller.hasViewed) {

    let
        sellerObj = JSON.parse(localStorage.getItem('fbSeller')),
        posDiff = sellerObj.posDiff,
        neuDiff = sellerObj.neuDiff,
        negDiff = sellerObj.negDiff;

    appendBadge('seller', posDiff, neuDiff, negDiff);
  }

  if (!fbBuyer.hasViewed) {

    let
        buyerObj = JSON.parse(localStorage.getItem('fbBuyer')),
        posDiff = buyerObj.posDiff,
        neuDiff = buyerObj.neuDiff,
        negDiff = buyerObj.negDiff;

    appendBadge('buyer', posDiff, neuDiff, negDiff);
  }

  // poll for changes
  // if user has seen previous updates and its been longer than the waitTime
  if (fbBuyer.hasViewed && fbSeller.hasViewed || timeStamp > waitTime) {

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            buyer = Number($(response).find('a[href*="buyer_feedback"]').text().trim()),
            seller = Number($(response).find('a[href*="seller_feedback"]').text().trim());

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeStamp);

        if (resourceLibrary.options.debug()) {

          console.log(' ');

          console.log('*** Polling for changes ***');

          console.log('buyer count: ', buyer, 'seller count: ', seller);
        }

        // Call update methods if change in `gTotal` detected
        if (seller > fbSeller.gTotal) {

          if (resourceLibrary.options.debug()) {

            console.log(' ');

            console.log('*** Changes in Seller stats detected ***');
          }

          // Pass in new grand total from polling (`seller`);
          getUpdates('seller', seller);
        }

        if (buyer > fbBuyer.gTotal) {

          if (resourceLibrary.options.debug()) {

            console.log(' ');

            console.log('*** Changes in Buyer stats detected ***');
          }

          getUpdates('buyer', buyer);
        }
      }
    });
  }


  // Save viewed states and clear notifications
  $('body').on('click', '.de-buyer-feedback, .de-seller-feedback', function() {

    let
        elemClass = this.className,
        name,
        obj;

    if (elemClass === 'nav_group_control de-buyer-feedback') {

      obj = JSON.parse(localStorage.getItem('fbBuyer'));

      name = 'fbBuyer';
    }

    if (elemClass === 'nav_group_control de-seller-feedback') {

      obj = JSON.parse(localStorage.getItem('fbSeller'));

      name = 'fbSeller';
    }

    return updateObj(name, obj);
  });

  // Menu interactions
  $('body').on('click', '.pos-reviews, .neu-reviews, .neg-reviews', function() {

    let
        elem = this.className,
        id = $(this).parent().parent().attr('id');


    if (id === 'de-seller-feedback') {

      let
          name = 'fbSeller',
          obj = JSON.parse(localStorage.getItem('fbSeller'));

      switch (elem) {

        case 'pos-reviews':

          updateObj(name, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user + '?show=Positive';

        case 'neu-reviews':

          updateObj(name, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user + '?show=Neutral';

        case 'neg-reviews':

          updateObj(name, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/seller_feedback/' + user + '?show=Negative';
      }
    }

    if (id === 'de-buyer-feedback') {

      let
          name = 'fbBuyer',
          obj = JSON.parse(localStorage.getItem('fbBuyer'));

      switch (elem) {

        case 'pos-reviews':

          updateObj(name, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user + '?show=Positive';

        case 'neu-reviews':

          updateObj(name, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user + '?show=Neutral';

        case 'neg-reviews':

          updateObj(name, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/buyer_feedback/' + user + '?show=Negative';
      }
    }
  });
});
