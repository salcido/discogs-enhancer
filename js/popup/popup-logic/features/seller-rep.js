/**
 * Seller Reputation feature
 */

import { applySave, setEnabledStatus } from '../utils';

// ========================================================
// saveSellerRep
// ========================================================
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
    repValue.textContent = `\u2011 ${input.value}%`;

    setEnabledStatus( self, 'Enabled' );
    applySave('refresh', event);

    if (_gaq) {
      _gaq.push(['_trackEvent', ` Seller Rep Percentage: ${input.value}`, 'Seller Reputation']);
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
      color = localStorage.getItem('sellerRepColor') || 'orange',
      repValue = document.getElementsByClassName('rep-value')[0],
      self = document.querySelector('.seller-rep .status'),
      swatch = document.querySelector(`.rep-color.${color}`),
      toggle = document.getElementById('toggleSellerRep');

  if (percent !== null) { input.value = percent; }

  swatch.className += ' selected';

  chrome.storage.sync.get('prefs', function(result) {

    if (result.prefs.sellerRep && percent !== null) {

      input.disabled = true;
      // Displays percentage value like: - 80%
      repValue.textContent = `\u2011 ${input.value}%`;
      setEnabledStatus( self, 'Enabled' );
    }

    else if (result.prefs.sellerRep && percent === null) {

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
 * value in localStorage
 *
 * @method selectSwatch
 * @param  {object} event The event object
 * @return {string}
 */
export function selectSwatch(event) {

  let
      color,
      swatch = event.target;

  // Remove .selected from className
  [...document.querySelectorAll('.rep-color')].forEach(el => {

    if ( el.className.includes('selected') ) {

      let classes = el.className.split(' ');

      classes.length = 2;

      el.className = classes.join(' ');
    }
  });

  color = swatch.className.split(' ')[1];

  localStorage.setItem('sellerRepColor', color);

  return swatch.className += ' selected';
}
