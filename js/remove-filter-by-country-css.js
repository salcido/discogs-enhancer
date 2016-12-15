/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

(function() {

  let id = 'filterByCountryCss',
      link = document.getElementById(id),
      styles = link.getAttribute('disabled');

  if (!styles) { link.setAttribute('disabled', true); }
}());
