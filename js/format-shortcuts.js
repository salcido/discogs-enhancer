$(document).ready(function() {

  let t = document.getElementsByTagName('textarea'),
      hasReview = false;

  // see if any review boxes exist on the page
  if (t.length) {

    for (let i in t) {

      if (t[i].name === 'review') {

        hasReview = true;

        break;
      }

      if (t[i].className.indexOf('forum_reply') > -1) {

        hasReview = true;

        break;
      }
    }
  } else {

    return;
  }

  // inject markup if necessary
  if (hasReview) {

    let markup = '<div class="quick-menu">' +
                    '<a href="#"><div class="quick-button quick-bold">B</div></a>' +
                    '<a href="#"><div class="quick-button quick-italic">I</div></a>' +
                 '</div>';

    $(markup).insertAfter( $('textarea') );

    // bold and italic
    $('.quick-button.quick-bold, .quick-button.quick-italic').click(function(event) {

      event.preventDefault();

      let
          textarea = $(this).parent().parent().siblings('textarea'),
          boldSyntax = $(this).hasClass('quick-bold') ? '[b][/b]' : '[i][/i]',
          position = textarea.getCursorPosition(),
          text = textarea.val();

      // insert appropriate tag syntax
      textarea.val( text.substr(0, position) + boldSyntax + text.substr(position) );

      // adjust cursor position to fit between bold/italic tags
      textarea.selectRange(position + 3);

      // set the focus
      textarea.focus();
    });
  }
});
