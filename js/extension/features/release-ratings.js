/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 *
 * This feature will inject `Show release ratings` links into marketplace / seller items.
 * When a user clicks an injected link, the script will fetch the release page, extract the
 * release rating data and display it in the marketplace listing.
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * 1.) The script is initiated with the code that follows the `init / DOM Setup` comment block.
 * 2.) `insertRatingsLink` injects the links and calls the `addUiListeners` function.
 * 3.) `addUiListeners` attaches click event listeners to each `Show release link` which
 * call `getReleaseRating`.
 * 4.) `getReleaseRating` feteches the relavant data from the release page and injects it into
 * the marketplace listing.
 */

$(document).ready(function() {

  let seller = window.location.href.includes('/seller/'),
      marketplace = window.location.href.includes('/sell/');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Attaches event listeners to all `.de-rating-link` elements
   *
   * @method addUiListeners
   * @return {undefined}
   */

  function addUiListeners() {

    $('.de-rating-link').on('click', function(event) {

      let preloader = document.createElement('i'),
          parent = $(event.target).parent();

      preloader.className = 'icon icon-spinner icon-spin preloader';
      preloader.style = 'font-style: normal; position: relative; margin-left: 10px;';

      event.preventDefault();

      parent.append(preloader);

      $(event.target).remove();

      getReleaseRating(event.target.dataset.id, parent);
    });
  }


  /**
   * Gets the release rating and votes from a specified release
   *
   * @method getReleaseRating
   * @param  {String} id [the event's data-id attribute value]
   * @param  {object} parent [the parent of the event.target element]
   * @return {undefined}
   */

  function getReleaseRating(id, parent) {

    $.ajax({

      url: id,
      type: 'GET',
      dataType: 'html',

      success: res => {

        let result = $(res),
            ratingInfo = result.find('.release_info_buttons div').html();

        parent.closest($('.preloader').remove());

        parent.append(ratingInfo);
      },

      error: () => console.log('Discogs Enhancer: Cannot get release ratings.')
    });
  }


  /**
   * Injects `Show release ratings` links into the DOM
   *
   * @method insertRatingsLink
   * @return {function}
   */

  // attached to window object so it can be called by Everlasting Marketplace
  window.insertRatingsLink = function insertRatingsLink() {

    let releases = [...document.querySelectorAll('.item_release_link')];

    releases.forEach(release => {

      let a = document.createElement('a'),
          div = document.createElement('div'),
          parent = release.parentElement;

      div.className = 'de-rating-link-wrap';

      a.className = 'de-rating-link';
      a.dataset.id = $(parent).find('.item_description_title').attr('href');
      a.style = 'display:block;';
      a.textContent = 'Show Release Rating';

      div.append(a);

      // don't insert links if they already exist
      if ( !parent.getElementsByClassName('de-rating-link-wrap').length ) {

        release.insertAdjacentElement('beforebegin', div);
      }
    });

    return addUiListeners();
  };


  // ========================================================
  // Init / DOM Setup
  // ========================================================

  if ( seller || marketplace ) {

    window.insertRatingsLink();

    // UI Functionality
    // ---------------------------------------------------------------------------

    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        if ( !document.getElementsByClassName('de-rating-link').length ) {

          window.insertRatingsLink();
        }
      });
    });
  }
});
