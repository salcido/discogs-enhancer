/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

 rl.ready(() => {

  if ( !rl.pageIsReact() ) return;
  // ========================================================
  // Functions
  // ========================================================
  /**
   * Creates the CSS necessary for styling the
   * artist discriminators
   * @prop {Boolean} hide - Show or hide the discriminator
   * @prop {Boolean} superscript - <sup> or <span> element
   * @prop {Boolean} unselectable - Whether the discriminator can be selected by the mouse
   * @prop {Boolean} transparent - Whether transparent or not
   * @returns {undefined}
   */
  function generateCss(hide, superscript, unselectable, transparent) {

    let margin = superscript ? '0.1rem' : '0';

    hide = hide ? 'none' : 'inherit';
    unselectable = unselectable ? 'none' : 'auto';
    transparent = transparent ? '0.5' : '1';
    superscript = superscript ? '0.9rem' : '20px';

    let rules = `
      .de-discriminator {
        display: ${hide};
        font-size: ${superscript};
        margin-left: ${margin};
        opacity: ${transparent};
        user-select: ${unselectable};
      }

      .de-artist-discriminator {
        font-size: ${superscript};
        margin-left: ${margin};
        opacity: ${transparent};
        user-select: ${unselectable};
      }
    `;

    rl.attachCss('discriminator', rules);
  }

  // ========================================================
  // DOM Setup
  // ========================================================
  let { discriminators } = rl.getPreference('featureData'),
      { hide, superscript, transparent, unselectable } = discriminators,
      elemType,
      re = /(.+\s)(\(\d+\))$/gm;

  elemType = superscript ? 'sup' : 'span';

  // Releases
  // ------------------------------------------------------
  if ( rl.pageIs('sellItem', 'release', 'master', 'buy') ) {

    generateCss(hide, superscript, unselectable, transparent);

    rl.waitForElement('div[class*="root_"] div[class*="content_"] h1[class*="title_"] span a').then(() => {

      document.querySelectorAll('div[class^="main_"] h1 a').forEach(s => {

        let markup = `<span class="trim-me">$1</span><${elemType} class="de-discriminator">$2</${elemType}>`;

        s.innerHTML = s.textContent.replace(re, markup);

        if ( superscript ) {
          document.querySelectorAll('.trim-me').forEach(t => { t.textContent = t.textContent.trim(); });
        }

      });
    });
  }

  // Artists / Labels
  // ------------------------------------------------------
  if ( rl.pageIs('artist', 'label') ) {

    generateCss(hide, superscript, unselectable, transparent);

    rl.waitForElement('[class*="main_"] h1[class*="title_"]').then(() => {

      document.querySelectorAll('[class*="main_"] h1[class*="title_"]').forEach(s => {

        let markup = `<span class="trim-me">$1</span><${elemType} class="de-artist-discriminator">$2</${elemType}>`;

        s.innerHTML = s.textContent.replace(re, markup);

        if ( superscript ) {
          document.querySelectorAll('.trim-me').forEach(t => { t.textContent = t.textContent.trim(); });
        }
      });
    });
  }
});
