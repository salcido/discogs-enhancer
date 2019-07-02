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

rl.ready(() => {

  let countryList = rl.getPreference('countryList'),
      href = window.location.href,
      currencyInURL = href.includes('currency='),
      currentFilterState = rl.getPreference('currentFilterState');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Filter items in the Marketplace
   *
   * @method filterCountries
   * @return {function}
   */
  window.filterCountries = function filterCountries(include, useCurrency) {

    let shipsFrom = [...document.querySelectorAll('td.seller_info ul li:nth-child(3)')];

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
  };

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-hide-country {
        display: none;
      }`;

  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( countryList ) {

    // Convert to lowercase for comparisons
    countryList.list = countryList.list.map(i => i.toLowerCase());

    if ( rl.pageIs('allItems', 'sellRelease', 'myWants') ) {

      rl.attachCss('filterShippingCountryCss', rules);
      window.filterCountries(countryList.include, countryList.currency);
    }

    rl.handlePaginationClicks(window.filterCountries, countryList.include, countryList.currency);
  }
});
