/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

resourceLibrary.ready(() => {

  let href = window.location.href,
      reactApp = document.querySelector('#CollectionApp'),
      layout = resourceLibrary.getCookie('rl_layout');

  if ( href.includes('/collection') && layout !== 'big' &&  !reactApp ) {

    let blackBar,
        hasLoaded = false,
        pagination,
        pTotal,
        page = 2,
        paused = false,
        username = document.querySelector('img.user_image').alt;

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Adds the click event listner for `.de-resume`
     * @method addResumeListener
     * @returns {method}
     */
    function addResumeListener() {

      let loadingText = document.querySelector('.de-next-text'),
          pauseIcon = '<i class="icon icon-pause" title="Pause Everlasting Collection"></i>',
          controls = document.querySelector('.de-pause'),
          resume = document.querySelector('.de-resume'),
          spinner = document.querySelector('#de-next .icon-spinner');

      resume.addEventListener('click', event => {

        event.preventDefault();

        controls.innerHTML = pauseIcon;
        spinner.style.display = 'block';
        loadingText.textContent = 'Loading next page...';

        paused = false;

        return getNextPage();
      });
    }

    /**
     * Appends the next page of the collection to the DOM
     * @param data {array.<object>} The next page of the collection data
     * @returns {undefined}
     */
    function appendCollectionData(data) {

      let body = document.querySelector('#collection tbody'),
          fragment = document.createDocumentFragment(),
          lastChild = '#collection tbody:last-child',
          opt = document.createElement('option'),
          selectBox = document.querySelector('.de-scroll-to-page'),
          pageStamp = assignPageStamp(layout);
      // Insert the page stamp in between each set of page results that are appended
      document.querySelector(lastChild).insertAdjacentHTML('beforeEnd', pageStamp);
      // Populate the document fragment
      data.forEach(tr => fragment.appendChild(tr));
      // Append the fragment to the DOM
      body.appendChild(fragment);
      // Update the select box in the blackBar component
      opt.value = page;
      opt.textContent = `Page: ${page}`;

      selectBox.insertAdjacentElement('beforeend', opt);

      setTimeout(() => injectStars(), 100);
      setTimeout(() => addStarListeners(), 200);
      setTimeout(() => addRatingListeners(), 300);
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
                          <h2 class="de-current-page" id="de-page-${page}">Page: ${page}</h2>
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
                          <h2 class="de-current-page" id="de-page-${page}">Page: ${page}</h2>
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
     * @returns {method}
     */
    async function getNextPage() {

      try {

        let url = `https://www.discogs.com/user/${username}/collection?page=${page}${resourceLibrary.removePageParam(href)}`,
            data = await fetch(`${url}`, { credentials: 'include' }),
            response = await data.text(),
            tr = '#collection tbody tr',
            div = document.createElement('div'),
            loader = document.querySelector('#de-next'),
            markup,
            noItems = '<h1 class="de-no-results">No more items for sale found</h1>';

        div.innerHTML = response;
        markup = div.querySelectorAll(tr);

        if ( markup.length ) {

          appendCollectionData(markup);

        } else {

          loader.remove();
          document.querySelector('#collection tbody:last-child').insertAdjacentHTML('beforeend', noItems);
        }

        page++;
        hasLoaded = false;

      } catch (err) {
        return console.log('Error getting next page of collection', err);
      }
    }

    function injectStars() {

      let ratings = [...document.querySelectorAll('span.rating')];

      ratings.forEach(rating => {

        if ( !rating.querySelector('.rating_icons') ) {

          let value = rating.dataset.value || 0;

          if ( value === 0 ) rating.classList.add('not_rated');

          rating.insertAdjacentHTML('beforeend', starTemplate(value));
        }
      });
    }

    function starTemplate(value) {
      let template = `<span class="rating_icons de-rating-icons"><span class="rating_range fill${value}"><a class="star star1 icon icon-star-o" tabindex="0" aria-label="Rate this release 1 star." data-value="1"></a><a class="star star1 icon icon-star" tabindex="0" aria-label="Rate this release 1 star." data-value="1"></a><a class="star star2 icon icon-star-o" tabindex="0" aria-label="Rate this release 2 stars." data-value="2"></a><a class="star star2 icon icon-star" tabindex="0" aria-label="Rate this release 2 stars." data-value="2"></a><a class="star star3 icon icon-star-o" tabindex="0" aria-label="Rate this release 3 stars." data-value="3"></a><a class="star star3 icon icon-star" tabindex="0" aria-label="Rate this release 3 stars." data-value="3"></a><a class="star star4 icon icon-star-o" tabindex="0" aria-label="Rate this release 4 stars." data-value="4"></a><a class="star star4 icon icon-star" tabindex="0" aria-label="Rate this release 4 stars." data-value="4"></a><a class="star star5 icon icon-star-o" tabindex="0" aria-label="Rate this release 5 stars." data-value="5"></a><a class="star star5 icon icon-star" tabindex="0" aria-label="Rate this release 5 stars." data-value="5"></a></span><i class="reset icon icon-times" tabindex="0" aria-label="Remove rating" data-value="0"></i></span>`;
      return template;
    }

    function addStarListeners() {

      let stars = [...document.querySelectorAll('.de-rating-icons .rating_range .star')];

      stars.forEach(star => {
        star.addEventListener('mouseover', event => {
          let rating = getRatingClass(event.target);
          removeStarClass(event.target.closest('.rating_range'));
          star.closest('.rating_range').classList.add(`fill${rating}`);
        });

        star.addEventListener('click', event => {
          let nums = /\d+/g;
          let releaseId = event.target.closest('.rating').dataset.postUrl.match(nums)[0];
          let rating = event.target.dataset.value;
          postRating(releaseId, rating, event);
        });
      });
    }

    async function postRating(releaseId, rating, event) {

      let
          value = `value=${rating}`,
          headers = { 'content-type': 'application/x-www-form-urlencoded' },
          url = `https://www.discogs.com/release/rate?release_id=${releaseId}`,
          initObj = {
            body: value,
            credentials: 'include',
            headers: headers,
            method: 'POST'
          },
          response = await fetch(url, initObj);

     if ( response.ok ) {

        if ( rating !== '0' ) {
          event.target.closest('.rating').dataset.value = rating;
          return event.target.closest('.rating').classList.remove('not_rated');
        }

        event.target.closest('.rating').removeAttribute('data-value');
        removeStarClass(event.target.closest('.rating').querySelector('.rating_range'));
        event.target.closest('.rating').querySelector('.rating_range').classList.add('fill0');
        return event.target.closest('.rating').classList.add('not_rated');
     }
    }

    function addRatingListeners() {
      let ratings = [...document.querySelectorAll('.de-rating-icons .rating_range')],
          removeRatings = [...document.querySelectorAll('.de-rating-icons .reset')];

      ratings.forEach(rating => {
        rating.addEventListener('mouseleave', event => {

          let notRated = event.target.closest('.rating').classList.contains('not_rated');
          let value = event.target.closest('.rating').dataset.value;

          if ( notRated ) {
            removeStarClass(event.target.closest('.rating .rating_range'));
            event.target.closest('.rating .rating_range').classList.add('fill0');

          } else {
            removeStarClass(event.target.closest('.rating .rating_range'));
            event.target.closest('.rating .rating_range').classList.add(`fill${value}`);
          }
        });
      });

      removeRatings.forEach(x => {
        x.addEventListener('click', event => {
          let nums = /\d+/g;
          let releaseId = event.target.closest('.rating').dataset.postUrl.match(nums)[0];
          let rating = event.target.dataset.value;
          postRating(releaseId, rating, event);
        });
      });
    }

    function getRatingClass(elem) {

      let classes = Array.from(elem.classList),
          num = /\d/g;

      classes = classes.join('');
      return classes.match(num)[0];
    }

    function removeStarClass(elem) {
      for ( let i = 0; i <= 5; i++ ) {
        elem.classList.remove(`fill${i}`);
      }
    }

    // ========================================================
    // DOM Setup / Init
    // ========================================================

    pagination = document.querySelector('.pagination_total').textContent;
    // This will grab the total number of results returned by discogs
    // depending on the language that the user has set
    pTotal = resourceLibrary.paginationTotal(pagination);
    // Hide pagination
    document.querySelectorAll('.pagination.bottom').forEach(el => el.style.display = 'none');

    blackBar = `<div class="de-page-bar">
                  <span class="de-page-info">
                    <span class="de-page de-page-num">Page: 1</span>
                    <span> ${pTotal} results</span>
                  </span>
                  <a href="#" id="de-update-filters">Back to top</a>
                  <div class="de-select-wrap">
                    <span>Scroll to: &nbsp;</span>
                    <select class="de-scroll-to-page">
                      <option value="" selected>Select</option>
                      <option value="1">Page: 1</option>
                    </select>
                    <span class="de-pause">
                      <i class="icon icon-pause" title="Pause Everlasting Collection"></i>
                    </span>
                  </div>
                </div>`;

    // Everlasting Collection add/remove filters bar
    document.body.insertAdjacentHTML('beforeend', blackBar);

    if ( !document.getElementById('de-next') ) {

      let loaderMarkup = `<div id="de-next" class="offers_box" >
                            <div class="de-next-text">
                              Loading next page...
                            </div>
                            ${resourceLibrary.css.preloader}
                          </div>`;

      document.querySelector('.release_list_table').insertAdjacentHTML('afterend', loaderMarkup);
    }

    // ========================================================
    // UI Functionalty
    // ========================================================

    // Scroll the browser up to the top so the user can change Collection filters
    document.querySelector('#de-update-filters').addEventListener('click', event => {

      event.preventDefault();
      window.scroll({ top: 0, left: 0 });
    });

    // Pause/resume Everlasting Collection
    document.querySelector('.de-pause').addEventListener('click', event => {

      let
          loader = document.querySelector('.de-next-text'),
          pauseIcon = '<i class="icon icon-pause" title="Pause Everlasting Collection"></i>',
          playIcon = '<i class="icon icon-play" title="Resume Everlasting Collection"></i>',
          resumeLink = '<p>Everlasting Collection is paused.</p> <p><a href="#" class="de-resume">Click here to resume loading results</a></p>',
          spinner = document.querySelector('#de-next .icon-spinner'),
          target = event.target;

      // Paused
      if ( target.classList.contains('icon-pause') ) {

        target.parentElement.innerHTML = playIcon;

        spinner.style.display = 'none';
        loader.innerHTML = resumeLink;

        paused = true;

        addResumeListener();

      // Resume
      } else {

        target.parentElement.innerHTML = pauseIcon;

        spinner.style.display = 'block';
        loader.textContent = 'Loading next page...';

        paused = false;
      }
    });

    // scroll to page section select box functionality
    document.querySelector('.de-scroll-to-page').addEventListener('change', event => {

      let target = event.target,
          targetId = '#de-page-' + target.value;

      if ( target.value ) {

        if ( target.value === '1' ) {

          window.scroll({ top: 0, left: 0 });

        } else {

          document.querySelector(targetId).scrollIntoView();
          window.scroll({top: window.scrollY - 30, left: 0});
        }
      }
    });

    // ========================================================
    // Scrolling Functionality
    // ========================================================

    window.addEventListener('scroll', () => {

      let
          currentPage = document.querySelector('.de-page'),
          everlasting = document.querySelector('.de-page-bar'),
          kurtLoder = document.querySelector('#de-next'), // also former MTV anchor
          pageIndicator = document.getElementsByClassName('de-current-page'),
          siteHeader = document.querySelector('#site_header');

      if ( resourceLibrary.isOnScreen(kurtLoder)
            && !hasLoaded
            && !paused ) {

        hasLoaded = true;

        return getNextPage();
      }

      // Show/Hide the blackbar nav component
      if ( resourceLibrary.isOnScreen(siteHeader) ) {

        everlasting.classList.remove('show');
        everlasting.classList.add('hide');
        currentPage.textContent = 'Page: 1';

      } else {

        if ( !resourceLibrary.isOnScreen(siteHeader)
             && everlasting.getBoundingClientRect().top < -30 ) {

          everlasting.classList.remove('hide');
          everlasting.classList.add('show');
        }
      }

      // This gnarly bit of code will display the currently viewed page
      // of results in the Everlasting Collection top bar.
      // I feel bad for writing this and even worse now that
      // you're looking at it.
      if ( pageIndicator && pageIndicator.length > 0 ) {

        for ( let i = 0; i < page; i++ ) {

          try {

            if ( resourceLibrary.isOnScreen(pageIndicator[i]) ) {

              currentPage.textContent = pageIndicator[i].textContent;
            }
          } catch (e) {
            // I'm just here so I don't throw errors
          }
        }
      }
    });
  }
});
