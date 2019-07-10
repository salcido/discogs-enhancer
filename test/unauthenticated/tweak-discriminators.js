const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
  await toggleFeature('#toggleTweakDiscrims');

  await Promise.all([
    page.goto('https://www.discogs.com/Digital-Assassins-DJEF-Skot-Vs-Mt-Vibes-Deep-Sound-Of-Underground-Los-Angeles/release/3931002'),
    page.waitFor('body')
  ]);

  let hasSpans = await page.$eval('.de-discriminator', elem => elem.classList.contains('de-discriminator'));

  assert.equal(hasSpans, true, 'Discriminators spans were not rendered');
};

module.exports = { test };
