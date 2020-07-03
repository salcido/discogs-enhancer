/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

rl.ready(() => {
  // ========================================================
  // Functions
  // ========================================================
  /**
   * Gets the `Buyers` form data from the seller settings page
   * @param {String} buyer - The buyer to block
   * @returns {Object}
   */
  async function getBuyersForm(buyer) {

    try {
      let url = '/settings/seller/',
          response = await fetch(url),
          data = await response.text(),
          div = document.createElement('div');

      div.innerHTML = data;

      return extractFormData(div, buyer);
    } catch(err) {
      errorMsg();
    }
  }

  /**
   * Extracts the necessary data from the seller form.
   * @param {HTMLElement} div - The element to pull the data from
   * @param {String} buyer - The buyer's username to block
   * @returns {Object}
   */
  function extractFormData(div, buyer) {

    let fp_token = div.querySelector('#fp_token').value || null,
        min_buyer_rating = div.querySelector('#min_buyer_rating').value || '',
        blocked = div.querySelector('#blocked').value,
        list = blocked.match(/([-.\w]{3,50})/g) || [],
        newList = [];

    if (!fp_token) throw new Error('fp_token not found.');

    list.push(buyer);
    newList = [...new Set(list)].join('\n');

    return {
      token: fp_token,
      mbr: min_buyer_rating,
      buyers: newList
    };
  }

  /**
   * Posts the blocked user data to Discogs
   * @param {String} buyer - The name of the buyer to block
   * @returns {HTMLElement} - Success or Error user notification
   */
  async function blockBuyer(buyer) {

    let params = await getBuyersForm(buyer),
        query = `fpt_token=${params.fpt}&min_buyer_rating=${params.mbr}&blocked=${params.buyers}`,
        url = '/settings/seller/update_buyer_criteria',
        headers = { 'content-type': 'application/x-www-form-urlencoded' },
        initObj = {
          body: query,
          credentials: 'include',
          headers: headers,
          method: 'POST'
        },
        response = await fetch(url, initObj);

    if ( response.ok ) {
      return successMsg(buyer);
    }
    return errorMsg();
  }

  /**
   * Inject the block buyer button into the page
   * @returns {undefined}
   */
  function setup() {

    let username = '.order-user-details a[href*="/user/"]',
        buyerInfo = document.querySelector(username).closest('.box-card'),
        button = document.createElement('button'),
        header = buyerInfo.querySelector('.box-card-header');

    button.classList = 'button button-small button-red de-block-buyer';
    button.textContent = 'Block Buyer';

    header.insertAdjacentElement('beforeend', button);
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.querySelector('h3.no_vertical').style.display = 'inline-block';
  }

  /**
   * Click event listener
   * @returns {undefined}
   */
  function addBlockListener() {
    document.querySelector('.de-block-buyer').addEventListener('click', () => {
      let name = document.querySelector('.order-user-details a').textContent,
          btn = document.querySelector('.de-block-buyer');

      btn.innerHTML = '<i class="icon icon-spinner icon-spin" style="color: #999 !important"></i> Blocking...';
      btn.disabled = true;
      blockBuyer(name);
    });
  }

  /**
   * Display a success message to the user.
   * @returns {undefined}
   */
  function successMsg(buyer) {
    let banner,
        btn = document.querySelector('.de-block-buyer');

    btn.innerHTML = 'Blocked!';
    btn.disabled = true;
    banner = `<div class="alert-message alert-message-js alert-message-accept alert-message-top">
                <div class="alert-message-content" style="max-width: none;">
                  <i class="icon icon-check-circle alert-message-icon"></i>
                  <span class="alert-message-text">
                    ${buyer} has been blocked.
                    <a href="/settings/seller/#seller-buyers-form">Click here to view your blocked buyers.</a>
                  </span>
                </div>
              </div>`;
    document.querySelector('#site_header_wrap').insertAdjacentHTML('beforeend', banner);
  }

  /**
   * Display an error message to the user.
   * @returns {undefined}
   */
  function errorMsg() {
    let banner = `<div class="alert-message alert-message-js alert-message-error alert-message-top">
                    <div class="alert-message-content" style="max-width: none;">
                      <i class="icon icon-exclamation-triangle alert-message-icon"></i>
                      <span class="alert-message-text">
                        Oops! Something went wrong. Please make sure you are logged in.
                      </span>
                    </div>
                  </div>`;
    document.querySelector('#site_header_wrap').insertAdjacentHTML('beforeend', banner);
  }

  // ========================================================
  // DOM Setup
  // ========================================================
  let orders = '.order-page-header a[href*="/sell/orders"]';

  if ( rl.pageIs('order') && document.querySelector(orders) ) {
    setup();
    addBlockListener();
  }
});
/*
// ========================================================
   180 degrees, but not that hot
   So whether or not you find the answer is really not the plot
   Because giving is receiving and seeing is believing
   And the solar system rotates so harmonious and even
   It's perfectly balanced...
   https://www.discogs.com/Aceyalone-A-Book-Of-Human-Language/master/19149
// ========================================================
 */
