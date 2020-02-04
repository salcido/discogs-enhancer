const assert = require('assert');
const { toggleFeature, openConfig } = require('../test');

// Filter items
let filter = async function(page) {
  await toggleFeature('#toggleFilterShippingCountry');

  let configPage = await openConfig('filter-shipping-country');
  await configPage.waitFor('.country-input');
  await configPage.type('.restore-input', '["United States", "United Kingdom", "Japan", "Germany", "Australia"]');
  await configPage.click('.restore .btn.btn-green');
  await configPage.close();

  await Promise.all([
    page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=250&page=1'),
    page.waitFor('.de-page-stamp'),
    page.waitFor('.de-hide-country')
  ]);

  let hiddenCountry = await page.$eval('.de-hide-country', elem => elem.classList.contains('de-hide-country'));
  assert.equal(hiddenCountry, true, 'Country was not hidden');
};

// Filter Native Navigation
let filterNative = async function(page) {
  await toggleFeature('#toggleEverlastingMarket');

  await Promise.all([
    page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=250&page=1'),
    page.waitFor('.de-hide-country'),
    page.waitFor('a.pagination_next'),
    page.waitFor('.country-list-info')
  ]);

  let hiddenCountry = await page.$eval('.de-hide-country', elem => elem.classList.contains('de-hide-country'));
  assert.equal(hiddenCountry, true, 'Country was not hidden after toggling Everlasting Marketplace.');

  await page.$eval('a.pagination_next', elem => elem.click());
  hiddenCountry = await page.$eval('.de-hide-country', elem => elem.classList.contains('de-hide-country'));
  assert.equal(hiddenCountry, true, 'Country was not hidden on Next click.');
  // Re-enable for subsequent tests
  await toggleFeature('#toggleEverlastingMarket');
};

module.exports = { filter, filterNative };
