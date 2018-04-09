/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will monitor the user's Buyer and Seller feedback numbers
 * and append badges to the navbar when any new feedback has been
 * detected.
 */
resourceLibrary.ready(() => {

  let debug = resourceLibrary.options.debug(),
      feedbackObj = resourceLibrary.getItem('feedbackObj') || null,
      language = resourceLibrary.language(),
      timeStamp = new Date().getTime(),
      user = document.querySelector('#site_account_menu .user_image').alt,
      //user = 'recordsale-de',
      waitTime = (1000 * 60) * 2; // 2 mins

  // ========================================================
  // Functions (Alphabetical)
  // ========================================================

  /**
   * Appends badges to menu bar
   * @param    {string} type         Either buyer or seller
   * @return   {function}
   */
  function appendBadge(type) {

    let obj = resourceLibrary.getItem('feedbackObj')[type],
        existing = !obj.hasViewed,
        badge,
        id,
        neg,
        neu,
        pos;

    id = (type === 'seller' ? 'de-seller-feedback' : 'de-buyer-feedback');

    if ( existing && debug ) {

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

    badge = `<li style="position: relative;">
              <span id="${id}">
                <a class="nav_group_control ${id}">
                  <span class="skittle skittle_collection" style="cursor: pointer; pointer-events: none;">
                    <span class="count" style="color: white !important;"></span>
                  </span>
                </a>
                <ul class="feedback-chart ${type}">
                  <li class="pos-reviews" alt="View Positive reviews">
                    <h3 class="pos">Positive</h3>
                    <h2 class="pos-count">${pos}</h2>
                  </li>
                  <li class="neu-reviews" alt="View Neutral reviews">
                    <h3 class="neu">Neutral</h3>
                    <h2 class="neu-count">${neu}</h2>
                  </li>
                  <li class="neg-reviews last" alt="View negative reviews">
                    <h3 class="neg">Negative</h3>
                    <h2 class="neg-count">${neg}</h2>
                  </li>
                </ul>
              </span>
            </li>`;

    /* Remove preloader */
    if ( document.querySelector(`.${type}_feedbackLoader`) ) {
      document.querySelector(`.${type}_feedbackLoader`).remove();
    }

    document.querySelector('#activity_menu').insertAdjacentHTML('beforeend', badge);

    return bindUi();
  }

  /**
   * Appends the badge preloader to the navbar.
   * @param {string} type buyer or seller
   * @returns {method}
   */
  function appendPreloader(type) {

    let preloader = `<li style="position: relative;" class="${type}feedbackLoader">
                        <i class="icon icon-spinner icon-spin nav_group_control"></i>
                     </li>`;
    // remove previous badge if it exists
    if (document.querySelector(`#de-${type}-feedback`)) {
      document.querySelector(`#de-${type}-feedback`).parentElement.remove();
    }

    return document.querySelector('#activity_menu').insertAdjacentHTML('beforeend', preloader);
  }

  /**
   * Attaches event listeners to the buyer and seller badges.
   * @returns {undefined}
   */
  function bindUi() {

    // ========================================================
    // Clear notifications and save "viewed" states
    // ========================================================
    [...document.querySelectorAll('.de-buyer-feedback, .de-seller-feedback')].forEach(elem => {

      elem.addEventListener('click', ({ target }) => {

        let elemClass = target.className,
            type,
            obj;

        type = elemClass === 'nav_group_control de-buyer-feedback' ? 'buyer' : 'seller';

        obj = resourceLibrary.getItem('feedbackObj')[type];

        clearNotification(type, obj);

        return target.parentElement.style.display = 'none';
      });
    });

    // ========================================================
    // Menu interactions
    // ========================================================
    [...document.querySelectorAll('.pos-reviews, .neu-reviews, .neg-reviews')].forEach(elem => {

      elem.addEventListener('click', ({ target }) => {

        let elem = target.className,
            id = target.parentElement.parentElement.id,
            obj,
            queryParam,
            type;

        type = id === 'de-seller-feedback' ? 'seller' : 'buyer';

        obj = resourceLibrary.getItem('feedbackObj')[type];

        switch (elem) {

          case 'pos-reviews':
            queryParam = '?show=Positive';
            break;

          case 'neu-reviews':
            queryParam = '?show=Neutral';
            break;

          case 'neg-reviews last':
            queryParam = '?show=Negative';
            break;
        }

        clearNotification(type, obj);

        /*
          The href is declared here because I need to be able to update
          the object props before the transition. Don't try to pass them into the
          appendBadge markup. It won't work.
        */
        return window.location.href = `https://www.discogs.com/${language}sell/${type}_feedback/${user}${queryParam}`;
      });
    });
  }

  /**
   * Updates the `buyer`/`seller` objects hasViewed prop
   * after user clicks on notifications
   * @param {string} type  Either buyer or seller
   * @param {object} obj   The object written to localStorage
   * @return {method}
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
   * Creates the buyer/seller objects when none exist.
   * @return {function}
   */
  async function createBuyerSellerObjs() {

    if (debug) {

      console.log(' ');
      console.log(' *** initializing base object values *** ');
      console.time('createBuyerSellerObjs');
    }

    let div = await fetchBuyerSellerTotals(),
        selector = '#page_aside .list_no_style.user_marketplace_rating ',
        buyerTotal = Number(div.querySelector(selector + 'a[href*="buyer_feedback"]').textContent.trim().replace(/,/g, '')),
        sellerTotal = Number(div.querySelector(selector + 'a[href*="seller_feedback"]').textContent.trim().replace(/,/g, '')),
        response = { seller: sellerTotal, buyer: buyerTotal };

    if (debug) { console.timeEnd('createBuyerSellerObjs'); }

    resetStats(response);
    getStatsFor('seller');
    getStatsFor('buyer');
  }

  /**
   * Fetches the buyer and seller total numbers
   * from a user's profile.
   * @returns {object}
   */
  async function fetchBuyerSellerTotals() {

    let url = `https://www.discogs.com/user/${user}`,
        response = await fetch(url),
        data = await response.text(),
        div = document.createElement('div');

    div.innerHTML = data;
    return div;
  }

  /**
   * Fetches the most recent Pos, Neu, and Neg numbers from a
   * user's profile.
   * @param {string} type Buyer or seller
   * @returns {object}
   */
  async function fetchFeedbackData(type) {

    let url = `https://www.discogs.com/sell/${type}_feedback/${user}`,
        response = await fetch(url),
        data = await response.text(),
        div = document.createElement('div');

    div.innerHTML = data;
    return div;
  }

  /**
   * Finds the differences between old/new stats.
   * @param {string} type    Either 'Negative' or 'Neutral' used for debugging
   * @param {array} oldStat  Previous value
   * @param {array} newStat  Current value
   * @return {number}
   */
  function findStatsShift(type, oldStat, newStat) {

    let shift = newStat - oldStat;

    if ( oldStat === newStat || shift < 0 ) {

      /* No changes were found */
      if ( debug ) {

          console.log('No changes in ' + type + ' stats');
          console.log('Stats for:', type, 'old:', oldStat, 'new:', newStat);
        }
      return 0;
    }
    return shift;
  }

  /**
   * Sets the object with the most recent stats
   * from the profile page when feedback-notifier is
   * first run.
   * @param {string} type  Either 'buyer' or 'seller'
   * @return {undefined}
   */
  async function getStatsFor(type) {

    /* used to report time elapsed for debugging */
    let randomTime = Math.random();

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    if (debug) {

      console.log(' ');
      console.log(' *** updating ' + type + ' object stats *** ');
      console.time(randomTime);
    }

    let data = await fetchFeedbackData(type),
        obj = feedbackObj[type],
        pos = getTabCount(data, 0),
        neu = getTabCount(data, 1),
        neg = getTabCount(data, 2);

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

  /**
   * Gets the number from the specified feedback tab on
   * a user's profile.
   * @param {object} data The element to pull the total from
   * @param {integer} index The index position of the element
   * @returns {integer}
   */
  function getTabCount(data, index) {

    let sel = '.tab_menu .menu-item .facet_count';
    return Number(data.querySelectorAll(sel)[index].textContent.trim().replace(/,/g, ''));
  }

  /**
   * Get's the user's feedback numbers from their profile,
   * parses the HTML returned in the response for the Positive,
   * Neutral and Negative totals and then appends those numbers
   * (if any) to the nav bar.
   * @param {string} type    Either `buyer` or `seller`
   * @param {number} gTotal  Total number of all transactions
   * @return {function}
   */
  async function getUpdates(type, gTotal) {

    let data,
        obj;

    feedbackObj = resourceLibrary.getItem('feedbackObj');

    obj = feedbackObj[type];

    if (debug) {

      console.log(' *** Getting updates for ' + type + ' *** ');
      console.time('getUpdates');
    }

    data = await fetchFeedbackData(type);
    parseFeedbackData(data, obj, type, gTotal);
    return appendBadge(type);
  }

  /**
   * Parses the DOM elements passed in for feedback numbers from
   * the user's profile.
   * @param {object} data The feedback elements from the user's page
   * @param {object} obj An object used to store the new data to be written into localStorage
   * @param {string} type Buyer or seller
   * @param {string} gTotal Total number of feedbacks received
   * @returns {undefined}
   */
  function parseFeedbackData(data, obj, type, gTotal) {

    let
        pos = getTabCount(data,0),
        neu = getTabCount(data,1),
        neg = getTabCount(data,2),
        negAnswer,
        neuAnswer,
        posAnswer,
        newStats,
        oldStats;

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
  }

  /**
   * Checks the user's profile for changes to their total number of
   * feedbacks received and calls
   * @returns {undefined}
   */
  async function pollForChanges() {

    let div = await fetchBuyerSellerTotals(),
        selector = '#page_aside .list_no_style.user_marketplace_rating ',
        bfsel = 'a[href*="buyer_feedback"]',
        sfsel = 'a[href*="seller_feedback"]',
        buyerTotal = Number(div.querySelector(selector + bfsel).textContent.trim().replace(/,/g, '')),
        sellerTotal = Number(div.querySelector(selector + sfsel).textContent.trim().replace(/,/g, ''));

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

    // Check Seller stats
    if ( sellerTotal > feedbackObj.seller.gTotal ) {

      if (debug) {

        console.log(' ');
        console.log(' *** Changes in Seller stats detected *** ');
        console.log('difference of: ', sellerTotal - feedbackObj.seller.gTotal);
        console.log(feedbackObj.seller);
      }

      appendPreloader('seller_');
      getUpdates('seller', sellerTotal);
    }

    // Check buyer stats
    if ( buyerTotal > feedbackObj.buyer.gTotal ) {

      if (debug) {

        console.log(' ');
        console.log(' *** Changes in Buyer stats detected *** ');
        console.log('difference of: ', buyerTotal - feedbackObj.buyer.gTotal);
        console.log(feedbackObj.buyer);
      }

      appendPreloader('buyer_');
      getUpdates('buyer', buyerTotal);
    }
  }

  /**
   * Resets the objects and adds the most recent buyer/seller grand total stats
   * @param {object} obj {seller: seller, buyer: buyer}
   * @returns {method}
   */
  function resetStats(obj) {

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
  }

  // ========================================================
  // DOM Setup/Init
  // ========================================================

  /* Set language for URL formation */
  language = ( language === 'en' ? '' : language + '/' );

  /* Create our object if it does not exist */
  if ( !resourceLibrary.getItem('feedbackObj') ) {

    feedbackObj = {
      baseValsChecked: timeStamp, // not used anymore but might be useful as install date?
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
  if ( !feedbackObj.buyer || !feedbackObj.seller ) {
    return createBuyerSellerObjs();
  }

  /* Append notifictions if they are unread. */
  if ( !feedbackObj.seller.hasViewed ) { appendBadge('seller'); }

  if ( !feedbackObj.buyer.hasViewed ) { appendBadge('buyer'); }

  // ========================================================
  // Poll for changes
  // ========================================================

  feedbackObj = resourceLibrary.getItem('feedbackObj');

  /* If it's been longer than the `waitTime` */
  if ( timeStamp > feedbackObj.lastChecked + waitTime ) {

    if (debug) { console.time('poll-time'); }

    pollForChanges();
  }
});
