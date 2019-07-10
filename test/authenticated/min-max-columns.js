const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
    await toggleFeature('#toggleMinMaxColumns');

    await Promise.all([
      page.goto(`https://www.discogs.com/user/${process.env.USERNAME}/collection`, { waitUntil: 'networkidle2' }),
      page.waitFor('td[data-header="Max"')
    ]);

    let maxHidden = await page.$eval('td[data-header="Max"', elem => elem.clientHeight === 0);
    assert.equal(maxHidden, true, 'Max Columns were not hidden');

    let medHidden = await page.$eval('td[data-header="Med"', elem => elem.clientHeight === 0);
    assert.equal(medHidden, true, 'Med Columns were not hidden');

    let minHidden = await page.$eval('td[data-header="Min"', elem => elem.clientHeight === 0);
    assert.equal(minHidden, true, 'Min Columns were not hidden');
};

module.exports = { test };
