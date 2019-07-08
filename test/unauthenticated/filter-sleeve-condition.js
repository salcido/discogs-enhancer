const assert = require('assert');
const { openPopup } = require('../test');

let test = async function(page) {

  let popup = await openPopup(),
      featureID = '#toggleFilterSleeveCondition';

  await Promise.all([
    popup.waitForSelector(`${featureID}`, { timeout: 10000 }),
    popup.waitForSelector(`${featureID} + label .onoffswitch-switch`),
    popup.waitForSelector(`${featureID}`),
    popup.waitFor('#sleeveConditionValue')
  ]);

  await popup.select('#sleeveConditionValue', '7');
  await popup.close();

  await Promise.all([
    page.goto('https://www.discogs.com/seller/letitberarities/profile'),
    page.waitFor('.de-hide-sleeve')
  ]);

  let hasHiddenSleeves = await page.$eval('.de-hide-sleeve', elem => elem.classList.contains('de-hide-sleeve'));
  assert.equal(hasHiddenSleeves, true, 'Items were not hidden');
};

module.exports = { test };
