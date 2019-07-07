const puppeteer = require('puppeteer');
const assert = require('assert');

const username = process.env.USERNAME || null;
const password = process.env.PASSWORD || null;
const url = 'https://www.discogs.com/sell/list';
const path = require('path').join(__dirname, './dist');
const config = {
  headless: false,
  ignoreHTTPSErrors: true,
  args: [
    `--disable-extensions-except=${path}`,
    `--load-extension=${path}`,
    '--no-sandbox'
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
    await popup.setViewport({ width: 1280, height: 768 })
  ]);
  popup.on('request', interceptedRequest => {
    if (interceptedRequest.url().startsWith('https://www.google-analytics.com/')) {
      interceptedRequest.abort();
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

  await Promise.all([
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
        page.goto('https://www.discogs.com/sell/list', { waitUntil: 'networkidle2' }),
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

    it('should request rates from discogs-enhancer.com', async function() {

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
        assert.equal(gotRates, true, 'Converter rates were not fetched');
      });
    });

    it('should convert currencies', async function() {

      await Promise.all([
        await page.waitFor('#ccInput'),
        await page.waitFor('#ccOutput'),
        await page.waitFor('#baseCurrency')
      ]);
      await page.type('#ccInput', '4');
      let hasOutput = await page.$eval('#ccOutput', elem => elem.textContent !== '');
      assert.equal(hasOutput, true, 'Converter did not convert');
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
    // TODO: test page loading on scroll
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
        page.goto('https://www.discogs.com/artist/5269363-Trance-Wax', { waitUntil: 'networkidle2' }),
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

  // Release Ratings
  // ------------------------------------------------------
  describe('Release Ratings', async function() {

    it('should insert rating links into listings in the Marketplace', async function() {
      await toggleFeature('#toggleReleaseRatings');
      await Promise.all([
        page.goto('https://www.discogs.com/sell/list', { waitUntil: 'networkidle2' }),
        page.waitFor('.de-rating-link')
      ]);
      let hasRatingLinks = await page.$eval('.de-rating-link', elem => elem.classList.contains('de-rating-link'));
      assert.equal(hasRatingLinks, true, 'Rating links were not rendered');
    });

    it('should render the preloader when clicked', async function() {
      await page.$eval('.de-rating-link', elem => elem.click());
      await page.waitFor('i.preloader');
      let preloader = await page.$eval('i.preloader', elem => elem.classList.contains('preloader'));
      assert.equal(preloader, true, 'Preloader was not rendered');
    });

    it('should fetch the release rating', async function() {
      await page.$eval('.de-rating-link', elem => elem.click());
      let isFetching;

      await page.waitForResponse(response => {
        if ( response.request().resourceType() !== undefined ) {
          isFetching = true;
          return isFetching;
        }
      });

      assert.equal(isFetching, true, 'Fetch was not initiated');
    });
  });

  // Quick Search
  // ------------------------------------------------------
  describe('Quick Search', async function() {
    it('should wrap the release title in a span', async function() {
      await toggleFeature('#toggleQuickSearch');
      await Promise.all([
        page.goto('https://www.discogs.com/Lou-Karsh-Phantom-Structures/release/13705345'),
        page.waitFor('.de-one-click')
      ]);
      let hasQuickSearch = await page.$eval('.de-one-click', elem => elem.classList.contains('de-one-click'));
      assert.equal(hasQuickSearch, true, 'Quick Search span was not rendered');
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
      await configPage.type('.restore-input', '["United States", "United Kingdom", "Germany", "France"]');
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
        page.goto('https://www.discogs.com/sell/list', { waitUntil: 'networkidle2' }),
        page.waitFor('.mint.bold')
      ]);

      let conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
      assert.equal(conditions, true, 'Items were not hidden based on condition');

      await toggleFeature('#toggleEverlastingMarket');

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list', { waitUntil: 'networkidle2' }),
        page.waitFor('.mint.bold'),
        page.waitFor('a.pagination_next')
      ]);

      conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
      assert.equal(conditions, true, 'Items were not hidden based on condition');

      await page.$eval('a.pagination_next', elem => elem.click());
      await page.waitFor(3000);
      conditions = await page.$$eval('tr.shortcut_navigable.de-hide-media', elems => elems.filter(e => e.$eval('.mint')).length === 0);
      assert.equal(conditions, true, 'Items were not hidden based on condition after using native navigation');
    });
  });

  // Tag Seller Repuation
  // ------------------------------------------------------
  describe('Tag Seller Repuation', async function() {
    it('should tag sellers with low repuations', async function() {

      let popup = await browser.newPage();
      await Promise.all([
        await popup.goto(`chrome-extension://${id}/html/popup.html`),
        await popup.setRequestInterception(true),
        await popup.setViewport({ width: 1280, height: 768 })
      ]);
      let featureID = '#toggleSellerRep';

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
    });
  });

  // Inventory Ratings
  // ------------------------------------------------------
  describe('Inventory Ratings', async function() {
    it('should highlight ratings above a specified rating', async function() {

      let popup = await browser.newPage();
      await Promise.all([
        await popup.goto(`chrome-extension://${id}/html/popup.html`),
        await popup.setRequestInterception(true),
        await popup.setViewport({ width: 1280, height: 768 })
      ]);
      let featureID = '#toggleInventoryRatings';

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
    });
  });

  // Filter Sleeve Conditions
  // ------------------------------------------------------
  describe('Filter Sleeve Conditions', async function() {
    it('should filter items below a specified condition', async function() {

      let popup = await browser.newPage();
      await Promise.all([
        await popup.goto(`chrome-extension://${id}/html/popup.html`),
        await popup.setRequestInterception(true),
        await popup.setViewport({ width: 1280, height: 768 })
      ]);

      let featureID = '#toggleFilterSleeveCondition';

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
    });
  });

  // Favorite Sellers
  // ------------------------------------------------------
  describe('Favorite Sellers', async function() {
    it('should mark sellers as favorites', async function() {
      await page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=50&page=1');

      await page.waitFor('.seller_info .seller_label + strong a');

      let sellerNames = await page.$$eval('.seller_info .seller_label + strong a', elems => {
        let sellerNames = [];
        elems.forEach(n => sellerNames.push(n.textContent));
        return sellerNames;
      });

      let configPage = await openConfig('favorite-sellers');

      await configPage.type('.restore-input', JSON.stringify(sellerNames));
      await configPage.click('.restore .btn.btn-green');
      await configPage.close();

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list'),
        page.waitFor('.de-favorite-seller')
      ]);

      let hasFavorites = await page.$eval('.de-favorite-seller', elem => elem.classList.contains('de-favorite-seller'));
      assert.equal(hasFavorites, true, 'Sellers were not marked as favorites');
    });

    it('should mark sellers as favorites on pagination clicks', async function() {

      await toggleFeature('#toggleEverlastingMarket');
      await Promise.all([
        page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=25&page=1'),
        page.waitFor('a.pagination_next')
      ]);

      await page.$eval('a.pagination_next', elem => elem.click());

      await Promise.all([
        page.waitFor('.de-favorite-seller')
      ]);

      let hasBlocked = await page.$eval('.de-favorite-seller', elem => elem.classList.contains('de-favorite-seller'));
      assert.equal(hasBlocked, true, 'Sellers were not marked as favorites on next page click');
    });

    it('should reset the favorite sellers list when done', async function() {
      // reset favorites list so theres no conflict with blocked sellers tests
      let configPage = await openConfig('favorite-sellers');
      await configPage.type('.restore-input', '[]');
      await configPage.click('.restore .btn.btn-green');
      await configPage.close();
    });
  });

  // Block Sellers
  // ------------------------------------------------------
  describe('Block Sellers', async function() {
    it('should mark sellers as blocked', async function() {

      await page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=50&page=1');

      await page.waitFor('.seller_info .seller_label + strong a');

      let sellerNames = await page.$$eval('.seller_info .seller_label + strong a', elems => {
        let sellerNames = [];
        elems.forEach(n => sellerNames.push(n.textContent));
        return sellerNames;
      });

      let configPage = await openConfig('block-sellers');

      await configPage.type('.restore-input', JSON.stringify(sellerNames));
      await configPage.click('.restore .btn.btn-green');
      await configPage.close();

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list'),
        page.waitFor('.blocked-seller')
      ]);

      let hasBlocked = await page.$eval('.blocked-seller', elem => elem.classList.contains('blocked-seller'));
      assert.equal(hasBlocked, true, 'Sellers were not marked as blocked');
    });

    it('should mark sellers as blocked on pagination clicks', async function() {

      await toggleFeature('#toggleEverlastingMarket');

      await Promise.all([
        page.goto('https://www.discogs.com/sell/list?sort=listed%2Cdesc&limit=25&page=1'),
        page.waitFor('a.pagination_next')
      ]);

      await page.$eval('a.pagination_next', elem => elem.click());

      await Promise.all([
        page.waitFor('.blocked-seller')
      ]);

      let hasBlocked = await page.$eval('.blocked-seller', elem => elem.classList.contains('blocked-seller'));
      assert.equal(hasBlocked, true, 'Sellers were not marked as blocked on next page click');
    });

    it('should reset the blocked sellers list when done', async function() {
      // reset blocked list so theres no conflict with other tests
      let configPage = await openConfig('block-sellers');
      await configPage.type('.restore-input', '[]');
      await configPage.click('.restore .btn.btn-green');
      await configPage.close();
    });
  });

  if ( username && password ) {
    // auth testing
    describe('Authenticated feature testing', async function() {
      it('should authenticate the test user', async function() {
        await page.goto('https://auth.discogs.com/login?service=https%3A//www.discogs.com/login%3Freturn_to%3D%252Fmy');
        await page.type('#username', username);
        await page.type('#password', password);
        await page.click('button.green');

        let pageUrl = await page.url();
        assert.equal(pageUrl, 'https://www.discogs.com/my', 'Login was unsuccessful');
      });
    });

    // Random Item Button
    // ------------------------------------------------------
    describe('Random Item Button', async function() {
      it('should append an icon to the nav bar', async function() {
        await toggleFeature('#toggleRandomItem');
        await Promise.all([
          page.goto('https://www.discogs.com/my', { waitUntil: 'networkidle2' }),
          page.waitFor('.de-random-item')
        ]);
        let hasIcon = await page.$eval('.de-random-item', elem => elem.classList.contains('de-random-item'));
        assert.equal(hasIcon, true, 'Random Item Button was not appended to nav');
      });

      it('should get a random item when clicked', async function() {
        await page.click('.de-random-item');
        let randomItem = false;
        await page.waitForResponse(response => {
          if ( response.request().url().includes('/collection') ) {
            randomItem = true;
            return randomItem;
          }
          assert.equal(randomItem, true, 'Random item was not fetched');
        });
      });
    });

    // Notes Counter
    // ------------------------------------------------------
    describe('Notes Counter', async function() {
      it('should append the counter to the In Collection box', async function() {
        await page.waitFor(3000);
        let pageUrl = await page.url();

        await Promise.all([
          page.goto(pageUrl, { waitUntil: 'networkidle2' }),
          page.waitFor('[data-field-name="Notes"]')
        ]);

        await page.$eval('[data-field-name="Notes"] .notes_show', elem => elem.click());

        await page.waitFor('.de-notes-count');

        let counter = await page.$eval('.de-notes-count', elem => elem.classList.contains('de-notes-count'));
        assert.equal(counter, true, 'Counter was not appended to Notes');
      });

      it('should count the characters in a note', async function() {

        await Promise.all([
          await page.waitFor('.notes_textarea'),
          await page.type('.notes_textarea', 'METALLICA!!!')
        ]);

        let counter = await page.$eval('.de-notes-count', elem => elem.textContent === '12 / 255');
        assert.equal(counter, true, 'Counter did not change after typing');
      });
    });

    // Show Acutal Add Dates
    // ------------------------------------------------------
    describe('Show Actual Add Dates', async function() {
      it('should show the date the item was added', async function() {
        await toggleFeature('#toggleAbsoluteDate');
        await page.waitFor(3000);
        let pageUrl = await page.url();
        await Promise.all([
          page.goto(pageUrl, { waitUntil: 'networkidle2' }),
          page.waitFor('.cw_block_timestamp')
        ]);

        let actualDate = await page.$eval('.cw_block_timestamp span', elem => elem.dataset.approx.includes('ago'));
        assert.equal(actualDate, true, 'Actual date markup was not rendered');
      });
    });

    after(async function() {
      await browser.close();
    });
  } else {
    after(async function() {
      await browser.close();
    });
  }
});
