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
 */

rl.ready(() => {
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

    document.querySelectorAll('.de-rating-link').forEach(elem => {

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
   * @param  {String} url [the event's data-id attribute value]
   * @param  {object} parent [the parent of the event.target element]
   * @return {object}
   */
  async function getReleaseRating(url, parent) {

    try {

      let response = await fetch(url),
          data = await response.text(),
          div = document.createElement('div'),
          id = parent.closest('tr').dataset.releaseId,
          selector = '#release-stats div[class*="items_"] ul li:nth-child(4) a',
          href = `/release/stats/${id}`,
          rating;

      if ( typeof Element.prototype.setHTMLUnsafe === 'function' ) {
        div.setHTMLUnsafe(data);
      } else {
        div.innerHTML = data;
      }
      rating = div.querySelector(selector).textContent;

      parent.querySelector('.preloader').remove();

      return parent.insertAdjacentHTML(
        'afterbegin',
        `Ratings: <a href="${href}" target="_blank">${rating}</a>`
      );

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

    let releases = document.querySelectorAll('.item_release_link');

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
  let marketplace = rl.pageIs('sell') && rl.pageIsNot('sellRelease', 'seller'),
      seller = rl.pageIs('seller');

  if ( seller || marketplace ) {
    window.insertRatingsLink();
    rl.handlePaginationClicks(window.insertRatingsLink);
  }
});
