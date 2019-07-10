const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
  await toggleFeature('#toggleReadability');

  await Promise.all([
    page.goto('https://www.discogs.com/Various-After-Hours-2/release/77602'),
    page.waitFor('body')
  ]);

  let hasSpacer = await page.$eval('.de-spacer', elem => elem.classList.contains('de-spacer'));

  assert.equal(hasSpacer, true, 'Readability dividers were not rendered');
};

module.exports = { test };
