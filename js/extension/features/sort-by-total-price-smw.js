/**
 * @author: Jon Uleis (@MovingToTheSun)
 * Website: https://jonuleis.com/
 * Modified for Shop By Wants by Matt Salcido
 *
 */

 rl.ready(() => {

  rl.onSellItemComplete(({ req }) => {

    let url = new URLSearchParams(req.url),
        params = Object.fromEntries(url.entries()),
        ascending = params.sort === 'price' && params.sortOrder === 'ascending',
        descending = params.sort === 'price' && params.sortOrder === 'descending';

    function tableSort() {
      // continue only if we are sorting by price
      if (ascending || descending) {

        const container = document.querySelector('div.flex.h-auto.w-full.flex-col.items-center div.w-full');
        const rows = Array.from(container.children).filter(el => el.tagName.toLowerCase() === 'div');

        rows.sort((rowA, rowB) => {
          const priceA = getRowPrice(rowA);
          const priceB = getRowPrice(rowB);
          return ascending ? priceA - priceB : priceB - priceA;
        });
        // append back to table in new order
        rows.forEach((row) => row.parentNode.appendChild(row));
        // change title text
        let header = document.querySelector('.bg-brand-background02 .flex.place-content-end button.text-brand-textLink');

        if ( header.firstChild && header.firstChild.nodeType === Node.TEXT_NODE ) {
          header.firstChild.textContent = 'Total Price';
        }
      }
    }

    function getRowPrice(row) {
      // if there's no total price, get the original bold one
      const price = row.querySelector('.text-brand-textSecondary.flex.flex-col.items-end.text-sm .italic') || row.querySelector('.text-right .text-2xl');
      // if the item is unavailable and we're sorting by lowest, push to bottom
      const weight = row.querySelector('p.text-brand-textSecondary.flex.flex-col.text-sm.italic') || !ascending ? 9999999 : 0;
      // strip everything else out of the price text
      return parseFloat(price.textContent.replace(/[^0-9]/g, '')) + weight;
    }

    rl.waitForElement('.text-right .text-2xl').then(() => {
      // delayed so that other features using onSellItemComplete can run first - otherwise the newly sorted items will
      // be incorrectly hidden, tagged, etc...
      setTimeout(() => {
        tableSort();
      }, 100);
    });
  });
});
