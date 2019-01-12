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
      currency = countryList.currency,
      include = countryList.include ? 'Including' : 'Excluding',
      info = `<i class="icon icon-info-circle muted" title="${countryList.list.join(', ')}"></i>`,
      key = ['P','F','G','G+','VG','VG+','NM or M-','M'],
      mediaEnabled = currentFilterState.filterMediaCondition,
      sleeveEnabled = currentFilterState.filterSleeveCondition;

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
        filters = [`${media}`, `${sleeve}`, `${generic}`, `${noCover}`, countriesFilter(countryEnabled, countryList, currency)];

    return 'Filtering item conditions below: ' + filters.filter(f => f !== '').join(', ');
  };
});


