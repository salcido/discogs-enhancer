/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

rl.ready(() => {

  let href = window.location.href,
      reactApp = document.querySelector('#CollectionApp'),
      layout = rl.getCookie('rl_layout'),
      username = rl.username();

  if ( href.includes(`/${username}/collection`)
       && layout !== 'big'
       &&  !reactApp ) {

    let hasLoaded = false,
        initialPage = (new URL(document.location)).searchParams.get('page') || 1,
        pageNum = initialPage,
        max = document.querySelector('.pagination.bottom li a.pagination_next')
                      ?.parentElement?.previousElementSibling?.textContent.trim() || 1;

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Appends the next page of the collection to the DOM
     * @param data {array.<object>} The next page of the collection data
     * @returns {undefined}
     */
    function appendCollectionData(data) {

      let body = document.querySelector('#collection tbody'),
          fragment = document.createDocumentFragment(),
          lastChild = '#collection tbody:last-child',
          pageStamp = assignPageStamp(layout);

      // Insert the page stamp in between each set of page results that are appended
      document.querySelector(lastChild).insertAdjacentHTML('beforeEnd', pageStamp);
      // Populate the document fragment
      data.forEach(tr => fragment.appendChild(tr));
      // Append the fragment to the DOM
      body.appendChild(fragment);

      setTimeout(() => window.injectStars(), 100);
      // Optional notes-counter feature functionality
      if ( window.addNotesCounter ) setTimeout(() => window.addNotesCounter(), 100);
    }

    /**
     * Determines the markup to use as the pageStamp
     * @param {string} cookie The layout value from the cookie (sm, med, big)
     * @returns {string}
     */
    function assignPageStamp(cookie) {

      let pageStamp;

      switch (cookie) {

        case 'sm':
          pageStamp = `<tr class="shortcut_navigable collection-row de-collection-stamp">
                        <td class="as_table_cell mobile_status"></td>
                        <td class="status hide_mobile"><div class="tooltip_wrapper"><span class="needs_tooltip" data-title=""></span></div></td>
                        <td class="collection-release-title-cell" data-followable=".release_title_link a">
                          <h2 class="de-current-page" id="de-page-${pageNum}">Page: ${pageNum}</h2>
                        </td>
                        <td class="collection-value-column hide_mobile"></td>
                        <td class="collection-value-column hide_mobile"></td>
                        <td class="collection-value-column hide_mobile"></td>
                        <td class="has_header cell_collapsed collection-date-added-column" data-header="Added"></td>
                        <td class="has_header cell_collapsed new-collection-folder-column" data-header="Folder"></td>
                        <td class="grouped-custom-fields-column cell_collapsed"></td>
                        <td class="has_header cell_collapsed old-custom-fields-column old-custom-fields-column-3" data-header="Notes"></td>
                        <td class="has_header cell_collapsed old-custom-fields-column old-custom-fields-column-4" data-header="Meta"></td>
                      </tr>`;
          return pageStamp;

        case 'med':
          pageStamp = `<tr class=" shortcut_navigable collection-row">
                        <td class="as_table_cell mobile_status"></td>
                        <td class="image as_float"><div class="collection-image-wrapper"></div></td>
                        <td class="status hide_mobile"></td>
                        <td class="collection-release-title-cell" data-followable=".release_title_link a">
                          <h2 class="de-current-page" id="de-page-${pageNum}">Page: ${pageNum}</h2>
                        </td>
                        <td class="right has_header pricing collection-value-column cell_collapsed" data-header="Min"></td>
                        <td class="right has_header pricing collection-value-column cell_collapsed" data-header="Med"></td>
                        <td class="right has_header pricing collection-value-column cell_collapsed" data-header="Max"></td>
                        <td class="has_header cell_collapsed collection-date-added-column" data-header="Added"></td>
                        <td class="has_header cell_collapsed new-collection-folder-column" data-header="Folder"></td>
                        <td class="grouped-custom-fields-column cell_collapsed"></td>
                        <td class="has_header cell_collapsed old-custom-fields-column old-custom-fields-column-3" data-header="Notes"></td>
                        <td class="has_header cell_collapsed old-custom-fields-column old-custom-fields-column-4" data-header="Meta"></td>
                      </tr>`;
          return pageStamp;
      }
    }

    /**
     * Gets the next page of the collection
     * @returns {undefined}
     */
    async function getNextPage() {

      pageNum++;

      try {

        let url = `https://www.discogs.com/user/${username}/collection?page=${pageNum}${rl.removePageParam(href)}`,
            data = await fetch(`${url}`, { credentials: 'include' }),
            response = await data.text(),
            tr = '#collection tbody tr',
            div = document.createElement('div'),
            loader = document.querySelector('#de-next'),
            markup,
            noItems = '<h1 class="de-no-results">End of collection</h1>',
            notes;

        div.innerHTML = response;
        // Modify .notes-show elements with custom class to hook on to
        notes = [...div.querySelectorAll('.notes_show')];
        notes.forEach(note => note.classList.add('de-notes-show'));
        // Select subset of markup to pass into DOM
        markup = div.querySelectorAll(tr);
        /*
          If the requested page number exceeds the total number of requestable
          pages, Discogs will return the first page of the collection. So check
          the page request number against the total number of pages and append
          a notice if we've reached the end.
        */
        if ( pageNum <= Number(max) ) {

          appendCollectionData(markup);
          rl.updatePageParam(pageNum);
        } else {

          loader.remove();
          document.querySelector('#collection table').insertAdjacentHTML('afterend', noItems);
        }

        hasLoaded = false;
        // Call Open links in new tabs feature
        window.modifyLinks();

      } catch (err) {
        return console.log('Error getting next page of collection', err);
      }
    }

    // ========================================================
    // DOM Setup / Init
    // ========================================================
    // Hide pagination
    document.querySelectorAll('.pagination.bottom').forEach(el => { el.style.display = 'none'; });

    if ( !document.getElementById('de-next') ) {

      let loaderMarkup = `<div id="de-next" class="offers_box" >
                            <div class="de-next-text">
                              Loading next page...
                            </div>
                            ${rl.css.preloader}
                          </div>`;

      document.querySelector('.release_list_table').insertAdjacentHTML('afterend', loaderMarkup);
    }

    // ========================================================
    // Scrolling Functionality
    // ========================================================
    window.addEventListener('scroll', () => {
      let kurtLoder = document.querySelector('#de-next');

      if ( rl.isOnScreen(kurtLoder) && !hasLoaded ) {
        hasLoaded = true;
        return getNextPage();
      }
    });
  }
});
