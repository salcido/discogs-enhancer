const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
  await toggleFeature('#toggleListsInTabs');
  await Promise.all([
    page.goto('https://www.discogs.com/lists/2019-Favorites/476255'),
    page.waitFor('.de-list-new-tabs')
  ]);

  let hasNewWindow = await page.$eval('.de-list-new-tabs', elem => elem.classList.contains('de-list-new-tabs'));
  assert.equal(hasNewWindow, true, 'List anchor elements are missing target attribute');
};

module.exports = { test };
