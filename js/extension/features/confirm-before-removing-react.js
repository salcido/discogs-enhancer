/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will prompt the user to confirm that they would
 * like to remove the item from their collection before
 * the request to remove it is sent.
 */

rl.ready(() => {

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Adds event listener functions to the `.cw_block_remove`
   * elements
   * @returns {undefined}
   */
  function addUIListeners() {
    document.querySelectorAll('.de-remove-block').forEach(block => {
      block.removeEventListener('mousedown', handleRemoveClicks);
      block.addEventListener('mousedown', handleRemoveClicks);
    });
  }

  /**
   * Asks the user if they are sure they want to remove the item
   * from their collection
   * @param {Object} event - The event object
   * @returns {Boolean}
   */
  function handleRemoveClicks(event) {
    event.preventDefault();
    showConfirmPrompt(event);
  }

  /**
   * Creates and shows the confirmation prompt
   * @returns {undefined}
   */
  function showConfirmPrompt(event) {

    let span = createConfirmPrompt(),
        collectionBlock = event.target.closest('div[class*="collection_"]'),
        removeLink = event.target,
        timestamp = collectionBlock.querySelector('span[class*="added_"]');

    removeLink.classList.add('flip-out');
    timestamp.classList.add('flip-out');

    setTimeout(() => {
      collectionBlock.insertAdjacentElement('afterbegin', span);

      removeLink.classList.add('hide');
      timestamp.classList.add('hide');

      removeLink.classList.remove('flip-out');

      collectionBlock.querySelector('.de-remove-no').addEventListener('click', event => {
        hideConfirmPrompt(event);
        timestamp.classList.remove('flip-out');
      });

      collectionBlock.querySelector('.de-remove-yes').addEventListener('click', event => {
        event.preventDefault();
        removeFromCollection(event);
      });
    }, 80);
  }

  /**
   * Creates the confirm prompt markup
   * @returns {HTMLElement}
   */
  function createConfirmPrompt() {
    let span = document.createElement('span'),
        remove = document.createElement('span'),
        yes = document.createElement('a'),
        slash = document.createElement('span'),
        no = document.createElement('a');

    remove.textContent = 'Are you sure? ';
    yes.textContent = 'Yes';
    slash.textContent = ' / ';
    no.textContent = 'No';

    span.className = 'cw_block_remove flip-in';
    yes.className = 'de-remove-yes';
    no.className = 'de-remove-no';

    span.appendChild(remove);
    span.appendChild(yes);
    span.appendChild(slash);
    span.appendChild(no);

    return span;
  }

  /**
   * Removes an item from the user's collection
   * @param {Object} event - The event object
   * @returns {undefined}
   */
  async function removeFromCollection(event) {
    let id = event.target.closest('div[class*="collection_"]').dataset.collectionId,
        collectionBox = event.target.parentElement.parentElement,
        url = `/_rest/collection/${id}`,
        headers = { 'content-type': 'application/x-www-form-urlencoded' },
        initObj = {
          credentials: 'include',
          headers: headers,
          method: 'DELETE'
        },
        response = await fetch(url, initObj);

    event.target.closest('.cw_block_remove.flip-in').innerHTML = 'Removing...';

    if ( response.ok ) {
      collectionBox.remove();
    }
  }

  /**
   * Hides the confirm prompt and unhides the Remove anchor
   * @returns {undefined}
   */
  function hideConfirmPrompt(event) {

    let collectionBlock = event.target.closest('div[class*="collection_"]'),
        prompt = collectionBlock.querySelector('.cw_block_remove.flip-in'),
        removeLink = collectionBlock.querySelector('.de-remove-block'),
        timestamp = collectionBlock.querySelector('span[class*="added_"]');

    prompt.classList.add('flip-out');

    setTimeout(() => {
      prompt.remove();
      removeLink.classList.remove('hide');
      removeLink.classList.add('flip-in');
    }, 100);

    setTimeout(() => {
      timestamp.classList.remove('hide');
      timestamp.classList.add('flip-in');
    }, 150);
  }

  /**
   * Deletes the original "Remove" link from the DOM
   * and replaces it with an identical element so that
   * any previous eventlisteners will no longer be
   * triggered.
   * @returns {Promise}
   */
  function deleteOriginalRemoveLink() {
    return new Promise(resolve => {

      let removeText = document.querySelector('div[class*="collection_"] button[class*="remove_"]').textContent;

      document.querySelectorAll('div[class*="collection_"] button[class*="remove_"]').forEach(rem => {
        rem.remove();
      });

      document.querySelectorAll('div[class*="collection_"]').forEach(block => {
        let a = document.createElement('a');
        a.textContent = removeText;
        a.classList = 'de-remove-block';

        block.insertAdjacentElement('afterbegin', a);
      });
      return resolve();
    });
  }

  async function fetchCollectionIDs(releaseId) {

    let hash = rl.getPreference('userHash'),
        url = `/internal/release-page/api/graphql?operationName=UserReleaseData&variables={"discogsId":${releaseId}}&extensions={"persistedQuery":{"version":1,"sha256Hash":"${hash}"}}`;

    // Return an empty array if this executes before
    // the userHash has been written to localStorage
    if (!hash) return [];

    return fetch(url)
      .then(response => response.json())
      .then(res => {
        return res.data.release.collectionItems.edges;
    });
  }

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-remove-block {
        float: right;
        font-size: 11px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
      }

      .hide {
        display: none !important;
      }

      .flip-in {
        animation: rotateIn .1s ease-out;
      }

      .flip-out {
        animation: rotateOut .1s ease-out;
      }

      .cw_block_remove {
        font-size: 12px;
        float: right;
        padding-top: 2px;
        cursor: pointer;
      }

      @keyframes rotateOut {
        0% { transform: rotateX(0deg); }
        100% { transform: rotateX(90deg); }
      }

      @keyframes rotateIn {
        0% { transform: rotateX(90deg); }
        100% { transform: rotateX(0deg); }
      }
  `;

  // ========================================================
  // DOM Setup
  // ========================================================
  if ( rl.pageIs('release') && rl.pageIsReact() ) {

    rl.waitForElement('div[class*="collection_"]').then(() => {

      rl.attachCss('random-item', rules);
      // Find the collection ID and attach it to each collection box
      // Wrapped in a setTimeout so that hashes.js can update any hashes before
      // this executes
      setTimeout(async () => {
        let regex = /(\d+)/g,
            releaseId = document.querySelector('#release-actions button[class*="id_"]').textContent.match(regex),
            ids = await fetchCollectionIDs(releaseId),
            itemsInCollection = document.querySelectorAll('div[class*="collection_"]');

        ids.forEach((id, i) => {
          itemsInCollection[i].dataset.collectionId = id.node.discogsId;
        });

        deleteOriginalRemoveLink().then(addUIListeners);
      }, 250);
    });
  }
});
