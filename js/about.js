/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// Inserts version and year into the about.html page
document.addEventListener('DOMContentLoaded', function () {

  function getVersionAndYear() {

    let
        d = new Date(),
        manifest = chrome.runtime.getManifest(),
        version = document.getElementById('version'),
        year = d.getFullYear(),
        yearSpan = document.getElementById('year');

    version.innerHTML = 'Version ' + manifest.version;

    yearSpan.innerHTML = year;
  }

  getVersionAndYear();
});
