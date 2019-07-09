const assert = require('assert');
const { toggleFeature } = require('../test');

let append = async function(page) {
    await toggleFeature('#toggleRandomItem');
    await Promise.all([
      page.goto('https://www.discogs.com/my', { waitUntil: 'networkidle2' }),
      page.waitFor('.de-random-item')
    ]);
    let hasIcon = await page.$eval('.de-random-item', elem => elem.classList.contains('de-random-item'));
    assert.equal(hasIcon, true, 'Random Item Button was not appended to nav');
};

let random = async function(page) {
    await page.click('.de-random-item');
    let randomItem = false;
    await page.waitForResponse(response => {
      if ( response.request().url().includes('/collection') ) {
        randomItem = true;
        return randomItem;
      }
      assert.equal(randomItem, true, 'Random item was not fetched');
    });
};

module.exports = { append, random };
