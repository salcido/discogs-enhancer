/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      hasLoaded = false,
      href = window.location.href,
      pageNum = 2,
      pagination,
      paused = false;

  if (href.indexOf('/sell/mywants') > -1 || href.indexOf('/sell/list') > -1) {

    let
        blockList = JSON.parse(localStorage.getItem('blockList')) || null,
        pTotal,
        filterUpdateLink,
        language = resourceLibrary.language();

    pagination = document.getElementsByClassName('pagination_total')[0].textContent;

    // This will grab the total number of results returned by discogs
    // depending on the language that the user has set
    switch (true) {

      // German
      case language === 'de':
        pTotal = pagination.split('von')[1];
        break;

      // Italian
      case language === 'it':
        pTotal = pagination.split('di')[1];
        break;

      // Spanish and French
      case language === 'es':
      case language === 'fr':
        pTotal = pagination.split('de')[1];
        break;

      // Japanese
      case language === 'ja':
        pTotal = pagination.split('中')[0];
        break;

      // English
      default:
        pTotal = pagination.split('of')[1];
        break;
    }

    filterUpdateLink = '<div class="de-page-bar">' +
                          '<span class="de-page-info">' +
                            '<span class="de-page de-page-num">Page: 1</span>' +
                            '<span>' + pTotal + ' results</span>' +
                          '</span>' +
                          '<a href="#" id="de-update-filters">Add or remove filters</a>' +
                          '<div class="de-select-wrap">' +
                            '<span>Scroll to: &nbsp;</span>' +
                            '<select class="de-scroll-to-page">' +
                              '<option value="" selected>Select</option>' +
                              '<option value="1">Page: 1</option>' +
                            '</select>' +
                            '<span class="de-pause">' +
                              '<i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>' +
                            '</span>' +
                          '</div>' +
                       '</div>';

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
    pagination.textContent = 'Everlasting Marketplace: ' + pTotal + ' results';

    // Scroll the browser up to the top so the user can change Marketplace filters
    $('body').on('click', '#de-update-filters', function(event) {

      event.preventDefault();

      $('body, html').animate({scrollTop: 0}, 300);
    });

    // grab next set of items
    function getNextPage() {

      let selectBox = $('.de-scroll-to-page'),
          type = href.indexOf('/sell/mywants') > -1 ? 'mywants' : 'list';

      $.ajax({
        url: '/sell/' + type + '?page=' + (Number(pageNum)) + resourceLibrary.removePageParam(href),
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

            // Inject options into scroll-to-page select box
            selectBox.append( $('<option/>', { value: pageNum, text: 'Page: ' + pageNum }) );

          } else {

            $('#de-next').remove();

            $('#pjax_container').append('<h1 class="de-no-results">No more items for sale found</h1>');
          }

          pageNum++;

          hasLoaded = false;

          // apply Marketplace Highlights
          if (window.applyStyles) {

            window.applyStyles();
          }

          // apply price comparisons
          if (window.injectPriceLinks) {

            window.injectPriceLinks();
          }

          // Hide/tag sellers in marketplace
          if (blockList && blockList.hide === 'global' && window.hideSellers ||
              blockList && blockList.hide === 'marketplace' && window.hideSellers) {

            window.hideSellers();
          }

          if (blockList && blockList.hide === 'tag' && window.tagSellers) {

            window.tagSellers();
          }

          // filter marketplace item by condition
          if (window.hideItems) {

            window.hideItems();
          }

          // Filter marketplace by country
          if (window.filterByCountry) {

            window.filterByCountry();
          }

          if (window.sellersRep) {

            window.sellersRep();
          }
        }
      });
    }

    // Pause/resume Everlasting Marketplace
    $('body').on('click', '.de-pause', function(event) {

      let target = event.target;

      // Paused
      if ( $(target).hasClass('icon-pause') ) {

        $(target).parent().html('<i class="icon icon-play" title="Resume Everlasting Marketplace"></i>');

        $('#de-next .icon-spinner').hide();

        $('.de-next-text').html('<p>Everlasting Marketplace is paused.</p> <p><a href="#" class="de-resume">Click here to resume loading results</a></p>');

        paused = true;

      // Resume
      } else {

        $(target).parent().html('<i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>');

        $('#de-next .icon-spinner').show();

        $('.de-next-text').text('Loading next page...');

        paused = false;
      }
    });

    // Resume loading shortcut
    $('body').on('click', '.de-resume', function(event) {

      event.preventDefault();

      $('.icon-play').parent().html('<i class="icon icon-pause" title="Pause Everlasting Marketplace"></i>');

      $('#de-next .icon-spinner').show();

      $('.de-next-text').text('Loading next page...');

      paused = false;

      return getNextPage();
    });

    // scroll to page section select box functionality
    $('.de-scroll-to-page').on('change', function(event) {

      let target = event.target,
          targetId = '#de-page-' + target.value;

      if (target.value) {

        if (target.value === '1') {

          $('body, html').animate( {scrollTop:$('#site_header').position().top}, 300 );

        } else {

          $('body, html').animate( {scrollTop:$(targetId).position().top}, 300 );
        }
      }
    });

    /**
     *
     * And we're scrolling....
     *
     */

    // draxx them sklounst
    $(document).on('scroll', window, function() {

      let
          everlasting = $('.de-page-bar'), // wrapped in jQ selector so it can use position() method
          kurtLoader = document.getElementById('de-next'),
          currentPage = document.getElementsByClassName('de-current-page'),
          pageIndicator = document.getElementsByClassName('de-page')[0],
          siteHeader = document.getElementById('site_header');

      if (resourceLibrary.isOnScreen(kurtLoader) && !hasLoaded && !paused) {

        hasLoaded = true;

        return getNextPage();
      }

      // hide the page bar if at top of screen
      if (resourceLibrary.isOnScreen(siteHeader)) {

        everlasting.animate({top: '-35px'});

        pageIndicator.textContent = 'Page: 1';

      } else {

        if (!resourceLibrary.isOnScreen(siteHeader) && everlasting.position().top < -30) {

          everlasting.animate({top: '0px'});
        }
      }

      // This gnarly bit of code will display the currently viewed page
      // of results in the Everlasting Marketplace top bar.
      // I feel bad for writing this and even worse now that
      // you're looking at it.
      if (currentPage && currentPage.length > 0) {

        for (let i = 0; i < pageNum; i++) {

          try {

            if (resourceLibrary.isOnScreen(currentPage[i])) {

              pageIndicator.textContent = currentPage[i].textContent;
            }
          } catch (e) {
            // I'm just here so I don't throw errors
          }
        }
      }
    });
  }
});
