/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let hasTextarea = false,
      int,
      selected = '';

  // ========================================================
  // Functions (Alphabetical)
  // ========================================================

  /**
   * Attaches event listeners to the B, I, S, U quick-link buttons
   *
   * @method attachButtonListeners
   * @return {undefined}
   */

  function attachButtonListeners() {

    $('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline').click(function(event) {

      let
          closer,
          opener,
          textarea = $(this).parent().siblings('textarea'),
          syntax,
          position = textarea.getCursorPosition(),
          text = textarea.val();

      event.preventDefault();

      if ( $(this).hasClass('quick-bold') ) {

        opener = '[b]';
        closer = '[/b]';

      } else if ( $(this).hasClass('quick-italic') ) {

        opener = '[i]';
        closer = '[/i]';

      } else if ( $(this).hasClass('quick-strikethrough') ) {

        opener = '[s]';
        closer = '[/s]';

      } else if ( $(this).hasClass('quick-underline') ) {

        opener = '[u]';
        closer = '[/u]';
      }

      // Either wrap the selected text with the markup or insert it by itself
      syntax = selected ? opener + selected + closer : opener + closer;

      // insert appropriate tag syntax
      textarea.val( text.substr(0, position) + syntax + text.substr(position + selected.length) );

      // adjust cursor position to fit between the tags
      textarea.selectRange( position + 3 );

      // set the focus
      textarea.focus().change();
    });
  }


  /**
   * Adds an event listener to the link `.quick-link` button
   *
   * @method attachLinkListener
   * @return {function|undefined}
   */

  function attachLinkListener() {

    $('.quick-button.quick-link').click(function(event) {

      let
          textarea = $(this).parent().siblings('textarea'),
          discogs = 'https://www.discogs.com',
          guideline = /(\d+\.+\d*)/g,
          link = window.prompt('Paste your link or guideline number (ie: 1.2.3) here:'),
          parsed = resourceLibrary.parseURL(link),
          position = textarea.getCursorPosition(),
          syntax,
          text = textarea.val();

      event.preventDefault();

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
        textarea.val( text.substr(0, position) + syntax + text.substr(position) );

        // adjust cursor position to fit between URL tags
        textarea.selectRange(position + (link.length + 6));

        // set the focus
        return textarea.focus().change();

      } else {

        let notRecognized = 'A valid link or guideline number was not recognized. \nPlease make sure links begin with http:// or https:// and guidelines are in an x.x.x format. \n\nYou can learn more about the requirements by clicking "About" from the Discogs Enhancer popup menu and reading the section called "Text Format Shortcuts".';

        // 'a link has no name...'
        return alert(notRecognized);
      }

      // insert appropriate tag syntax
      textarea.val( text.substr(0, position) + syntax + text.substr(position) );

      // adjust cursor position to end of the inserted tag
      textarea.selectRange( position + syntax.length );

      // set the focus
      textarea.focus().change();
    });
  }


  /**
  * Grabs the text selected by the user
  *
  * @method grabSelectedText
  * @return {undefined}
  */

  function grabSelectedText() {

    $('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline').mousedown(function(event) {

      selected = $(this).parent().siblings('textarea').getSelectedText();
    });
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
                      <i class="icon icon-chain"></i>
                    </button>
                    <button class="quick-button quick-bold" title="Insert bold code">B</button>
                    <button class="quick-button quick-italic" title="Insert italic code">I</button>
                    <button class="quick-button quick-strikethrough" title="Insert strikethrough code">S</button>
                    <button class="quick-button quick-underline" title="Insert underline code">U</button>
                  </div>`;

    // Inject buttons into DOM
    $(markup).insertAfter( $('textarea') );

    // maintain selected text
    grabSelectedText();

    // bold, italic, strikethrough and underline
    attachButtonListeners();

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


  // ========================================================
  // Init / DOM Setup
  // ========================================================

  // Check for `getCursorPosition` & `getSelectedText` in jQ prototype.
  // If they exist (ie: jQ has been successfully extended) call
  // `inspectTextareas`. Because the comments field doesn't seem to
  // be part of the DOM even after the document onDOMContentLoaded
  // event has fired, I am waiting a bit before calling `inspectTextareas`.
  int = setInterval(() => {

    if ( !!$.prototype.getCursorPosition && !!$.prototype.getSelectedText ) {

      clearInterval(int);

      setTimeout(inspectTextareas, 750);
    }
  }, 100);


  // ========================================================
  // UI functionality
  // ========================================================

  // insert shortcuts when replying to reviews
  $('.review_action1.review_action1-reply').click(() => {

    setTimeout(() => {

      insertShortcuts();

      // add eventlistener to cancel button once it
      // exists in the DOM.
      $('.reviews-cancel-event').click(() => {

        // if a user cancels out of a reply,
        // insert shortcuts on the main review textarea
        setTimeout(insertShortcuts, 500);
      });
    }, 500);
  });

  // insert shortcuts when editing list items
  $('.textedit_content').click(() => {

    setTimeout(() => {

      if ( !document.getElementsByClassName('quick-menu').length ) {

        insertShortcuts();
      }
    }, 500);
  });
});
