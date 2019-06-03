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
      currentFilterState = JSON.parse(localStorage.getItem('currentFilterState'));

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

        if ( !countryList.list.includes(countryName.toLowerCase()) === include ) {
          location.closest('.shortcut_navigable').classList.add('de-hide-country');
        }
      });
    }

    // Update page with filter notice (everlasting)
    if ( !currentFilterState.filterMediaCondition
          && !currentFilterState.filterSleeveCondition
          && !document.querySelector('.de-filter-stamp') ) {

      document.querySelectorAll('.pagination').forEach(e => {

        let div = document.createElement('div');

        div.innerHTML = window.setFilterStateText();
        div.className = 'de-filter-stamp';
        div.style.margin = '8px 0';
        e.insertAdjacentElement('afterend', div);
      });
    }
    return addUiListeners();
  };


  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( countryList ) {

    // Convert to lowercase for comparisons
    countryList.list = countryList.list.map(i => i.toLowerCase());

    if ( resourceLibrary.pageIs('allItems', 'sellRelease', 'myWants') ) {

      let style = document.createElement('style');

      style.type = 'text/css';
      style.id = 'filterShippingCountryCss';
      style.rel = 'stylesheet';
      style.textContent = `
      .de-hide-country {
        display: none;
      }`;

      document.head.append(style);

      window.filterCountries(countryList.include, countryList.currency);
    }
  }
});
