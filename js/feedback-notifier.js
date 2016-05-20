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
      //user = $('#site_account_menu').find('.user_image').attr('alt'),
      user = 'recordsale-de',
      //user = 'KISSMYDISC.JP',
      //user = 'super.soul.records',
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

    pos = obj.posDiff[0];
    neu = obj.neuDiff[0];
    neg = obj.negDiff[0];

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
    obj.posDiff = [0, 0, 0];
    obj.neuDiff = [0, 0, 0];
    obj.negDiff = [0, 0, 0];
    obj.hasViewed = true;
    /* obj.gTotal is set during 'poll for changes' cycle */

    /* save updated obj */
    feedbackObj[type] = obj;

    return resourceLibrary.setItem('feedbackObj', feedbackObj);
  }

  /**
   * Finds the differences between old/new stats.
   *
   * @param    {string}      type        Either 'Negative' or 'Neutral'
   * @param    {array}       oldStat     An array of 3/6/12 month stats
   * @param    {array}       newStat     An array of 3/6/12 month stats
   * @param    {number}      totalShift  Difference between the old gTotal and the new gTotal
   * @return   {number}
   */

  function findStatsShift(type, oldStat, newStat, totalShift) {

    let
        answer,
        twelveMonthShift = newStat[2] - oldStat[2],
        sixMonthShift = newStat[1] - oldStat[1],
        threeMonthShift = newStat[0] - oldStat[0];

    if (oldStat[0] === newStat[0] && oldStat[1] === newStat[1] && oldStat[2] === newStat[2]) {

      /* No changes were found */
      if (debug) {

          console.log('No changes in ' + type + ' stats');
          console.log('Stats for:', type, 'old:', oldStat, 'new:', newStat);
        }

      answer = 0;

      return answer;

    } else if (threeMonthShift > 0) {

      /* The total change in stats is equal to the total change overall */
      if (threeMonthShift === totalShift) {

        answer = totalShift;

        return answer;

      } else {

        answer = threeMonthShift;

        return answer;
      }

    } else if (threeMonthShift === 0 && sixMonthShift > 0) {

      if (sixMonthShift === totalShift) {

        answer = totalShift;

        return answer;

      } else {

        answer = sixMonthShift;

        return answer;
      }

    } else if (threeMonthShift === 0 && sixMonthShift === 0 && twelveMonthShift > 0) {

      if (twelveMonthShift === totalShift) {

        answer = totalShift;

        return answer;

      } else {

        answer = twelveMonthShift;

        return answer;
      }

    } else {

      answer = 0;

      return answer;
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
        oldStats,
        totalShift;

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    obj = feedbackObj[type];

    totalShift = gTotal - obj.gTotal;

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
            selector = '#page_content .table_block.fright ',

            /* New values (yes, this is ugly. sorry.) */
            pos3 = Number( $(response).find(selector + '.pos-rating-text').next('td').text().trim() ),
            pos6 = Number( $(response).find(selector + '.pos-rating-text').next('td').next('td').text().trim() ),
            pos12 = Number( $(response).find(selector + '.pos-rating-text').next('td').next('td').next('td').text().trim() ),

            neu3 = Number( $(response).find(selector + '.neu-rating-text').next('td').text().trim() ),
            neu6 = Number( $(response).find(selector + '.neu-rating-text').next('td').next('td').text().trim() ),
            neu12 = Number( $(response).find(selector + '.neu-rating-text').next('td').next('td').next('td').text().trim() ),

            neg3 = Number( $(response).find(selector + '.neg-rating-text').next('td').text().trim() ),
            neg6 = Number( $(response).find(selector + '.neg-rating-text').next('td').next('td').text().trim() ),
            neg12 = Number( $(response).find(selector + '.neg-rating-text').next('td').next('td').next('td').text().trim() ),

            negAnswer,
            neuAnswer,
            posAnswer;


        /* Our stats objects */
        newStats = {
          posCount: [pos3, pos6, pos12],
          neuCount: [neu3, neu6, neu12],
          negCount: [neg3, neg6, neg12]
        };

        oldStats = {
          posCount: [obj.posCount[0], obj.posCount[1], obj.posCount[2]],
          neuCount: [obj.neuCount[0], obj.neuCount[1], obj.neuCount[2]],
          negCount: [obj.negCount[0], obj.negCount[1], obj.negCount[2]]
        };

        /*
          I am getting Negative stats first, as they are the most important notifications
          to show the user. If there were multiple stat changes
          (e.g.: one or more positive and neutral/negative feedbacks left), get the negative & neutral
          ones first. Subtract those numbers from the overall change in stats (aka `totalShift`).
          Whatever is left over should be the total number of positive feedbacks since they
          are the most common.

          This is likely not fool-proof. But since the stats constantly shift because of old feedback
          stats dropping off after 3/6/12 months, it seems the most reliable way to decipher what
          has changed.

          Do you know a better way? Please tell me! I spent days looking at stat changes for Discogs' user
          "recordsale-de" - the #1 seller on Discogs. Their numbers shift constantly and I couldn't find
          a reliable means of tracking the shifts exactly. Math is hard sometimes.
        */

        /*
          Negative Stats
         */

        negAnswer = findStatsShift('Negative', oldStats.negCount, newStats.negCount, totalShift);

        /*
          Neutral Stats
        */

        /* update `totalShift` value if necessary */
        totalShift = totalShift - negAnswer;

        neuAnswer = findStatsShift('Neutral', oldStats.neuCount, newStats.neuCount, totalShift);

        /*
          Positive Stats
        */

        /* update `totalShift` value if necessary */
        totalShift = totalShift - neuAnswer;

        posAnswer = (totalShift > 0 ? totalShift : 0);

        /* Assign new diff values to obj for reference */

        /*
           If there are existing notification stats,
           add them to the new ones,
           otherwise, just use the new ones.
        */
        obj.posDiff[0] = (obj.posDiff[0] > 0 ? obj.posDiff[0] + posAnswer : posAnswer);
        obj.neuDiff[0] = (obj.neuDiff[0] > 0 ? obj.neuDiff[0] + neuAnswer : neuAnswer);
        obj.negDiff[0] = (obj.negDiff[0] > 0 ? obj.negDiff[0] + negAnswer : negAnswer);

        obj.hasViewed = false;
        obj.gTotal = gTotal;

        /* Update feedbackObj[type] with new stats */
        obj.posCount = [pos3, pos6, pos12];
        obj.neuCount = [neu3, neu6, neu12];
        obj.negCount = [neg3, neg6, neg12];

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
            posCount: [0, 0, 0],
            posDiff: [0, 0, 0],
            neuCount: [0, 0, 0],
            neuDiff: [0, 0, 0],
            negCount: [0, 0, 0],
            negDiff: [0, 0, 0],
            gTotal: obj.buyer,
            hasViewed: true
          },

          sellerObj = {
            posCount: [0, 0, 0],
            posDiff: [0, 0, 0],
            neuCount: [0, 0, 0],
            neuDiff: [0, 0, 0],
            negCount: [0, 0, 0],
            negDiff: [0, 0, 0],
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
            selector = '#page_content .table_block.fright ',
            neg3 = Number( $(response).find(selector + '.neg-rating-text').next('td').text().trim() ),
            neu3 = Number( $(response).find(selector + '.neu-rating-text').next('td').text().trim() ),
            pos3 = Number( $(response).find(selector + '.pos-rating-text').next('td').text().trim() ),

            neg6 = Number( $(response).find(selector + '.neg-rating-text').next('td').next('td').text().trim() ),
            neu6 = Number( $(response).find(selector + '.neu-rating-text').next('td').next('td').text().trim() ),
            pos6 = Number( $(response).find(selector + '.pos-rating-text').next('td').next('td').text().trim() ),

            neg12 = Number( $(response).find(selector + '.neg-rating-text').next('td').next('td').next('td').text().trim() ),
            neu12 = Number( $(response).find(selector + '.neu-rating-text').next('td').next('td').next('td').text().trim() ),
            pos12 = Number( $(response).find(selector + '.pos-rating-text').next('td').next('td').next('td').text().trim() );

        /* Assign new values to obj */
        obj.negCount[0] = neg3;
        obj.neuCount[0] = neu3;
        obj.posCount[0] = pos3;

        obj.negCount[1] = neg6;
        obj.neuCount[1] = neu6;
        obj.posCount[1] = pos6;

        obj.negCount[2] = neg12;
        obj.neuCount[2] = neu12;
        obj.posCount[2] = pos12;

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
