const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
    await toggleFeature('#toggleCollectionNewTabs');

    await Promise.all([
      page.goto(`https://www.discogs.com/user/${process.env.USERNAME}/collection`, { waitUntil: 'networkidle2' }),
      page.waitFor('.release-table-card a'),
      page.waitFor('.FacetGroup a')
    ]);

    let release = await page.$eval('.release-table-card a', elem => elem.target === '_blank');
    assert.equal(release, true, 'Anchors were not modified');
};

module.exports = { test };
