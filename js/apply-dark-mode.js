(function() {

  var id = 'darkModeCss',
      link = document.getElementById(id),
      styles = link.getAttribute('disabled');

  if (styles) { link.removeAttribute('disabled'); }
})();
