const assert = require('assert');
const { toggleFeature } = require('../test');

// it should display an icon next to the seller's name
let test = async function(page) {
    await toggleFeature('#toggleSellerItemsInCart');
    await Promise.all([
      page.goto('https://www.discogs.com/sell/mywants?sort=condition%2Cdesc&limit=50', { waitUntil: 'networkidle2' }),
      page.waitFor('.button.button-green.cart_button')
    ]);

    await page.$eval('.button.button-green.cart_button', btn => btn.click());
    await page.waitFor(2000);

    await Promise.all([
      page.goto('https://www.discogs.com/sell/mywants?sort=condition%2Cdesc&limit=250', { waitUntil: 'networkidle2' }),
      page.waitFor('.de-items-in-cart')
    ]);

    let hasBadge = await page.$eval('.de-items-in-cart', elem => elem.classList.contains('de-items-in-cart'));
    assert.equal(hasBadge, true, 'Badge was not rendered to Seller name');
};

module.exports = { test };
