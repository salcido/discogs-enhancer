const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
  await toggleFeature('#toggleRelativeSoldDate');

  await Promise.all([
    page.goto('https://www.discogs.com/Digital-Assassins-DJEF-Skot-Vs-Mt-Vibes-Deep-Sound-Of-Underground-Los-Angeles/release/3931002'),
    page.waitFor('body')
  ]);

  let relativeDate = await page.$eval('.de-last-sold', elem => elem.classList.contains('de-last-sold'));

  assert.equal(relativeDate, true, 'Last Sold Date was not rendered');
};

module.exports = { test };
