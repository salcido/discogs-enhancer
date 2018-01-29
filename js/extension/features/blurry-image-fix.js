/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * Fixes blurry images in galleries.
 * See this thread for more info:
 * https://www.discogs.com/forum/thread/759801?page=1#7536285
 */
$(document).ready(function(){

  let gallery = document.querySelector('.image_gallery.image_gallery_large');

  if (gallery) {

    // ========================================================
    // Functions
    // ========================================================

    /**
     * Attaches event listeners to UI elements to call unblur with
     * @method addUIListeners
     * @return {undefined}
     */
    function addUIListeners() {

      let next = document.querySelector('.image_gallery_nav.image_gallery_next'),
          prev = document.querySelector('.image_gallery_nav.image_gallery_prev'),
          slide = [...document.querySelectorAll('.image_gallery_slide img')],
          thumb = [...document.querySelectorAll('.image_gallery_thumb')];

      // Next button
      next.addEventListener('click', function() {
        setTimeout(()=> {
          checkForZoom();
        }, 0);
      });

      // Previous button
      prev.addEventListener('click', function() {
        setTimeout(()=> {
          checkForZoom();
        }, 0);
      });

      // Image slide
      slide.forEach(s => {
        s.addEventListener('click', function() {
          setTimeout(()=> {
            checkForZoom();
          }, 0);
        });
      });

      // Gallery thumbs
      thumb.forEach(t => {
        t.addEventListener('click', function() {
          setTimeout(()=> {
            checkForZoom();
          }, 0);
        });
      });
    }
    /**
     * Checks to see if the gallery image is zoomed. If it is, then the transform
     * property is reset so that the image remains centered. Otherwise, the image
     * is unblurred.
     *
     * @method checkForZoom
     * @return {undefined}
     */
    function checkForZoom() {

      let isZoomed = document.getElementById('image_gallery_modal').classList.contains('image_zoomed');

      if (isZoomed) {

        let i = [...document.querySelectorAll('.image_gallery_slide img.loaded')];

        i.forEach(img => img.style.transform = 'translate(0, 0)');

      } else {
        unblur();
      }
    }
    /**
     * Centers the images so that the blur from `transform` is remedied
     * @method unblur
     * @return {undefined}
     */
    function unblur() {

      let i = [...document.querySelectorAll('.image_gallery_slide img.loaded')];

      i.forEach(img => {

        let w = img.clientWidth,
            h = img.clientHeight;

        if ( w % 2 === 1 && h % 2 === 1 ) {
          img.style.transform = 'translateX(calc(-50% + 0.5px)) translateY(calc(-50% + 0.5px))';
        } else if ( w % 2 === 1 && h % 2 === 0 ) {
          img.style.transform = 'translateX(calc(-50% + 0.5px)) translateY(-50%)';
        } else if ( w % 2 === 0 && h % 2 === 1 ) {
          img.style.transform = 'translateX(-50%) translateY(calc(-50% + 0.5px))';
        }
      });
    }

    // ========================================================
    // DOM setup
    // ========================================================

    // Left and Right key presses
    document.addEventListener('keyup', function(event) {

      let code = event.keyCode || event.which;

      if ( code === 39 || code === 37 ) { checkForZoom(); }
    });

    // Add initial event listener to gallery element
    gallery.addEventListener('click', function() {

      setTimeout(()=> {
        unblur();
        addUIListeners();
      }, 200);
    });
  }
});
