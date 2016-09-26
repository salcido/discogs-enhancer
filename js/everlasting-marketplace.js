/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO call price comparison script on ajaxSuccess calls when everlasting marketplace is in use
// TODO call block sellers on ajaxSuccess when everlasting marketplace is in use

$(document).ready(function() {

  let hasLoaded = false,
      href = window.location.href,
      pageNum = href.split('/sell/mywants?page=')[1] || 2;

  if (href.indexOf('/sell/mywants') > -1) {

    /**
     * Parses the page url
     *
     * @param    {string} url [current page URL]
     * @return   {string}
     */

    function parseURL(url) {

      let params;

        if (url.indexOf('?') > -1) {

          let page = /page=/g;

          params = url.split('?')[1].split('&');

          params.forEach(function(param) {

            let target;

            if (param.match(page)) {

              target = params.indexOf(param);

              params.splice(target, 1);
            }
        });
     }

     return params && params.length ? '&' + params.join('&') : '';
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
    $('.pagination_page_links').hide();

    // Remove results total and replace with NEM indicator
    $('.pagination_total').html('Everlasting Marketplace');

    // load next page on scroll
    $(document).on('scroll', window, function() {

      let kurtLoader = document.getElementById('de-next');

      if (kurtLoader && resourceLibrary.isOnScreen(kurtLoader) && !hasLoaded) {

        hasLoaded = true;

        return getNextPage();
      }
    });

    // grab next set of items
    function getNextPage() {

      let currentPage = window.location.href;

      $.ajax({
        url: '/sell/mywants?page=' + (Number(pageNum)) + parseURL(currentPage),
        type: 'GET',
        success: function(res) {

          let markup = $(res).find('#pjax_container tbody').html(),
              pageIndicator = 'Page: ' + pageNum;

          if (markup) {

            let nextSetIndicator = '<tr class="shortcut_navigable">' +
                                   '<td></td>' +
                                   '<td class="item_description">' +
                                      '<h2 style="font-weight: bold;">' + pageIndicator + '</h2>' +
                                      '<a href="#page_aside">Add or remove filters</a>' +
                                   '</td>' +
                                   '</tr>';

            // Append page number to the DOM
            $('#pjax_container tbody:last-child').append(nextSetIndicator);

            // Append new items to the DOM
            $('#pjax_container tbody:last-child').append(markup);

          } else {

            $('#de-next').remove();

            $('#pjax_container').append('<p style="font-weight: bold;">No items for sale found</p>');
          }

          pageNum++;

          hasLoaded = false;

          // apply Marketplace Highlights if necessary
          if (window.applyStyles) {

            window.applyStyles();
          }
        }
      });
    }
  }
});
