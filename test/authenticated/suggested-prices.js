const assert = require('assert');
const { openPopup } = require('../test');

// Render links
let render = async function(page) {
  // Setup/enable feature
  let popup = await openPopup(),
      featureID = '#togglePrices';

  await Promise.all([
    popup.select('#currency', 'USD'),
    popup.waitForSelector(`${featureID}`, { timeout: 10000 }),
    popup.waitForSelector(`${featureID} + label .onoffswitch-switch`),
    popup.waitForSelector(`${featureID}`),
  ]);

  await popup.$(`${featureID} + label .onoffswitch-switch`);

  let checkbox = await popup.$(`${featureID}`);

  await popup.$eval(`${featureID} + label .onoffswitch-switch`, elem => elem.click());
  console.log(`Clicked ${featureID}`);
  let checked = await(await checkbox.getProperty('checked')).jsonValue();
  console.log(`${featureID} is `, checked ? 'enabled' : 'disabled');
  popup.close();

  await Promise.all([
    page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=250&page=1', { waitUntil: 'networkidle2' }),
    page.waitFor('.de-price-link')
  ]);

  let priceLinks = await page.$eval('.de-price-link', elem => elem.classList.contains('de-price-link'));
  assert.equal(priceLinks, true, 'Price comparison links were not rendered');
};

// Show price on click
let showPrice = async function(page) {

  await page.click('.de-price-link')

  await Promise.all([
    page.waitFor(1000),
    page.waitFor('.de-suggested-price')
  ]);

  let didDisplayPrice = await page.$eval('.de-suggested-price', elem => elem.classList.contains('de-suggested-price'));
  assert.equal(didDisplayPrice, true, 'Suggested price was not displayed');
};

// Show prices on release page
let showReleasePrice = async function(page) {

  await Promise.all([
    page.goto('https://www.discogs.com/sell/release/2897713', { waitUntil: 'networkidle2' }),
    page.waitFor('.de-suggested-price')
  ]);

  let didDisplayPrice = await page.$eval('.de-suggested-price', elem => elem.classList.contains('de-suggested-price'));
  assert.equal(didDisplayPrice, true, 'Suggested price was not displayed');
};

module.exports = { render, showPrice, showReleasePrice };
