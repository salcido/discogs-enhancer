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
      fbBuyer = resourceLibrary.getItem('fbBuyer'),
      fbSeller = resourceLibrary.getItem('fbSeller'),
      language = resourceLibrary.language(),
      lastChecked = Number(resourceLibrary.getItem('fbLastChecked')),
      timeStamp = d.getTime(),
      updateBaseVals = 7200000, // 2 hours
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      waitTime = lastChecked + 1000; //120000; // 10 mins
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
        id;

    id = (type === 'seller' ? 'de-seller-feedback' : 'de-buyer-feedback');

    badge = '<li style="position: relative;">' +
              '<span id="' + id + '">' +
                '<a class="nav_group_control ' + id + '">' +
                  '<span class="skittle skittle_collection" style="cursor: pointer;">' +
                    '<span class="count" style="color: white !important;"></span>' +
                  '</span>' +
                '</a>' +
                '<ul class="feedback-chart ' + type + '">' +
                  '<li class="pos-reviews" alt="View Positive reviews">' +
                    '<h3 class="pos">Positive</h3>' +
                    '<h2 class="pos-count">' + posDiff + '</h2>' +
                  '</li>' +
                  '<li class="neu-reviews" alt="View Neutral reviews">' +
                    '<h3 class="neu">Neutral</h3>' +
                    '<h2 class="neu-count">' + neuDiff + '</h2>' +
                  '</li>' +
                  '<li class="neg-reviews last" alt="View negative reviews">' +
                    '<h3 class="neg">Negative</h3>' +
                    '<h2 class="neg-count">' + negDiff + '</h2>' +
                  '</li>' +
                '</ul>' +
              '</span>' +
            '</li>';

    $('#activity_menu').append(badge);
  }


  /**
   * Updates the `fbBuyer`/`fbSeller` objects hasViewed prop
   * after user clicks on notifications
   *
   * @instance
   * @param    {string} name
   * @param    {object} obj
   * @return   {method}
   */

  function clearNotification(name, obj) {

    // update obj props; obj.gTotal is set during poll for changes
    obj.posCount = Number(obj.posCount) + Number(obj.posDiff);

    obj.posDiff = 0;

    obj.neuCount = Number(obj.neuCount) + Number(obj.neuDiff);

    obj.neuDiff = 0;

    obj.negCount = Number(obj.negCount) + Number(obj.negDiff);

    obj.negDiff = 0;

    obj.hasViewed = true;

    // save updated obj
    return resourceLibrary.setItem(name, obj);
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
        obj,
        objName;

    objName = (type === 'seller' ? 'fbSeller' : 'fbBuyer');

    obj = resourceLibrary.getItem(objName);

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/' + type +'_feedback/' + user,

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
        resourceLibrary.setItem(objName, obj);

        // Calcuate values to pass to `appendBadge()`
        posDiff = posDiff > 0 ? posDiff : '';

        neuDiff = neuDiff > 0 ? neuDiff : '';

        negDiff = negDiff > 0 ? negDiff : '';

        // Set timestamp when checked
        resourceLibrary.setItem('fbLastChecked', timeStamp);

        if (resourceLibrary.options.debug()) {

          console.log(' ');

          console.log('*** Got ' + type + ' Updates ***');

          console.log('pos: ', pos, 'neu: ', neu, 'neg: ', neg);

          console.log(objName + ' obj: ', resourceLibrary.getItem(objName));
        }

        return appendBadge(type, posDiff, neuDiff, negDiff);
      }
    });
  }


  /**
   * Appends existing notifications if they have not been acknowledged
   *
   * @instance
   * @param    {string}  type
   * @return   {function}
   */

  function hasNotification(type) {

    let
        objName,
        negDiff,
        neuDiff,
        obj,
        posDiff;

    objName = (type === 'seller' ? 'fbSeller' : 'fbBuyer');

    obj = resourceLibrary.getItem(objName);

    posDiff = obj.posDiff;
    neuDiff = obj.neuDiff;
    negDiff = obj.negDiff;

    posDiff = posDiff > 0 ? posDiff : '';
    neuDiff = neuDiff > 0 ? neuDiff : '';
    negDiff = negDiff > 0 ? negDiff : '';

    if (resourceLibrary.options.debug()) {

      console.log(' ');

      console.log(' *** Existing notifications for: ' + type + ' *** ');
    }

    return appendBadge(type, posDiff, neuDiff, negDiff);
  }


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
            seller = Number( $(response).find('a[href*="seller_feedback"]').text().trim() ),

        // setup initial object states
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

        resourceLibrary.setItem('fbBuyer', buyerObj);

        resourceLibrary.setItem('fbSeller', sellerObj);

        if (resourceLibrary.options.debug()) {

          console.log(' ');

          console.log(' *** initializing base object values *** ');
        }
      }
    });

    return;
  }


  /**
   * Sets the object with the most recent stats
   * from the profile page
   *
   * @instance
   * @param    {string} type
   * @return   {undefined}
   */

  function updateObjVals(type) {

    let objName;

    objName = (type === 'buyer' ? 'fbBuyer' : 'fbSeller');

    $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user,

      type: 'GET',

      dataType: 'html',

      success: function(response) {

        let
            obj = resourceLibrary.getItem(objName),
            neg = Number( $(response).find('.neg-rating-text').next('td').text().trim() ),
            neu = Number( $(response).find('.neu-rating-text').next('td').text().trim() ),
            pos = Number( $(response).find('.pos-rating-text').next('td').text().trim() );

        // assign new values to obj
        obj.posCount = pos;
        obj.neuCount = neu;
        obj.negCount = neg;
        obj.hasViewed = true;

        // Save obj updates
        resourceLibrary.setItem(objName, obj);

        // Set timestamp when checked
        resourceLibrary.setItem('fbLastChecked', timeStamp);

        if (resourceLibrary.options.debug()) {

          console.log(' ');

          console.log(' *** updating object values for ' + type + ' *** ');

          console.log(obj);
        }
      }
    });

    return;
  }


  // Set language for URL formation
  language = (language === 'en' ? '' : language + '/');


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


  if (!fbSeller.hasViewed) {

    hasNotification('seller');
  }

  if (!fbBuyer.hasViewed) {

    hasNotification('buyer');
  }


  // poll for changes
  // if user has seen previous updates and its been longer than the `waitTime`
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
        resourceLibrary.setItem('fbLastChecked', timeStamp);

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
            this would be rare but I need to think of a solution.

        */

        // I'm using the <= operator in case a user has some reviews removed which would lower the `gTotal` count
        if (buyer <= fbBuyer.gTotal && seller <= fbSeller.gTotal && timeStamp > lastChecked + updateBaseVals) {

          if (resourceLibrary.options.debug()) {

            console.log(' ');

            console.log(' *** Resetting Buyer/Seller base values *** ');
          }

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
      }
    });
  }


  // Save viewed states and clear notifications
  $('body').on('click', '.de-buyer-feedback, .de-seller-feedback', function() {

    let
        elemClass = this.className,
        objName,
        obj;

    if (elemClass === 'nav_group_control de-buyer-feedback') {

      objName = 'fbBuyer';
    }

    if (elemClass === 'nav_group_control de-seller-feedback') {

      objName = 'fbSeller';
    }

    obj = resourceLibrary.getItem(objName);

    clearNotification(objName, obj);

    $(this).parent().hide();

    return;
  });

  // Menu interactions
  $('body').on('click', '.pos-reviews, .neu-reviews, .neg-reviews', function() {

    let
        elem = this.className,
        id = $(this).parent().parent().attr('id'),
        objName,
        obj,
        type;

    if (id === 'de-seller-feedback') {

      objName = 'fbSeller';
      type = 'seller';

    } else {

      objName = 'fbBuyer';
      type = 'buyer';
    }

    obj = resourceLibrary.getItem(objName);

    switch (elem) {

      case 'pos-reviews':

        clearNotification(objName, obj);

        // These hrefs are declared here because I need to be able to update
        // the object props before the transition
        return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Positive';

      case 'neu-reviews':

        clearNotification(objName, obj);

        return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Neutral';

      case 'neg-reviews last':

        clearNotification(objName, obj);

        return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Negative';
    }
  });
});
