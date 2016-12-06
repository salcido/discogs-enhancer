/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO add buttons to list comments $('.textedit_content')

// TODO move appending functionality into a method so it can be called
// via reply links/events in comments, etc.

// TODO figure out why jQuery does not always get extended properly.

$(document).ready(function() {

  // this timeout insures that this code executes after
  // jquery has been extended so that calls to `getCursorPosition`
  // and `selectRange` will work correctly. Also, the comments field
  // doesn't seem to be part of the DOM even after the document onDOMContentLoaded
  // event has fired. So I'm waiting 1000ms before executing this block.
  setTimeout(function() {

    let t = document.getElementsByTagName('textarea'),
        hasTextarea = false;

    // see if any review boxes exist on the page
    if (t.length) {

      for (let i in t) {

        // reviews
        if (t[i].id === 'review') {
          hasTextarea = true;
        }

        // comments
        if (t[i].name === 'comment') {
          hasTextarea = true;
        }

        // new threads in groups/forums
        if (t[i].id === 'text') {
          hasTextarea = true;
        }

        // forum/group replies
        if ( t[i].className && t[i].className.indexOf('forum_reply') > -1 ) {
          hasTextarea = true;
        }
      }
    } else {

      return;
    }

    // inject markup if necessary
    if (hasTextarea && !!$.prototype.getCursorPosition && !!$.prototype.getSelectedText) {

      let selected = '',
          markup = '<div class="quick-menu">' +
                      '<button class="quick-button quick-link" title="Insert url">' +
                        '<i class="icon icon-chain"></i>' +
                      '</button>' +
                      '<button class="quick-button quick-bold" title="Insert bold code">B</button>' +
                      '<button class="quick-button quick-italic" title="Insert italic code">I</button>' +
                      '<button class="quick-button quick-strikethrough" title="Insert strikethrough code">S</button>' +
                      '<button class="quick-button quick-underline" title="Insert underline code">U</button>' +
                    '</div>';

      /**
      * Parses the URL passed into it and
      * returns the release/master/artist/forum
      * number.
      *
      * @param    {string} url [the URL passed into the function]
      * @return   {string} num [the parsed id number]
      */

      function parseURL(url) {

       let urlArr = url.split('/'),
           num = urlArr[urlArr.length - 1];

       if (num.indexOf('-') > -1) {
         num = num.split('-')[0];
       }

       if (num.indexOf('?') > -1) {
         num = num.split('?')[0];
       }

       return num;
      }

      // Inject buttons into DOM
      $(markup).insertAfter( $('textarea') );

      // maintain selected text
      $('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline').mousedown(function(event) {

        selected = $(this).parent().siblings('textarea').getSelectedText();
      });

      // bold and italic
      $('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline').click(function(event) {

        let
            textarea = $(this).parent().siblings('textarea'),
            syntax,
            position = textarea.getCursorPosition(),
            text = textarea.val();

        event.preventDefault();

        switch (true) {

          case $(this).hasClass('quick-bold'):

              syntax = selected ? '[b]' + selected + '[/b]' : '[b][/b]';
              break;

          case $(this).hasClass('quick-italic'):

              syntax = selected ? '[i]' + selected + '[/i]' : '[i][/i]';
              break;

          case $(this).hasClass('quick-strikethrough'):

              syntax = selected ? '[s]' + selected + '[/s]' : '[s][/s]';
              break;

          case $(this).hasClass('quick-underline'):

              syntax = selected ? '[u]' + selected + '[/u]' : '[u][/u]';
              break;
        }

        // insert appropriate tag syntax
        textarea.val( text.substr(0, position) + syntax + text.substr(position + selected.length) );

        // adjust cursor position to fit between bold/italic tags
        textarea.selectRange(position + 3);

        // set the focus
        textarea.focus().change();
      });

      // URLs
      $('.quick-button.quick-link').click(function(event) {

        let
            textarea = $(this).parent().siblings('textarea'),
            discogs = 'https://www.discogs.com',
            guideline = /(\d+\.+\d*)/g,
            link = window.prompt('Paste your link or guideline number (ie: 1.2.3) here:'),
            position = textarea.getCursorPosition(),
            syntax,
            text = textarea.val();

        event.preventDefault();

        switch (true) {

          // artists
          case link.indexOf('/artist/') > -1 && link.indexOf(discogs) > -1:

              let artist = parseURL(link);

              syntax = '[a' + artist + ']';
              break;

          // guidelines
          case guideline.test(link) && link.indexOf(discogs) === -1 && link.indexOf('http') === -1:

              syntax = '[g' + link + ']';
              break;

          // labels
          case link.indexOf('/label/') > -1 && link.indexOf(discogs) > -1:

              let label = parseURL(link);

              syntax = '[l' + label + ']';
              break;

          // masters
          case link.indexOf('/master/') > -1 && link.indexOf(discogs) > -1:

              let master = parseURL(link);

              syntax = '[m' + master + ']';
              break;

          // releases
          case link.indexOf('/release/')> -1 && link.indexOf(discogs) > -1:

              let release = parseURL(link);

              syntax = '[r' + release + ']';
              break;

          // topics
          case link.indexOf('/forum/thread/') > -1 && link.indexOf(discogs) > -1:

              let topic = parseURL(link);

              syntax = '[t=' + topic + ']';
              break;

          // user
          case link.indexOf('/user/') > -1 && link.indexOf(discogs) > -1:

              syntax = '[u=' + link.split('/')[link.split('/').length - 1] + ']';
              break;

          // non-discogs urls
          case link.indexOf('http') > -1:

              syntax = '[url=' + link + '][/url]';

              // insert appropriate tag syntax
              textarea.val( text.substr(0, position) + syntax + text.substr(position) );

              // adjust cursor position to fit between URL tags
              textarea.selectRange(position + (link.length + 6));

              // set the focus
              textarea.focus().change();

              return;

          default:
              // 'a link has no name...'
              alert('A valid link or guideline number was not recognized. \nPlease make sure links begin with http:// or https:// and guidelines are in an x.x.x format. \n\nYou can learn more about the requirements by clicking "About" from the Discogs Enhancer popup menu and reading the section called "Text Format Shortcuts".');

              return;
        }

        // insert appropriate tag syntax
        textarea.val( text.substr(0, position) + syntax + text.substr(position) );

        // adjust cursor position to end of the inserted tag
        textarea.selectRange(position + syntax.length);

        // set the focus
        textarea.focus().change();
      });
    }
  }, 1000);
});
