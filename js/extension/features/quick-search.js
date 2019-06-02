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

resourceLibrary.ready(() => {

  let href = window.location.href,
      shouldRun = false,
      title = document.title,
      re;

  // Master release pages
  // ------------------------------------------------------
  if ( href.includes('/master/') ) {
    re = /(\|+.*)/g;
    shouldRun = true;
  }

  // Individual release pages
  // ------------------------------------------------------
  if ( href.includes('/release/') ) {
    re = /(?:.(?!\(.+\).+\| Discogs))+$/g;
    shouldRun = true;
  }

  // Details pages
  // ------------------------------------------------------
  if ( href.includes('/sell/item/') ) {
    re = /(?:.(?!\:.+\| Discogs))+$/g;
    shouldRun = true;
  }

  if ( !shouldRun ) return;

  // ========================================================
  // DOM Setup
  // ========================================================
  let i = document.createElement('i'),
      releaseTitle = document.querySelector('#profile_title span'),
      style = document.createElement('style'),
      additionalText = localStorage.getItem('quicksearch') || '',
      query = title.replace(re, '');

  // DOM manipulation
  i.classList = 'icon icon-external-link de-external';
  releaseTitle.nextElementSibling.classList = 'de-one-click';
  releaseTitle.nextElementSibling.insertAdjacentElement('afterend', i);
  releaseTitle.nextElementSibling.textContent = releaseTitle.nextElementSibling.textContent.trim();

  // Handle click events
  releaseTitle.nextElementSibling.addEventListener('click', () => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(query) + additionalText);
  });

  // CSS
  style.type = 'text/css';
  style.id = 'one-click';
  style.rel = 'stylesheet';
  style.textContent = `
    .de-one-click {
      cursor: pointer;
    }
    .de-one-click:hover {
      text-decoration: underline;
    }
    .de-external {
      color: #03b;
      font-size: 1rem;
      margin-left: 0.5rem;
      opacity: 0;
      position: absolute;
    }
    .de-one-click:hover + .de-external {
      opacity: 1;
      text-decoration: none;
    }
  `;

  document.head.append(style);
});
