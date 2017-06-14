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
 * 2.) If all these things are true, query params examined for `currency`
 * 3.) If there is a `currency` param that matches the currency value saved in `filterByCountry`,
 * any results that do not ship from the specified country are hidden in the DOM via CSS class.
 */

$(document).ready(function() {

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
   * add to window object so it can be called by other features in
   * the extension
   *
   * @method filterByCountry
   * @return {undefined}
   */

  window.filterByCountry = function filterByCountry() {

    let listings = $('.seller_info ul li:nth-child(3)'),
        countries = listings.toArray();

    if (enabled) {

      $(countries).each(function() {

        if ( !$(this).text().includes(prefs.country) &&
             !$(this).parent().parent().parent().hasClass('de-hide-country') ) {

          $(this).parent().parent().parent().addClass('de-hide-country');
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

    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        window.filterByCountry();
      });
    });
  }
});
