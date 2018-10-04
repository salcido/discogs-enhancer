/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will inject text format shortcut buttons
 * to textarea elements within discogs that allow
 * the user to quickly insert URLs or stylize text
 * when leaving comments or notes.
 */

resourceLibrary.ready(() => {

  let hasTextarea = false,
      selected = '';

  // ========================================================
  // Functions (Alphabetical)
  // ========================================================

  /**
   * Attaches event listeners to the B, I, S, U quick-link buttons
   *
   * @method attachBISUlisteners
   * @return {undefined}
   */
  function attachBISUlisteners() {

    let buttons = document.querySelectorAll('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline');

    buttons.forEach(b => b.addEventListener('click', event => {

        let
            closer,
            opener,
            syntax,
            textarea = event.target.parentElement.parentElement.querySelector('textarea'),
            text = textarea.value,
            position = textarea.selectionStart || 0;

        event.preventDefault();

        if ( event.target.classList.contains('quick-bold') ) {
          opener = '[b]';
          closer = '[/b]';

        } else if ( event.target.classList.contains('quick-italic') ) {
          opener = '[i]';
          closer = '[/i]';

        } else if ( event.target.classList.contains('quick-strikethrough') ) {
          opener = '[s]';
          closer = '[/s]';

        } else if ( event.target.classList.contains('quick-underline') ) {
          opener = '[u]';
          closer = '[/u]';
        }

        // Either wrap the selected text with the markup or insert it by itself
        syntax = selected ? opener + selected + closer : opener + closer;
        // insert appropriate tag syntax
        textarea.value = ( text.substr(0, position) + syntax + text.substr(position + selected.length) );
        // adjust cursor position to fit between the tags
        selectRange( textarea, position + 3 );
        // set the focus
        textarea.focus();
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
      })
    );
  }

  /**
   * Adds an event listener to the link `.quick-link` button
   *
   * @method attachLinkListener
   * @return {method}
   */
  function attachLinkListener() {

    document.querySelector('.quick-button.quick-link').addEventListener('click', event => {

      event.preventDefault();

      return parseLink(event.target);
    });
  }

  /**
  * Maintains the text value selected by the user
  *
  * @method attachTextSelectionListeners
  * @return {undefined}
  */
  function attachTextSelectionListeners() {

    let textareaElement,
        buttons = document.querySelectorAll('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline');

    buttons.forEach(b => {

      b.addEventListener('mousedown', event => {

        textareaElement = event.target.parentElement.parentElement.querySelector('textarea');
        selected = getSelectedText(textareaElement);
      });
    });
  }

  /**
   * Gets the selected text from an input/textarea
   * @method getSelectedText
   * @param  {object} target The intput/textarea element
   * @return {string}
   */
  function getSelectedText(target) {

    let sSelectedText = '';

    if ( window.getSelection ) {

      let sTagName = target.tagName.toLowerCase();

      sSelectedText = ( sTagName === 'input' || sTagName === 'textarea'
                        ? target.value.substring (target.selectionStart, target.selectionEnd)
                        : document.getSelection().toString() );
    }

    return sSelectedText;
  }

  /**
   * Injects the shortcut markup and calls click
   * event listener functions to each respective
   * shortcut button.
   *
   * @method   insertShortcuts
   * @return   {undefined}
   */
  function insertShortcuts() {

    let markup = `<div class="quick-menu">
                    <button class="quick-button quick-link" title="Insert url">
                      <i class="icon icon-chain" style="pointer-events: none;"></i>
                    </button>
                    <button class="quick-button quick-bold" title="Insert bold code">B</button>
                    <button class="quick-button quick-italic" title="Insert italic code">I</button>
                    <button class="quick-button quick-strikethrough" title="Insert strikethrough code">S</button>
                    <button class="quick-button quick-underline" title="Insert underline code">U</button>
                  </div>`;

    // Inject buttons into DOM
    document.getElementsByTagName('textarea')[0].insertAdjacentHTML('afterend', markup);
    // bold, italic, strikethrough and underline
    attachBISUlisteners();
    attachTextSelectionListeners();
    // Links
    attachLinkListener();
  }

  /**
   * Iterate over all textarea elements and look for
   * specific ids/classes/names. If there is a match, call the
   * `insertShortcuts` function which will inject the shortcut markup
   *
   * @method   inspectTextareas
   * @return   {object|boolean}
   */
  function inspectTextareas() {

    let t = [...document.getElementsByTagName('textarea')];

    // see if any review boxes exist on the page
    if ( t.length ) {

      for ( let i in t ) {

        if (
             // reviews
             t[i].id === 'review' ||
             // new threads in groups/forums
             t[i].id === 'text' ||
             // comments
             t[i].name === 'comment' ||
             // forum/group replies
             t[i].className && t[i].className.includes('forum_reply') ) {

          hasTextarea = true;
        }
      }

      return hasTextarea ? insertShortcuts() : false;
    }
  }

  /**
   * Parses the text passed into the prompt
   *
   * @method   parseLink
   * @param    {object} target The target textarea element
   * @return   {method}
   */
  function parseLink(target) {

    let
        textarea = target.parentElement.parentElement.querySelector('textarea'),
        discogs = 'https://www.discogs.com',
        guideline = /(\d+\.+\d*)/g,
        link = window.prompt('Paste your link or guideline number (ie: 1.2.3) here:'),
        parsed = resourceLibrary.parseURL(link),
        position = textarea.selectionStart || 0,
        syntax,
        text = textarea.value;

    if ( parsed ) {

      if ( link.includes('/artist/') && link.includes(discogs) ) {
        // artists
        syntax = '[a' + parsed + ']';

      } else if ( guideline.test(link) && !link.includes(discogs) && !link.includes('http') ) {
        // guidelines
        syntax = '[g' + link + ']';

      } else if ( link.includes('/label/') && link.includes(discogs) ) {
        // labels
        syntax = '[l' + parsed + ']';

      } else if ( link.includes('/master/') && link.includes(discogs) ) {
        // masters
        syntax = '[m' + parsed + ']';

      } else if ( link.includes('/release/') && link.includes(discogs) ) {
        // releases
        syntax = '[r' + parsed + ']';

      } else if ( link.includes('/forum/thread/') && link.includes(discogs) ) {
        // topics
        syntax = '[t=' + parsed + ']';

      } else if ( link.includes('/user/') && link.includes(discogs) ) {
        // users
        syntax = '[u=' + link.split('/')[link.split('/').length - 1] + ']';

      } else if ( link.includes('http') ) {
        // urls
        syntax = '[url=' + link + '][/url]';
        // insert appropriate tag syntax
        textarea.value = text.substr(0, position) + syntax + text.substr(position);
        // adjust cursor position to fit between URL tags
        selectRange(textarea, (position + (link.length + 6)) );
        // set the focus
        textarea.focus();
        // return early
        return textarea.dispatchEvent(new Event('change', { bubbles: true }));

      } else {

        let notRecognized = 'A valid link or guideline number was not recognized. \nPlease make sure links begin with http:// or https:// and guidelines are in an x.x.x format. \n\nYou can learn more about the requirements by clicking "About" from the Discogs Enhancer popup menu and reading the section called "Text Format Shortcuts".';

        // 'a link has no name...'
        return alert(notRecognized);
      }

      // insert appropriate tag syntax
      textarea.value = text.substr(0, position) + syntax + text.substr(position);
      // adjust cursor position to end of the inserted tag
      selectRange( textarea, position + syntax.length );
      // set the focus
      textarea.focus();
      return textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * Inserts the cursor at a specific location inside
   * a textarea
   * @param    {object} target [The textarea element to inspect]
   * @param    {string} start [The start position]
   * @param    {string} end   [The end position]
   * @return   {object}
   */
  function selectRange(target, start, end) {

    if ( end === undefined ) { end = start; }

    if ( 'selectionStart' in target ) {

      target.selectionStart = start;
      target.selectionEnd = end;

    } else if ( target.setSelectionRange ) {

      target.setSelectionRange(start, end);
    }

    return target;
  }

  // ========================================================
  // Init / DOM Setup
  // ========================================================

  // Because the textareas on Discogs seem to load later than
  // other elements, we wait for the 'load' event to fire
  // before looking for textareas to attach our buttons to
  window.addEventListener('load', () => setTimeout(() => { inspectTextareas(); }, 100));

  // ========================================================
  // UI functionality
  // ========================================================
  try {
    // insert shortcuts when replying to reviews
    document.querySelector('.review_action1.review_action1-reply').addEventListener('click', () => {

      setTimeout(() => {
        insertShortcuts();
        // add eventlistener to cancel button once it
        // exists in the DOM.
        document.querySelector('.reviews-cancel-event').addEventListener('click', () => {
          // if a user cancels out of a reply,
          // insert shortcuts on the main review textarea
          setTimeout(insertShortcuts, 500);
        });
      }, 500);
    });

    // insert shortcuts when editing list items
    document.querySelector('.textedit_content').addEventListener('click', () => {

      setTimeout(() => {

        if ( !document.getElementsByClassName('quick-menu').length ) {
          insertShortcuts();
        }
      }, 500);
    });
  } catch(err) { /* Just catch the error */ }
});
