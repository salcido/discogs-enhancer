/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 * @discogs: https://www.discogs.com/user/mattsalcido
 *
 */

$(document).ready(function() {

  var
      loc = window.location.href,
      sellPage = /discogs.com\/sell\/list/g,
      sellerPage = /discogs.com\/seller/g,
      sellRelease = /discogs.com\/sell\/release/g,
      wantsPage = /discogs.com\/sell\/mywants/g;

  // Find all Marketplace item conditions and apply classes
  function applyStyles() {
    /* Marketplace Pages */

    // Media conditions
    $('span.item_media_condition:contains("Mint (M)")').addClass('mint bold');
    $('span.item_media_condition:contains("Near Mint (NM or M-)")').addClass('near-mint bold');
    $('span.item_media_condition:contains("Very Good Plus (VG+)")').addClass('very-good-plus bold');
    $('span.item_media_condition:contains("Very Good (VG)")').addClass('very-good bold');
    $('span.item_media_condition:contains("Good Plus (G+)")').addClass('good-plus bold');
    $('span.item_media_condition:contains("Good (G)")').addClass('good bold');
    $('span.item_media_condition:contains("Fair (F)")').addClass('fair bold');
    $('span.item_media_condition:contains("Poor (P)")').addClass('poor bold');

    // Sleeve conditions
    $('span.item_sleeve_condition:contains("Mint (M)")').addClass('mint bold');
    $('span.item_sleeve_condition:contains("Near Mint (NM or M-)")').addClass('near-mint bold');
    $('span.item_sleeve_condition:contains("Very Good Plus (VG+)")').addClass('very-good-plus bold');
    $('span.item_sleeve_condition:contains("Very Good (VG)")').addClass('very-good bold');
    $('span.item_sleeve_condition:contains("Good Plus (G+)")').addClass('good-plus bold');
    $('span.item_sleeve_condition:contains("Good (G)")').addClass('good bold');
    $('span.item_sleeve_condition:contains("Fair (F)")').addClass('fair bold');
    $('span.item_sleeve_condition:contains("Poor (P)")').addClass('poor bold');
    // $('span.item_sleeve_condition:contains("Generic")').addClass('generic bold');
  }



  // calls applyStyles on every |ajaxSuccess| method callback
  function callApplyStyles() {

    $(document).ajaxSuccess(function() {

      applyStyles();
    });
  }

  // Applying media highlights is tricky business. It wont reliably stick so
  // I am making sure it's being applied to the necessary elements via
  // setInterval(). This seems like a janky way to do things but it works.
  if (loc.match(sellPage) || loc.match(sellRelease) || loc.match(sellerPage) || loc.match(wantsPage)) {

    var count = 0,
        interval;

    interval = setInterval(function() {

      applyStyles();

      count++;

      if (count > 5) {

        clearInterval(interval);

        callApplyStyles();
      }
    }, 100);
  }
});
