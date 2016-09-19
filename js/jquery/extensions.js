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

    } else if ('selection' in document) {

      el.focus();

      let Sel = document.selection.createRange(),
          SelLength = document.selection.createRange().text.length;

      Sel.moveStart('character', -el.value.length);

      pos = Sel.text.length - SelLength;
    }

    return pos;
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

      } else if (this.createTextRange) {

        let range = this.createTextRange();

        range.collapse(true);

        range.moveEnd('character', end);

        range.moveStart('character', start);

        range.select();
      }
    });
  };
}, 100);
