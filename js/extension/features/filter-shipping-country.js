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
 * This feature will hide items that ship from specified countries in the Marketplace.
 */

resourceLibrary.ready(() => {

  let
      countryList = JSON.parse(localStorage.getItem('countryList')),
      href = window.location.href,
      currencyInURL = href.includes('currency='),
      sellPage = href.includes('/sell/list'), // master releases && all items in marketplace
      sellRelease = href.includes('/sell/release/'),
      wantsPage = href.includes('/sell/mywants');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Adds event listners to the prev and next buttons
   *
   * @method addUiListeners
   * @returns {undefined}
   */

  function addUiListeners() {

    let pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a');

    pagination.forEach(elem => {
      elem.addEventListener('click', () => {
        resourceLibrary.xhrSuccess(window.filterCountries());
      });
    });
  }

  /**
   * Filter items in the Marketplace
   *
   * @method filterCountries
   * @return {function}
   */
  window.filterCountries = function filterCountries(include, useCurrency) {

    let shipsFrom = document.querySelectorAll('td.seller_info ul li:nth-child(3)');

    if ( !useCurrency || useCurrency && currencyInURL ) {

      shipsFrom.forEach(location => {

        let countryName = location.textContent.split(':')[1];

        if ( !countryList.list.includes(countryName) === include ) {
          location.parentElement.parentElement.parentElement.classList.add('de-hide-country');
        }
      });
    }
    return addUiListeners();
  };


  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( countryList ) {
    if ( sellPage || sellRelease || wantsPage ) {
      window.filterCountries(countryList.include, countryList.currency);
    }
  }
});
