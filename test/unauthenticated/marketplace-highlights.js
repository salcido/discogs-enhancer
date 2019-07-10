const assert = require('assert');

let test = async function(page) {
  await page.waitForSelector('.very-good-plus', { timeout: 10000 });
  let hasHighlight = await page.$eval('.very-good-plus', elem => elem.classList.contains('very-good-plus'));

  assert.equal(hasHighlight, true, 'Highlights were not found in the DOM');
};

module.exports = { test };
