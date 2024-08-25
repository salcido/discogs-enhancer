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
      reactVersion = document.getElementById('app'),
      page = reactVersion ? document.getElementById('app') : document.getElementById('page');

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

  // TODO: Remove selectors that worked on old pages (Release, Lists, Labels, Artist, Collection)
  let { linksInTabs } = rl.getPreference('featureData'),
      // Artist
      artThumbs = '#artist .card .image a',
      artTitles = '#artist .card .title a',
      artLabels = '#artist .card .label a',
      artLists = '.de-artist #list a',
      artLinks = '.de-artist [class*="textWithCoversRow_"] td a[class*="link_"]',
      artMRToggles = '.de-artist [class*="versionsTextWithCoversRow_"] td a[class*="link_"]',
      // Collection
      colThumbs = '#collection .collection-image-wrapper a',
      colThumbsLg = '#collection .card_large a',
      colTitle = '#collection .release_list_table .collection-release-title-cell a',
      // colNew = '[class*="itemContainer_"] a',
      // Labels
      labThumbs = '#label .card .image a',
      labArtist = '#label .card .artist a',
      labTitle = '#label .card .title a',
      labLists = '.de-label #list a',
      labLinks = '.de-label [class*="textWithCoversRow_"] td a[class*="link_"]',
      labMRToggles = '.de-label [class*="versionsTextWithCoversRow_"] td a[class*="link_"]',
      // Lists
      listsOld = '#listitems .listitem_title.hide_mobile a, #listitems .marketplace_for_sale_count a',
      listsNew = '[class*="itemContainer_"] a',
      // Marketplace
      mpItems = '.item_description a.item_description_title',
      mpLabels = '.item_description .hide_mobile.label_and_cat a',
      mpReleases = '.item_description a.item_release_link.hide_mobile',
      mpSellers = '.shortcut_navigable .seller_info li strong a',
      mpThumbs = '.item_picture a',
      // Releases
      relCompanies = '#release-companies a',
      relVersions = '#release-other-versions a',
      relRecommends = '#release-recommendations ul[class*="cards_"] a',
      relLists = '.de-release #curated-lists a',
      relContribs = '#release-contributors a',
      relTracklist = '#release-tracklist tr a',
      relLastSold = '#release-stats ul li a[href*="/sell/history/"]',
      relOtherVers = '.de-release .title a, .de-release .label a',
      // Wantlist
      wantThumbs = '[class^="wantlist_"] .image a',
      wantTitles = '[class^="wantlist_"] .artist_title a',
      wantThumbsLg = '#wantlist .card a',
      //
      selectors = [],
      enabled = false;

  let sections = {
    artists: [artThumbs, artTitles, artLabels, artLists, artLinks, artMRToggles],
    collection: [colThumbs, colThumbsLg, colTitle],
    dashboard: '.module_blocks a',
    labels: [labThumbs, labArtist, labTitle, labLists, labLinks, labMRToggles],
    lists: [listsOld, listsNew],
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
    if (selectors.length) {
      document.querySelectorAll(selectors.join(',')).forEach(a => {
        a.setAttribute('target', '_blank');
      });
    }
  };

  // ========================================================
  // DOM Setup
  // ========================================================

  if ( linksInTabs ) {
    // Find any preferences set to true and compile
    // their respective selectors into an array
    for ( let p in linksInTabs ) {
      if ( linksInTabs[p] ) {
        enabled = true;
        selectors.push(sections[p]);
      }
    }

    if (enabled) {
      // Don't modify the header
      rl.waitForElement('header[class*="_header_"] a').then(() => {
        document.querySelector('a[class*="_button_"][class*="_home_"]').classList.add('de-ignore');
        document.querySelectorAll('header[class*="_header_"] a').forEach(a => a.classList.add('de-ignore'));
        window.modifyLinks();
      });

      rl.handlePaginationClicks(window.modifyLinks);

      // Modify links on MR toggle
      document.querySelectorAll('button.mr_toggler').forEach(toggle => {
        toggle.addEventListener('click', () => {
            $(document).ajaxStop(() => {
              window.modifyLinks();
            });
        });
      });
      // React MR toggles
      rl.waitForElement('[class*="versionsButton_"]').then(() => {
        setTimeout(() => {
          document.querySelectorAll('[class*="versionsButton_"]').forEach(toggle => {
            toggle.addEventListener('click', () => {
              rl.waitForElement('[class*="versionsTextWithCoversRow_"] [class*="title_"] a').then(() => {
                window.modifyLinks();
              });
            });
          });
        }, 200);
      });

      if ( rl.pageIs('master', 'release') ) {
        if (reactVersion) {
          rl.waitForElement('#release-actions').then(() => {
            document.querySelectorAll('#release-actions a').forEach(a => a.classList.add('de-ignore'));
          });

          // Guessing that recommendations are one of the last things to render on the page
          // Maybe there is a better way to tell when all requests have finished?
          rl.waitForElement('#release-recommendations ul li a').then(() => {
            window.modifyLinks();
          });
        }

        document.body.addEventListener('mouseover', (event) => {
          if ( event.target.tagName === 'A'
               && !event.target.className.startsWith('de-')
               && ![...event.target.classList].includes('de-ignore') ) {
            event.target.setAttribute('target', '_blank');
          }
        });
      }

      // Dashboard modules load async so wait for calls to finish
      if ( linksInTabs.dashboard && rl.pageIs('dashboard') ) {
        rl.waitForElement('ul.module_blocks li').then(() => {
          setTimeout(() => {
            $(document).ajaxStop(() => {
              window.modifyLinks();
            });
          }, 200);
        });
      }
      // New label page loads async so wait for calls to finish
      if ( linksInTabs.labels && rl.pageIs('label') ) {
        document.body.addEventListener('mouseover', (event) => {
          if (event.target.tagName === 'A' && ![...event.target.classList].includes('de-ignore') ) {
            event.target.setAttribute('target', '_blank');
          }
        });
      }
      // New artist page loads async so wait for calls to finish
      if ( linksInTabs.artists && rl.pageIs('artist') ) {
        document.body.addEventListener('mouseover', (event) => {
          if (event.target.tagName === 'A' && ![...event.target.classList].includes('de-ignore') ) {
            event.target.setAttribute('target', '_blank');
          }
        });
      }
      // New lists page loads async so wait for calls to finish
      if ( linksInTabs.lists && rl.pageIs('lists') ) {
        document.body.addEventListener('mouseover', (event) => {
          if (event.target.tagName === 'A' && ![...event.target.classList].includes('de-ignore')) {
            event.target.setAttribute('target', '_blank');
          }
        });
      }
      // New collection page loads async so wait for calls to finish
      if ( linksInTabs.collection && rl.pageIs('collection') ) {
        // Don't modify nav links at top of page
        // Old Collection
        document.querySelectorAll('#page_content [class*="tabs-wrap"] a').forEach(link => link.classList.add('de-ignore'));
        // New Collection
        rl.waitForElement('[class*="horizontalLinks_"]').then(() => {
          document.querySelectorAll('[class*="horizontalLinks_"] a').forEach(link => link.classList.add('de-ignore'));
        });
        // Don't modify random item
        rl.waitForElement('[class*="randomItem_"]').then(() => {
          document.querySelector('[class*="randomItem_"]').classList.add('de-ignore');
        });

        document.body.addEventListener('mouseover', (event) => {
          if ( event.target.tagName === 'A'
               && !event.target.className.startsWith('de-')
               && ![...event.target.classList].includes('de-ignore') ) {
            event.target.setAttribute('target', '_blank');
          }
        });
      }

    }
  }
});
