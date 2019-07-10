const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
  await toggleFeature('#toggleRatingPercent');

  await Promise.all([
    page.goto('https://www.discogs.com/Various-After-Hours-2/release/77602'),
    page.waitFor('body')
  ]);

  let hasPercentage = await page.$eval('.de-percentage', elem => elem.classList.contains('de-percentage'));

  assert.equal(hasPercentage, true, 'Rating Percentage was not displayed');
};

module.exports = { test };
