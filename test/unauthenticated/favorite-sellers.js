const assert = require('assert');
const { toggleFeature, openConfig } = require('../test');

// Favorite sellers
let mark = async function(page) {
  await page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=50&page=1');

  await page.waitFor('.seller_info .seller_label + strong a');

  let sellerNames = await page.$$eval('.seller_info .seller_label + strong a', elems => {
    let sellerNames = [];
    elems.forEach(n => sellerNames.push(n.textContent));
    let uniqueNames = new Set(sellerNames);
    return [...uniqueNames];
  });

  let configPage = await openConfig('favorite-sellers');

  await configPage.type('.restore-input', JSON.stringify(sellerNames));
  await configPage.click('.restore .btn.btn-green');
  await configPage.close();

  await Promise.all([
    page.goto('https://www.discogs.com/sell/list'),
    page.waitFor('.de-favorite-seller')
  ]);

  let hasFavorites = await page.$eval('.de-favorite-seller', elem => elem.classList.contains('de-favorite-seller'));
  assert.equal(hasFavorites, true, 'Sellers were not marked as favorites');
};

// Mark sellers native pagination
let markNative = async function(page) {
  await toggleFeature('#toggleEverlastingMarket');
  await Promise.all([
    page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=25&page=1'),
    page.waitFor('a.pagination_next')
  ]);

  await page.$eval('a.pagination_next', elem => elem.click());

  await Promise.all([
    page.waitFor('.de-favorite-seller')
  ]);

  let hasBlocked = await page.$eval('.de-favorite-seller', elem => elem.classList.contains('de-favorite-seller'));
  assert.equal(hasBlocked, true, 'Sellers were not marked as favorites on next page click');
};

// Reset config
let reset = async function() {
  let configPage = await openConfig('favorite-sellers');
  await configPage.type('.restore-input', '[]');
  await configPage.click('.restore .btn.btn-green');
  await configPage.close();
};

module.exports = { mark, markNative, reset };
