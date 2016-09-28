/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      hasLoaded = false,
      href = window.location.href,
      pageNum = 2,
      pagination = $('.pagination_total'),
      pTotal = pagination.html().split('of')[1],
      filterUpdateLink = '<div class="de-page-bar">' +
                            '<span class="de-page-info">' +
                              '<span class="de-page de-page-num">Page: 1</span>' +
                              '<span>' + pTotal + ' results</span>' +
                            '</span>' +
                            '<a href="#" id="de-update-filters">Add or remove filters</a>' +
                            '<div class="de-select-wrap">' +
                              '<span>Jump to: &nbsp;</span>' +
                              '<select class="de-jump-to-page">' +
                                '<option value="1">Page: 1</option>' +
                              '</select>' +
                            '</div>' +
                         '</div>';

  if (href.indexOf('/sell/mywants') > -1 || href.indexOf('/sell/list') > -1) {

    // Everlasting Marketplace add/remove filters bar
    $('body').append(filterUpdateLink);

    // append preloader to bottom
    if (!document.getElementById('de-next')) {

      let loaderMarkup = '<div id="de-next" class="offers_box" >' +
                            '<div class="de-next-text"> ' +
                              'Loading next page...' +
                            '</div>' +
                              resourceLibrary.css.preloader +
                         '</div>';

      $('#pjax_container').append(loaderMarkup);
    }

    // Hide standard means of page navigation
    $('.pagination_page_links').hide();

    // Remove results total and replace with NM indicator
    pagination.html('Everlasting Marketplace: ' + pTotal + ' results');

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

        pageIndicator.innerHTML = 'Page: 1';

      } else {

        if (!resourceLibrary.isOnScreen(siteHeader) && everlasting.position().top < -30) {

          everlasting.animate({top: '0px'});
        }
      }

      // This gnarly bit of code will display the currently viewed page
      // of results in the Everlasting Marketplace top bar
      if (currentPage && currentPage.length > 0) {

        for (let i = 0; i < pageNum; i++) {

          try {

            if (resourceLibrary.isOnScreen(currentPage[i])) {

              pageIndicator.innerHTML = currentPage[i].innerHTML;
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
        url: '/sell/' + type + '?page=' + (Number(pageNum)) + resourceLibrary.parseURL(href),
        type: 'GET',
        success: function(res) {

          let markup = $(res).find('#pjax_container tbody').html(),
              page = 'Page: ' + pageNum;

          if (markup) {

            let nextSetIndicator = '<tr class="shortcut_navigable">' +
                                      '<td class="item_description">' +
                                         '<h2 class="de-current-page" id="de-page-' + pageNum + '">' + page + '</h2>' +
                                      '</td>' +
                                   '</tr>';

            // Append page number to the DOM
            $('#pjax_container tbody:last-child').append(nextSetIndicator);

            // Append new items to the DOM
            $('#pjax_container tbody:last-child').append(markup);

            // Inject options into page jump select box
            selectBox.append( $('<option/>', { value: pageNum, text: 'Page: ' + pageNum }) );

          } else {

            $('#de-next').remove();

            $('#pjax_container').append('<p class="de-no-results">No more items for sale found</p>');
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
