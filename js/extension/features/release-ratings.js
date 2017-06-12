/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
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

        let
            result = $(res),
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

  window.insertRatingsLink = function insertRatingsLink() {

    let releases = [...document.querySelectorAll('.item_release_link')];

    releases.forEach(release => {

      let a = document.createElement('a'),
          div = document.createElement('div'),
          parent = release.parentElement;

      a.className = 'de-rating-link';
      a.dataset.id = $(parent).find('.item_description_title').attr('href');
      a.style = 'display:block;';
      a.textContent = 'Show Release Rating';

      div.append(a);

      // don't insert links if they already exist
      if ( !parent.getElementsByClassName('de-rating-link').length && !parent.getElementsByClassName('de-rating').length ) {

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
