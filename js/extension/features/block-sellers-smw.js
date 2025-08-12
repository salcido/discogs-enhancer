/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ----------------------------------------------------------
 * Overview
 * ----------------------------------------------------------
 *
 * This feature will mark or hide specified users in the
 * Marketplace. The script is initiated with the code that
 * follows the `DOM manipulation` comment block.
 *
 */

 rl.ready(() => {

  if ( rl.pageIsNot('shopMyWants') ) return;

  rl.onSellItemComplete(({ response }) => {

    let { blockList } = rl.getPreference('featureData'),
        type;

    if ( blockList ) {
      switch ( blockList.hide ) {
        // Hide sellers in the Marketplace and on release sale pages
        // ---------------------------------------------------------------
        case 'global':
          type = 'hide';
          break;
        // Hide sellers in the Marketplace only (marked in red elsewhere)
        // ----------------------------------------------------------------
        case 'marketplace':
          type = 'hide';
          break;
        // Mark sellers in red everywhere
        // ----------------------------------------------------------------
        case 'tag':
          type = 'tag';
          break;
      }
    }

    rl.waitForElement('.border-brand-border01.flex.flex-col.border-solid').then(() => {

      let _class = type === 'hide' ? 'hidden-seller' : 'blocked-seller',
          sellerName = '.flex-row.justify-between.gap-4 ul.w-full.overflow-hidden li p a',
          itemsForSale = document.querySelectorAll('.border-brand-border01.flex.flex-col.border-solid');

      response.items.forEach((item, i) => {

        if ( blockList.list.includes(item.seller.name) ) {

          let icon = document.createElement('span');

          icon.className = 'de-blocked-seller-icon needs_delegated_tooltip';
          icon.dataset.placement = 'bottom';
          icon.rel = 'tooltip';
          icon.title = `${item.seller.name} is on your Blocked Seller list.`;

          itemsForSale[i].classList.add(_class);
          itemsForSale[i].querySelector(sellerName).insertAdjacentElement('beforeend', icon);
        }
      });
    });
  });
});
/**
// ========================================================
I am the wizard, the (hush) awkward hawk-eyed wizard
Whose melancholy state of stubborn shows him the hard place
Up close and conjures a lucid quandary
The dreamiest paranoia
Where's the rock, the rock, I wanna fix the rock
Talk it into being my pal
Better yet, my indolent solid-stood apprentice
But thanks, but no thanks but, there is no rock
https://www.discogs.com/master/view/58623
// ========================================================
 */
