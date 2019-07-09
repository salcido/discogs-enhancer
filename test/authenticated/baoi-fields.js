const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
    await toggleFeature('#toggleBaoiFields');

    await Promise.all([
      page.goto('https://www.discogs.com/release/edit/950480', { waitUntil: 'networkidle2' }),
      page.waitFor('.clearfix_no_overflow')
    ]);

    let hasLargeFields = await page.$eval('td[data-ref-overview="barcode"] input', elem => elem.offsetWidth > 232);
    assert.equal(hasLargeFields, true, 'Large BAOI fields were not rendered');
};

module.exports = { test };
