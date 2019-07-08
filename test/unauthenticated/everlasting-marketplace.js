const assert = require('assert');

let test = async function(page) {
  let pageStamp = await page.waitForSelector('.de-page-stamp');
  assert.ok(pageStamp, 'Everlasting Marketplace headers were not rendered');
};

module.exports = { test };
