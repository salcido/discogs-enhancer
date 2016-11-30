/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */
// TODO add enabled prop to localStorage object so this doesn't
// fire when everlasting marketplace calls it
$(document).ready(function() {

  let
      params = document.location.href.indexOf('?') > -1 ? document.location.href.split('?')[1].split('&') : null,
      currency,
      prefs = JSON.parse(localStorage.getItem('filterByCountry'));

  // add to window object so it can be called by other features in
  // the extension
  window.filterByCountry = function filterByCountry() {

    let listings = $('.seller_info ul li:nth-child(3)'),
        countries = listings.toArray();

    $(countries).each(function() {

      if ( $(this).text().indexOf(prefs.country) === -1 &&
          !$(this).parent().parent().parent().hasClass('de-hide-country') ) {

        $(this).parent().parent().parent().addClass('de-hide-country');
      }
    });
  };

  if (params) {
    // find currency query param value
    params.forEach(param => {

      if (param.indexOf('currency') > -1) {

        currency = param.split('=')[1];
      }
    });
  }

  // Finally, call filterByCountry() if the user has a prefs object and the
  // query param for currency matches the value set in the extension's popup
  if (prefs && prefs.country && prefs.currency && currency === prefs.currency) {

    window.filterByCountry();
  }
});
