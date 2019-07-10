const assert = require('assert');

let test = async function(page) {
  await Promise.all([
    await page.waitForSelector('.filter_currency .show_more_filters'),
    await page.$eval('.filter_currency .show_more_filters', elem => elem.click())
  ]);

  await page.waitForSelector('.hide_more_filters');

  let sortBtn = await page.$eval('#sortMpLists', elem => elem.classList.contains('button-blue'));

  assert.equal(sortBtn, true, 'Sort buttons were not rendered');
};

module.exports = { test };
