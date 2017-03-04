/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */
// @TODO
$(document).ready(function() {

  let
      hasLoaded = false,
      href = window.location.href,
      pagination,
      pageNum = 2,
      paused = false,
      loaderMarkup = '<div id="de-next" class="offers_box" >' +
                        '<div class="de-next-text"> ' +
                          'Loading next page...' +
                        '</div>' +
                        resourceLibrary.css.preloader +
                      '</div>';

  /**
   * Extracts the label info and any query params
   * from the href
   * @param {string} href
   * @return {undefined}
   */
  function extractLabelName(href) {

    href = href.split('/label/');

    if (href[1].includes('?')) {

      let label = href[1].split('?');

      return { label: label[0], params: '&' + resourceLibrary.removePageParam(href[1]) }
    }

    return { label: href[1], params: '' }
  }

  /**
   * Summons Kurt upon request
   * @method summonKurtLoader
   * @returns {undefined}
   */
  function summonKurtLoader() {

    if (!document.getElementById('de-next')) {

      $('#label_wrap .section_content').append(loaderMarkup);
    }
  }

  if (href.includes('/label/')) {

    let page = extractLabelName(href),
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
                          '<a href="#" id="de-update-filters">Top of page</a>' +
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

    // delete pagination related elements
    $('.pagination_total').remove();
    $('.pagination_page_links').remove();

    summonKurtLoader();

    // Scroll the browser up to the top so the user can change Marketplace filters
    $('body').on('click', '#de-update-filters', function(event) {

      event.preventDefault();

      $('body, html').animate({ scrollTop: 0 }, 300);
    });

    /**
     * Inject releases into DOM
     * @method getNextPage
     * @return {undefined}
     */
    function getNextPage() {

      let selectBox = $('.de-scroll-to-page');

      $.ajax({

        url: '/label/' + page.label + '?page=' + pageNum + page.params,
        type: 'GET',

        success: function(res) {

          let releases = $(res).find('.section_content table tbody'),
              nextSetIndicator = '<tr class="card r_tr main release shortcut_navigable" id="de-page-' + pageNum + '">' +
                                    '<td class = "status hide_mobile"></td>' +
                                    '<td class="catno_first"></td>' +
                                    '<td class="image"></td>' +
                                    '<td class="artist">' +
                                      '<h2 class="de-current-page">Page: ' + pageNum + '</h2>' +
                                    '</td>' +
                                    '<td class="title"></td>' +
                                    '<td class="label has_header"></td>' +
                                    '<td class="catno has_header"></td>' +
                                    '<td class="country has_header"></td>' +
                                    '<td class="year has_header"></td>' +
                                    '<td class="mr_checkbox hide_mobile"></td>' +
                                    '<td class="skittles"></td>' +
                                    '<td class="actions"></td>' +
                                    '<td class="sell_this_version"></td>' +
                                    '<td class="mr_toggler_mobile hide_desktop"></td>' +
                                  '</tr>';

            if (releases) {

              // clean up returned markup
              releases.find('tr.headings').remove();

              // remove kurtLoader
              $('#de-next').remove();

              // insert the page indicators into the response data
              releases.prepend(nextSetIndicator);

              // inject next set of results
              $(releases).appendTo('#label_wrap .section_content table:last-child');

              // Inject options into scroll-to-page select box
              selectBox.append( $('<option/>', { value: pageNum, text: 'Page: ' + pageNum }) );

              summonKurtLoader();
              pageNum++;
              hasLoaded = false;

            } else {

              $('#de-next').remove();

              $('#label_wrap .section_content').append('<h1 class="de-no-results">No more items for sale found</h1>');
            }
        },

        error: function() {

          $('#de-next').remove();
          $('#label_wrap .section_content').append('<h1 class="de-no-results">No more releases found.</h1>');
        }
      });
    }

    // draxx them sklounst
    $(document).on('scroll', window, function() {

      let kurtLoader = document.getElementById('de-next'),
          everlasting = $('.de-page-bar'),
          pageIndicator = document.getElementsByClassName('de-page')[0],
          siteHeader = document.getElementById('site_header');

      if (resourceLibrary.isOnScreen(kurtLoader) && !hasLoaded && !paused) {

        hasLoaded = true;
        return getNextPage();
      }

      // hide the page bar if at top of screen
      if (resourceLibrary.isOnScreen(siteHeader)) {

        everlasting.animate({ top: '-35px' });

        pageIndicator.textContent = 'Page: 1';

      } else {

        if (!resourceLibrary.isOnScreen(siteHeader) && everlasting.position().top < -30) {

          everlasting.animate({ top: '0px' });
        }
      }
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
  }
});
