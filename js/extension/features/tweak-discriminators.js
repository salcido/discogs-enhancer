/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {
// TODO: fix discriminator display when not rendered as superscript
  // ========================================================
  // Functions
  // ========================================================
  /**
   * Injects the CSS necessary for styling the
   * artist discriminators
   * @prop {Boolean} hide - Show or hide the discriminator
   * @prop {Boolean} superscript - <sup> or <span> element
   * @prop {Boolean} unselectable - Whether the discriminator can be selected by the mouse
   * @prop {Boolean} transparent - Whether transparent or not
   * @returns {undefined}
   */
  function injectCss(hide, superscript, unselectable, transparent) {

    let margin = superscript ? '0.1rem' : '0',
        style = document.createElement('style');

    hide = hide ? 'none' : 'inherit';
    unselectable = unselectable ? 'none' : 'auto';
    transparent = transparent ? '0.5' : '1';
    superscript = superscript ? '0.9rem' : '20px';

    style.type = 'text/css';
    style.id = 'discriminator';
    style.rel = 'stylesheet';
    style.textContent = `
      .de-discriminator {
        display: ${hide};
        font-size: ${superscript};
        margin-left: ${margin};
        opacity: ${transparent};
        user-select: ${unselectable};
      }
      /*
      a:hover > .de-discriminator {
        text-underline-position: under;
      }
      */
      .de-artist-discriminator {
        font-size: ${superscript};
        margin-left: ${margin};
        opacity: ${transparent};
        user-select: ${unselectable};
      }
    `;

    document.head.append(style);
  }

  // ========================================================
  // DOM Setup
  // ========================================================
  let href = window.location.href,
      prefs = localStorage.getItem('discriminators') || null,
      re = /(.+\s)(\(\d+\))$/gm,
      hide,
      superscript,
      unselectable,
      transparent,
      elemType;

  if ( prefs ) {
    prefs = JSON.parse(prefs);
  } else {
    prefs = {  hide: false, superscript: true, unselectable: true, transparent: true };
  }

  hide = prefs.hide;
  superscript = prefs.superscript;
  unselectable = prefs.unselectable;
  transparent = prefs.transparent;
  elemType = superscript ? 'sup' : 'span';

  // Releases
  // ------------------------------------------------------
  if ( href.includes('/sell/item/')
       || href.includes('/release/')
       || href.includes('/buy/')
       || href.includes('/master/') ) {

    injectCss(hide, superscript, unselectable, transparent);

    document.querySelectorAll('#profile_title span span a').forEach(s => {

      let markup = `<span class="trim-me">$1</span><${elemType} class="de-discriminator">$2</${elemType}>`;

      s.innerHTML = s.textContent.replace(re, markup);

      if ( superscript ) {
        document.querySelectorAll('.trim-me').forEach(t => { t.textContent = t.textContent.trim(); });
      }
    });
  }

  // Artists / Labels
  // ------------------------------------------------------
  if ( href.includes('/artist/') || href.includes('/label/') ) {

    injectCss(hide, superscript, unselectable, transparent);

    document.querySelectorAll('.profile h1.hide_mobile').forEach(s => {

      let markup = `<span class="trim-me">$1</span><${elemType} class="de-artist-discriminator">$2</${elemType}>`;

      s.innerHTML = s.textContent.replace(re, markup);

      if ( superscript ) {
        document.querySelectorAll('.trim-me').forEach(t => { t.textContent = t.textContent.trim(); });
      }
    });
  }
});
