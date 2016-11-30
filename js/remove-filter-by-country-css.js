/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
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
