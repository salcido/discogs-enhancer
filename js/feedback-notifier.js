/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO add get/set localStorage methods to resourceLibrary for easy parsing/stringification

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
      updateBaseVals = 1000, //21600000; // 6 hours
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      waitTime = lastChecked + 10000; //120000; // 10 mins

  /**
   * Appends badges to menu bar
   *
   * @instance
   * @param    {string} type
   * @param    {number | string} posDiff
   * @param    {number | string} neuDiff
   * @param    {number | string} negDiff
   * @return   {undefined}
   */

  function appendBadge(type, posDiff, neuDiff, negDiff) {

    let
        badge,
        color,
        id,
        initial;

    if (type === 'seller') {

      color = colorSeller;
      id = 'de-seller-feedback';
      initial = 'S';
    }

    if (type === 'buyer') {

      color = colorBuyer;
      id = 'de-buyer-feedback';
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
                  '<li class="neg-reviews last">' +
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
           posDiff = pos - obj.posCount;

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

          console.log('pos: ', pos, 'neu: ', neu, 'neg: ', neg);

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

  /**
   * [updateObjVals description]
   * @memberof
   * @instance
   * @param    {[type]} type
   * @return   {[type]}
   */

  function updateObjVals(type) {

    let name;

    name = (type === 'buyer' ? 'fbBuyer' : 'fbSeller');

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            obj = JSON.parse(localStorage.getItem(name)),
            neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
            neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
            pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() );

        // assign new values to obj
        obj.posCount = pos;
        obj.neuCount = neu;
        obj.negCount = neg;
        obj.hasViewed = true;

        // Save obj updates
        obj = JSON.stringify(obj);
        localStorage.setItem(name, obj);

        // Set timestamp when checked
        localStorage.setItem('fbLastChecked', timeStamp);
      }
    });
  }


  // Set language for URL formation
  language = (language === 'en' ? '' : language + '/');


  /**
   * Creates the fbBuyer/fbSeller objects when none exist.
   *
   * @instance
   * @param    {object} fbBuyer | fbSeller
   * @return   {undefined}
   */

  function initObjVals() {

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
    });
  }


  // Initialize the `fbBuyer` / `fbSeller` objects;
  if (!fbBuyer || !fbSeller) {

    let p = new Promise(function(resolve, reject) {

      resolve(initObjVals());
    });

    p.then(function() {

      return updateObjVals('buyer');

    }).then(function() {

      return updateObjVals('seller');
    });

    return;
  }


  // Appends existing notifications if they have not been acknowledged
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
  if (fbBuyer.hasViewed && fbSeller.hasViewed && timeStamp > waitTime) {

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

        /*

            if the `gTotal` has not changed, reset the `fbBuyer` / `fbSeller` objects
            so that when a user's stats change due to the 3|6|12 month number updates
            the notifications still (hopefully) correctly identify when a
            review is posted.

            the one exception (that I anticipate at this point) is a review is left
            and the seller's stats shift on the same day. This would trigger an
            update cycle but the numbers would not reflect the change. I think
            this would be rare but I obviously need to think of a solution.

            (I'm using <= operator in case a user has some reviews removed which would lower
             the `gTotal` count and all hell would break loose.)

        */

        if (buyer <= fbBuyer.gTotal && seller <= fbSeller.gTotal && timeStamp > lastChecked + updateBaseVals) {

          let p = new Promise(function(resolve, reject) {

            resolve(updateObjVals('buyer'));
          });

          p.then(function() {

            return updateObjVals('seller');
          });

          return;
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

    updateObj(name, obj);

    $(this).parent().hide();

    return;  // TODO change initial to 'X', color to gray on hover;
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
