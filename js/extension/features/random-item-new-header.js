/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will append a small icon to the nav bar that
 * when clicked will show a random item from the user's
 * collection. The functionality is identical to the
 * Random Item feature in the collection page but
 * makes it accessable from the nav bar.
 */

 rl.ready(() => {

  let newHeader = document.querySelector('div[id*="__header"]');

  if (!newHeader) return;
  // ========================================================
  // Function
  // ========================================================
  /**
   * Stops the .random-item animation
   * @returns {undefined}
   */
  function stopAnimation() {
    document.querySelector('.de-random-item').classList.replace('rotate-out', 'rotate-in');
  }

  // ========================================================
  // CSS
  // ========================================================

  let rules = /*css*/`
      .de-random-item {
        cursor: pointer;
        font-size: 14px;
        color: white;
        list-style-type: none;
      }

      .de-random-item:hover {
        background: black;
      }

      .de-random-item svg {
        fill: #ffffff;
      }

      .de-random-item span,
      .de-random-item span i {
        pointer-events: none;
      }

      .de-random-item-tooltip {
        background: #000;
        border-radius: 4px;
        color: #fff;
        display: block;
        font-size: 16px;
        height: 18px;
        left: -56%;
        line-height: 18px;
        margin: auto;
        opacity: 0;
        padding: 0.5rem 1rem;
        pointer-events: none;
        position: absolute;
        text-align: center;
        top: 65px;
        transform: scale(.9);
        transition: opacity .2s,transform 1s;
        white-space: nowrap;
        width: auto;
      }

      .de-random-item-tooltip.visible {
        transition: opacity .35s, transform .3s;
        transform: scale(1);
        opacity: 1;
      }

      .de-random-item-tooltip::before {
        border-color: transparent transparent #000;
        border-style: solid;
        border-width: 0 5px 5px;
        content: "";
        height: 0;
        left: 50%;
        margin-left: -5px;
        position: absolute;
        top: -5px;
        width: 0;
      }

      .rotate-in {
        animation: rotateIn .1s ease-in;
      }

      .rotate-out {
        animation: rotateOut .2s infinite;
      }

      @keyframes rotateIn {
        from { transform: rotateX(90deg); }
        to { transform: rotateX(0deg); }
      }

      @keyframes rotateOut {
        0% { transform: rotateX(0deg); }
        50% { transform: rotateX(90deg); }
        100% { transform: rotateX(180deg); }
      }
      `;

  rl.attachCss('random-item', rules);

  // ========================================================
  // DOM Setup
  // ========================================================

  let releasePage = (rl.pageIs('master') || rl.pageIs('release') || rl.pageIs('artist') || rl.pageIs('label')),
      shouldRun = rl.pageIsNot('stats') && rl.pageIsNot('history') && rl.pageIsNot('edit'),
      paddingTop = releasePage && shouldRun ? '1.35rem;' : '1.5rem;',
      user = rl.username(),
      selector = 'nav[class^="_user_"]',
      position = 'afterbegin',
      inline_css = `padding-top: ${paddingTop} padding-right: 1.4rem; padding-left: 1.2rem;`,
      icon = `<div style="position: relative; ${inline_css}" class="de-random-item rotate-in">
                <a class="de-random-item rotate-in"
                  href="/user/${user}/collection/random"
                  arial-label="Random Item">
                  <span>
                  <svg width="20" height="17" alt="Random Item" viewBox="0 0 15 12" xmlns="http://www.w3.org/2000/svg"><path d="M14.9998 9.45703L11.85 12V10.3044H11.3198C9.64588 10.3044 8.41328 9.59801 7.39572 8.66267C7.78817 8.22752 8.14397 7.78952 8.47497 7.37975C8.55101 7.28523 8.62656 7.19195 8.70195 7.09867C9.45476 7.83191 10.2645 8.32656 11.32 8.32656H11.8502V6.9135L14.9998 9.45703V9.45703ZM0 3.80524H1.56967C2.56507 3.80524 3.34176 4.24592 4.05831 4.90998C4.17623 4.76739 4.29547 4.61885 4.41583 4.47054C4.70881 4.1072 5.01853 3.72463 5.35412 3.34308C4.36327 2.47094 3.16781 1.82692 1.56971 1.82692H0V3.80524V3.80524ZM11.85 0V1.68576H11.3198C8.54949 1.68576 6.9876 3.61988 5.60929 5.32689C4.36954 6.8596 3.29919 8.1851 1.56967 8.1851H0V10.1632H1.56967C4.34043 10.1632 5.90228 8.23008 7.28063 6.52348C8.51994 4.98893 9.59049 3.66362 11.3198 3.66362H11.85V5.08692L15 2.54316L11.85 0V0Z"/></svg>
                  </span>
                </a>
                <div class="de-random-item-tooltip">Random Item</div>
              </div>`;

  function addListeners() {
    // show the tooltip
    document.querySelector('.de-random-item').addEventListener('mouseover', () => {
      document.querySelector('.de-random-item-tooltip').classList.add('visible');
    });

    // hide the tooltip
    document.querySelector('.de-random-item').addEventListener('mouseout', () => {
      document.querySelector('.de-random-item-tooltip').classList.remove('visible');
    });

    document.querySelector('.de-random-item').addEventListener('click', event => {
      document.querySelector('.de-random-item-tooltip').style.visibility = 'hidden';
      document.querySelector('.de-random-item').style.background = 'transparent';

      // Call the random item endpoint if the user clicks the surrounding div instead
      if (event.target.classList.contains('de-random-item')) {
        window.location = `/user/${user}/collection/random`;
        document.querySelectorAll('.rotate-in').forEach(elem => elem.classList.replace('rotate-in', 'rotate-out'));
      }

      if (event.metaKey) {
        return setTimeout(() => stopAnimation(), 250);
      }
      return setTimeout(() => stopAnimation(), 4000);
    });
  }

  rl.waitForElement(selector + ' a').then(() => {
    setTimeout(() => {
      document.querySelector(selector).insertAdjacentHTML(position, icon);
      addListeners();
      return;
    }, 150);
  });
});
/**
// ========================================================
A fine white ash covered me. The great white light took me in.
I knew happiness, for a moment. I was going towards the eternal light
"but you come back". Yes it was my body,
it wasn't my time you see. The picture of a man was beside me
just before he slipped away he looked me in the eye he said
"Take the pictures" "Take the pictures"
We were going towards the eternal light
but I had to bring back the living pictures.
They saw it. The pictures saw it.
Light, white the colour. How could all these things be true?
If they hadn't, the living pictures saw it all...
My eyes will forget but they never will
never...
ever...
https://www.discogs.com/Microwave-Prince-Volume-3/release/32837
// ========================================================
*/
