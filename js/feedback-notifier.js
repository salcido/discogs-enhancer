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
      debug = resourceLibrary.options.debug(),
      feedbackObj = resourceLibrary.getItem('feedbackObj') || null,
      language = resourceLibrary.language(),
      timeStamp = d.getTime(),
      user = $('#site_account_menu').find('.user_image').attr('alt'),
      //user = 'recordsale-de',
      waitTime = 120000; // 2 mins

  /**
   * Appends badges to menu bar
   *
   * @param    {string} type         Either buyer or seller
   * @param    {number|string} pos   The number of new feedback reviews
   * @param    {number|string} neu   ""
   * @param    {number|string} neg   ""
   * @return   {undefined}
   */

  function appendBadge(type) {

    let
        obj = resourceLibrary.getItem('feedbackObj')[type],
        existing = (obj.hasViewed ? false : true),
        badge,
        id,
        neg,
        neu,
        pos;

    id = (type === 'seller' ? 'de-seller-feedback' : 'de-buyer-feedback');

    if (existing && debug) {

      console.log(' ');
      console.log(' *** Existing notifications for: ' + type + ' *** ');
    }

    pos = obj.posDiff;
    neu = obj.neuDiff;
    neg = obj.negDiff;

    /* Don't show a 0 value in notificaiton */
    pos = (pos > 0 ? pos : '');
    neu = (neu > 0 ? neu : '');
    neg = (neg > 0 ? neg : '');

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
                    '<h2 class="pos-count">' + pos + '</h2>' +
                  '</li>' +
                  '<li class="neu-reviews" alt="View Neutral reviews">' +
                    '<h3 class="neu">Neutral</h3>' +
                    '<h2 class="neu-count">' + neu + '</h2>' +
                  '</li>' +
                  '<li class="neg-reviews last" alt="View negative reviews">' +
                    '<h3 class="neg">Negative</h3>' +
                    '<h2 class="neg-count">' + neg + '</h2>' +
                  '</li>' +
                '</ul>' +
              '</span>' +
            '</li>';

    /* Remove preloader */
    $('.' + type + '_feedbackLoader').remove();

    /* Remove if appended already.
       This is pretty lazy. I should find a more sophisticated way of
       dealing with existing notification skittles.... probs with a promise. */
    if (existing) {

      $('.' + type).parent().remove();
    }

    $('#activity_menu').append(badge);

    return bindUi();
  }


  /**
   * Updates the `buyer`/`seller` objects hasViewed prop
   * after user clicks on notifications
   *
   * @param    {string} type  Either buyer or seller
   * @param    {object} obj   The object written to localStorage
   * @return   {method}
   */

  function clearNotification(type, obj) {

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    /* update obj props. */
    obj.posDiff = 0;
    obj.neuDiff = 0;
    obj.negDiff = 0;
    obj.hasViewed = true;
    // Note: obj.gTotal is set during 'poll for changes' cycle

    /* save updated obj */
    feedbackObj[type] = obj;

    return resourceLibrary.setItem('feedbackObj', feedbackObj);
  }

  /**
   * Finds the differences between old/new stats.
   *
   * @param    {string}      type        Either 'Negative' or 'Neutral' used for debugging
   * @param    {array}       oldStat     Previous value
   * @param    {array}       newStat     Current value
   * @return   {number}
   */

  function findStatsShift(type, oldStat, newStat) {

    let shift = newStat - oldStat;

    if (oldStat === newStat || shift < 0) {

      /* No changes were found */
      if (debug) {

          console.log('No changes in ' + type + ' stats');
          console.log('Stats for:', type, 'old:', oldStat, 'new:', newStat);
        }

      return 0;

    } else {

      return shift;
    }
  }


  /**
   * Gets Buyer/Seller number updates from profile
   *
   * @param    {string} type    Either `buyer` or `seller`
   * @param    {number} gTotal  Total number of all transactions
   * @return   {function}
   */

  function getUpdates(type, gTotal) {

    let obj,
        newStats,
        oldStats;

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    obj = feedbackObj[type];

    if (debug) {

      console.log(' *** Getting updates for ' + type + ' *** ');
      console.time('getUpdates');
    }

    return $.ajax({

      url: 'https://www.discogs.com/' + language + 'sell/' + type +'_feedback/' + user,
      type: 'GET',
      dataType: 'html',

      success: function(response) {

        let
            pos = Number( $(response).find('.tab_menu .menu-item:eq(1) .facet_count').text().trim().replace(/,/g, '') ),
            neu = Number( $(response).find('.tab_menu .menu-item:eq(2) .facet_count').text().trim().replace(/,/g, '') ),
            neg = Number( $(response).find('.tab_menu .menu-item:eq(3) .facet_count').text().trim().replace(/,/g, '') ),
            negAnswer,
            neuAnswer,
            posAnswer;

        /* Our stats objects */
        newStats = {
          posCount: pos,
          neuCount: neu,
          negCount: neg
        };

        oldStats = {
          posCount: obj.posCount,
          neuCount: obj.neuCount,
          negCount: obj.negCount
        };

        negAnswer = findStatsShift('Negative', oldStats.negCount, newStats.negCount);
        neuAnswer = findStatsShift('Neutral', oldStats.neuCount, newStats.neuCount);
        posAnswer = findStatsShift('Positive', oldStats.posCount, newStats.posCount);

        /* Assign new diff values to obj for reference */
        obj.posDiff = (obj.posDiff > 0 ? obj.posDiff + posAnswer : posAnswer);
        obj.neuDiff = (obj.neuDiff > 0 ? obj.neuDiff + neuAnswer : neuAnswer);
        obj.negDiff = (obj.negDiff > 0 ? obj.negDiff + negAnswer : negAnswer);
        obj.hasViewed = false;
        obj.gTotal = gTotal;

        /* Update feedbackObj[type] with new stats */
        obj.posCount = pos;
        obj.neuCount = neu;
        obj.negCount = neg;

        feedbackObj[type] = obj;

        /* Set timestamp when checked */
        feedbackObj.lastChecked = timeStamp;

        /* Save our object with the new stats/notification totals */
        resourceLibrary.setItem('feedbackObj', feedbackObj);

        if (debug) {

          console.log(' ');
          console.log(' *** Got ' + type + ' Updates *** ');
          console.log('pos: ', posAnswer, 'neu: ', neuAnswer, 'neg: ', negAnswer);
          console.log('Previous stats:');
          console.log('pos:', obj.posCount, 'neu:', obj.neuCount, 'neg:', obj.negCount);
          console.log(type + ' obj: ', feedbackObj[type]);
          console.log('Results from new stats', 'pos', posAnswer, 'neu', neuAnswer, 'neg', negAnswer);
          console.timeEnd('getUpdates');
        }

        return appendBadge(type);
      }
    });
  }

  /**
   * Creates the buyer/seller objects when none exist.
   *
   * @return {function}
   */

  function createBuyerSellerObjs() {

    if (debug) {

      console.log(' ');
      console.log(' *** initializing base object values *** ');
      console.time('createBuyerSellerObjs');
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

        if (debug) { console.timeEnd('createBuyerSellerObjs'); }

        return resetStats(response).then(getStatsFor('seller')).then(getStatsFor('buyer'));
      }
    });
  }


  /**
   * Resets the objects and adds the most recent buyer/seller grand total stats
   *
   * @param    {object} obj: {seller: seller, buyer: buyer}
   */

  function resetStats(obj) {

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

      /* Get current object state */
      feedbackObj = resourceLibrary.getItem('feedbackObj');

      if (debug) {

        console.log(' *** Resetting Object Values *** ');
        console.log('Reset sellerObj: ');
        console.log(sellerObj);
        console.log(' ');
        console.log('Reset buyerObj: ');
        console.log(buyerObj);
        console.time('resetStats');
      }

      feedbackObj.seller = sellerObj;
      feedbackObj.buyer = buyerObj;

      /* Save current state */
      resourceLibrary.setItem('feedbackObj', feedbackObj);

      if (debug) {

        console.log('Done resetting buyer/seller objects.');
        console.timeEnd('resetStats');
      }

      resolve();
    });
  }


  /**
   * Sets the object with the most recent stats
   * from the profile page when feedback-notifier is
   * first run.
   *
   * @param    {string} type  Either 'buyer' or 'seller'
   * @return   {undefined}
   */

  function getStatsFor(type) {

    /* used to report time elapsed for debugging */
    let randomTime = Math.random();

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

      success: (response) => {

        let
            obj = feedbackObj[type],
            pos = Number( $(response).find('.tab_menu .menu-item:eq(1) .facet_count').text().trim().replace(/,/g, '') ),
            neu = Number( $(response).find('.tab_menu .menu-item:eq(2) .facet_count').text().trim().replace(/,/g, '') ),
            neg = Number( $(response).find('.tab_menu .menu-item:eq(3) .facet_count').text().trim().replace(/,/g, '') );

        /* Assign new values to obj */
        obj.negCount = neg;
        obj.neuCount = neu;
        obj.posCount = pos;
        obj.hasViewed = true;

        /* Save obj updates */
        feedbackObj[type] = obj;

        /* Set timestamp when checked */
        feedbackObj.lastChecked = timeStamp;

        resourceLibrary.setItem('feedbackObj', feedbackObj);

        if (debug) {

          console.log(obj);
          console.timeEnd(randomTime);
        }
      }
    });
  }


  /* Set language for URL formation */
  language = (language === 'en' ? '' : language + '/');


  /* Create our object if it does not exist */
  if (!resourceLibrary.getItem('feedbackObj')) {

    feedbackObj = {
      baseValsChecked: timeStamp, // not used but might be useful as install date.
      buyer: null,
      seller: null,
      lastChecked: timeStamp
    };

    /* Save it... */
    resourceLibrary.setItem('feedbackObj', feedbackObj);

    /* Get newly saved object */
    feedbackObj = resourceLibrary.getItem('feedbackObj');
  }


  /* Create the `buyer` / `seller` objects; */
  if (!feedbackObj.buyer || !feedbackObj.seller) {
    return createBuyerSellerObjs();
  }

  /* Append notifictions if they are unread. */
  if (!feedbackObj.seller.hasViewed) {
    appendBadge('seller');
  }

  if (!feedbackObj.buyer.hasViewed) {
    appendBadge('buyer');
  }


  /*

  Poll for changes

  */

  feedbackObj = resourceLibrary.getItem('feedbackObj');

  /* If it's been longer than the `waitTime` */
  if (timeStamp > feedbackObj.lastChecked + waitTime) {

    if (debug) { console.time('poll-time'); }

    return $.ajax({

      url: 'https://www.discogs.com/' + language + 'user/' + user,
      type: 'GET',
      dataType: 'html',

      success: function(response) {

        let
            type,
            preloader,
            selector = '#page_aside .list_no_style.user_marketplace_rating ',
            buyerTotal = Number( $(response).find(selector + 'a[href*="buyer_feedback"]').text().trim().replace(/,/g, '') ),
            sellerTotal = Number( $(response).find(selector + 'a[href*="seller_feedback"]').text().trim().replace(/,/g, '') );

        /* Set timestamp when checked */
        feedbackObj.lastChecked = timeStamp;

        resourceLibrary.setItem('feedbackObj', feedbackObj);

        if (debug) {

          console.log(' ');
          console.log(' *** Polling for changes *** ');
          console.log('Buyer count: ', buyerTotal, 'Seller count: ', sellerTotal);
          console.log('%cNext check-in time: ', 'color: limegreen', new Date(feedbackObj.lastChecked + waitTime).toLocaleTimeString());
          console.timeEnd('poll-time');
        }

        if (sellerTotal > feedbackObj.seller.gTotal) {

          if (debug) {

            console.log(' ');
            console.log(' *** Changes in Seller stats detected *** ');
            console.log('difference of: ', sellerTotal - feedbackObj.seller.gTotal);
            console.log(feedbackObj.seller);
          }

          type = 'seller_';

          preloader = '<li style="position: relative;" class="' + type + 'feedbackLoader"><i class="icon icon-spinner icon-spin nav_group_control"></i></li>';

          // remove previous badge if it exists
          if ($('#de-seller-feedback').length) {

            $('#de-seller-feedback').parent().remove();
          }

          $('#activity_menu').append(preloader);

          /* Pass in new grand total from polling; */
          getUpdates('seller', sellerTotal);
        }

        if (buyerTotal > feedbackObj.buyer.gTotal) {

          if (debug) {

            console.log(' ');
            console.log(' *** Changes in Buyer stats detected *** ');
            console.log('difference of: ', buyerTotal - feedbackObj.buyer.gTotal);
            console.log(feedbackObj.buyer);
          }

          type = 'buyer_';

          preloader = '<li style="position: relative;" class="' + type + 'feedbackLoader"><i class="icon icon-spinner icon-spin nav_group_control"></i></li>';

          // remove previous badge if it exists
          if ($('#de-buyer-feedback').length) {

            $('#de-buyer-feedback').parent().remove();
          }

          $('#activity_menu').append(preloader);

          getUpdates('buyer', buyerTotal);
        }
      }
    });
  }

  /**
   * UI Functionality
   */
  function bindUi() {

    /* Save viewed states and clear notifications */
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

    /* Menu interactions */
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
