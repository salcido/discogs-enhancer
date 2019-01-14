/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This feature relays the filter media/sleeve/countries feature settings
 * so that their current status can be shown whilst browsing the Marketplace
 */

 // @TODO: make a proper popover for country list
resourceLibrary.ready(() => {

  let currentFilterState = JSON.parse(localStorage.getItem('currentFilterState')),
      sleeveCondition = JSON.parse(localStorage.getItem('sleeveCondition')) || null,
      countryList = JSON.parse(localStorage.getItem('countryList')) || null,
      _class = ['poor','fair','good','good-plus','very-good','very-good-plus','near-mint','mint'],
      countryEnabled = currentFilterState.filterShippingCountry,
      currency = countryList && countryList.currency ? countryList.currency : null,
      include = countryList && countryList.include ? 'Including' : 'Excluding',
      key = ['P','F','G','G+','VG','VG+','NM or M-','M'],
      mediaEnabled = currentFilterState.filterMediaCondition,
      sleeveEnabled = currentFilterState.filterSleeveCondition,
      info = countryList && countryList.list ? `
      <span class="country-list-info">
        <i class="icon icon-info-circle muted" title=""></i>
        <span class="country-list">${countryList.list.join(', ')}</span>
      </span>` : null;

  function mediaFilter(mediaLength) {
    if ( mediaEnabled && mediaLength ) {
      return `Media: <span class="${_class[mediaLength]}">${key[mediaLength]}</span>`;
    }
    return '';
  }

  function sleeveFilter(sleeveLength) {
    if ( sleeveEnabled && sleeveLength ) {
      return `Sleeve: <span class="${_class[sleeveLength]}">${key[sleeveLength]}</span>`;
    }
    return '';
  }

  function genericFilter() {
    if ( sleeveEnabled && sleeveCondition && sleeveCondition.generic ) {
      return 'Generic';
    }
    return '';
  }

  function noCoverFilter() {
    if ( sleeveEnabled && sleeveCondition && sleeveCondition.noCover ) {
      return 'No Cover';
    }
    return '';
  }

  function countriesFilter(enabled, list, currency) {

    let href = window.location.href,
        currencyInURL = href.includes('currency=');

    if ( enabled && list && currency && currencyInURL
        || enabled && list && !currency ) {

      return `${include} countries: ${info}`;
    }
    return '';
  }

  /**
   * Shows/hides filtered items in the Marketplace
   * @returns {undefined}
   * Commenting this out for now. Toggling filtered items sounds good
   * on paper but it doesn't work that well in reality. Sometimes filtered
   * items are "below the fold" so it looks as if nothing was toggled.
   * Not great UX.

  window.toggleItems = function toggleItems(event) {

    event.preventDefault();

    let target = event.target.parentElement.parentElement.parentElement.nextElementSibling;

    let items = target.querySelectorAll('tr ~ .de-hide-media');

    items.forEach(item => {
      item.classList.toggle('de-show');
    });
  };
  */

  /**
   * Creates HTML that represents the Media and Sleeve filter settings to
   * display to the user in the Marketplace.
   * @param {Number} mediaLength  - The current length of the Media Condtion array
   * @param {Number} sleeveLength - The current length of the Sleeve Condition array
   * @returns {HTMLElement}
   */
  window.setFilterStateText = function setFilterStateText(mediaLength, sleeveLength) {

    let media = mediaFilter(mediaLength),
        sleeve = sleeveFilter(sleeveLength),
        generic = genericFilter(),
        noCover = noCoverFilter(),
        // toggle = '<button onClick="window.toggleItems(event)" class="de-show-toggle">Toggle Filtered Items</button>',
        filters = [`${media}`, `${sleeve}`, `${generic}`, `${noCover}`, countriesFilter(countryEnabled, countryList, currency)];

    return `Filtering - ${filters.filter(f => f !== '').join(', ')}`;
  };

  // ========================================================
  // DOM setup
  // ========================================================
  let style = document.createElement('style');

  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.textContent = `
  .de-show {
    display: table-row;
    border-left: 3px solid #c72020 !important;
    background: #292929 !important;
  }

  .country-list-info {
    position: relative;
    z-index: 1050;
  }

  .country-list-info .country-list {
    background: #fff;
    border-radius: 5px;
    display: none;
    filter: drop-shadow(0 2px 2px #888);
    font-weight: normal;
    line-height: 1.4;
    padding: 8px;
    position: absolute;
    right: -60px;
    top: 20px;
    width: 125px;
  }

  .country-list-info:hover .country-list {
    display: block;
  }
  `;

  // Append to body for proper css overrides
  document.body.append(style);
});


