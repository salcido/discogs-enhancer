const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
    await toggleFeature('#toggleAbsoluteDate');
    await page.waitFor(3000);
    let pageUrl = await page.url();
    await Promise.all([
      page.goto(pageUrl, { waitUntil: 'networkidle2' }),
      page.waitFor('.cw_block_timestamp')
    ]);

    let actualDate = await page.$eval('.cw_block_timestamp span', elem => elem.dataset.approx.includes('ago'));
    assert.equal(actualDate, true, 'Actual date markup was not rendered');
};

module.exports = { test };
