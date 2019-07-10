const assert = require('assert');
// Search
let search = async function(page) {
  let searchElem = await page.$('#searchbox');
  assert.ok(searchElem, 'Search bar was not rendered');

  await page.type('#searchbox', 'cart');

  let showSellersInCart = await page.$eval('.show-sellers-in-cart', elem => !elem.closest('.toggle-group').classList.contains('hide'));

  let darkTheme = await page.$eval('.darkTheme', elem => elem.closest('.toggle-group').classList.contains('hide'));

  assert.equal(showSellersInCart, true, 'Error searching for Cart');
  assert.equal(darkTheme, true, 'Dark Theme option was not hidden');
  let clear = await page.$('.clear-search');
  await clear.click();
};

// Dark Theme
let darkTheme = async function(page) {
  await Promise.all([
    page.waitForSelector('#toggleDarkTheme', { timeout: 10000 }),
    page.waitForSelector('#toggleDarkTheme + label .onoffswitch-switch'),
    page.waitForSelector('#toggleDarkTheme')
  ]);

  let darkTheme = await page.$('.darkTheme');
  assert.ok(darkTheme, 'Dark Theme Feature was not rendered');

  await page.$('#toggleDarkTheme + label .onoffswitch-switch');
  let checkbox = await page.$('#toggleDarkTheme');
  let checked = await(await checkbox.getProperty('checked')).jsonValue();

  assert.equal(checked, false, 'Checkbox was already checked');

  await page.$eval('#toggleDarkTheme + label .onoffswitch-switch', elem => elem.click());

  checked = await(await checkbox.getProperty('checked')).jsonValue();
  assert.equal(checked, true, 'Could not enable Dark Theme');
};

module.exports = { search, darkTheme };
