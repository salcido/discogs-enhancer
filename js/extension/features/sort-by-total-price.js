/**
 * @author: Jon Uleis (@MovingToTheSun)
 * Website: https://jonuleis.com/
 *
 */
rl.ready(() => {
  const priceSort = document.querySelector('.price_header .sortable_link_selected');
  const ascending = priceSort?.title.includes('ascending');

  function tableSort() {
    // continue only if we are sorting by price
    if (priceSort) {

      const rows = Array.from(document.querySelectorAll('tr[data-release-id]'));

      rows.sort((rowA, rowB) => {
        const priceA = getRowPrice(rowA);
        const priceB = getRowPrice(rowB);
        return ascending ? priceA - priceB : priceB - priceA;
      });
      // append back to table in new order
      rows.forEach((row) => row.parentNode.appendChild(row));
      // change title text
      let header = document.querySelector('.price_header .sortable_link_selected');
      header.querySelector('.link-text').innerText = 'Total Price';
    }
  }

  function getRowPrice(row) {
    // if there's no total price, get the original bold one
    const price = row.querySelector('.converted_price') || row.querySelector('.price');
    // if the item is unavailable and we're sorting by lowest, push to bottom
    const weight = row.querySelector('.item_add_to_cart .button') || !ascending ? 0 : 9999999;
    // strip everything else out of the price text
    return parseFloat(price.textContent.replace(/[^0-9]/g, '')) + weight;
  }

  const tableBlock = document.querySelector('.table_block');

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      // run function again if we're ajax loading in another table of items
      if (mutation.type === 'childList' && mutation.addedNodes.length && mutation.addedNodes[0].nodeName === 'TBODY') {
        tableSort();
      }
    }
  });

  if (rl.pageIs('myWants', 'sellMaster', 'sellRelease')) {
    observer.observe(tableBlock, { childList: true });
    // first run
    tableSort();
    rl.handlePaginationClicks(tableSort);
  }
});
