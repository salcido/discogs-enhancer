const puppeteer = require('puppeteer');
const assert = require('assert');

const username = process.argv[2];
const password = process.argv[3];
const url = 'https://www.discogs.com/sell/list';
const path = require('path').join(__dirname, './dist');
const config = {
  headless: false,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ignoreHTTPSErrors: true,
  args: [
    `--disable-extensions-except=${path}`,
    `--load-extension=${path}`,
  ]
};

let browser, page, id;

/**
 * Instantiates the extension in the browser.
 */
async function boot() {
  let popup = 'html/popup.html',
      extensionName = 'Discogs Enhancer';

  browser = await puppeteer.launch(config);
  let setupPage = await browser.newPage();
  await setupPage.setRequestInterception(true),
  await setupPage.waitFor(100);

  setupPage.on('request', interceptedRequest => {
    if (interceptedRequest.url().startsWith('https://www.google-analytics.com/')) {
      interceptedRequest.abort();
      console.log('\nBlocked Request:\n', interceptedRequest.url(), '\n');
    } else {
        interceptedRequest.continue();
    }
  });

  let targets = await browser.targets();
  let extensionTarget = targets.find(({ _targetInfo }) => {
      return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
  });
  let extensionUrl = extensionTarget._targetInfo.url || '';
  let [,, extensionID] = extensionUrl.split('/');
  id = extensionID;
  setupPage.close();
  page = await browser.newPage();

  await Promise.all([
    await page.goto(`chrome-extension://${extensionID}/${popup}`),
    await page.setRequestInterception(true),
    await page.evaluate(() => { localStorage.setItem('analytics', false); })
  ]);

  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().startsWith('https://www.google-analytics.com/')) {
      interceptedRequest.abort();
      console.log('\nBlocked Request:\n', interceptedRequest.url(), '\n');
    } else {
        interceptedRequest.continue();
    }
  });
}

/**
 * Opens the extension's popup in a new page
 * @returns {Object}
 */
async function openPopup() {
  let popup = await browser.newPage();
  await Promise.all([
    await popup.goto(`chrome-extension://${id}/html/popup.html`),
    await popup.setRequestInterception(true),
    await popup.setViewport({ width: 1280, height: 768 }),
    await popup.evaluate(() => { localStorage.setItem('analytics', false); })
  ]);
  popup.on('request', interceptedRequest => {
    if (interceptedRequest.url().startsWith('https://www.google-analytics.com/')) {
      interceptedRequest.abort();
      console.log('\nBlocked Request:\n', interceptedRequest.url(), '\n');
    } else {
        interceptedRequest.continue();
    }
  });
  return popup;
}

/**
 * Opens the specified config page
 * @returns {Object}
 */
async function openConfig(file) {
  let configPage = await browser.newPage();
  await Promise.all([
    await configPage.goto(`chrome-extension://${id}/html/${file}.html`),
    await configPage.setRequestInterception(true),
    await configPage.setViewport({ width: 1280, height: 768 }),
    await configPage.evaluate(() => { localStorage.setItem('analytics', false); })
  ]);
  configPage.on('request', interceptedRequest => {
    if (interceptedRequest.url().startsWith('https://www.google-analytics.com/')) {
      interceptedRequest.abort();
      console.log('\nBlocked Request:\n', interceptedRequest.url(), '\n');
    } else {
        interceptedRequest.continue();
    }
  });
  return configPage;
}

/**
 * Enables a feature in the popup menu
 * @param {String} featureID - The ID of the feature to enable
 * @param {String} helpBubble - The help bubble class
 * @returns {undefined}
 */
async function toggleFeature(featureID) {
  let popup = await openPopup();

  Promise.all([
    popup.waitForSelector(`${featureID}`, { timeout: 10000 }),
    popup.waitForSelector(`${featureID} + label .onoffswitch-switch`),
    popup.waitForSelector(`${featureID}`)
  ]);

  await popup.$(`${featureID} + label .onoffswitch-switch`);
  let checkbox = await popup.$(`${featureID}`);

  await popup.$eval(`${featureID} + label .onoffswitch-switch`, elem => elem.click());
  console.log(`Clicked ${featureID}`);
  let checked = await(await checkbox.getProperty('checked')).jsonValue();
  console.log(`${featureID} is `, checked ? 'enabled' : 'disabled');
  popup.close();
}

