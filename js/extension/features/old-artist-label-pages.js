/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * --------------------------------------------------------
 * Lets you search for the release on Google in a new tab
 * by clicking the release's title.
 * --------------------------------------------------------
 */

 rl.ready(() => {

  let oldpages = resourceLibrary.options.oldpages();

  function modifyArtistLabelLinks() {
    document.querySelectorAll('a').forEach(a => {
      if (a.href.includes('/artist/') && !a.href.includes('/artist//')) {
          a.href = a.href.replace('/artist/', '/artist//');
      }
          if (a.href.includes('/label/') && !a.href.includes('/label//')) {
          a.href = a.href.replace('/label/', '/label//');
      }
    });

    if (window.location.href.includes('/artist/') && !window.location.href.includes('/artist//')) {
      window.location.href = window.location.href.replace('/artist/', '/artist//');
    }

    if (window.location.href.includes('/label/') && !window.location.href.includes('/label//')) {
      window.location.href = window.location.href.replace('/label/', '/label//');
    }
  }

  document.querySelectorAll('button.mr_toggler').forEach(toggle => {
    toggle.addEventListener('click', () => {
        $(document).ajaxStop(() => {
          modifyArtistLabelLinks();
        });
    });
  });

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length && mutation.addedNodes[0].nodeName === 'LI') {
        modifyArtistLabelLinks();
      }
    }
  });

  if (oldpages) {
    modifyArtistLabelLinks();
    rl.handlePaginationClicks(modifyArtistLabelLinks);
    observer.observe(document.querySelector('[class*="_suggestions_"] ul'), { childList: true });
  }
});
