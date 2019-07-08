const assert = require('assert');
const { toggleFeature, openPopup } = require('../test');

// Filter Items
let filter = async function(page) {

  let popup = await openPopup(),
      featureID = '#toggleFilterMediaCondition';

  await Promise.all([
    popup.select('#conditionValue', '7'),
    popup.waitForSelector(`${featureID}`, { timeout: 10000 }),
    popup.waitForSelector(`${featureID} + label .onoffswitch-switch`),
    popup.waitForSelector(`${featureID}`),
  ]);

  await popup.$(`${featureID} + label .onoffswitch-switch`);

  let checkbox = await popup.$(`${featureID}`);

  await popup.$eval(`${featureID} + label .onoffswitch-switch`, elem => elem.click());
  console.log(`Clicked ${featureID}`);
  let checked = await(await checkbox.getProperty('checked')).jsonValue();
  console.log(`${featureID} is `, checked ? 'enabled' : 'disabled');
  popup.close();

  await Promise.all([
    page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=250&page=1', { waitUntil: 'networkidle2' }),
    page.waitFor('.mint.bold')
  ]);

  let conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
  assert.equal(conditions, true, 'Items were not hidden based on condition');
};

// Filter Native Navigation
let filterNative = async function(page) {
  // disable EM
  await toggleFeature('#toggleEverlastingMarket');

  await Promise.all([
    page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=250&page=1', { waitUntil: 'networkidle2' }),
    page.waitFor('.mint.bold'),
    page.waitFor('.de-filter-stamp'),
    page.waitFor('a.pagination_next')
  ]);

  let conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
  assert.equal(conditions, true, 'Items were not hidden based on condition');

  await page.$eval('a.pagination_next', elem => elem.click());
  await page.waitFor(3000);
  conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
  assert.equal(conditions, true, 'Items were not hidden based on condition after using native navigation');
};

module.exports = { filter, filterNative };
