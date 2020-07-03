/**
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

rl.ready(() => {

  let href = window.location.href,
      page = document.getElementById('page');

  // There are selectors that are common across multiple pages.
  // Add these classes so that there is no unintended
  // link modification.
  if ( href.match(/release/g) || href.match(/master/g) ) {
    page.classList.add('de-release');
  } else if (href.match(/artist/g)) {
    page.classList.add('de-artist');
  } else if (href.match(/label/g)) {
    page.classList.add('de-label');
  }

  let prefs = rl.getPreference('linksInTabs') || null,
      // Artist
      artThumbs = '#artist .card .image a',
      artTitles = '#artist .card .title a',
      artLabels = '#artist .card .label a',
      artLists = '.de-artist #list a',
      // Collection
      colThumbs = '#collection .collection-image-wrapper a',
      colThumbsLg = '#collection .card_large a',
      colTitle = '#collection .release_list_table .collection-release-title-cell a',
      // Labels
      labThumbs = '#label .card .image a',
      labArtist = '#label .card .artist a',
      labTitle = '#label .card .title a',
      labLists = '.de-label #list a',
      // Marketplace
      mpItems = '.item_description a.item_description_title',
      mpLabels = '.item_description .hide_mobile.label_and_cat a',
      mpReleases = '.item_description a.item_release_link.hide_mobile',
      mpSellers = '.shortcut_navigable .seller_info li strong a',
      mpThumbs = '.item_picture a',
      // Releases
      relCompanies = '#page .section.companies a',
      relVersions = '.de-release .card.release td a',
      relRecommends = '#recs_slider .cards a',
      relLists = '.de-release #list a',
      relContribs = '#page .section.contribs a',
      relTracklist = '#page .playlist tr a',
      relLastSold = '.last_sold a',
      relOtherVers = '.de-release .title a, .de-release .label a',
      // Wantlist
      wantThumbs = '[class^="wantlist_"] .image a',
      wantTitles = '[class^="wantlist_"] .artist_title a',
      wantThumbsLg = '#wantlist .card a',
      //
      selectors = [],
      enabled = false;

  let sections = {
    artists: [artThumbs, artTitles, artLabels, artLists],
    collection: [colThumbs, colThumbsLg, colTitle],
    dashboard: '.module_blocks a',
    labels: [labThumbs, labArtist, labTitle, labLists],
    lists: '#listitems .listitem_title.hide_mobile a, #listitems .marketplace_for_sale_count a',
    marketplace: [mpItems, mpReleases, mpLabels, mpSellers, mpThumbs],
    releases: [
      relOtherVers,
      relCompanies,
      relVersions,
      relRecommends,
      relLists,
      relContribs,
      relLastSold,
      relTracklist],
    wantlist: [wantThumbs, wantThumbsLg, wantTitles],
  };

  /**
   * Grabs all elements with user-chosen selectors and modifies them
   * to open in a new window.
   */
  window.modifyLinks = function modifyLinks() {
    document.querySelectorAll(selectors.join(',')).forEach(a => {
      a.setAttribute('target', '_blank');
    });
  };

  // ========================================================
  // DOM Setup
  // ========================================================

  if (prefs) {
    // Find any preferences set to true and compile
    // their respective selectors into an array
    for (let p in prefs) {
      if (prefs[p]) {
        enabled = true;
        selectors.push(sections[p]);
      }
    }

    if (enabled) {
      // Modify links on page load
      window.modifyLinks();
      rl.handlePaginationClicks(window.modifyLinks);

      // Modify links on MR toggle
      document.querySelectorAll('button.mr_toggler').forEach(toggle => {
        toggle.addEventListener('click', () => {
            $(document).ajaxStop(() => {
              window.modifyLinks();
            });
        });
      });

      // Dashboard modules load async so wait for calls to finish
      if (prefs.dashboard && rl.pageIs('dashboard')
       || rl.pageIs('master', 'release')) {
        setTimeout(() => {
          $(document).ajaxStop(() => {
            window.modifyLinks();
          });
        }, 200);
      }
    }
  }
});
