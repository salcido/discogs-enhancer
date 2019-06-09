/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This feature will mark any seller who's reputation falls below a specified number.
 *
 * 1.) The URL is examined to see if the user is in the Marketplace.
 * 2.) localStorage is queried for a `threshold` item.
 * 3.) The seller's reputations are pushed into a `ratings` array and iterated over.
 * 4.) If the reputation value is below the specified threshold, the `de-seller-rep`
 * class is added to the seller's rating element in the DOM.
 */

resourceLibrary.ready(() => {

  let threshold = resourceLibrary.getItem('sellerRep');

  if ( !threshold ) return;

  if ( resourceLibrary.pageIs('allItems', 'sellRelease', 'myWants') ) {

    // ========================================================
    // Functions
    // ========================================================

    function attachCSS() {
      let respColor = resourceLibrary.getItem('sellerRepColor') || 'darkorange',
          sellerRepCss = document.createElement('style'),
          color = respColor.match(/#*\w/g).join('');

      sellerRepCss.id = 'sellerRepCss';
      sellerRepCss.rel = 'stylesheet';
      sellerRepCss.type = 'text/css';
      sellerRepCss.textContent = `.de-dark-theme .de-seller-rep ul li i,
                                  .de-dark-theme .de-seller-rep ul li strong,
                                  .de-seller-rep ul li i,
                                  .de-seller-rep ul li strong {
                                    color: ${color} !important;
                                  }`;

      document.head.append(sellerRepCss);
    }
    /**
     * Finds all the seller's reputation scores in the DOM and
     * adds a `de-seller-rep` class to them if necessary. Also
     * injects the seller-rep icon into the DOM.
     * @method sellersRep
     * @return {undefined}
     */
    window.sellersRep = function sellersRep() {

      let ratingVals = [...document.getElementsByClassName('seller_info')],
          ratings = ratingVals.map(val => Number( val.textContent.match(/\d+\.+\d/g) ) );

      // Tag any sellers below threshold
      ratings.forEach((rating, i) => {

        let seller_info = document.getElementsByClassName('seller_info');

        // if you want to tag new sellers as well change this to:
        // if ( rating < threshold ) {
        if ( rating
             && rating < threshold
             && !seller_info[i].querySelector('.de-seller-rep-icon')) {

          let icon = document.createElement('span'),
              name = seller_info[i].querySelector('ul li:first-child a').textContent;

          icon.className = 'de-seller-rep-icon';
          icon.title = `${name}'s seller reputation is below ${threshold}%`;

          seller_info[i].classList.add('de-seller-rep');
          seller_info[i].querySelector('li:first-child')
                        .insertAdjacentElement('beforeend', icon);
        }
      });
    };

    // ========================================================
    // DOM manipulation
    // ========================================================
    attachCSS();
    window.sellersRep();

    // UI Functionality
    // ------------------------------------------------------
    let selector = 'ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a',
        pagination = document.querySelectorAll(selector);

    pagination.forEach(elem => {
      elem.addEventListener('click', () => {
        resourceLibrary.xhrSuccess(window.sellersRep);
      });
    });
  }
});
