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
      reactVersion = document.querySelector('#app') || null,
      shouldRun = false;

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
       && rl.pageIsNot('reviews', 'videos', 'edit', 'stats', 'update') ) {
    // Match patterns:
    // Tissu - Unmanned Vehicle (Vinyl, UK, 2015) - Discogs
    // Tissu - Unmanned Vehicle (Vinyl, UK, 2015) For Sale | Discogs
    re = reactVersion
            ? /(?:.(?!\(.+\).+\- Discogs))+$/g
            : /(?:.(?!\(.+\).+\| Discogs))+$/g;
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
      query = document.title.replace(re, ''),
      releaseTitle = reactVersion
                     ? document.querySelector('#release-header h1')
                     : document.querySelector('#profile_title span');

  // DOM manipulation
  i.classList = 'icon icon-external-link de-external';

  if (reactVersion) {
    let regex = /(\– .+)+$/g,
    titleText = releaseTitle.innerHTML.match(regex);

    let newReleaseMarkup = releaseTitle.innerHTML.toString().replace(regex, `<span class="de-one-click">${titleText[0]}</span>`);

    releaseTitle.innerHTML = newReleaseMarkup;
    releaseTitle.insertAdjacentElement('beforeend', i);

    // Click handler
    document.querySelector('.de-one-click').addEventListener('click', () => {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(query) + additionalText);
    });

  } else {
    releaseTitle.nextElementSibling.classList = 'de-one-click';
    releaseTitle.nextElementSibling.insertAdjacentElement('afterend', i);
    releaseTitle.nextElementSibling.textContent = releaseTitle.nextElementSibling.textContent.trim();

    // Click handler
    releaseTitle.nextElementSibling.addEventListener('click', () => {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(query) + additionalText);
    });
  }

  rl.attachCss('quick-search', rules);
});
