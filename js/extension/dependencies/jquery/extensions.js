// Extend jQuery to include these methods for
// various Discogs Enhancer features. Currently, it's just
// used in text-format-shortcuts
let extensions = setInterval(function() {

  $.fn.extend({
    /**
     * Gets the cursor position from an input element
     *
     * @return {number}
     */
    getCursorPosition: function () {

      let el = $(this)[0],
          pos = 0;

      if ('selectionStart' in el) {

        pos = el.selectionStart;
      }

      return pos;
    },

    /**
     * Gets the selected text from an input/textarea
     *
     * @return   {string}
     */
    getSelectedText: function() {

      let sSelectedText = '';

      if (window.getSelection) {

        let sTagName = this.get(0).tagName.toLowerCase();

        sSelectedText = ( sTagName == 'input' || sTagName == 'textarea'
                          ? this.val().substring (this.get(0).selectionStart, this.get(0).selectionEnd)
                          : document.getSelection().toString() );
      }

      return sSelectedText;
    },

    /**
     * Inserts the cursor at a specific location inside
     * a textarea
     *
     * @param    {string} start [The start position]
     * @param    {string} end   [The end position]
     * @return   {method}
     */
    selectRange: function(start, end) {

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
    }
  });

  // jQuery just will not reliably extend and I'm not sure why. So, keep executing this
  // script until the prototype contains these new methods.
  if (!!$.prototype.getCursorPosition && !!$.prototype.getSelectedText) {
    clearInterval(extensions);
  }
}, 300);
