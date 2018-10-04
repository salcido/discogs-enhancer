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
 * This feature will hide any listing in the Marketplace that is not from a specified country
 * when filtering with a specified currency.
 *
 * The script is initiated with the code that follows the `DOM manipulation` comment block.
 *
 * 1a) The URL is examined to see if the user is in the marketplace.
 * 1b) The URL is examined for the presence of query params.
 * 1c) localStorage is queried for the `filterByCountry` item.
 * 2.) If all these things are true, query params are examined for a `currency` param
 * 3.) If there is a `currency` param that matches the currency value saved in `filterByCountry`,
 * any results that do not ship from the specified country are hidden in the DOM via CSS class.
 */

resourceLibrary.ready(() => {

  let
      href = window.location.href,
      params = href.includes('?') ? href.split('?')[1].split('&') : null,
      prefs = JSON.parse(localStorage.getItem('filterByCountry')),
      //
      currency,
      enabled = false,
      marketplace = href.includes('/sell/list') && params && prefs,
      wantlist = href.includes('/sell/mywants') && params && prefs;


  /**
   * Iterates through the marketplace results and adds the `de-hide-country`
   * class to any countries that do not match the user's specified
   * country.
   *
   * @method filterByCountry
   * @return {undefined}
   */

  // add to window object so it can be called by Everlasting Marketplace
  window.filterByCountry = function filterByCountry() {

    let countries = document.querySelectorAll('.seller_info ul li:nth-child(3)');

    if ( enabled ) {

      countries.forEach(elem => {

        let greatGrandParent = elem.parentElement.parentElement.parentElement;

        if ( !elem.textContent.includes(prefs.country) &&
             !greatGrandParent.classList.contains('de-hide-country') ) {

          greatGrandParent.classList.add('de-hide-country');
        }
      });
    }
  };


  // ========================================================
  // DOM manipulation
  // ========================================================

  // Make sure the user is in the marketplace before doing all this stuff
  if ( wantlist || marketplace ) {

    // find currency query param value
    params.forEach(param => {

      if ( param.includes('currency') ) {

        currency = param.split('=')[1];

        // if the user has a prefs object and the query param for currency matches
        // the value set in the extension's popup set `enabled` to `true`.
        if ( prefs.country && prefs.currency && currency === prefs.currency ) {

          enabled = true;
        }
      }
    });

    window.filterByCountry();

    // ========================================================
    // UI Functionality
    // ========================================================

    let pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]');

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(window.filterByCountry);
      });
    });
  }
});
