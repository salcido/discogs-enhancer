/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */
// @TODO: Allow users to tweak the discriminator styles (superscript, selectable, opacity)
resourceLibrary.ready(() => {

  // ========================================================
  // Functions
  // ========================================================
  /**
   * Injects the CSS necessary for styling the
   * artist discriminators
   * @returns {undefined}
   */
  function injectCss(superscript = true, selectable = false, transparent = true) {

    let margin = superscript ? '0.1rem' : '0',
        style = document.createElement('style');

    selectable = selectable ? 'auto' : 'none';
    transparent = transparent ? '0.5' : '1';
    superscript = superscript ? '0.9rem' : '20px';

    style.type = 'text/css';
    style.id = 'discriminator';
    style.rel = 'stylesheet';
    style.textContent = `
      .de-discriminator {
        font-size: ${superscript};
        margin-left: ${margin};
        opacity: ${transparent};
        user-select: ${selectable};
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
        user-select: ${selectable};
      }
    `;

    document.head.append(style);
  }

  // ========================================================
  // DOM Setup
  // ========================================================
  let href = window.location.href,
      prefs = localStorage.getItem('discriminators') || { superscript: true, selectable: false, transparent: true },
      re = /(.+\s)(\(\d+\))$/gm,
      superscript,
      selectable,
      transparent,
      elemType;

  if ( prefs ) {
    // prefs = JSON.parse(prefs);
    superscript = prefs.superscript;
    selectable = prefs.selectable;
    transparent = prefs.transparent;
  }

  // else set discriminators in localstorage here

  elemType = superscript ? 'sup' : 'span';

  // Releases
  // ------------------------------------------------------
  if ( href.includes('/sell/item/')
       || href.includes('/release/')
       || href.includes('/master/') ) {

    injectCss(superscript, selectable, transparent);

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

    injectCss(superscript, selectable, transparent);

    document.querySelectorAll('.profile h1.hide_mobile').forEach(s => {

      let markup = `<span class="trim-me">$1</span><${elemType} class="de-artist-discriminator">$2</${elemType}>`;

      s.innerHTML = s.textContent.replace(re, markup);

      if ( superscript ) {
        document.querySelectorAll('.trim-me').forEach(t => { t.textContent = t.textContent.trim(); });
      }
    });
  }
});
