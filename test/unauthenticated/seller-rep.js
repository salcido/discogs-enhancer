const assert = require('assert');
const { openPopup } = require('../test');

let test = async function(page) {

  let popup = await openPopup(),
      featureID = '#toggleSellerRep';

  await Promise.all([
    popup.waitForSelector(`${featureID}`, { timeout: 10000 }),
    popup.waitForSelector(`${featureID} + label .onoffswitch-switch`),
    popup.waitForSelector(`${featureID}`),
    popup.waitFor('#percent')
  ]);

  await popup.evaluate(() => { document.querySelector('#percent').value = 100; });
  await popup.$(`${featureID} + label .onoffswitch-switch`);
  await popup.$eval(`${featureID} + label .onoffswitch-switch`, elem => elem.click());

  await popup.close();

  await Promise.all([
    page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=250&page=1'),
    page.waitFor('.de-seller-rep-icon')
  ]);

  let hasIcons = await page.$eval('.de-seller-rep-icon', elem => elem.classList.contains('de-seller-rep-icon'));
  assert.equal(hasIcons, true, 'Seller Rep Icons were not rendered');
};

module.exports = { test };
