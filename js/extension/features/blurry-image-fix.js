/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * Fixes blurry images in galleries on non-HD screens (e.g.: not 4k/Retina screens).
 * See this thread for more info:
 * https://www.discogs.com/forum/thread/759801?page=1#7536285
 */
resourceLibrary.ready(function() {

  let gallery = document.querySelector('.image_gallery.image_gallery_large'),
      hasListeners = false,
      href =  window.location.href;

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
    next.addEventListener('click', ()=> setTimeout(checkForZoom, 0));
    // Previous button
    prev.addEventListener('click', ()=> setTimeout(checkForZoom, 0));
    // Image slide
    slide.forEach(s => {
      s.addEventListener('click', ()=> setTimeout(checkForZoom, 0));
    });
    // Gallery thumbs
    thumb.forEach(t => {
      t.addEventListener('click', ()=> setTimeout(checkForZoom, 0));
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

    if ( isZoomed ) {

      let img = [...document.querySelectorAll('.image_gallery_slide img.loaded')];

      img.forEach(i => i.style.transform = 'translate(0, 0)');

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

    let img = [...document.querySelectorAll('.image_gallery_slide img.loaded')],
        calc = 'calc(-50% + 0.5px)';

    img.forEach(i => {

      let w = i.clientWidth,
          h = i.clientHeight;

      if ( w % 2 === 1 && h % 2 === 1 ) {
        i.style.transform = `translateX(${calc}) translateY(${calc})`;
      } else if ( w % 2 === 1 && h % 2 === 0 ) {
        i.style.transform = `translateX(${calc}) translateY(-50%)`;
      } else if ( w % 2 === 0 && h % 2 === 1 ) {
        i.style.transform = `translateX(-50%) translateY(${calc})`;
      } else {
        i.style.transform = 'translateX(-50%) translateY(-50%)';
      }
    });
  }

  // ========================================================
  // DOM setup
  // ========================================================

  if ( gallery ) {

    // Add initial event listener to gallery element.
    // Delaying a bit so that the UI elements that
    // this script hooks on to have time to be
    // rendered in the DOM
    gallery.addEventListener('click', ()=> {

      setTimeout(()=> {

        // Fix initial image that is loaded
        unblur();

        if ( !hasListeners ) {

          // add event listeners only once
          addUIListeners();
          hasListeners = true;
        }
      }, 300);
    });

    // Left and Right key presses
    document.addEventListener('keyup', event => {

      let code = event.keyCode || event.which;

      if ( code === 39 || code === 37 ) { checkForZoom(); }
    });

    // Check the url for `#images` for instances
    // when a user might follow a link that goes directly
    // to an image.
    if ( href.includes('#images') ) {

      let int = setInterval(()=> {
        // Check to make sure the image has been loaded
        // then wait a bit so that the gallery can animate
        // into position. Then call the unblur/ui methods.
        let img = document.querySelectorAll('#image_gallery_modal .image_gallery_slide_wrapper img.loaded');

        if ( img.length ) {

          clearInterval(int);

          setTimeout(() => {

            addUIListeners();
            unblur();
            hasListeners = true;
          }, 300);
        }
      }, 13);
    }
  }
});
