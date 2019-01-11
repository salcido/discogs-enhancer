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
resourceLibrary.ready(() => {

  let currentFilterState = JSON.parse(localStorage.getItem('currentFilterState')),
      sleeveCondition = JSON.parse(localStorage.getItem('sleeveCondition')) || null;

  /**
   * Creates HTML that represents the Media and Sleeve filter settings to
   * display to the user in the Marketplace.
   * @param {Number} mediaLength  - The current length of the Media Condtion array
   * @param {Number} sleeveLength - The current length of the Sleeve Condition array
   * @returns {HTMLElement}
   */
  window.setFilterStateText = function setFilterStateText(mediaLength, sleeveLength) {
    let key = ['P','F','G','G+','VG','VG+','NM or M-','M'];
    let _class = ['poor','fair','good','good-plus','very-good','very-good-plus','near-mint','mint'];
    let mediaEnabled = currentFilterState.filterMediaCondition;
    let sleeveEnabled = currentFilterState.filterSleeveCondition;
    let media = mediaEnabled
              ? `Media: <span class="${_class[mediaLength]}">${key[mediaLength]}</span>`
              : '';
    let sleeve = sleeveEnabled
               ? `Sleeve: <span class="${_class[sleeveLength]}">${key[sleeveLength]}</span>`
               : '';
    let generic = sleeveEnabled && sleeveCondition && sleeveCondition.generic
                ? 'Generic'
                : '';
    let noCover = sleeveEnabled && sleeveCondition && sleeveCondition.noCover
                ? 'No Cover'
                : '';

    let filters = [`${media}`, `${sleeve}`, `${generic}`, `${noCover}`];
    return 'Filtering item conditions below: ' + filters.filter(f => f !== '').join(', ');
  };

  // ========================================================
  // CSS styles for filter status
  // ========================================================
  // Only append if using both condition filters
  // if ( currentFilterState.filterMediaCondition
  //      && currentFilterState.filterSleeveCondition ) {
  //   let script = document.createElement('style');
  //   script.type = 'text/css';
  //   script.textContent = `.de-filters {
  //                           line-height: 1.2;
  //                           font-size: 12px;
  //                           margin-top: 0.5rem;
  //                         }`;
  //   document.body.append(script);
  // }
});


