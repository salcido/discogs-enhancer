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

 rl.ready(() => {
  // ========================================================
  // Functions
  // ========================================================

  /**
   * Generates the confirm box markup that gets append to the DOM
   * @param: id - the release ID to remove
   * @returns {object} HTML
   */
  function createConfirmBox(id) {

    let confirmBox = document.createElement('div'),
        areYouSure = document.createElement('div'),
        yes = document.createElement('a'),
        no = document.createElement('a'),
        slash = document.createElement('div'),
        inline_block = 'display: inline-block; margin-right: 5px;';

    areYouSure.textContent = 'Remove From Wantlist?';
    areYouSure.style = inline_block;

    yes.textContent = 'Yes';
    yes.style = inline_block;
    yes.className = 'de-remove-yes';
    yes.dataset.id = id;

    slash.textContent = ' / ';
    slash.style = inline_block;

    no.textContent = 'No';
    no.style = inline_block;
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
  async function removeFromWantlist(id, target) {

    try {

      let data = {
            operationName:'RemoveReleasesFromWantlist',
            variables:{
              input: {
                releaseDiscogsIds:[Number(id)]
              }
            },
            extensions: {
              persistedQuery: {
                version: 1,
                sha256Hash: 'ab4a277f4c5d9da56ba17d4b88643c51a1935f500813133c55fe5a340625d06f'
              }
            }
          };

      let releases = document.querySelectorAll('ul.w-full.overflow-hidden li:last-child p.brand-item-copy a.brand-item-copy-link'),
          headers = { 'content-type': 'application/x-www-form-urlencoded' },
          url = 'https://www.discogs.com/service/catalog/api/graphql',
          initObj = {
            credentials: 'include',
            headers: headers,
            method: 'POST',
            body: JSON.stringify(data)
          },
          response = await fetch(url, initObj);

      if ( response.ok ) {

        // Go over all the releases to check for duplicates
        releases.forEach(release => {
          let item = release.closest('.border-brand-border01.flex.flex-col.border-solid');

          if ( item.dataset.id == id ) {
            item.classList.add('hide');
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });

      } else if (response.status === 404) {
        target.parentElement.innerHTML = '<div>This Item has already been removed from your Wantlist.</div>';
      }
    } catch (err) {

      return console.log('Discogs Enhancer: Could not remove from wantlist.', err);
    }
  }

  // ========================================================
  // CSS
  // ========================================================
  let rules = /*css*/`
      .border-brand-border01.flex.flex-col.border-solid {
        transition: opacity 0.3s;
        transition-timing-function: ease;
      }

      .border-brand-border01.flex.flex-col.border-solid.hide {
        opacity: 0;
      }
      .de-remove-wantlist:hover {
        text-decoration: underline;
      }
      .de-remove-wantlist,
      .de-remove-yes,
      .de-remove-no {
        cursor: pointer;
        color: #2653d9;
      }
      `;

  // ========================================================
  // DOM Setup
  // ========================================================

  if ( rl.pageIs('shopMyWants') ) {
    // --------------------------------------------------
    // Attach CSS
    // --------------------------------------------------
    rl.attachCss('remove-from-wantlist-smw', rules);

    // --------------------------------------------------
    // Event Listeners
    // --------------------------------------------------
    document.querySelector('body').addEventListener('click', event => {

      let target = event.target,
          parent = event.target.parentElement;

      // Remove From Wantlist initial click
      if ( target.classList.contains('de-remove-wantlist') ) {
        event.preventDefault();
        event.target.style.display = 'none';
        parent.append(createConfirmBox(event.target.dataset.id));
      }
      // Yes, remove this
      if ( target.classList.contains('de-remove-yes') ) {
        removeFromWantlist(event.target.dataset.id, event.target);
      }
      // No, don't remove anything
      if ( target.classList.contains('de-remove-no') ) {
        target.parentElement.previousElementSibling.style.display = 'block';
        target.parentElement.remove();
      }
    });

    // --------------------------------------------------
    // Inject links
    // --------------------------------------------------
    rl.onSellItemComplete(({ response }) => {

      let viewReleasePageLink = 'ul.w-full.overflow-hidden li:last-child p.brand-item-copy a.brand-item-copy-link';

      rl.waitForElement(viewReleasePageLink).then(() => {

        let itemsForSale = document.querySelectorAll('.border-brand-border01.flex.flex-col.border-solid');

        response.items.forEach((item, i) => {

          let { releaseId } = item.release,
              button = document.createElement('button'),
              div = document.createElement('div');

          itemsForSale[i].dataset.id = releaseId;
          div.className = 'de-remove-wantlist-wrap';

          button.className = 'de-remove-wantlist';
          button.dataset.id = releaseId;
          button.style = 'display:block;';
          button.textContent = 'Remove From Wantlist';

          div.append(button);

          // don't insert links if they already exist
          if ( !itemsForSale[i].querySelector('.de-remove-wantlist-wrap') ) {
            itemsForSale[i].querySelector(viewReleasePageLink).insertAdjacentElement('beforebegin', div);
          }
        });

      });

    });

  }
});
