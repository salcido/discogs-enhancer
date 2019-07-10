const assert = require('assert');
const { toggleFeature } = require('../test');

let render = async function(page) {
  await toggleFeature('#toggleRemoveFromWantlist');

  await Promise.all([
    page.goto('https://www.discogs.com/sell/mywants', { waitUntil: 'networkidle2' }),
    page.waitFor('.de-remove-wantlist')
  ]);

  let hasShortcuts = await page.$eval('.de-remove-wantlist', elem => elem.classList.contains('de-remove-wantlist'));
  assert.equal(hasShortcuts, true, 'Shortcuts were not rendered');
};

let prompt = async function(page) {

  await Promise.all([
    page.goto('https://www.discogs.com/sell/mywants', { waitUntil: 'networkidle2' }),
    page.waitFor('.de-remove-wantlist')
  ]);

  await page.$eval('.de-remove-wantlist', elem => elem.click());

  await Promise.all([
    page.waitFor(1000),
    page.waitFor('.de-remove-yes'),
    page.waitFor('.de-remove-no')
  ]);

  let hasPrompt = await page.$eval('.de-remove-yes', elem => elem.classList.contains('de-remove-yes'));
  assert.equal(hasPrompt, true, 'Prompt was not displayed');
};

module.exports = { render, prompt };
