/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO move `parseURL` to resourceLibrary

$(document).ready(function() {

  let
      hasLoaded = false,
      href = window.location.href,
      pageNum = 2,

      barStyles = 'position: fixed; top:-35px; left: 0;' +
                  'width: 100%;' +
                  'height: 25px;' +
                  'text-align: center;' +
                  'background: #000 !important;' +
                  'padding-top: 5px;' +
                  'z-index: 1000;',

      linkStyles = 'color: #809bbe !important;',

      titleStyles = 'position: absolute;' +
                    'top: 5px;' +
                    'color: lightgray !important;' +
                    'left: 10px;',

      selectWrap = 'position: absolute;' +
                     'top: 4px;' +
                     'right: 10px;',

      filterUpdateLink = '<div class="de-page-bar" style="' + barStyles + '">' +
                            '<h5 style="' + titleStyles + '">Everlasting Marketplace <span class="de-page">/ Page: 1</span></h5>' +
                            '<a href="#" id="de-update-filters" style="' + linkStyles + '">Add or remove filters</a>' +
                            '<div style="' + selectWrap + '">' +
                              '<span style="color: lightgray !important;">Jump to: &nbsp;</span>' +
                              '<select class="de-jump-to-page">' +
                                '<option value="1">Page: 1</option>' +
                              '</select>' +
                            '</div>' +
                         '</div>';

  if (href.indexOf('/sell/mywants') > -1 || href.indexOf('/sell/list') > -1) {

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

    // Everlasting Marketplace add/remove filters bar
    $('body').append(filterUpdateLink);

    // append preloader to bottom
    if (!document.getElementById('de-next')) {

      let
          loaderStyles = 'style="width: 100%; text-align: center; height: 150px; border-radius: 10px;"',

          textStyles = 'width: 100%; text-align: center; padding-top: 45px;',

          loaderMarkup = '<div ' + loaderStyles + 'id="de-next" class="offers_box" >' +
                            '<div style="' + textStyles + '"> ' +
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

    // Scroll the browser up to the top so the user can change Marketplace filters
    $('body').on('click', '#de-update-filters', function(event) {

      event.preventDefault();

      $('body').animate({scrollTop: 0}, 300);
    });

    // Jump to page select box functionality
    $('.de-jump-to-page').on('change', function(event) {

      let target = event.target,
          targetId = '#de-page-' + target.value;

      if (target.value === '1') {

        $('body').animate( {scrollTop:$('#site_header').position().top}, 300 );

      } else {

        $('body').animate( {scrollTop:$(targetId).position().top}, 300 );
      }
    });

    /**
     *
     * And we're scrolling....
     *
     */

    $(document).on('scroll', window, function() {

      let
          everlasting = $('.de-page-bar'), // wrapped in jQ selector so it can use position() method
          kurtLoader = document.getElementById('de-next'),
          currentPage = document.getElementsByClassName('de-current-page'),
          pageIndicator = document.getElementsByClassName('de-page')[0],
          siteHeader = document.getElementById('site_header');

      if (kurtLoader && resourceLibrary.isOnScreen(kurtLoader) && !hasLoaded) {

        hasLoaded = true;

        return getNextPage();
      }

      // hide the page bar if at top of screen
      if (resourceLibrary.isOnScreen(siteHeader)) {

        everlasting.animate({top: '-35px'});

        pageIndicator.innerHTML = '/ Page: 1';

      } else {

        if (everlasting && everlasting.position() && everlasting.position().top <= -10) {

          everlasting.animate({top: '0px'});
        }
      }

      // This gnarly bit of code will display the currently viewed page
      // of results in the Everlasting Marketplace top bar
      if (currentPage && currentPage.length > 0) {

        for (let i = 0; i < pageNum; i++) {

          try {

            if (resourceLibrary.isOnScreen(currentPage[i])) {

              pageIndicator.innerHTML = '/ ' + currentPage[i].innerHTML;
            }
          } catch (e) {
            // I'm just here so I don't throw errors
          }
        }
      }
    });

    // grab next set of items
    function getNextPage() {

      let selectBox = $('.de-jump-to-page'),
          type = href.indexOf('/sell/mywants') > -1 ? 'mywants' : 'list';

      $.ajax({
        url: '/sell/' + type + '?page=' + (Number(pageNum)) + parseURL(href),
        type: 'GET',
        success: function(res) {

          let markup = $(res).find('#pjax_container tbody').html(),
              page = 'Page: ' + pageNum;

          if (markup) {

            let nextSetIndicator = '<tr class="shortcut_navigable">' +
                                      '<td class="item_description">' +
                                         '<h2 style="font-weight: bold;" class="de-current-page" id="de-page-' + pageNum + '">' + page + '</h2>' +
                                      '</td>' +
                                   '</tr>';

            // Append page number to the DOM
            $('#pjax_container tbody:last-child').append(nextSetIndicator);

            // Append new items to the DOM
            $('#pjax_container tbody:last-child').append(markup);

            // Inject options into page jump select box
            selectBox.append($('<option/>', { value: pageNum, text: 'Page: ' + pageNum }));

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
