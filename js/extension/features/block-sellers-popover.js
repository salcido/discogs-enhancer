/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This is the logic that controls the popover that
 * appears when you hover over a seller's name in the Marketplace.
 */

// TODO: add undo button?
rl.ready(() => {

  // ========================================================
  // Functions
  // ========================================================
  /**
   * Wraps a target element with the specified HTML Element.
   * @param {HTMLElement} wrappingElem - The element that will wrap the target
   * @param {HTMLElement} target - The target element that will be wrapped
   */
  function wrap(wrappingElem, target) {
    wrappingElem.parentNode.insertBefore(target, wrappingElem);
    target.appendChild(wrappingElem);
  }

  /**
   * Returns the success message markup for the popover.
   * @param {String} sellerName - The seller's username
   * @returns {String}
   */
  function successMessage(sellerName) {
    let message = `
          <div class="success hide">
            ${sellerName} has been added to your blocked list.
              <div class="muted">Refresh the page to put the block into effect or select more sellers to block.</div>
          </div>`;

    return message;
  }

  // ========================================================
  // DOM setup
  // ========================================================
  let sellerSelector = '.seller_info ul li:first-of-type strong a[href^="/seller/"]';

  window.blockSellersPopover = function blockSellersPopover() {
    // Grab all non-blocked seller names and wrap them with the
    // popover wrapping div
    document.querySelectorAll(sellerSelector).forEach((seller) => {
      if (!seller.closest('tr').classList.contains('blocked-seller')) {
        let wrappingDiv = document.createElement('div');
        wrappingDiv.classList = 'popover-wrap';

        wrap(seller, wrappingDiv);
      }
    });

    // Find all wrapped divs and inject the popover markup
    document.querySelectorAll('.popover-wrap').forEach((popover) => {
      if (!popover.querySelector('.popover-content')) {

        let sellerName = popover.querySelector('a').textContent,
            popoverMarkup = `
              <div class="popover-content">
                <button class="popover-ui button button-red button-small">Block ${sellerName}</button>
                ${successMessage(sellerName)}
              </div>
            `;

        popover.insertAdjacentHTML('beforeend', popoverMarkup);
      }
    });
  };

  // Attach event listeners to each popover
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('popover-ui')) {
      let sellerName = event.target.closest('.popover-wrap').querySelector('a').textContent,
          up = JSON.parse(localStorage.getItem('userPreferences'));

      up.newBlockedSellers = up.newBlockedSellers ? up.newBlockedSellers : [];
      up.newBlockedSellers.push(sellerName);

      localStorage.setItem('userPreferences', JSON.stringify(up));

      if ( rl.pageIsNot('shopMyWants') ) {
        event.target.closest('tr').classList.add('blocked-seller');
      } else {
        event.target.closest('.border-brand-border01.flex.flex-col.border-solid').classList.add('blocked-seller');
      }

      event.target.textContent = 'Blocked!';
      event.target.disabled = true;
      event.target.closest('.popover-content').querySelector('.success').classList.remove('hide');
    }
  });

  // ========================================================
  // CSS
  // ========================================================

  let rules = /*css*/`
    .popover-wrap {
      position: relative;
      display: inline-block;
    }
    .popover-content {
      opacity: 0;
      visibility: hidden;
      position: absolute;
      transform: translate(0, 10px);
      background-color: white;
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 26%);
      min-width: 90px;
      padding: 1rem;
      border-radius: 5px;
      white-space: nowrap;
      transition: all 0s;
    }

    .popover-wrap:hover .popover-content {
      z-index: 10;
      opacity: 1;
      visibility: visible;
      transform: translate(0, 0px);
      transition: all 0.2s cubic-bezier(0.75, -0.02, 0.2, 0.97);
      transition-delay: 1s;
    }
    .popover-content .hide {
      display: none;
    }
    .button {
      border-radius: 3px;
      display: inline-block;
      border-style: solid;
      border-width: 1px;
      vertical-align: middle;
      height: 2em;
      line-height: 2em;
      padding: 0 1em;
      font-weight: normal;
      font-size: 14px;
      font-family: Helvetica, Arial, sans-serif;
      text-align: center;
    }
    .button-red {
      border-color: #9c2f2e;
      border-top-color: #a33230;
      border-bottom-color: #902c2a;
      background-color: #BF3A38;
    }
    .button-small {
      font-size: 12px;
      padding: 0 1em;
    }
    .success {
      margin-top: 1rem;
      width: 200px;
      white-space: normal;
      color: black;
    }
    .success .muted {
      margin-top: .5rem;
      font-weight: normal;
      color: gray;
      font-size: small;
      line-height: 18px;
    }
    .popover-ui {
      text-align: center;
    }
  `;

  rl.attachCss('block-seller-popover', rules);
  rl.handlePaginationClicks(window.blockSellersPopover);
  window.blockSellersPopover();

  if ( rl.pageIs('shopMyWants') ) {

    rl.onSellItemComplete(() => {
      rl.waitForElement('.border-brand-border01.flex.flex-col.border-solid').then(() => {
        // console.log('popover', response);
        let itemsForSale = document.querySelectorAll('.border-brand-border01.flex.flex-col.border-solid'),
            sellerName = '.flex-row.justify-between.gap-4 ul.w-full.overflow-hidden li p a';

        itemsForSale.forEach((item) => {
          let seller = item.querySelector(sellerName);

          if ( !seller.closest('.border-brand-border01.flex.flex-col.border-solid').classList.contains('blocked-seller')
                  && !seller.closest('.border-brand-border01.flex.flex-col.border-solid').classList.contains('favorite-seller')) {
            let wrappingDiv = document.createElement('div');
            wrappingDiv.classList = 'popover-wrap';
            wrap(seller, wrappingDiv);
          }
        });
        window.blockSellersPopover();
      });
    });

  }
});
