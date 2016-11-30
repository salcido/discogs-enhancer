/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      listings = $('.seller_info ul li:nth-child(3)'),
      countries = listings.toArray(),
      params = document.location.href.split('?')[1].split('&'),
      prefs = JSON.parse(localStorage.getItem('filterByCountry'));

  if (prefs && prefs.country !== null && prefs.currency !== null) {
    // TODO check for currency in query params
    $(countries).each(function() {

      if ( $(this).text().indexOf(prefs.country) === -1 &&
          !$(this).parent().parent().parent().hasClass('de-hide-country') ) {

        $(this).parent().parent().parent().addClass('de-hide-country');
      }
    });
  }
});
