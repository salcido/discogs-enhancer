// setTimeout is used here to delay the loading of this code
// so that jQuery has had time to be loaded into the browser.
setTimeout(function() {

  /**
   * Gets the cursor position from an input element
   *
   * @return {object}
   */
  $.fn.getCursorPosition = function () {

    let el = $(this)[0],
        pos = 0;

    if ('selectionStart' in el) {

      pos = el.selectionStart;
    }

    return pos;
  };

  /**
   * Gets the selected text from an input/textarea
   *
   * @return   {string}
   */
  $.fn.getSelectedText = function() {

    let sSelectedText = '';

    if (window.getSelection) {

      let sTagName = this.get(0).tagName.toLowerCase();

      sSelectedText = ( sTagName == 'input' || sTagName == 'textarea'
                        ? this.val().substring (this.get(0).selectionStart, this.get(0).selectionEnd)
                        : document.getSelection().toString() );
    }

    return sSelectedText;
  };

  /**
   * Inserts the cursor at a specific location inside
   * a textarea
   *
   * @param    {string} start [The start position]
   * @param    {string} end   [The end position]
   * @return   {undefined}
   */
  $.fn.selectRange = function(start, end) {

    if (end === undefined) {

      end = start;
    }

    return this.each(function() {

      if ('selectionStart' in this) {

        this.selectionStart = start;
        this.selectionEnd = end;

      } else if (this.setSelectionRange) {

        this.setSelectionRange(start, end);
      }
    });
  };
}, 100);
