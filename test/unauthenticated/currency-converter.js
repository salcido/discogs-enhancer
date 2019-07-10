const assert = require('assert');

// Render
let render = async function(page) {
  await page.waitForSelector('.currency-converter', { timeout: 10000 });
  let converter = await page.$eval('.currency-converter', elem => elem.classList.contains('currency-converter'));
  assert.equal(converter, true, 'Currency converter was not rendered');
};

// Request
let request = async function(page) {
  await Promise.all([
    await page.waitFor('#ccInput'),
    await page.waitFor('#baseCurrency')
  ]);

  let gotRates;
  await page.select('#baseCurrency', 'AUD');
  await page.waitForResponse(response => {
    if ( response.request().url() === 'https://discogs-enhancer.com/rates?base=AUD' ) {
      gotRates = true;
      return gotRates;
    }
  });

  assert.equal(gotRates, true, 'Converter rates were not fetched');
};

// Convert
let convert = async function(page) {
  await Promise.all([
    await page.waitFor('#ccInput'),
    await page.waitFor('#ccOutput'),
    await page.waitFor('#baseCurrency')
  ]);
  await page.type('#ccInput', '4');
  let hasOutput = await page.$eval('#ccOutput', elem => elem.textContent !== '');
  assert.equal(hasOutput, true, 'Converter did not convert');
};

module.exports = { render, request, convert };
