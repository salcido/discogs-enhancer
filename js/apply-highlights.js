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
      loc = window.location.href,
      sellPage = /discogs.com\/sell\/list/g,
      sellerPage = /discogs.com\/seller/g,
      sellRelease = /discogs.com\/sell\/release/g,
      wantsPage = /discogs.com\/sell\/mywants/g;


  // Find all Marketplace item conditions and apply classes
  function applyStyles() {

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
  }


  // calls applyStyles on every |ajaxSuccess| method callback
  function callApplyStyles() {

    $(document).ajaxSuccess(function() {

      applyStyles();
    });
  }


  // Apply styles on ready/prev/next clicks
  if (loc.match(sellPage) || loc.match(sellRelease) || loc.match(sellerPage) || loc.match(wantsPage)) {

    applyStyles();

    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      callApplyStyles();
    });
  }
});
