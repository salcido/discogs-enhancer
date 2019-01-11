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
 * This feature will inject `Remove From Wantlist` links into marketplace / seller items.
 * When a user clicks an injected link, the script will remove the item from the user's
 * wantlist without having to open a new page and click remove.
 *
 * The script is initiated with the code that follows the `init / DOM Setup` comment block.
 */

resourceLibrary.ready(() => {

  let marketplace = window.location.href.includes('/mywants');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Generates the confirm box markup that gets appened to the DOM
   * @returns {object} HTML
   */
  function createConfirmBox() {

    let confirmBox = document.createElement('div'),
        areYouSure = document.createElement('div'),
        yes = document.createElement('a'),
        no = document.createElement('a'),
        slash = document.createElement('div'),
        inblk_mr = 'display: inline-block; margin-right: 5px;';

    areYouSure.textContent = 'Remove From Wantlist?';
    areYouSure.style = inblk_mr;

    yes.textContent = 'Yes';
    yes.style = inblk_mr;
    yes.className = 'de-remove-yes';
    yes.dataset.id = event.target.dataset.id;

    slash.textContent = ' / ';
    slash.style = inblk_mr;

    no.textContent = 'No';
    no.style = inblk_mr;
    no.className = 'de-remove-no';

    confirmBox.appendChild(areYouSure);
    confirmBox.appendChild(yes);
    confirmBox.appendChild(slash);
    confirmBox.appendChild(no);

    return confirmBox;
  }

  /**
   * Gets the release rating and votes from a specified release
   *
   * @method removeFromWantlist
   * @param  {String} id [the event's data-id attribute value]
   * @param  {object} parent [the parent of the event.target element]
   * @return {object}
   */
  async function removeFromWantlist(id, parent, target) {

    try {

      let releaseId = id.split('/release/')[1],
          releases = document.querySelectorAll('.item_description .item_release_link'),
          headers = { 'content-type': 'application/x-www-form-urlencoded' },
          url = `https://www.discogs.com/_rest/wantlist/${releaseId}`,
          initObj = {
            credentials: 'include',
            headers: headers,
            method: 'DELETE'
          },
          response = await fetch(url, initObj);

      if ( response.ok ) {
        // Go over all the releases to check for duplicates
        releases.forEach(release => {
          let tr = release.closest('.shortcut_navigable');
          if ( release.href === id ) {
            tr.classList.add('hide');
            setTimeout(() => { tr.style.display = 'none'; }, 300);
          }
        });

      } else if (response.status === 404) {
        target.parentElement.innerHTML = '<div>This Item has already been removed from your Wantlist.</div>';
      }
    } catch (err) {

      return console.log('Discogs Enhancer: Could not remove from wantlist.', err);
    }
  }

  /**
   * Injects `Remove From Wantlist` links into the DOM
   *
   * @method insertRemoveLinks
   * @return {function}
   */
  // attached to window object so it can be called by Everlasting Marketplace
  window.insertRemoveLinks = function insertRemoveLinks() {

    if ( marketplace ) {

      let releases = document.querySelectorAll('.item_release_link');

      releases.forEach(release => {

        let a = document.createElement('a'),
            div = document.createElement('div'),
            parent = release.parentElement;

        div.className = 'de-remove-wantlist-wrap';

        a.className = 'de-remove-wantlist';
        a.dataset.id = release.href;
        a.style = 'display:block;';
        a.textContent = 'Remove From Wantlist';

        div.append(a);

        // don't insert links if they already exist
        if (!parent.getElementsByClassName('de-remove-wantlist-wrap').length) {
          release.insertAdjacentElement('beforebegin', div);
        }
      });
    }
  };

  // ========================================================
  // Init / DOM Setup
  // ========================================================

  if ( marketplace ) {

    window.insertRemoveLinks();

    // UI Functionality
    // ---------------------------------------------------------------------------

    let pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a');

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {
        resourceLibrary.xhrSuccess(() => {
          if ( !document.getElementsByClassName('de-remove-wantlist').length ) {
            window.insertRemoveLinks();
          }
        });
      });
    });

    // Confirm/negate removal
    document.querySelector('body').addEventListener('click', event => {

      let target = event.target,
          parent = event.target.parentElement;

      // Remove From Wantlist intial click
      if ( target.classList.contains('de-remove-wantlist') ) {
        event.preventDefault();
        event.target.style.display = 'none';
        parent.append(createConfirmBox());
      }
      // Yes, remove this
      if ( target.classList.contains('de-remove-yes') ) {
        removeFromWantlist(event.target.dataset.id, parent, event.target);
      }
      // No, don't remove anything
      if ( target.classList.contains('de-remove-no') ) {
        target.parentElement.previousElementSibling.style.display = 'block';
        target.parentElement.remove();
      }
    });
  }
});
