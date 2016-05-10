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
      baseValsChecked,
      d = new Date(),
      debug = resourceLibrary.options.debug(),
      feedbackObj = resourceLibrary.getItem('feedbackObj') || null,
      language = resourceLibrary.language(),
      lastChecked = resourceLibrary.getItem('feedbackObj').lastChecked || null,
      timeStamp = d.getTime(),
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      //user = 'KISSMYDISC.JP',
      waitTime = lastChecked + 120000; // 2 mins


  /**
   * Appends badges to menu bar
   *
   * pos/neu/negDiff: the number of new feedback reviews
   *
   * @param    {string} type: either buyer or seller
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
   * Updates the `buyer`/`seller` objects hasViewed prop
   * after user clicks on notifications
   *
   * @param    {string} type: either buyer or seller
   * @param    {object} obj: the object written to localStorage
   * @return   {method}
   */

  function clearNotification(type, obj) {

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    // update obj props; obj.gTotal is set during poll for changes
    obj.posCount = Number(obj.posCount) + Number(obj.posDiff);
    obj.posDiff = 0;

    obj.neuCount = Number(obj.neuCount) + Number(obj.neuDiff);
    obj.neuDiff = 0;

    obj.negCount = Number(obj.negCount) + Number(obj.negDiff);
    obj.negDiff = 0;

    obj.hasViewed = true;

    // save updated obj
    feedbackObj[type] = obj;

    return resourceLibrary.setItem('feedbackObj', feedbackObj);
  }


  /**
   * Gets Buyer/Seller number updates from profile
   *
   * @param    {string} type: either `buyer` or `seller`
   * @param    {number} gTotal: total number of all transactions
   * @return   {function}
   */

  function getUpdates(type, gTotal) {

    let obj;


    feedbackObj = resourceLibrary.getItem('feedbackObj');

    obj = feedbackObj[type];

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
        feedbackObj[type] = obj;

        /*
           Calcuate values to pass to `appendBadge()`
           so that the badge dropdown does not list 0 as a stat.
           I only want to show values greater than 0.
        */
        posDiff = (posDiff > 0 ? posDiff : '');
        neuDiff = (neuDiff > 0 ? neuDiff : '');
        negDiff = (negDiff > 0 ? negDiff : '');

        // Discogs stats seem to shift which causes a false
        // triggering of the notifications
        // if (posDiff === '' && neuDiff === '' && negDiff === '') {
        //
        //   if (debug) {
        //
        //     console.log(' ');
        //     console.log(' *** False positive triggered *** ');
        //     console.log(' *** No changes *** ');
        //     console.timeEnd('getUpdates');
        //   }
        //
        //   return clearNotification(type, obj);
        // }

        // Set timestamp when checked
        feedbackObj.lastChecked = timeStamp;

        resourceLibrary.setItem('feedbackObj', feedbackObj);

        if (debug) {

          console.log(' ');
          console.log(' *** Got ' + type + ' Updates *** ');
          console.log('pos: ', pos, 'neu: ', neu, 'neg: ', neg);
          console.log('Previous stats:');
          console.log('pos:', obj.posCount, 'neu:', obj.neuCount, 'neg:', obj.negCount);
          console.log(type + ' obj: ', feedbackObj[type]);
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
        //objName,
        negDiff,
        neuDiff,
        obj,
        posDiff;

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    //objName = (type === 'seller' ? 'seller' : 'buyer');

    obj = feedbackObj[type];

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
   * Creates the buyer/seller objects when none exist.
   *
   * @return {function}
   */

  function initObjVals() {

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
            buyerTotal = Number( $(response).find(selector + 'a[href*="buyer_feedback"]').text().trim().replace(/,/g, '') ),
            sellerTotal = Number( $(response).find(selector + 'a[href*="seller_feedback"]').text().trim().replace(/,/g, '') );
            response = { seller: sellerTotal, buyer: buyerTotal };

        if (debug) { console.timeEnd('initObjVals'); }

        return resetObjs(response).then(updateObjVals('seller')).then(updateObjVals('buyer'));
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
            posCount: [],
            posDiff: 0,
            neuCount: [],
            neuDiff: 0,
            negCount: [],
            negDiff: 0,
            gTotal: obj.buyer,
            hasViewed: true
          },

          sellerObj = {
            posCount: [],
            posDiff: 0,
            neuCount: [],
            neuDiff: 0,
            negCount: [],
            negDiff: 0,
            gTotal: obj.seller,
            hasViewed: true
          };

      // Get current object state
      feedbackObj = resourceLibrary.getItem('feedbackObj');

      if (debug) {

        console.log(' *** Resetting Object Values *** ');
        console.log('Reset sellerObj: ');
        console.log(sellerObj);
        console.log(' ');
        console.log('Reset buyerObj: ');
        console.log(buyerObj);
        console.time('resetObjs');
      }

      feedbackObj.seller = sellerObj;
      feedbackObj.buyer = buyerObj;

      // Save current state
      resourceLibrary.setItem('feedbackObj', feedbackObj);

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
        //objName = (type === 'buyer' ? 'buyer' : 'seller'),
        randomTime = Math.random();

    feedbackObj = resourceLibrary.getItem('feedbackObj');

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
            obj = feedbackObj[type],
            selector = '',
            neg = Number( $(response).find(selector + '.neg-rating-text').next('td').text().trim() ),
            neu = Number( $(response).find(selector + '.neu-rating-text').next('td').text().trim() ),
            pos = Number( $(response).find(selector + '.pos-rating-text').next('td').text().trim() );

//console.log($('#page_content .table_block.fright .pos-rating-text').next('td').next('td').text().trim());
        // assign new values to obj
        obj.posCount = pos;
        obj.neuCount = neu;
        obj.negCount = neg;
        obj.hasViewed = true;

        // Save obj updates
        feedbackObj[type] = obj;

        // Set timestamp when checked
        feedbackObj.lastChecked = timeStamp;

        resourceLibrary.setItem('feedbackObj', feedbackObj);

        if (debug) {

          console.log(obj);
          console.timeEnd(randomTime);
        }
      }
    });
  }


  // Set language for URL formation
  language = (language === 'en' ? '' : language + '/');


  // Create our object if it does not exist
  if (!resourceLibrary.getItem('feedbackObj')) {

    feedbackObj = {
      baseValsChecked: null,
      updateInterval: 900000,
      buyer: null,
      seller: null,
      lastChecked: null
    };

    // Save it...
    resourceLibrary.setItem('feedbackObj', feedbackObj);

    // Get newly saved object
    feedbackObj = resourceLibrary.getItem('feedbackObj');
  }


  // Create and assign `baseValsChecked` if it does not exist.
  if (!baseValsChecked) {

    // Get object
    feedbackObj = resourceLibrary.getItem('feedbackObj');

    // Give it a new prop value
    feedbackObj.baseValsChecked = timeStamp;

    // Save updated object
    resourceLibrary.setItem('feedbackObj', feedbackObj);

    // Set value on var
    baseValsChecked = feedbackObj.baseValsChecked;
  }


  // Initialize the `buyer` / `seller` objects;
  if (!feedbackObj.buyer || !feedbackObj.seller) { return initObjVals(); }


  // Append notifictions if they are unread.
  if (!feedbackObj.seller.hasViewed) { hasNotification('seller'); }
  if (!feedbackObj.buyer.hasViewed) { hasNotification('buyer'); }


  /*  Poll for changes */

  // if user has seen previous updates and its been longer than the `waitTime`
  if (feedbackObj.buyer.hasViewed && feedbackObj.seller.hasViewed && timeStamp > waitTime) {

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    if (debug) { console.time('poll-time'); }

    return $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,
      type: 'GET',
      dataType: 'html',

      success: function(response) {

        let
            selector = '#page_aside .list_no_style.user_marketplace_rating ',
            buyerTotal = Number( $(response).find(selector + 'a[href*="buyer_feedback"]').text().trim().replace(/,/g, '') ),
            sellerTotal = Number( $(response).find(selector + 'a[href*="seller_feedback"]').text().trim().replace(/,/g, '') );

        // Set timestamp when checked
        feedbackObj.lastChecked = timeStamp;

        resourceLibrary.setItem('feedbackObj', feedbackObj);

        if (debug) {

          console.log(' ');
          console.log(' *** Polling for changes *** ');
          console.log('buyer count: ', buyerTotal, 'seller count: ', sellerTotal);
          console.timeEnd('poll-time');
        }

        if (sellerTotal > feedbackObj.seller.gTotal) {

          if (debug) {

            console.log(' ');
            console.log(' *** Changes in Seller stats detected *** ');
            console.log('difference of: ', sellerTotal - feedbackObj.seller.gTotal);
            console.log(feedbackObj.seller);
          }

          // Pass in new grand total from polling;
          return getUpdates('seller', sellerTotal);
        }

        if (buyerTotal > feedbackObj.buyer.gTotal) {

          if (debug) {

            console.log(' ');
            console.log(' *** Changes in Buyer stats detected *** ');
            console.log('difference of: ', buyerTotal - feedbackObj.buyer.gTotal);
            console.log(feedbackObj.buyer);
          }

          return getUpdates('buyer', buyerTotal);
        }

        /*

            if the `gTotal` has not changed, reset the `buyer` / `seller` objects
            so that when a user's stats change due to the 3|6|12 month number updates
            the notifications still (hopefully) correctly identify when a
            review is posted.

            the one exception (that I anticipate at this point) is a review is left
            and the seller's stats shift on the same day. This would trigger an
            update cycle but the numbers would not reflect the change. I think
            this would be rare but I need to think of a solution.

        */

        feedbackObj = resourceLibrary.getItem('feedbackObj');

        // Using the <= operator here in case a user has some reviews removed which would lower the `gTotal` count
        if (buyerTotal <= feedbackObj.buyer.gTotal && sellerTotal <= feedbackObj.seller.gTotal && timeStamp > feedbackObj.baseValsChecked + feedbackObj.updateInterval) {

          if (debug) {

            console.log(' ');
            console.log(' *** Resetting Buyer/Seller base values *** ');
            console.time('reset');
          }

          return resetObjs( {seller: sellerTotal, buyer: buyerTotal} )
                        .then(updateObjVals('seller'))
                        .then(updateObjVals('buyer'))
                        .then(feedbackObj.baseValsChecked = timeStamp);

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
          type,
          obj;

      if (elemClass === 'nav_group_control de-buyer-feedback') {

        type = 'buyer';
      }

      if (elemClass === 'nav_group_control de-seller-feedback') {

        type = 'seller';
      }

      obj = resourceLibrary.getItem('feedbackObj')[type];

      clearNotification(type, obj);

      return $(this).parent().hide();
    });

    // Menu interactions
    $('body').on('click', '.pos-reviews, .neu-reviews, .neg-reviews', function() {

      let
          elem = this.className,
          id = $(this).parent().parent().attr('id'),
          obj,
          type;

      if (id === 'de-seller-feedback') {

        type = 'seller';
      }

      if (id === 'de-buyer-feedback') {

        type = 'buyer';
      }

      obj = resourceLibrary.getItem('feedbackObj')[type];

      switch (elem) {

        case 'pos-reviews':

          clearNotification(type, obj);

          /*
             These hrefs are declared here because I need to be able to update
             the object props before the transition. Don't try to pass them into the
             appendBadge markup. It won't work.
          */
          return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Positive';

        case 'neu-reviews':

          clearNotification(type, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Neutral';

        case 'neg-reviews last':

          clearNotification(type, obj);

          return window.location.href = 'https://www.discogs.com/' + language + 'sell/' + type + '_feedback/' + user + '?show=Negative';
      }
    });
  }
});
