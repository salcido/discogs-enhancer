const assert = require('assert');

let test = async function(page) {
  await Promise.all([
    page.waitFor('.quick-button')
  ]);

  let hasShortcuts = await page.$eval('.quick-button', elem => elem.classList.contains('quick-button'));
  assert.equal(hasShortcuts, true, 'Text Format Shortcuts were not rendered');
};

module.exports = { test };
