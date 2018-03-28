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
 * This feature will inject `Show ratings` links into marketplace / seller items.
 * When a user clicks an injected link, the script will fetch the release page, extract the
 * release rating data and display it in the marketplace listing.
 *
 * The script is initiated with the code that follows the `init / DOM Setup` comment block.
 *
 * 1.) `insertRatingsLink` injects the links and calls the `addUiListeners` function.
 * 2.) `addUiListeners` attaches click event listeners to each `Show release link` which
 * call `getReleaseRating`.
 * 3.) `getReleaseRating` feteches the relavant data from the release page and injects it into
 * the marketplace listing.
 */

resourceLibrary.ready(() => {

  let marketplace = window.location.href.includes('/sell/') &&
                      !window.location.href.includes('/sell/release/'),
      seller = window.location.href.includes('/seller/');

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

    [...document.getElementsByClassName('de-rating-link')].forEach(elem => {

        elem.addEventListener('click', event => {

        let preloader = document.createElement('i'),
            parent = event.target.parentElement;

        preloader.className = 'icon icon-spinner icon-spin preloader';
        preloader.style = 'font-style: normal; position: relative; margin-left: 10px;';

        event.preventDefault();

        parent.append(preloader);

        event.target.remove();

        getReleaseRating(event.target.dataset.id, parent);
      });
    });
  }


  /**
   * Gets the release rating and votes from a specified release
   *
   * @method getReleaseRating
   * @param  {String} id [the event's data-id attribute value]
   * @param  {object} parent [the parent of the event.target element]
   * @return {object}
   */

  async function getReleaseRating(id, parent) {

    try {

      let response = await fetch(id),
          data = await response.text(),
          div = document.createElement('div'),
          rating;

      div.innerHTML = data;
      rating = div.querySelector('.statistics ul:first-of-type li:last-child').textContent;

      parent.querySelector('.preloader').remove();

      return parent.append(rating);

    } catch (err) {

      return console.log('Discogs Enhancer: Cannot get release ratings.', err);
    }
  }


  /**
   * Injects `Show release ratings` links into the DOM
   *
   * @method insertRatingsLink
   * @return {function}
   */

  // attached to window object so it can be called by Everlasting Marketplace
  window.insertRatingsLink = function insertRatingsLink() {

    let releases = [...document.getElementsByClassName('item_release_link')];

    releases.forEach(release => {

      let a = document.createElement('a'),
          div = document.createElement('div'),
          parent = release.parentElement;

      div.className = 'de-rating-link-wrap';

      a.className = 'de-rating-link';
      a.dataset.id = release.href;
      a.style = 'display:block;';
      a.textContent = 'Show Ratings';

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

    let pagination = [...document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]')];

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(() => {

          if ( !document.getElementsByClassName('de-rating-link').length ) {

            window.insertRatingsLink();
          }
        });
      });
    });
  }
});
