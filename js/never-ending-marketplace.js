/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO call price comparison script on ajaxSuccess calls when never ending marketplace is in use
// TODO call block sellers on ajaxSuccess when never ending marketplace is in use
// TODO update GET to include any filters added by the user
// TODO add check for last page of results
// TODO add ability to call up page filters

$(document).ready(function() {

  let hasLoaded = false,
      href = window.location.href,
      pageNum = href.split('/sell/mywants?page=')[1] || 2;

  /**
   * Parses the page url
   *
   * @param    {string} url [current page URL]
   * @return   {string}
   */

  function parseURL(url) {

   if (url.indexOf('?') > -1) {

     url = url.split('?')[0];
   }

   if (url.indexOf('#') > -1) {

     url = url.split('#')[0];
   }

   return url;
  }

  /**
   * Detects whether an element is visible on the page
   *
   * @param    {Object}   elem [the element to detect]
   * @return   {Boolean}
   */

  function isOnScreen(elem) {

    let elemTop = elem.getBoundingClientRect().top,
        elemBottom = elem.getBoundingClientRect().bottom,
        isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);

    return isVisible;
  }

  // append preloader to bottom
  if (!$('#de-next').length) {

    let loaderMarkup = '<div style="width: 100%; text-align: center;" id="de-next">' +
                          '<div style="width: 100%; text-align: center;"> ' +
                            'Loading next page...' +
                          '</div>' +
                          resourceLibrary.css.preloader +
                       '</div>';

    $('#pjax_container').append(loaderMarkup);
  }

  // Hide standard means of page navigation
  $('.pagination').hide();

  // load next page on scroll
  $(document).on('scroll', window, function() {

    let but = document.getElementById('de-next');

    if (isOnScreen(but) && !hasLoaded) {

      hasLoaded = true;

      return getNextPage();
    }
  });

  // grab next set of items
  function getNextPage() {

    $.ajax({
      url: '/sell/mywants?page=' + (Number(pageNum) + 1),
      type: 'GET',
      success: function(res) {

        let markup = $(res).find('#pjax_container tbody').html(),
            pageIndicator = 'Page: ' + pageNum,
            currentPage = window.location.href;

        // Append page number to the DOM
        $('#pjax_container tbody:last-child').append('<p style="font-weight: bold;">' + pageIndicator + '</p>');

        // Append new items to the DOM
        $('#pjax_container tbody:last-child').append(markup);

        // Update URL to display current page of results
        window.location.href = parseURL(currentPage) + '#de-page:' + pageNum;

        pageNum++;

        hasLoaded = false;

        // apply Marketplace Highlights if necessary
        if (window.applyStyles) {

          window.applyStyles();
        }
      }
    });
  }
});