// ========================================================
// Functional Tests
// ========================================================

describe('Functional Testing', function() {
  this.timeout(20000);
  before(async function() { await boot(); });

  // Searching
  // ------------------------------------------------------
  describe('Search Features', async function() {
    it('should refine the features list', async function() {

      let searchElem = await page.$('#searchbox');
      assert.ok(searchElem, 'Search bar was not rendered');

      await page.type('#searchbox', 'cart');

      let showSellersInCart = await page.$eval('.show-sellers-in-cart', elem => !elem.closest('.toggle-group').classList.contains('hide'));

      let darkTheme = await page.$eval('.darkTheme', elem => elem.closest('.toggle-group').classList.contains('hide'));

      assert.equal(showSellersInCart, true, 'Error searching for Cart');
      assert.equal(darkTheme, true, 'Dark Theme option was not hidden');
      let clear = await page.$('.clear-search');
      clear.click();
    });
  });

  // Enable Dark Theme
  // ------------------------------------------------------
  describe('Enable Dark Theme', async function() {
    it('should enable the Dark Theme when checked', async function() {

      Promise.all([
        page.waitForSelector('#toggleDarkTheme', { timeout: 10000 }),
        page.waitForSelector('#toggleDarkTheme + label .onoffswitch-switch'),
        page.waitForSelector('#toggleDarkTheme')
      ]);

      let darkTheme = await page.$('.darkTheme');
      assert.ok(darkTheme, 'Dark Theme Feature was not rendered');

      await page.$('#toggleDarkTheme + label .onoffswitch-switch');
      let checkbox = await page.$('#toggleDarkTheme');
      let checked = await(await checkbox.getProperty('checked')).jsonValue();

      assert.equal(checked, false, 'Checkbox was already checked');

      await page.$eval('#toggleDarkTheme + label .onoffswitch-switch', elem => elem.click());

      checked = await(await checkbox.getProperty('checked')).jsonValue();
      assert.equal(checked, true, 'Could not enable Dark Theme');
    });
  });

  // Dark Theme
  // ------------------------------------------------------
  describe('Dark Theme', async function() {
    it('should apply the Dark Theme to Discogs.com', async function() {

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list'),
        page.waitFor('body')
      ]);

      await page.waitForSelector('.de-dark-theme', { timeout: 10000 });
      let hasDarkTheme = await page.$eval('.de-dark-theme', elem => elem.classList.contains('de-dark-theme'));
      assert.equal(hasDarkTheme, true, 'Dark Theme class was not found on documentElement');
    });
  });

  // Marketplace Hightlights
  // ------------------------------------------------------
  describe('Marketplace Highlights', async function() {
    it('should highlight media/sleeve conditions in the Marketplace', async function() {

      await page.waitForSelector('.very-good-plus', { timeout: 10000 });
      let hasHighlight = await page.$eval('.very-good-plus', elem => elem.classList.contains('very-good-plus'));

      assert.equal(hasHighlight, true, 'Highlights were not found in the DOM');
    });
  });

  // Currency Converter
  // ------------------------------------------------------
  describe('Currency Converter', async function() {
    it('should render the currency converter in the DOM', async function() {

      await page.waitForSelector('.currency-converter', { timeout: 10000 });
      let converter = await page.$eval('.currency-converter', elem => elem.classList.contains('currency-converter'));

      assert.equal(converter, true, 'Currency converter was not rendered');
    });
  });

  // Sort Buttons
  // ------------------------------------------------------
  describe('Sort Buttons', async function() {
    it('show render sort buttons into the Marketplace filters', async function() {

      await Promise.all([
        await page.waitForSelector('.filter_currency .show_more_filters'),
        await page.$eval('.filter_currency .show_more_filters', elem => elem.click())
      ]);

      await page.waitForSelector('.hide_more_filters');

      let sortBtn = await page.$eval('#sortMpLists', elem => elem.classList.contains('button-blue'));

      assert.equal(sortBtn, true, 'Sort buttons were not rendered');
    });
  });

  // Everlasting Marketplace
  // ------------------------------------------------------
  describe('Everlasting Marketplace', async function() {
    it('renders EM headers in the DOM', async function() {
        let pageStamp = await page.waitForSelector('.de-page-stamp');
        assert.ok(pageStamp, 'Everlasting Marketplace headers were not rendered');
    });
  });

  // Release Durations
  // ------------------------------------------------------
  describe('Release Durations', async function() {
    it('displays the release durations', async function() {

      await Promise.all([
        page.goto('https://www.discogs.com/Scorn-Evanescence/master/13043'),
        page.waitFor('body')
      ]);

      await page.waitForSelector('.tracklist_track.track_heading');

      let duration = await page.$eval('.tracklist_track.track_heading .tracklist_track_pos span', elem => elem.textContent === 'Total Time:');

      assert.equal(duration, true, 'Release durations were not rendered');
    });
  });

  // Large YouTube Playlists
  // ------------------------------------------------------
  describe('Large YouTube Playlists', async function() {
    it('should embiggen the YouTube Playlists', async function() {

      await toggleFeature('#toggleYtPlaylists');

      await Promise.all([
        page.goto('https://www.discogs.com/Various-After-Hours-2/release/77602'),
        page.waitFor('body')
      ]);

      let isLarge = await page.$eval('#youtube_tracklist', elem => elem.offsetHeight > 166);

      assert.equal(isLarge, true, 'YouTube playlists were not hugeified');
    });
  });

  // Rating Percentage
  // ------------------------------------------------------
  describe('Rating Percentage', async function() {
    it('should show the Rating Percent on a release', async function() {

      await toggleFeature('#toggleRatingPercent');

      await Promise.all([
        page.goto('https://www.discogs.com/Various-After-Hours-2/release/77602'),
        page.waitFor('body')
      ]);

      let hasPercentage = await page.$eval('.de-percentage', elem => elem.classList.contains('de-percentage'));

      assert.equal(hasPercentage, true, 'Rating Percentage was not displayed');
    });
  });

  // Tracklist Readability
  // ------------------------------------------------------
  describe('Tracklist Readability', async function() {
    it('should render readability dividers in the tracklist', async function() {

      await toggleFeature('#toggleReadability');

      await Promise.all([
        page.goto('https://www.discogs.com/Various-After-Hours-2/release/77602'),
        page.waitFor('body')
      ]);

      let hasSpacer = await page.$eval('.de-spacer', elem => elem.classList.contains('de-spacer'));

      assert.equal(hasSpacer, true, 'Readability dividers were not rendered');
    });
  });

  // Tweak Discriminators
  // ------------------------------------------------------
  describe('Tweak Discriminators', async function() {
    it('should render spans around discriminators', async function() {

      await toggleFeature('#toggleTweakDiscrims');

      await Promise.all([
        page.goto('https://www.discogs.com/Digital-Assassins-DJEF-Skot-Vs-Mt-Vibes-Deep-Sound-Of-Underground-Los-Angeles/release/3931002'),
        page.waitFor('body')
      ]);

      let hasSpans = await page.$eval('.de-discriminator', elem => elem.classList.contains('de-discriminator'));

      assert.equal(hasSpans, true, 'Discriminators spans were not rendered');
    });
  });

  // Relative Last Sold Dates
  // ------------------------------------------------------
  describe('Show Relative Last Sold Dates', async function() {
    it('should render the date in relative terms', async function() {

      await toggleFeature('#toggleRelativeSoldDate');

      await Promise.all([
        page.goto('https://www.discogs.com/Digital-Assassins-DJEF-Skot-Vs-Mt-Vibes-Deep-Sound-Of-Underground-Los-Angeles/release/3931002'),
        page.waitFor('body')
      ]);

      let relativeDate = await page.$eval('.de-last-sold', elem => elem.classList.contains('de-last-sold'));

      assert.equal(relativeDate, true, 'Last Sold Date was not rendered');
    });
  });

  // Release Scanner
  // ------------------------------------------------------
  describe('Release Scanner', async function() {
    it('should append the Scan Releases button', async function() {
      await toggleFeature('#toggleReleaseScanner');
      await Promise.all([
        page.goto('https://www.discogs.com/artist/5269363-Trance-Wax', {waitUntil: 'networkidle2'}),
        page.waitFor('.de-scan-releases')
      ]);

      let hasScanButton = await page.$eval('.de-scan-releases', elem => elem.classList.contains('de-scan-releases'));
      assert.equal(hasScanButton, true, 'Scan Releases button was not appended');
    });

    it('Should scan releases when clicked', async function() {

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
    });
  });

  // List Items In New Tabs
  // ------------------------------------------------------
  describe('List Items In New Tabs', async function() {
    it('should open list items in new tabs', async function() {
      await toggleFeature('#toggleListsInTabs');
      await Promise.all([
        page.goto('https://www.discogs.com/lists/2019-Favorites/476255'),
        page.waitFor('.de-list-new-tabs')
      ]);

      let hasNewWindow = await page.$eval('.de-list-new-tabs', elem => elem.classList.contains('de-list-new-tabs'));
      assert.equal(hasNewWindow, true, 'List anchor elements are missing target attribute');
    });
  });

  // Filter Shipping Countries
  // ------------------------------------------------------
  describe('Filter Shipping Countries', async function() {
    it('should filter items based on their country of origin', async function() {

      await toggleFeature('#toggleFilterShippingCountry');
      let configPage = await openConfig('filter-shipping-country');
      await configPage.waitFor('.country-input');
      await configPage.type('.restore-input', '["United States", "United Kingdom", "Germany"]');
      await configPage.click('.restore .btn.btn-green');
      await configPage.close();

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list'),
        page.waitFor('.de-page-stamp'),
        page.waitFor('.de-hide-country')
      ]);

      let countryInfo = await page.$eval('.country-list-info', elem => elem.classList.contains('country-list-info'));

      assert.equal(countryInfo, true, 'Country info icon was not rendered');

      let hiddenCountry = await page.$eval('.de-hide-country', elem => elem.classList.contains('de-hide-country'));
      assert.equal(hiddenCountry, true, 'Country was not hidden');
    });

    it('should filter items based on their country of origin using native navigation', async function() {

      await toggleFeature('#toggleEverlastingMarket');

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list'),
        page.waitFor('.de-hide-country'),
        page.waitFor('a.pagination_next'),
        page.waitFor('.country-list-info')
      ]);

      let hiddenCountry = await page.$eval('.de-hide-country', elem => elem.classList.contains('de-hide-country'));
      assert.equal(hiddenCountry, true, 'Country was not hidden after toggling Everlasting Marketplace.');

      await page.$eval('a.pagination_next', elem => elem.click());
      hiddenCountry = await page.$eval('.de-hide-country', elem => elem.classList.contains('de-hide-country'));
      assert.equal(hiddenCountry, true, 'Country was not hidden on Next click.');

      await toggleFeature('#toggleEverlastingMarket');
    });
  });

  // Filter Media Condition
  // ------------------------------------------------------
  describe('Filter Media Condition', async function() {
    it('should filter items based on media condition', async function() {
      await toggleFeature('#toggleFilterMediaCondition');

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list'),
        page.waitFor('.mint.bold')
      ]);

      let conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
      assert.equal(conditions, true, 'Items were not hidden based on condition');

      await toggleFeature('#toggleEverlastingMarket');

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list'),
        page.waitFor('.mint.bold'),
        page.waitFor('a.pagination_next')
      ]);

      conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
      assert.equal(conditions, true, 'Items were not hidden based on condition');

      await page.$eval('a.pagination_next', elem => elem.click());

      conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
      assert.equal(conditions, true, 'Items were not hidden based on condition after using native navigation');
    });
  });

  after(async function() {
    await browser.close();
  });
});

// puppeteer.launch(config).then(async browser => {

//   Testing popup menu

//   await page.goto(url);
//   await page.type('#username', username);
//   await page.type('#password', password);
//   await page.click('button.green');

//   currencyConverter = await page.evaluate(() => document.querySelectorAll('.currency-converter').length);
//   console.log('Converter', currencyConverter);
//   await browser.close();
// });
