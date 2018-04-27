/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {

  let hasPageLinks = document.querySelectorAll('.pagination_page_links').length > 0,
      href = window.location.href;


  if ( href.includes('/sell/release') && hasPageLinks ) {

    let
        blackBar,
        hasLoaded = false,
        pTotal,
        pageNum = 2,
        pagination,
        paused = false,
        pjax = document.querySelector('#pjax_container');

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
          pauseIcon = '<i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>',
          controls = document.querySelector('.de-pause'),
          resume = document.querySelector('.de-resume'),
          spinner = document.querySelector('#de-next .icon-spinner');

      resume.addEventListener('click', event => {

        event.preventDefault();

        controls.innerHTML = pauseIcon;

        if (spinner){
          spinner.style.display = 'block';
        }

        loadingText.textContent = 'Loading next page...';

        paused = false;

        return getNextPage();
      });
    }

    function appendMarketplaceResults(markup) {

      let condition = document.querySelector('.pagination_total').textContent,
          lastChild = '#pjax_container tbody:last-child',
          opt = document.createElement('option'),
          selectBox = document.querySelector('.de-scroll-to-page'),
          pageStamp = `<tr class="shortcut_navigable">
                                <td class="item_picture as_float"></td>
                                <td class="item_description de-filter-stamp">
                                  <h2 class="de-current-page" id="de-page-${pageNum}">Page: ${pageNum}</h2>
                                  <span>${window.hideItems ? condition : ''}</span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>`;

      // Append page number to the DOM
      document.querySelector(lastChild).insertAdjacentHTML('afterEnd', pageStamp);
      // Append new items to the DOM
      document.querySelector(lastChild).insertAdjacentHTML('afterEnd', markup);

      // Inject options into scroll-to-page select box
      opt.value = pageNum;
      opt.textContent = `Page: ${pageNum}`;
      selectBox.insertAdjacentElement('beforeend', opt);
    }

    /**
     * Calls any other Marketplace filtering features
     * the user might have enabled.
     * @method callOtherMarketplaceFeatures
     * @returns {undefined}
     */
    function callOtherMarketplaceFeatures() {

      let blockList = JSON.parse(localStorage.getItem('blockList')) || null;

      // apply Marketplace Highlights
      if ( window.applyStyles ) { window.applyStyles(); }

      // apply price comparisons
      if ( window.appendPrices ) {
        window.releasePricesInit();
        window.appendPrices();
      }

      // Hide/tag sellers in marketplace
      if ( blockList && blockList.hide === 'global' && window.modifySellers ||
           blockList && blockList.hide === 'marketplace' && window.modifySellers ) {

        window.modifySellers('hide');
      }

      if ( blockList && blockList.hide === 'tag' && window.modifySellers ) {
        window.modifySellers('tag');
      }

      // filter marketplace item by condition
      if ( window.hideItems ) {

        window.hideItems();
      }

      // filter marketplace item by condition
      if ( window.hideItems ) { window.hideItems(); }
      // Filter marketplace by country
      if ( window.filterByCountry ) { window.filterByCountry(); }
      // Tag sellers by reputation
      if ( window.sellersRep ) { window.sellersRep(); }
      // Release ratings
      if ( window.insertRatingsLink ) { window.insertRatingsLink(); }
    }

    /**
     * Grabs the next set of items
     * @method   getNextPage
     * @return   {undefined}
     */
    async function getNextPage() {

      let releaseMatch = href.match(/(release\/)\d{1,}/),
          releaseId = releaseMatch[0].split('release/')[1],
          url = `/sell/release/${releaseId}?page=${Number(pageNum)}${resourceLibrary.removePageParam(href)}`;

      try {

        let response = await fetch(url),
            data = await response.text(),
            div = document.createElement('div'),
            loader = document.querySelector('#de-next'),
            markup,
            noItems = '<h1 class="de-no-results">No more items for sale found</h1>',
            tbody = '#pjax_container tbody:last-child';

        div.innerHTML = data;

        markup = div.querySelector(tbody) ? div.querySelector(tbody).innerHTML : null;

        if ( markup.match(/\S/) ) {

          appendMarketplaceResults(markup);

        } else {

          loader.remove();
          pjax.insertAdjacentHTML('beforeend', noItems);
        }

        pageNum++;
        hasLoaded = false;

        callOtherMarketplaceFeatures();

      } catch (err) {
        console.log('Everlastning Marketplace could not fetch data', err);
      }
    }

    // ========================================================
    // DOM Setup
    // ========================================================

    pagination = document.getElementsByClassName('pagination_total')[0].textContent;
    // This will grab the total number of results returned by discogs
    // depending on the language that the user has set
    pTotal = resourceLibrary.paginationTotal(pagination);
    // Markup for the black bar that appears at the top of the Marketplace
    blackBar = `<div class="de-page-bar">
                          <span class="de-page-info">
                            <span class="de-page de-page-num">Page: 1</span>
                            <span> ${pTotal} results</span>
                          </span>
                          <a href="#" id="de-update-filters">Add or remove filters</a>
                          <div class="de-select-wrap">
                            <span>Scroll to: &nbsp;</span>
                            <select class="de-scroll-to-page">
                              <option value="" selected>Select</option>
                              <option value="1">Page: 1</option>
                            </select>
                            <span class="de-pause">
                              <i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>
                            </span>
                          </div>
                       </div>`;

    // Everlasting Marketplace add/remove filters bar
    document.body.insertAdjacentHTML('beforeend', blackBar);

    // append preloader to bottom
    if ( !document.getElementById('de-next') ) {

      let loaderMarkup = `<div id="de-next" class="offers_box" >
                            <div class="de-next-text">
                              Loading next page...
                            </div>
                              ${resourceLibrary.css.preloader}
                          </div>`;

      pjax.insertAdjacentHTML('beforeend', loaderMarkup);
    }

    // Hide standard means of page navigation
    [...document.querySelectorAll('.pagination_page_links')].forEach(el => el.style.display = 'none');

    // ========================================================
    // UI Functionalty
    // ========================================================

    // Scroll the browser up to the top so the user can change Marketplace filters
    document.querySelector('#de-update-filters').addEventListener('click', event => {

      event.preventDefault();
      window.scroll({ top: 0, left: 0 });
    });

    // Pause/resume Everlasting Marketplace
    document.querySelector('.de-pause').addEventListener('click', event => {

      let loader = document.querySelector('.de-next-text'),
          pauseIcon = '<i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>',
          playIcon = '<i class="icon icon-play" title="Resume Everlasting Marketplace"></i>',
          resumeLink = '<p>Everlasting Marketplace is paused.</p> <p><a href="#" class="de-resume">Click here to resume loading results</a></p>',
          spinner = document.querySelector('#de-next .icon-spinner'),
          target = event.target;

      // Paused
      if ( target.classList.contains('icon-pause') ) {

        target.parentElement.innerHTML = playIcon;

        if ( spinner ) { spinner.style.display = 'none'; }
        loader.innerHTML = resumeLink;

        paused = true;

        addResumeListener();

      // Resume
      } else {

        target.parentElement.innerHTML = pauseIcon;

        if ( spinner ) { spinner.style.display = 'block'; }
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

      let currentPage = document.querySelector('.de-page'),
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

      // Hide the page bar if at top of screen
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
      // of results in the Everlasting Marketplace top bar.
      // I feel bad for writing this and even worse now that
      // you're looking at it.
      if ( pageIndicator && pageIndicator.length > 0 ) {

        for ( let i = 0; i < pageNum; i++ ) {

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
