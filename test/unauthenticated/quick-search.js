const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
  await toggleFeature('#toggleQuickSearch');
  await Promise.all([
    page.goto('https://www.discogs.com/Lou-Karsh-Phantom-Structures/release/13705345', { waitUntil: 'networkidle2' }),
    page.waitFor('.de-one-click')
  ]);
  let hasQuickSearch = await page.$eval('.de-one-click', elem => elem.classList.contains('de-one-click'));
  assert.equal(hasQuickSearch, true, 'Quick Search span was not rendered');
};

module.exports = { test };
