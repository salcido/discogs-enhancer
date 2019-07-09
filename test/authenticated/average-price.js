const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
    await toggleFeature('#toggleAveragePrice');

    await Promise.all([
      page.goto('https://www.discogs.com/Sascha-Dive-The-Basic-Collective-EP-Part-1-Of-3/release/950480', { waitUntil: 'networkidle2' }),
      page.waitFor('.de-average-price')
    ]);

    let hasAverage = await page.$eval('.de-average-price', elem => elem.classList.contains('de-average-price'));
    assert.equal(hasAverage, true, 'Price average was not rendered');
};

module.exports = { test };
