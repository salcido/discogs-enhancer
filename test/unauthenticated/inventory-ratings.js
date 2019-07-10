const assert = require('assert');
const { openPopup } = require('../test');

let test = async function(page) {

  let popup = await openPopup(),
      featureID = '#toggleInventoryRatings';

  await Promise.all([
    popup.waitForSelector(`${featureID}`, { timeout: 10000 }),
    popup.waitForSelector(`${featureID} + label .onoffswitch-switch`),
    popup.waitForSelector(`${featureID}`),
    popup.waitFor('#ratingsValue')
  ]);

  await popup.evaluate(() => { document.querySelector('#ratingsValue').value = 1.25; });
  await popup.$(`${featureID} + label .onoffswitch-switch`);
  await popup.$eval(`${featureID} + label .onoffswitch-switch`, elem => elem.click());

  await popup.close();

  await Promise.all([
    page.goto('https://www.discogs.com/seller/letitberarities/profile'),
    page.waitFor('.de-inventory-rating')
  ]);

  let hasRatingHighlights = await page.$eval('.de-inventory-rating', elem => elem.classList.contains('de-inventory-rating'));
  assert.equal(hasRatingHighlights, true, 'Inventory ratings were not rendered');
};

module.exports = { test };
