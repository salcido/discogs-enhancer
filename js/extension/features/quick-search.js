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

  let additionalText = rl.options.quicksearch(),
      re,
      shouldRun = false,
      title = document.title;

  // Master release pages
  // ------------------------------------------------------
  if ( rl.pageIs('master') ) {
    // Match patterns:
    // Lofthouse | Releases, Reviews, Credits | Discogs
    re = /(\|+.*)/g;
    shouldRun = true;
  }

  // Individual release pages
  // ------------------------------------------------------
  if ( rl.pageIs('release')
       && rl.pageIsNot('reviews', 'videos', 'edit', 'stats') ) {
    // Match patterns:
    // Tissu - Unmanned Vehicle (Vinyl, UK, 2015) For Sale | Discogs
    re = /(?:.(?!\(.+\).+\| Discogs))+$/g;
    shouldRun = true;
  }

  // Details pages
  // ------------------------------------------------------
  if ( rl.pageIs('sellItem') ) {
    // Match patterns:
    // Tissu - Unmanned Vehicle: 12" For Sale | Discogs
    additionalText = ` ${additionalText}`;
    re = /(?:.(?!\:.+\| Discogs))+$/g;
    shouldRun = true;
  }

  if ( !shouldRun ) return;

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
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

  // ========================================================
  // DOM Setup
  // ========================================================
  let i = document.createElement('i'),
      query = title.replace(re, ''),
      releaseTitle = document.querySelector('#profile_title span');

  // DOM manipulation
  i.classList = 'icon icon-external-link de-external';
  releaseTitle.nextElementSibling.classList = 'de-one-click';
  releaseTitle.nextElementSibling.insertAdjacentElement('afterend', i);
  releaseTitle.nextElementSibling.textContent = releaseTitle.nextElementSibling.textContent.trim();

  // Handle click events
  releaseTitle.nextElementSibling.addEventListener('click', () => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(query) + additionalText);
  });

  rl.attachCss('quick-search', rules);
});
