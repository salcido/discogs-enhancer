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



// inits |applystyles| method on DOM load
setTimeout(function() {

  applyStyles();

  callApplyStyles();
}, 200);
