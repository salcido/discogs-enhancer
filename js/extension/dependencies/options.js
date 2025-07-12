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

  let visible = false,
      loc = window.location.href,
      modal = `<div id="optionsModal" class="options-modal" style="display: none;">
                <div class="options-modal-content">
                  <span class="options-close">x</span>
                  <h3>Super Secret Options Menu</h3>
                  <ul class="options">
                    <li>
                      <input id="colorize" name="colorize" type="checkbox" value="colorize" />
                      <label for="colorize">Colorize Prices</label>
                    </li>
                    <li>
                      <input id="debug" name="debug" type="checkbox" value="debug" />
                      <label for="debug">Debug Messages</label>
                    </li>
                    <li>
                      <input id="comments" name="comments" type="checkbox" value="comments" />
                      <label for="comments">Highlight Comments</label>
                    </li>
                    <li>
                      <input id="unittests" name="unittests" type="checkbox" value="unittests" />
                      <label for="unittests">Unit Tests</label>
                    </li>
                    <li>
                      <input id="oldpages" name="oldpages" type="checkbox" value="oldpages" />
                      <label for="oldpages">Old Artist And Label Pages</label>
                    </li>
                    <li>
                      <label for="threshold" id="thresholdLabel">Threshold:</label>
                      <input id="threshold" name="threshold" type="number" value="" max="10" min="0"/>
                    </li>
                    <li>
                      <label for="quicksearch" id="quickSearchLabel">Quick Search:</label>
                      <input id="quicksearch" name="quicksearch" placeholder="Additional Keywords" />
                    </li>
                    <li>
                      <label for="itemsIWant" id="itemsIWantLabel">Items I Want:</label>
                      <input id="itemsIWant" name="itemsIWant" placeholder="URL Params"/>
                    </li>
                  </ul>
                  <a href="#" class="options-save button button-green" id="saveOptions">Save options &amp; refresh</a>
                </div>
              </div>`;

  // Keyboard Shortcut
  document.addEventListener('keyup', event => {

    let close = document.querySelector('.options-close'),
        modalElem = document.querySelector('.options-modal'),
        save = document.querySelector('.options-save');

    // Alt + Ctrl + 7
    if ( event.altKey && event.ctrlKey && event.which === 55 ) {

      if ( !visible ) {

        visible = true;
        modalElem.style = 'display:block;';
        resourceLibrary.options.getOptions();

        // Close it
        close.addEventListener('click', () => {

          modalElem.style = 'display: none;';
          visible = false;
        });

        // Save it
        save.addEventListener('click', () => resourceLibrary.options.saveOptions());
      }

      return false;
    }
  });

  // The options form screws with the checkbox count on the collection page
  // so I'm not appending it if a user is currently on the collection page.
  if ( !loc.includes('/collection') ) {

    document.body.insertAdjacentHTML('beforeend', modal);

    resourceLibrary.options.getOptions();
  }
});
