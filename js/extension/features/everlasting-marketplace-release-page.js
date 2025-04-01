/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 * -----------------------------------------------------------
 * @Testing: https://www.discogs.com/sell/release/2897713
 * -----------------------------------------------------------
 */

rl.ready(() => {

  let hasPageLinks = document.querySelectorAll('.pagination_page_links').length > 0,
      href = window.location.href;

  if ( href.includes('/sell/release') && hasPageLinks ) {

    let hasLoaded = false,
        initialPage = (new URL(document.location)).searchParams.get('page') || 1,
        pageHist = [initialPage],
        pageNum = initialPage,
        pagination,
        paused = false,
        pjax = document.querySelector('#pjax_container'),
        pTotal,
        { mediaCondition, sleeveCondition } = rl.getPreference('featureData');

    let pauseBtn = `<a class="de-pause button button-blue">
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
     * Appends the release markup to the page.
     * @param {object} markup - The markup to be appended to the page
     * @returns {undefined}
     */
    function appendMarketplaceResults(markup) {

      let lastChild = '#pjax_container tbody:last-child';

      // Append page number to the DOM
      document.querySelector(lastChild).insertAdjacentHTML('afterEnd', pageStamp(pageNum));
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
     * Grabs the next set of items
     * @method   getNextPage
     * @return   {undefined}
     */
    async function getNextPage() {

      pageNum++;

      let releaseMatch = href.match(/(release\/)\d{1,}/),
          releaseId = releaseMatch[0].split('release/')[1],
          url = `/sell/release/${releaseId}?page=${Number(pageNum)}${rl.removePageParam(href)}`;

      try {

        let response = await fetch(url),
            data = await response.text(),
            div = document.createElement('div'),
            loader = document.querySelector('#de-next'),
            markup,
            noItems = '<h1 class="de-no-results">No more items for sale found</h1>',
            tbody = '#pjax_container tbody:last-child';

        if ( typeof Element.prototype.setHTMLUnsafe === 'function' ) {
          div.setHTMLUnsafe(data);
        } else {
          div.innerHTML = data;
        }

        markup = div.querySelector(tbody) ? div.querySelector(tbody).innerHTML : null;

        if ( markup.match(/\S/) ) {

          appendMarketplaceResults(markup);
          rl.updatePageParam(pageNum);
        } else {

          loader.remove();
          pjax.insertAdjacentHTML('beforeend', noItems);
          document.querySelectorAll('.de-pause, .de-resume').forEach(b => b.remove());
        }

        hasLoaded = false;

        addPauseListener();
        addSelectListener();
        rl.callOtherMarketplaceFeatures();

      } catch (err) {
        console.log('Everlastning Marketplace could not fetch data', err);
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

        if ( target.value === pageHist[0] ) {

          window.scroll({ top: 0, left: 0 });

        } else {

          document.querySelector(targetId).scrollIntoView();
          window.scroll({top: window.scrollY, left: 0});
        }
        document.querySelectorAll('.de-scroll-to-page').forEach(s => { s.value = ''; });
      }
    }

    /**
     * Inserts page headers at top of new page set
     * @returns {HTMLElement}
     */
    function pageStamp() {

      let mc = mediaCondition ? Number(mediaCondition) : null,
          sc = sleeveCondition && sleeveCondition.value ? Number(sleeveCondition.value) : null;

      return `<tr class="shortcut_navigable">
                <td class="item_picture as_float de-page-stamp">
                  <h4 class="de-current-page">Page: ${pageNum}&nbsp;</h4>
                </td>
                <td class="item_description de-filter-stamp de-page-stamp">
                 ${pTotal} results &mdash; ${window.setFilterStateText(mc, sc)}
                </td>
                <td class="de-page-stamp de-marketplace-results z-1 to-top"><a href="#main_wrapper" >Back to top</a></td>
                <td class="de-page-stamp de-marketplace-results">
                  <div class="de-select-wrap">
                    <span></span>
                    <select class="de-scroll-to-page">
                      <option value="" selected>Select Page</option>
                      <option value="${pageHist[0]}">Page: ${pageHist[0]}</option>
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

    pagination = document.getElementsByClassName('pagination_total')[0].textContent;
    pTotal = rl.paginationTotal(pagination);

    // append preloader to bottom
    if ( !document.getElementById('de-next') ) {

      let loaderMarkup = `<div id="de-next" class="offers_box" >
                            <div class="de-next-text">
                              Loading next page...
                            </div>
                              ${rl.css.preloader}
                          </div>`;

      pjax.insertAdjacentHTML('beforeend', loaderMarkup);
    }

    // Hide standard means of page navigation
    document.querySelectorAll('.pagination_page_links').forEach(el => { el.style.display = 'none'; });
    document.querySelector('.mpitems tbody').insertAdjacentHTML('afterBegin', pageStamp(pageNum));

    addPauseListener();
    addSelectListener();

    // ========================================================
    // Scrolling Functionality
    // ========================================================

    window.addEventListener('scroll', () => {

      let kurtLoder = document.querySelector('#de-next');

      if ( rl.isOnScreen(kurtLoder)
            && !hasLoaded
            && !paused ) {

        hasLoaded = true;

        return getNextPage();
      }
    });
  }
});
