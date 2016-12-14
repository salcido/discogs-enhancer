/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO fix list comments

// TODO figure out why jQuery does not always get extended properly.
// specifically on this: https://www.discogs.com/Aphex-Twin-Selected-Ambient-Works-Volume-II/release/3636

$(document).ready(function() {

  let
      selected = '',
      markup = '<div class="quick-menu" style="display: none;">' +
                  '<button class="quick-button quick-link" title="Insert url">' +
                    '<i class="icon icon-chain"></i>' +
                  '</button>' +
                  '<button class="quick-button quick-bold" title="Insert bold code">B</button>' +
                  '<button class="quick-button quick-italic" title="Insert italic code">I</button>' +
                  '<button class="quick-button quick-strikethrough" title="Insert strikethrough code">S</button>' +
                  '<button class="quick-button quick-underline" title="Insert underline code">U</button>' +
                '</div>';

  /**
   * Initiates the UI based functions
   *
   * @method initUI
   * @return {undefined}
   */

  function initUI() {

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

            let artist = resourceLibrary.parseURL(link);

            syntax = '[a' + artist + ']';
            break;

        // guidelines
        case guideline.test(link) && link.indexOf(discogs) === -1 && link.indexOf('http') === -1:

            syntax = '[g' + link + ']';
            break;

        // labels
        case link.indexOf('/label/') > -1 && link.indexOf(discogs) > -1:

            let label = resourceLibrary.parseURL(link);

            syntax = '[l' + label + ']';
            break;

        // masters
        case link.indexOf('/master/') > -1 && link.indexOf(discogs) > -1:

            let master = resourceLibrary.parseURL(link);

            syntax = '[m' + master + ']';
            break;

        // releases
        case link.indexOf('/release/')> -1 && link.indexOf(discogs) > -1:

            let release = resourceLibrary.parseURL(link);

            syntax = '[r' + release + ']';
            break;

        // topics
        case link.indexOf('/forum/thread/') > -1 && link.indexOf(discogs) > -1:

            let topic = resourceLibrary.parseURL(link);

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
            // a link has no name...
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

  // Inject shortcuts after a textarea
  $('body').on('click', 'textarea', function(event) {

    console.log(!!$.prototype.getCursorPosition && !!$.prototype.getSelectedText)

    if ( !$(event.target).next().hasClass('quick-menu') && !!$.prototype.getCursorPosition && !!$.prototype.getSelectedText ) {

      $(markup).insertAfter( $('textarea') ).fadeIn('fast');

      initUI();
    }
  });

  // replies
  $('body').on('click', '.review_action1, .review_action1-reply', function() {

    if ( !$('.form_field .quick-menu') && !!$.prototype.getCursorPosition && !!$.prototype.getSelectedText ) {

      $(markup).insertAfter( $('textarea') ).fadeIn('fast');

      initUI();
    }
  });

  // list comments
//   $('body').on('click', '.listitem_comment, .textedit_content', function(event) {
// console.log($(event.target).next())
//     if ( !$(event.target).next().hasClass('quick-menu') && !!$.prototype.getCursorPosition && !!$.prototype.getSelectedText ) {
//
//       $(markup).insertAfter( $('textarea') ).fadeIn('fast');
//
//       initUI();
//     }
//   });
});
