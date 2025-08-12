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
 * This feature will add a check mark icon to specified users
 * in the Marketplace. The script is initiated with the code
 * that follows the `DOM manipulation` comment block.
 *
 */

 rl.ready(() => {

  if ( rl.pageIsNot('shopMyWants') ) return;

  // ========================================================
  // CSS
  // ========================================================
  let rules = /*css*/`
      .de-favorite-seller {
        background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTQuNTkxIDYuNjM3bC0xLTEuMjI5YTEuNTA3IDEuNTA3IDAgMCAxLS4yOTUtLjcwM2wtLjE4Mi0xLjU3YTEuNCAxLjQgMCAwIDAtMS4yMjgtMS4yMjZsLTEuNTY4LS4xODJhMS4zOCAxLjM4IDAgMCAxLS43MjctLjI5NWwtMS4yMjgtMWExLjM2OSAxLjM2OSAwIDAgMC0xLjcyNiAwbC0xLjIyOSAxYy0uMjAzLjE1OS0uNDMuMjUtLjcwMy4yOTVsLTEuNTcuMTgyQTEuNCAxLjQgMCAwIDAgMS45MSAzLjEzN2wtLjE4MiAxLjU2N2ExLjM3NSAxLjM3NSAwIDAgMS0uMjk1LjcyOGwtMSAxLjIyN2ExLjM2OSAxLjM2OSAwIDAgMCAwIDEuNzI3bDEgMS4yMjhjLjE1OS4yMDQuMjUuNDMxLjI5NS43MDRsLjE4MiAxLjU2OWExLjQgMS40IDAgMCAwIDEuMjI4IDEuMjI3bDEuNTY3LjE4MmMuMjczLjAyMi41MjQuMTM2LjcyOC4yOTVsMS4yMjcgMWExLjM2OSAxLjM2OSAwIDAgMCAxLjcyNyAwbDEuMjI4LTFjLjIwNC0uMTYuNDMxLS4yNS43MDQtLjI5NWwxLjU2OS0uMTgyYTEuNCAxLjQgMCAwIDAgMS4yMjctMS4yMjhsLjE4Mi0xLjU2OGMuMDIyLS4yNzIuMTM2LS41MjMuMjk1LS43MjdsMS0xLjIyOGExLjQzMiAxLjQzMiAwIDAgMCAwLTEuNzI2eiIgZmlsbD0iIzAwQjREQiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik02LjExMyAxMS4yMDVMMi44ODcgNy45NzdsMS4zODYtMS4zODYgMS44NCAxLjg0IDQuNjEzLTQuNjEzIDEuMzg3IDEuNDMyeiIvPjwvZz48L3N2Zz4=);
        display: inline-block;
        height: 15px;
        width: 15px;
        margin-left: 3px;
        margin-top: 3px;
        vertical-align: top;
      }
      .de-favorite-seller + .tooltip {
        white-space: normal;
        opacity: 1;
      }
  `;

  rl.attachCss('favorite-sellers', rules);

  // ========================================================
  // DOM Manipulation
  // ========================================================
  rl.onSellItemComplete(({ response }) => {

    let { favoriteList } = rl.getPreference('featureData');

    rl.waitForElement('.border-brand-border01.flex.flex-col.border-solid').then(() => {

      let sellerName = '.flex-row.justify-between.gap-4 ul.w-full.overflow-hidden li p a',
          itemsForSale = document.querySelectorAll('.border-brand-border01.flex.flex-col.border-solid');

      response.items.forEach((item, i) => {

        if ( favoriteList
              && favoriteList.list
              && favoriteList.list.includes(item.seller.name) ) {

          let icon = document.createElement('span');

          icon.className = 'de-favorite-seller';
          icon.title = `${item.seller.name} is on your Favorite Sellers list.`;

          itemsForSale[i].classList.add('favorite-seller');
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
