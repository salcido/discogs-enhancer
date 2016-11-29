$(document).ready(function() {

  let listings = $('.seller_info ul li:nth-child(3)'),
      countries = listings.toArray();

  $(countries).each(function() {

    if ( $(this).text().indexOf('United States') === -1 &&
        !$(this).parent().parent().parent().hasClass('de-hide-country') ) {

      $(this).parent().parent().parent().addClass('de-hide-country');
    }
  });
});
