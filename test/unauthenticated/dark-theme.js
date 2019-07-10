const assert = require('assert');

let test = async function(page) {
  await Promise.all([
    page.goto('https://www.discogs.com/sell/list'),
    page.waitFor('body')
  ]);

  await page.waitForSelector('.de-dark-theme', { timeout: 10000 });
  let hasDarkTheme = await page.$eval('.de-dark-theme', elem => elem.classList.contains('de-dark-theme'));
  assert.equal(hasDarkTheme, true, 'Dark Theme class was not found on documentElement');
};

module.exports = { test };
