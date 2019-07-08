const assert = require('assert');
const { toggleFeature } = require('../test');

// Add Button to page
let addButton = async function(page) {
  await toggleFeature('#toggleReleaseScanner');
  await Promise.all([
    page.goto('https://www.discogs.com/artist/5269363-Trance-Wax', { waitUntil: 'networkidle2' }),
    page.waitFor('.de-scan-releases')
  ]);

  let hasScanButton = await page.$eval('.de-scan-releases', elem => elem.classList.contains('de-scan-releases'));
  assert.equal(hasScanButton, true, 'Scan Releases button was not appended');
};

// Scan releases
let scan = async function(page) {
  await page.waitFor('.de-scan-releases');
  await page.$eval('.de-scan-releases', elem => elem.click());
  let scanText = await page.$eval('.de-scan-releases', elem => elem.textContent == 'Scanning...');
  assert.equal(scanText, true, 'Button text was not updated when clicked');

  let isScanning;

  await page.waitForResponse(response => {
    if ( response.request().resourceType() !== undefined ) {
      isScanning = true;
      return isScanning;
    }
  });

  assert.equal(isScanning, true, 'Scan was unsuccessful');
};

module.exports = { addButton, scan };
