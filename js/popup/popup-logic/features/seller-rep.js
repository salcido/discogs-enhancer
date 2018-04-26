/**
 * Seller Reputation feature
 */

import { applySave, optionsToggle, setEnabledStatus } from '../utils';

export function init() {

  document.querySelector('.toggle-group.seller-rep').addEventListener('click', function () {
    optionsToggle('.hide-percentage', this, '.seller-rep', 200);
  });

  // Swatches
  [...document.querySelectorAll('.rep-color')].forEach(swatch => {
    swatch.addEventListener('click', event => {
      selectSwatch(event);
    });
  });
}
/**
 * Saves the sellerRep percentage
 * @method saveSellerRep
 * @return {undefined}
 */
export function saveSellerRep() {

  let
      input = document.getElementById('percent'),
      repValue = document.getElementsByClassName('rep-value')[0],
      self = document.querySelector('.seller-rep .status'),
      tag,
      toggle = document.getElementById('toggleSellerRep');

  // enabled -and- has value entered
  if ( input.value && toggle.checked ) {

    input.disabled = true;
    toggle.disabled = false;
    input.classList.remove('alert');

    // reset value to '100' if user enters a greater value
    if ( input.value > 100 ) { input.value = 100; }

    localStorage.setItem('sellerRep', input.value);

    input.value = localStorage.getItem('sellerRep');

    // Displays percentage value like: - 80%
    repValue.innerHTML = `&#8209; ${input.value}%`;

    setEnabledStatus( self, 'Enabled' );
    applySave('refresh', event);

    if ( _gaq ) {

      tag = ` Seller Rep Percentage: ${input.value}`;

      _gaq.push(['_trackEvent', tag, 'Seller Reputation']);
    }

  } else if ( input.value && !toggle.checked ) {

    input.disabled = false;
    repValue.textContent = '';

    setEnabledStatus( self, 'Disabled' );
    applySave('refresh', event);

  } else if ( !input.value ) {

    toggle.checked = false;
    input.classList.add('alert');
  }
}

// ========================================================
// setSellerRep
// ========================================================
/**
 * Sets the value of the seller reputation input
 * when the popup is rendered
 * @method setSellerRep
 * @return {undefined}
 */
export function setSellerRep() {

  let input = document.getElementById('percent'),
      percent = localStorage.getItem('sellerRep') || null,
      lscolor = localStorage.getItem('sellerRepColor') || 'darkorange',
      color = lscolor.match(/\w/g).join(''),
      repValue = document.getElementsByClassName('rep-value')[0],
      self = document.querySelector('.seller-rep .status'),
      swatch = document.querySelector(`.rep-color.${color}`),
      toggle = document.getElementById('toggleSellerRep');

  if ( percent !== null ) { input.value = percent; }

  swatch.className += ' selected';

  chrome.storage.sync.get('prefs', function(result) {

    if ( result.prefs.sellerRep && percent !== null ) {

      input.disabled = true;
      // Displays percentage value like: - 80%
      repValue.innerHTML = `&#8209; ${input.value}%`;
      setEnabledStatus( self, 'Enabled' );
    }

    else if ( result.prefs.sellerRep && percent === null ) {

      toggle.checked = false;
      setEnabledStatus( self, 'Disabled' );

    } else {

      setEnabledStatus( self, 'Disabled' );
    }
  });
}

// ========================================================
// selectSwatch
// ========================================================
/**
 * Selects the swatch when clicked and sets the
 * value in localStorage.
 *
 * Each key in the `colorTable` object corresponds with a
 * CSS class. Swatch color values are determined by class
 * and then saved as their value from the `colorTable`
 * object.
 *
 * @method selectSwatch
 * @param  {object} event The event object
 * @return {string}
 */
function selectSwatch(event) {

  let classname,
      colorTable = {
                darkgoldenrod: 'darkgoldenrod',
                dimgray: 'dimgray',
                BF3A38: '#BF3A38',
                darkorange: 'darkorange',
                slategray: 'slategray',
                darkslategray: 'darkslategray',
                black: 'black'
              },
      swatch = event.target;

  // Remove .selected from className
  [...document.querySelectorAll('.rep-color')].forEach(el => {

    if ( el.classList.contains('selected') ) {

      el.classList.remove('selected');
    }
  });

  // Extract the class name for the `colorTable` value
  classname = swatch.className.split(' ')[1];

  localStorage.setItem('sellerRepColor', JSON.stringify(colorTable[classname]));

  applySave('refresh', event);

  return swatch.classList.add('selected');
}
