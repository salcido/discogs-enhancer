/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This looks for an empty dashboard module with the .info_text class.
 * Then it adds a button that will fetch the 1000 most recent comments
 * and look for any that from friends of the current user.
 */

rl.ready(() => {

  let friends = [],
      pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      reviewDiv = document.createElement('div'),
      existingId = rl.getPreference('friendsListId'),
      commentScannerHistory = rl.getPreference('commentScannerHistory');

  // ========================================================
  // Template Strings
  // ========================================================

  let title = 'Comment Scanner',

      noCommentsText = 'No new comments to display. Try again later.',

      error = 'Something went wrong. Please refresh the page.',

      setupInstructions = 'Click "Select this module" to use this List to see your friends\' comments. The page will refresh and your preference will be saved.',

      instructions = 'Select the number of comments you want to search through then click "Scan comments".',

      subtext = '(This may take a while)',

      resetButton = '<button class="reset-ui hidden">Scan again</button>',

      getCommentsUI = `
        <div class="get-comments-ui">
          <h3>${title}</h3>
          <p>${instructions}</p>
          <div class="ui-wrap">
            <button id="get-comments" class="button button-green">
              Scan Comments
            </button>
            <select id="comment-limit">
              <option value="2">500 Comments</option>
              <option value="4">1000 Comments</option>
              <option value="6">1500 Comments</option>
              <option value="8">2000 Comments</option>
              <option value="10">2500 Comments</option>
              <option value="12">3000 Comments</option>
            </select>
          </div>
        </div>
        `,

      preloader =`
          <div class="loader">
            <div style="display: flex; flex-direction: column;">
              <i class="icon icon-spinner icon-spin"></i>
              <span class="status">Initializing...</span>
              <span class="long-scan-warning"></span>
            </div>
          </div>
        `,

      commentMarkupPrimer = `
          <div class="box_pad">
            <div class="de-comment-overlay">
              <div class="message">
                ${noCommentsText}
                <a class="de-close-overlay">Close</a>
              </div>
            </div>
            <table class="broadcast_table table_block">
              <tbody>
                <tr class="no-comments">
                  <td class="gutter">
                      <span class="icon_wrapper">
                          <i class="icon icon-comment"></i>
                      </span>
                  </td>
                  <td class="recent_activity_3">
                      ${noCommentsText}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        `,

      listIdTemplate = `
          <div class="info_text" style="padding: 0 1rem;">
            <div class="wrap">
                <h3>${title}</h3>
                <span class="instructions">${setupInstructions}</span>
                <span class="form-ui">
                  <button class="button button-green de-list-id-save">Select this module</button>
                </span>
            </div>
            <span class="error"><span>
          </div>
        `;

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Fetches the user's friends
   * @returns {undefined}
   */
  async function getFriends() {

    let username,
        url = '/users/friends',
        response = await fetch(url),
        data = await response.text(),
        div = document.createElement('div'),
        status = document.querySelector(`#dashboard_list_${existingId} .box_pad .status`);

    status.innerHTML = 'Fetching your friends...';
    div.innerHTML = data;
    username = div.querySelectorAll('table.table_block td a.linked_username');

    username.forEach(name => friends.push(name.textContent.trim()));
  }

  /**
   * Fetches a single page of reviews
   * @param {number} pageNum - The page number to fetch reviews from
   * @returns {undefined}
   */
  async function getReviews(pageNum) {

    let url = `/reviews?limit=250&page=${pageNum}`,
        response = await fetch(url),
        data = await response.text(),
        div = document.createElement('div'),
        status = document.querySelector(`#dashboard_list_${existingId} .box_pad .status`);

    status.innerHTML = `Scanning <b>${pageNum * 250}</b> of ${pages.length * 250} recent comments`;
    div.innerHTML = data;
    reviewDiv.innerHTML += div.querySelector('#page_content').innerHTML;
  }

  /**
   * Saves the list ID to localStorage or displays an error
   * @returns {undefined}
   */
  function saveListId() {

    let id = event.target.dataset.id,
        parentElem = event.target.closest('.info_text');

    if (isNaN(id) || !id) {

      parentElem.querySelector('.error').textContent = error;

    } else {
      // reset errors
      parentElem.querySelector('.error').textContent = '';
      // reset friends and reviewDiv
      friends = [];
      reviewDiv = document.createElement('div');

      rl.setPreference('friendsListId', id);
      existingId = id;
      window.location.reload();
    }
  }

  /**
   * Generates the comment markup that gets injected into
   * the empty list module on the Dashboard.
   * @param {HTMLElement} review - The review markup
   * @param {string} username - The username to search for
   * @param {string} trClass - 'odd' or 'even' (alternating classes on <tr> elements)
   * @returns {HTMLElement}
   */
  function createCommentMarkup(review, username, trClass) {

    let releaseAnchor,
        userHref = review.querySelector('a.user').href,
        href = review.querySelector('a[href*="https://"]'),
        thumbnail = review.querySelector('a.thumbnail_link'),
        date = review.querySelector('.date').outerHTML;

    href.target = '_blank';
    releaseAnchor = href.outerHTML;

    thumbnail.classList.remove('thumbnail_size_small');
    thumbnail.classList.add('thumbnail_size_tiny');
    thumbnail.querySelector('img').src = thumbnail.querySelector('img').dataset.src;
    thumbnail = review.querySelector('a.thumbnail_link').outerHTML;

    // comment template
    let markup = `
      <tr class=${trClass}>
        <td class="gutter">
            <span class="icon_wrapper">
                <i class="icon icon-comment"></i>
            </span>
            ${thumbnail}
        </td>
        <td class="recent_activity_3">
            <a href="${userHref}" class="user" target="_blank">${username}</a> reviewed ${releaseAnchor} ${date}
        </td>
      </tr>
    `;

    return markup;
  }

  /**
   * Initiates fetching friends and reviews, then appends the markup
   * to the list module.
   * @returns {undefined}
   */
  function searchForFriendsComments(value) {

    let hasComments = false,
        boxpad = document.querySelector(`#dashboard_list_${existingId} .box_pad`);

    // insert comment markup preloader
    boxpad.innerHTML = preloader;
    // Show the warning text if scanning for more than 1500 comments
    if ( value > 7 ) {
      document.querySelector('.long-scan-warning').textContent = subtext;
    }

    getFriends()
      .then(() => pages.reduce((p, page) => p
      .then(() => getReviews(page)), Promise.resolve(null)))
      .then(() => {

      let username,
          markup,
          count = 0,
          trClass,
          tbody;

      boxpad.outerHTML = commentMarkupPrimer;
      tbody = document.querySelector(`#dashboard_list_${existingId} tbody`);
      // examine each review for username matches
      reviewDiv.querySelectorAll('.review').forEach(review => {

        username = review.querySelector('a.user').textContent;

        if ( friends.includes(username) ) {
          trClass = count % 2 === 0 ? 'even' : 'odd';
          markup = createCommentMarkup(review, username, trClass);

          hasComments = true;
          tbody.insertAdjacentHTML('beforeend', markup);
          count++;
        }
      });

      // Hide the default message if there are comments to display
      if (hasComments) {
        tbody.querySelector('.no-comments').remove();
        rl.setPreference('commentScannerHistory', tbody.innerHTML.trim());

      } else if ( !hasComments && commentScannerHistory ) {
        let selector = `#dashboard_list_${existingId} .de-comment-overlay`;

        document.querySelector(selector).classList.toggle('show');
        tbody.innerHTML = commentScannerHistory;
      }
      document.querySelector('.reset-ui').classList.toggle('hidden');
    });
  }

  /**
   * Injects the `get comments` button into
   * an empty list module when the user has a saved ID.
   * @returns {none}
   */
  function injectListUI() {

    let lastUsedValue = rl.getPreference('friendsListValue'),
        boxpad = document.querySelector(`#dashboard_list_${existingId} .box_pad`),
        header = document.querySelector(`#dashboard_list_${existingId} .header`),
        footer = document.querySelector(`#dashboard_list_${existingId} .footer`);

    try {

      if ( !commentScannerHistory ) {
        // inject the get comments button
        boxpad.innerHTML = getCommentsUI;
        header.querySelector('small').remove();
        footer.insertAdjacentHTML('afterbegin', resetButton);

        if (lastUsedValue) {
          document.querySelector('#comment-limit').value = lastUsedValue;
        }

      } else {
        // show previously stored comments
        boxpad.outerHTML = commentMarkupPrimer;

        let selector = `#dashboard_list_${existingId} tbody`,
            tbody = document.querySelector(selector);

        tbody.innerHTML = commentScannerHistory;
        header.querySelector('small').remove();

        footer.insertAdjacentHTML('afterbegin', resetButton);
        document.querySelector('.reset-ui').classList.toggle('hidden');
      }

    } catch (e) {
      // If a list ID gets borked somehow,
      // catch the error and delete the old ID
      rl.setPreference('friendsListId', null);
      document.querySelector('.info_text').textContent = error;
    }
  }

  /**
   * Looks for an empty list on the Dashboard (.info_text) and
   * inserts the Select This List UI.
   * @returns {undefined}
   */
  function setupNewList() {
    rl.waitForElement('.info_text').then(() => {
      document.querySelectorAll('.info_text').forEach(dashModule => {

        let regex = /\/(\d+)/g,
            parentLi = dashModule.closest('li'),
            href = parentLi.querySelector('.footer a').href,
            listId = href.match(regex)[0];

        parentLi.querySelector('.box_pad').innerHTML = listIdTemplate;
        // Get the list ID value from the URL in the footer
        parentLi.querySelector('.de-list-id-save').dataset.id = listId.replace('/', '');
      });
    });
  }

  /**
   * Attaches event listeners to the body
   * @returns {undefined}
   */
  function attachEventListeners() {
    document.body.addEventListener('click', (event) => {
      // Save functionality
      // -----------------------------------------
      if ( event.target.classList.contains('de-list-id-save') ) {
        saveListId();
      }
      // Close no new comments overlay
      // -----------------------------------------
      if ( event.target.classList.contains('de-close-overlay') ) {
        document.querySelector('.de-comment-overlay').style.display = 'none';
      }
      // Kick off everything
      // -----------------------------------------
      if (event.target.id === 'get-comments') {
        let value = document.querySelector('#comment-limit').value;

        pages.length = value;
        rl.setPreference('friendsListValue', value);
        searchForFriendsComments(value);
      }
      // Reset button
      // -----------------------------------------
      if (event.target.className === 'reset-ui') {
        let boxpad = document.querySelector(`#dashboard_list_${existingId} .box_pad`),
            lastUsedValue = rl.getPreference('friendsListValue');

        boxpad.innerHTML = getCommentsUI;
        event.target.classList.toggle('hidden');
        document.querySelector('#comment-limit').value = lastUsedValue;
        friends = [];
        pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        reviewDiv.innerHTML = '';
      }
      // Remove list from Dashboard
      // -----------------------------------------
      if ( event.target.parentElement
           && event.target.parentElement.id === `remove_list${existingId}` ) {
        existingId = null;
        rl.setPreference('friendsListId', null);
      }
    });

    document.body.addEventListener('change', (event) => {
      // Select list element
      // -----------------------------------------
      if (event.target.className === 'list_module_select') {
        if ( !document.querySelector('.instructions') ) {
          rl.waitForElement('.info_text').then(() => setupNewList());
        }
      }
    });
  }

  // ========================================================
  // CSS
  // ========================================================

  let rules = `
    #dashboard_list_${existingId} .box_pad {
      position: relative;
      display: flex;
      justify-content: center;
      padding: 0;
      max-height: 400px;
      overflow: scroll;
    }

    #dashboard_list_${existingId} .footer {
      display: flex;
      justify-content: space-between;
    }

    #dashboard_list_${existingId} .de-comment-overlay {
      background: white;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 10;
      opacity: 0;
      box-shadow: 0px 0px 0px 2px rgb(0 0 0 / 20%) inset;
    }

    #dashboard_list_${existingId} .de-comment-overlay.show {
      opacity: 1;
    }

    #dashboard_list_${existingId} .message {
      position: absolute;
      top: calc(50% - 1rem);
      left: calc(50% - 160px);
    }

    .de-dark-theme #dashboard_list_${existingId} .de-comment-overlay {
      background: #333 !important;
      box-shadow: 0px 0px 0px 2px rgb(0 0 0 / 78%) inset;
    }

    .loader {
      text-align: center;
      margin: 1rem auto;
    }

    .loader i {
      font-size: 18px;
      margin-bottom: .5rem;
    }

    .reset-ui {
      border: none;
      background: none;
      color: #0133bb;
    }

    .reset-ui:hover {
      text-decoration: underline;
      color: #08c;
    }

    .de-dark-theme .reset-ui {
      color: #839fc4 !important;
    }

    .de-dark-theme .reset-ui:hover {
      color: #cae0f9 !important;
    }

    .hidden {
      visibility: hidden;
      display: block;
    }

    .get-comments-ui {
      padding: 1rem 1.5rem;
    }

    .ui-wrap {
      display: flex;
    }

    #get-comments {
      margin-right: 10px;
    }

    .info_text .wrap {
      display: block;
      margin: 1rem auto;
    }

    .instructions {
      display: block;
      margin-bottom: 1rem;
    }

    .long-scan-warning {
      font-size: smaller;
      font-style: italic;
    }

    .info_text .form-ui {
      display: flex;
    }

    .info_text .form-ui #de-list-id {
      height: 2rem;
    }

    .info_text .form-ui .de-list-id {
      display: block;
      margin-bottom: 1rem;
      height: 2rem;
      margin-right: 1rem;
    }

    .info_text .error {
      display: block;
      color: red !important;
    }
  `;

  // ========================================================
  // DOM Setup
  // ========================================================

  if ( rl.pageIs('dashboard') ) {

    rl.attachCss('friends-module', rules);
    attachEventListeners();

    rl.waitForElement('.info_text').then(() => {
      // Using setTimeout here because dashboard modules load async
      // and will continue to load even after the first instance of .info_text. And
      // I want to try to capture every (or at least multiple) empty list modules on the Dashboard
      setTimeout(() => {
        if ( !existingId ) {
          return setupNewList();
        }
        return injectListUI();
      }, 350);
    });
  }
});
