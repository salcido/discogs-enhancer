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
      baseValsChecked = Number(resourceLibrary.getItem('fbBaseValsChecked')),
      baseValsInterval = 900000, // 15 mins
      d = new Date(),
      debug = resourceLibrary.options.debug(),
      fbBuyer = resourceLibrary.getItem('fbBuyer'),
      fbSeller = resourceLibrary.getItem('fbSeller'),
      language = resourceLibrary.language(),
      lastChecked = Number(resourceLibrary.getItem('fbLastChecked')),
      timeStamp = d.getTime(),
      //user = $('#site_account_menu').find('.user_image').attr('alt'),
      user = 'KISSMYDISC.JP',
      waitTime = lastChecked + 120000; // 2 mins


  /**
   * Appends badges to menu bar
   *
   * pos/neu/negDiff: the number of new feedback reviews
   *
   * @param    {string} type
   * @param    {number | string} posDiff: difference between previous/current stats
   * @param    {number | string} neuDiff: ""
   * @param    {number | string} negDiff: ""
   * @return   {undefined}
   */

  function appendBadge(type, posDiff, neuDiff, negDiff) {

    let badge,
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

    return bindUi();
  }


  /**
   * Updates the `fbBuyer`/`fbSeller` objects hasViewed prop
   * after user clicks on notifications
   *
   * objName:
   *
   * @param    {string} objName:  the name of the localStorage item
   * @param    {object} obj: the object written to localStorage
   * @return   {method}
   */

  function clearNotification(objName, obj) {

    // update obj props; obj.gTotal is set during poll for changes
    obj.posCount = Number(obj.posCount) + Number(obj.posDiff);
    obj.posDiff = 0;

    obj.neuCount = Number(obj.neuCount) + Number(obj.neuDiff);
    obj.neuDiff = 0;

    obj.negCount = Number(obj.negCount) + Number(obj.negDiff);
    obj.negDiff = 0;

    obj.hasViewed = true;

    // save updated obj
    return resourceLibrary.setItem(objName, obj);
  }


  /**
   * Gets Buyer/Seller number updates from profile
   *
   * gTotal: the grand total of the buyer/seller f eedbacks
   *
   * @param    {number} gTotal: total number of all transactions
   * @return   {function}
   */

  function getUpdates(type, gTotal) {

    let
        obj,
        objName;

    objName = (type === 'seller' ? 'fbSeller' : 'fbBuyer');

    obj = resourceLibrary.getItem(objName);

    if (debug) {

      console.log(' *** getting updates for ' + type + ' *** ');
      console.time('getUpdates');
    }

    return $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/' + type +'_feedback/' + user,
      type: 'GET',
      dataType: 'html',

      success: function(response) {

        let
            selector = '#page_content .table_block.fright ',

            neg = Number( $(response).find(selector + '.neg-rating-text').next('td').text().trim() ),
            negDiff = (obj.negCount === 0 ? neg : neg - obj.negCount),

            neu = Number( $(response).find(selector + '.neu-rating-text').next('td').text().trim() ),
            neuDiff = (obj.neuCount === 0 ? neu : neu - obj.neuCount),

            pos = Number( $(response).find(selector + '.pos-rating-text').next('td').text().trim() ),
            posDiff = (obj.posCount === 0 ? pos : pos - obj.posCount);

        // assign new diff values to obj for reference
        obj.posDiff = posDiff;
        obj.neuDiff = neuDiff;
        obj.negDiff = negDiff;
        obj.hasViewed = false;
        obj.gTotal = gTotal;

        // Save obj updates
        resourceLibrary.setItem(objName, obj);

        // Calcuate values to pass to `appendBadge()`
        // so that the badge dropdown does not list 0 as a stat.
        // I only want to show values greater than 0.
        posDiff = (posDiff > 0 ? posDiff : '');
        neuDiff = (neuDiff > 0 ? neuDiff : '');
        negDiff = (negDiff > 0 ? negDiff : '');

        // Discogs stats seem to shift which causes a false
        // triggering of the notifications
        if (posDiff === '' && neuDiff === '' && negDiff === '') {

          if (debug) {

            console.log(' ');
            console.log(' *** False positive triggered *** ');
            console.log(' *** No changes *** ');
            console.timeEnd('getUpdates');
          }

          return clearNotification(objName, obj);
        }

        // Set timestamp when checked
        resourceLibrary.setItem('fbLastChecked', timeStamp);

        if (debug) {

          console.log(' ');
          console.log(' *** Got ' + type + ' Updates *** ');
          console.log('pos: ', pos, 'neu: ', neu, 'neg: ', neg);
          console.log('Previous stats:');
          console.log('pos:', obj.posCount, 'neu:', obj.neuCount, 'neg:', obj.negCount);
          console.log(objName + ' obj: ', resourceLibrary.getItem(objName));
          console.timeEnd('getUpdates');
        }

        appendBadge(type, posDiff, neuDiff, negDiff);
      }
    });
  }


  /**
   * Appends existing notifications if they have not been acknowledged
   *
   * @param    {string}  type: either 'buyer' or 'seller'
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

    posDiff = (posDiff > 0 ? posDiff : '');
    neuDiff = (neuDiff > 0 ? neuDiff : '');
    negDiff = (negDiff > 0 ? negDiff : '');

    if (debug) {

      console.log(' ');
      console.log(' *** Existing notifications for: ' + type + ' *** ');
    }

    return appendBadge(type, posDiff, neuDiff, negDiff);
  }


  /**
   * Creates the fbBuyer/fbSeller objects when none exist.
   *
   * @param    {object} fbBuyer | fbSeller
   * @param    {function} action: will always be resetObjs()
   * @param    {function} callback: will always be updateObjVals()
   */

  function initObjVals(action, callback) {

    if (debug) {

      console.log(' ');
      console.log(' *** initializing base object values *** ');
      console.time('initObjVals');
    }

    return $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,
      type: 'GET',
      dataType: 'html',

      success: function(response) {

        let
            selector = '#page_aside .list_no_style.user_marketplace_rating ',
            buyer = Number( $(response).find(selector + 'a[href*="buyer_feedback"]').text().trim().replace(/,/g, '') ),
            seller = Number( $(response).find(selector + 'a[href*="seller_feedback"]').text().trim().replace(/,/g, '') );
            response = { seller: seller, buyer: buyer };

        if (debug) { console.timeEnd('initObjVals'); }

        return action(response).then(callback('seller')).then(callback('buyer'));
      }
    });
  }


  /**
   * Resets the objects with the most recent buyer/seller grand total stats
   *
   * @param    {object} obj: {seller: seller, buyer: buyer}
   */

  function resetObjs(obj) {

    return new Promise(function(resolve, reject) {

      let
          buyerObj = {
            posCount: 0,
            posDiff: 0,
            neuCount: 0,
            neuDiff: 0,
            negCount: 0,
            negDiff: 0,
            gTotal: obj.buyer,
            hasViewed: true
          },

          sellerObj = {
            posCount: 0,
            posDiff: 0,
            neuCount: 0,
            neuDiff: 0,
            negCount: 0,
            negDiff: 0,
            gTotal: obj.seller,
            hasViewed: true
          };

      if (debug) {

        console.log(' *** Resetting Object Values *** ');
        console.log('Reset sellerObj: ');
        console.log(sellerObj);
        console.log(' ');
        console.log('Reset buyerObj: ');
        console.log(buyerObj);
        console.time('resetObjs');
      }

      resourceLibrary.setItem('fbSeller', sellerObj);
      resourceLibrary.setItem('fbBuyer', buyerObj);

      if (debug) {

        console.log('Done resetting buyer/seller objects.');
        console.timeEnd('resetObjs');
      }

      resolve();
    });
  }


  /**
   * Sets the object with the most recent stats
   * from the profile page
   *
   * @param    {string} type: either 'buyer' or 'seller'
   * @return   {undefined}
   */

  function updateObjVals(type) {

    let
        objName = (type === 'buyer' ? 'fbBuyer' : 'fbSeller'),
        randomTime = Math.random();

    if (debug) {

      console.log(' ');
      console.log(' *** updating ' + type + ' object stats *** ');
      console.time(randomTime);
    }

    return $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user,
      type: 'GET',
      dataType: 'html',

      success: function(response) {

        let
            obj = resourceLibrary.getItem(objName),
            selector = '#page_content .table_block.fright ',
            neg = Number( $(response).find(selector + '.neg-rating-text').next('td').text().trim() ),
            neu = Number( $(response).find(selector + '.neu-rating-text').next('td').text().trim() ),
            pos = Number( $(response).find(selector + '.pos-rating-text').next('td').text().trim() );

        // assign new values to obj
        obj.posCount = pos;
        obj.neuCount = neu;
        obj.negCount = neg;
        obj.hasViewed = true;

        // Save obj updates
        resourceLibrary.setItem(objName, obj);

        // Set timestamp when checked
        resourceLibrary.setItem('fbLastChecked', timeStamp);

        if (debug) {

          console.log(obj);
          console.timeEnd(randomTime);
        }
      }
    });
  }


  // Set language for URL formation
  language = (language === 'en' ? '' : language + '/');


  // Create and assign `baseValsChecked` if it does not exist.
  if (!baseValsChecked) {

    resourceLibrary.setItem('fbBaseValsChecked', timeStamp);
    baseValsChecked = resourceLibrary.getItem('fbBaseValsChecked');
  }


  // Initialize the `fbBuyer` / `fbSeller` objects;
  if (!fbBuyer || !fbSeller) {

    return initObjVals(resetObjs, updateObjVals);
  }


  // Append notifictions if they are unread.
  if (!fbSeller.hasViewed) { hasNotification('seller'); }
  if (!fbBuyer.hasViewed) { hasNotification('buyer'); }


  // poll for changes
  // if user has seen previous updates and its been longer than the `waitTime`
  if (fbBuyer.hasViewed && fbSeller.hasViewed && timeStamp > waitTime) {

    if (debug) { console.time('poll-time'); }

    return $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,
      type: 'GET',
      dataType: 'html',

      success: function(response) {

        let
            selector = '#page_aside .list_no_style.user_marketplace_rating ',
            buyer = Number( $(response).find(selector + 'a[href*="buyer_feedback"]').text().trim().replace(/,/g, '') ),
            seller = Number( $(response).find(selector + 'a[href*="seller_feedback"]').text().trim().replace(/,/g, '') );

        // Set timestamp when checked
        resourceLibrary.setItem('fbLastChecked', timeStamp);

        if (debug) {

          console.log(' ');
          console.log(' *** Polling for changes *** ');
          console.log('buyer count: ', buyer, 'seller count: ', seller);
          console.timeEnd('poll-time');
        }

        if (seller > fbSeller.gTotal) {

          if (debug) {

            console.log(' ');
            console.log(' *** Changes in Seller stats detected *** ');
            console.log('difference of: ', seller - fbSeller.gTotal);
            console.log(fbSeller);
          }

          // Pass in new grand total from polling (`seller`);
          return getUpdates('seller', seller);
        }

        if (buyer > fbBuyer.gTotal) {

          if (debug) {

            console.log(' ');
            console.log(' *** Changes in Buyer stats detected *** ');
            console.log('difference of: ', buyer - fbBuyer.gTotal);
            console.log(fbBuyer);
          }

          return getUpdates('buyer', buyer);
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

        // Using the <= operator here in case a user has some reviews removed which would lower the `gTotal` count
        if (buyer <= fbBuyer.gTotal && seller <= fbSeller.gTotal && timeStamp > baseValsChecked + baseValsInterval) {

          if (debug) {

            console.log(' ');
            console.log(' *** Resetting Buyer/Seller base values *** ');
            console.time('reset');
          }

          return resetObjs( {seller: seller, buyer: buyer} )
                        .then(updateObjVals('seller'))
                        .then(updateObjVals('buyer'))
                        .then(resourceLibrary.setItem('fbBaseValsChecked', timeStamp));

        }
      }
    });
  }

  /**
   * UI Functionality
   */
  function bindUi() {

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

      return $(this).parent().hide();
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
      }

      if (id === 'de-buyer-feedback') {

        objName = 'fbBuyer';
        type = 'buyer';
      }

      obj = resourceLibrary.getItem(objName);

      switch (elem) {

        case 'pos-reviews':

          clearNotification(objName, obj);

          // These hrefs are declared here because I need to be able to update
          // the object props before the transition. Don't try to pass them into the
          // appendBadge markup. It won't work.
          return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Positive';

        case 'neu-reviews':

          clearNotification(objName, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Neutral';

        case 'neg-reviews last':

          clearNotification(objName, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Negative';
      }
    });
  }
});
