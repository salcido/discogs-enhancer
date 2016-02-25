// Inserts version and year into the about.html page

document.addEventListener('DOMContentLoaded', function () {

  function getVersionAndYear() {

    var
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
