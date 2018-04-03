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

  let
      hasLoaded = false,
      href = window.location.href,
      pageNum = 2,
      pagination,
      paused = false;

  // Make sure we are in the Marketplace
  if ( href.includes('/sell/mywants') || href.includes('/sell/list') ) {

    let
        blockList = JSON.parse(localStorage.getItem('blockList')) || null,
        filterUpdateLink,
        language = resourceLibrary.language(),
        pTotal,
        type = href.includes('/sell/mywants') ? 'mywants' : 'list';

    pagination = document.querySelector('.pagination_total').textContent;

    // This will grab the total number of results returned by discogs
    // depending on the language that the user has set
    switch ( language ) {

      // German
      case 'de':
        pTotal = pagination.split('von')[1];
        break;

      // Italian
      case 'it':
        pTotal = pagination.split('di')[1];
        break;

      // Spanish and French
      case 'es':
      case 'fr':
        pTotal = pagination.split('de')[1];
        break;

      // Japanese
      case 'ja':
        pTotal = pagination.split('中')[0];
        break;

      // English
      default:
        pTotal = pagination.split('of')[1];
        break;
    }

    filterUpdateLink = `<div class="de-page-bar">
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
    document.body.insertAdjacentHTML('beforeend', filterUpdateLink);

    // append preloader to bottom
    if ( !document.getElementById('de-next') ) {

      let loaderMarkup = `<div id="de-next" class="offers_box" >
                            <div class="de-next-text">
                              Loading next page...
                            </div>
                              ${resourceLibrary.css.preloader}
                         </div>`;

      document.querySelector('#pjax_container').insertAdjacentHTML('beforeend', loaderMarkup);
    }

    // Hide standard means of page navigation
    [...document.querySelectorAll('.pagination_page_links')].forEach(el => el.style.display = 'none');

    // Scroll the browser up to the top so the user can change Marketplace filters
    document.querySelector('#de-update-filters').addEventListener('click', event => {

      event.preventDefault();
      window.scroll({ top: 0, left: 0 });
    });

    /**
     * Injects the page result markup into the DOM
     * @param {object} markup The releases markup that was fetched
     * @returns {undefined}
     */
    function appendMarketplaceResults(markup) {

      let lastChild = '#pjax_container tbody:last-child',
          opt = document.createElement('option'),
          selectBox = document.querySelector('.de-scroll-to-page'),
          nextSetIndicator = `<tr class="shortcut_navigable">
                                <td class="item_description">
                                  <h2 class="de-current-page" id="de-page-${pageNum}">Page: ${pageNum}</h2>
                                </td>
                              </tr>`;

      // Append page number to the DOM
      document.querySelector(lastChild).insertAdjacentHTML('afterEnd', nextSetIndicator);
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

      // apply Marketplace Highlights
      if (window.applyStyles) { window.applyStyles(); }

      // apply price comparisons
      if (window.injectPriceLinks) { window.injectPriceLinks(); }

      // Hide/tag sellers in marketplace
      if ( blockList && blockList.hide === 'global' && window.modifySellers ||
            blockList && blockList.hide === 'marketplace' && window.modifySellers ) {

        window.modifySellers('hide');
      }

      if ( blockList && blockList.hide === 'tag' && window.modifySellers ) {
        window.modifySellers('tag');
      }

      // filter marketplace item by condition
      if ( window.hideItems ) { window.hideItems(); }

      // Filter marketplace by country
      if ( window.filterByCountry ) { window.filterByCountry(); }

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

      let url = `/sell/${type}?page=${Number(pageNum)}${resourceLibrary.removePageParam(href)}`;

      try {

        let response = await fetch(url, { credentials: 'include' }),
            data = await response.text(),
            div = document.createElement('div'),
            markup,
            noItems = '<h1 class="de-no-results">No more items for sale found</h1>',
            tbody = '#pjax_container tbody';

        div.innerHTML = data;

        markup = div.querySelector(tbody) ? div.querySelector(tbody).innerHTML : null;

        if ( markup ) {

          appendMarketplaceResults(markup);

        } else {

          document.querySelector('#de-next').remove();
          document.querySelector('#pjax_container').insertAdjacentHTML('beforeend', noItems);
        }

        pageNum++;
        hasLoaded = false;

        callOtherMarketplaceFeatures();

      } catch (err) {
        console.error('Everlastning Marketplace could not fetch data', err);
      }
    }

    /**
     * Adds the click event listner for `.de-resume`
     * @method addResumeListener
     * @returns {method}
     */
    function addResumeListener() {

      document.querySelector('.de-resume').addEventListener('click', event => {

        event.preventDefault();

        document.querySelector('.icon-play').parentElement.innerHTML = '<i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>';
        document.querySelector('#de-next .icon-spinner').style.display = 'block';
        document.querySelector('.de-next-text').textContent = 'Loading next page...';

        paused = false;

        return getNextPage();
      });
    }

    // ========================================================
    // UI Functionalty
    // ========================================================

    // Pause/resume Everlasting Marketplace
    document.querySelector('.de-pause').addEventListener('click', event => {

      let target = event.target;

      // Paused
      if ( target.classList.contains('icon-pause') ) {

        target.parentElement.innerHTML = '<i class="icon icon-play" title="Resume Everlasting Marketplace"></i>';

        document.querySelector('#de-next .icon-spinner').style.display = 'none';
        document.querySelector('.de-next-text').innerHTML = '<p>Everlasting Marketplace is paused.</p> <p><a href="#" class="de-resume">Click here to resume loading results</a></p>';

        paused = true;

        addResumeListener();

      // Resume
      } else {

        target.parentElement.innerHTML = '<i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>';

        document.querySelector('#de-next .icon-spinner').style.display = 'block';
        document.querySelector('.de-next-text').textContent = 'Loading next page...';

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
          everlasting = $('.de-page-bar'), // TODO move animation to CSS file
          kurtLoder = document.querySelector('#de-next'), // also former MTV anchor
          pageIndicator = document.getElementsByClassName('de-current-page'),
          currentPage = document.querySelector('.de-page'),
          siteHeader = document.querySelector('#site_header');

      if ( resourceLibrary.isOnScreen(kurtLoder)
            && !hasLoaded
            && !paused ) {

        hasLoaded = true;

        return getNextPage();
      }

      // Hide the page bar if at top of screen
      if ( resourceLibrary.isOnScreen(siteHeader) ) {

        everlasting.animate({top: '-35px'}); // TODO move animation to CSS file
        currentPage.textContent = 'Page: 1';

      } else {

        if ( !resourceLibrary.isOnScreen(siteHeader)
              && everlasting.position().top < -30 ) {

          everlasting.animate({top: '0px'});
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
