/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO update filter marketplace option

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

      let kurtLoader = document.getElementById('de-next'),
          siteHeader = document.getElementById('site_header');

      if (kurtLoader && resourceLibrary.isOnScreen(kurtLoader) && !hasLoaded) {

        hasLoaded = true;

        return getNextPage();
      }

      // remove the page bar if at top of screen
      if (resourceLibrary.isOnScreen(siteHeader)) {

        if ($('.de-page-bar').length) {

          $('.de-page-bar').hide();
        }
      } else {

        if ($('.de-page-bar').length && $('.de-page-bar').is(':hidden')) {

          $('.de-page-bar').show();
        }
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
              page = 'Page: ' + pageNum;

          if (markup) {

            let nextSetIndicator = '<tr class="shortcut_navigable">' +
                                      '<td class="item_description">' +
                                         '<h2 style="font-weight: bold;">' + page + '</h2>' +
                                      '</td>' +
                                   '</tr>',

                barStyles = 'position: fixed; top:0; left: 0;' +
                            'width: 100%;' +
                            'height: 25px;' +
                            'text-align: center;' +
                            'background: #000 !important;' +
                            'padding-top: 5px;' +
                            'z-index: 1000;',

                titleStyles = 'position: absolute;' +
                              'top: 5px;' +
                              'color: gray !important;' +
                              'left: 10px;',

                filterUpdateLink = '<div class="de-page-bar" style="' + barStyles + '">' +
                                      '<h5 style="' + titleStyles + '">Everlasting Marketplace</h5>' +
                                      '<a href="#site_header">Add or remove filters</a>' +
                                   '</div>';

            // Append page number to the DOM
            $('#pjax_container tbody:last-child').append(nextSetIndicator);

            if ($('.de-page-bar').length) {

              $('.de-page-bar').remove();
            }

            $('body').append(filterUpdateLink);

            // Append new items to the DOM
            $('#pjax_container tbody:last-child').append(markup);

          } else {

            $('#de-next').remove();

            $('#pjax_container').append('<p style="font-weight: bold;">No more items for sale found</p>');
          }

          pageNum++;

          hasLoaded = false;

          // apply Marketplace Highlights if necessary
          if (window.applyStyles) {

            window.applyStyles();
          }

          // apply price comparisons if necessary
          if (window.injectPriceLinks) {

            window.injectPriceLinks();
          }

          // block sellers if necessary
          if (window.hideSellers) {

            window.hideSellers();
          }

          // filter marketplace items if necessary
          if (window.hideItems) {

            window.hideItems();
          }
        }
      });
    }
  }
});
