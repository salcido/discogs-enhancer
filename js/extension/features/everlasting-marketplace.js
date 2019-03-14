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

  let href = window.location.href;

  if ( href.includes('/sell/mywants') || href.includes('/sell/list') ) {

    let hasLoaded = false,
        pTotal,
        pageHist = [1],
        pageNum = 2,
        pagination,
        paused = false,
        pjax = document.querySelector('#pjax_container'),
        mediaCondition = JSON.parse(localStorage.getItem('mediaCondition')),
        sleeveCondition = JSON.parse(localStorage.getItem('sleeveCondition')) || null;

    let pauseBtn = `<a class="de-pause button">
                     <i class="icon icon-pause" title="Pause Everlasting Marketplace"></i> Pause
                    </a>`,
        playBtn = `<a class="de-resume button button-blue">
                     <i class="icon icon-play" title="Resume Everlasting Marketplace"></i> Resume
                   </a>`;

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Adds/removes the event listeners for `.de-pause` elements
     * @returns {undefined}
     */
    function addPauseListener() {
      document.querySelectorAll('.de-pause').forEach(pause => {
        pause.removeEventListener('click', handlePauseClick);
        pause.addEventListener('click', handlePauseClick);
      });
    }

    /**
     * Adds/removes the event listeners for `.de-resume` elements
     * @returns {undefined}
     */
    function addResumeListener() {
      document.querySelectorAll('.de-resume').forEach(btn => {
        btn.removeEventListener('click', handleResumeClick);
        btn.addEventListener('click', handleResumeClick);
      });
    }

    /**
     * Adds/removes the event listeners for `.de-scroll-to-page` elements
     * @returns {undefined}
     */
    function addSelectListener() {
      document.querySelectorAll('.de-scroll-to-page').forEach(select => {
        select.removeEventListener('change', handleSelectChange);
        select.addEventListener('change', handleSelectChange);
      });
    }

    /**
     * Injects the page result markup into the DOM
     * @param {object} markup The releases markup that was fetched
     * @returns {undefined}
     */
    function appendMarketplaceResults(markup) {

      let lastChild = '#pjax_container tbody:last-child';

      // Append page results number to the DOM
      /*
         document.querySelector caches the results so I'm using it twice
         here to grab `lastChild`. After the first call
         the content has changed and if it's declared in a var, it never gets
         updated when the `markup` gets appened...
      */
      document.querySelector(lastChild).insertAdjacentHTML('afterEnd', pageStamp());
      document.querySelector(lastChild).id = `de-page-${pageNum}`;

      // Append new items to the DOM
      document.querySelector(lastChild).insertAdjacentHTML('afterEnd', markup);
      pageHist.push(pageNum);

      // Inject options into scroll-to-page select box
      document.querySelectorAll('.de-scroll-to-page').forEach(select => {
        select.innerHTML = '<option value="" selected>Select Page</option>';
        pageHist.forEach(page => {
          let opt = document.createElement('option');
          opt.value = page;
          opt.textContent = `Page: ${page}`;
          select.insertAdjacentElement('beforeend', opt);
        });
      });
    }

    /**
     * Calls any other Marketplace filtering features
     * the user might have enabled.
     * @returns {undefined}
     */
    function callOtherMarketplaceFeatures() {

      let blockList = JSON.parse(localStorage.getItem('blockList')) || null,
          favoriteList = JSON.parse(localStorage.getItem('favoriteList')) || null;

      // apply Marketplace Highlights
      if ( window.applyStyles ) window.applyStyles();
      // apply price comparisons
      if ( window.injectPriceLinks ) window.injectPriceLinks();

      // Hide/tag sellers in marketplace
      if ( blockList && blockList.hide === 'global' && window.blockSellers ||
           blockList && blockList.hide === 'marketplace' && window.blockSellers ) {

        window.blockSellers('hide');
      }

      if ( blockList && blockList.hide === 'tag' && window.blockSellers ) {
        window.blockSellers('tag');
      }

      // Favorite sellers
      if ( favoriteList && window.favoriteSellers ) window.favoriteSellers();
      // filter marketplace media condition
      if ( window.filterMediaCondition ) window.filterMediaCondition();
      // filter marketplace sleeve condition
      if ( window.filterSleeveCondition ) window.filterSleeveCondition();

      // Filter shipping country
      if ( window.filterCountries ) {
        let countryList = JSON.parse(localStorage.getItem('countryList')),
            include = countryList.include,
            useCurrency = countryList.currency;
        window.filterCountries(include, useCurrency);
      }

      // Tag sellers by reputation
      if ( window.sellersRep ) window.sellersRep();
      // Release ratings
      if ( window.insertRatingsLink ) window.insertRatingsLink();
      // Remove from wantlist
      if ( window.insertRemoveLinks ) window.insertRemoveLinks();
    }

    /**
     * Grabs the next set of items
     * @method   getNextPage
     * @return   {undefined}
     */
    async function getNextPage() {

      let type = href.includes('/sell/mywants') ? 'mywants' : 'list',
          url = `/sell/${type}?page=${Number(pageNum)}${resourceLibrary.removePageParam(href)}`;

      try {

        let response = await fetch(url, { credentials: 'include' }),
            data = await response.text(),
            div = document.createElement('div'),
            loader = document.querySelector('#de-next'),
            markup,
            noItems = '<h1 class="de-no-results">No more items for sale found</h1>',
            tbody = '#pjax_container tbody';

        div.innerHTML = data;

        markup = div.querySelector(tbody) ? div.querySelector(tbody).innerHTML : null;

        if ( markup ) {

          appendMarketplaceResults(markup);

        } else {

          loader.remove();
          pjax.insertAdjacentHTML('beforeend', noItems);
          document.querySelectorAll('.de-pause, .de-resume').forEach(b => b.remove());
        }

        pageNum++;
        hasLoaded = false;

        addPauseListener();
        addSelectListener();
        callOtherMarketplaceFeatures();

      } catch (err) {
        console.error('Everlastning Marketplace could not fetch data', err);
      }
    }

    /**
     * Handles click events for the .de-pause elements
     * @param {object} event - the event object
     * @returns {undefined}
     */
    function handlePauseClick(event) {

      let loader = document.querySelector('.de-next-text'),
          spinner = document.querySelector('#de-next .icon-spinner'),
          resumeLink = `<p>Everlasting Marketplace is paused.</p>
                        <p><a href="#" class="de-resume">Click here to resume loading results</a></p>`;


      // Paused
      if ( event.target.classList.contains('de-pause') ) {

        document.querySelectorAll('.de-pause').forEach(p => { p.parentElement.innerHTML = playBtn; });

        spinner.style.display = 'none';
        loader.innerHTML = resumeLink;

        paused = true;

        addResumeListener();

      // Resume
      } else {

        event.target.outerHTML = pauseBtn;

        spinner.style.display = 'block';
        loader.textContent = 'Loading next page...';

        paused = false;
      }
    }

    /**
     * Handles click events for the .de-resume elements
     * @param {object} event - the event object
     * @returns {undefined}
     */
    function handleResumeClick(event) {

      let loadingText = document.querySelector('.de-next-text'),
          resumeBtns = document.querySelectorAll('.de-resume'),
          spinner = document.querySelector('#de-next .icon-spinner');

      event.preventDefault();

      resumeBtns.forEach(btn => { btn.parentElement.innerHTML = pauseBtn; });
      spinner.style.display = 'block';
      loadingText.textContent = 'Loading next page...';

      paused = false;

      return getNextPage();
    }

    /**
     * Handles click events for the .de-scroll-to-page elements
     * @param {object} event - the event object
     * @returns {undefined}
     */
    function handleSelectChange(event) {

      let target = event.target,
          targetId = '#de-page-' + target.value;

      if ( target.value ) {

        if ( target.value === '1' ) {

          window.scroll({ top: 0, left: 0 });

        } else {

          document.querySelector(targetId).scrollIntoView();
          window.scroll({top: window.scrollY, left: 0});
          document.querySelectorAll('.de-scroll-to-page').forEach(s => { s.value = target.value; });
        }
      }
    }

    /**
     * Inserts page headers at top of new page set
     * @param {string} override - Page number to override automated pagination count
     * @returns {HTMLElement}
     */
    function pageStamp(override) {

      let mc = mediaCondition ? Number(mediaCondition) : null,
          sc = sleeveCondition && sleeveCondition.value ? Number(sleeveCondition.value) : null,
          filterState = window.setFilterStateText ? `&mdash; ${ window.setFilterStateText(mc, sc)}` : '';

      return `<tr class="shortcut_navigable">
                <td class="item_description de-page-stamp de-page-number">
                  <h3 class="de-current-page">Page: ${override || pageNum}</h3>
                </td>
                <td class="item_description de-filter-stamp de-page-stamp">
                  ${pTotal} results ${filterState}
                </td>
                <td class="de-page-stamp de-marketplace-results z-1 back-to-top"><a href="#site_header">Back to top</a></td>
                <td class="de-page-stamp de-marketplace-results">
                  <div class="de-select-wrap">
                    <span></span>
                    <select class="de-scroll-to-page">
                      <option value="" selected>Select Page</option>
                      <option value="1">Page: 1</option>
                    </select>
                  </div>
                </td>
                <td class="de-page-stamp de-marketplace-results">
                  ${paused ? playBtn : pauseBtn}
                </td>
              </tr>`;
    }

    // ========================================================
    // DOM Setup
    // ========================================================

    pagination = document.querySelector('.pagination_total').textContent;
    // This will grab the total number of results returned by discogs
    pTotal = resourceLibrary.paginationTotal(pagination);

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
    document.querySelectorAll('.pagination_page_links').forEach(el => { el.style.display = 'none'; });
    document.querySelector('.mpitems tbody').insertAdjacentHTML('afterBegin', pageStamp('1'));

    addPauseListener();
    addResumeListener();
    addSelectListener();

    // ========================================================
    // Scrolling Functionality
    // ========================================================

    window.addEventListener('scroll', () => {

      let kurtLoder = document.querySelector('#de-next'); // also former MTV anchor

      if ( resourceLibrary.isOnScreen(kurtLoder)
            && !hasLoaded
            && !paused ) {

        hasLoaded = true;

        return getNextPage();
      }
    });
  }
});
