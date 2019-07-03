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

let browser,
    extensionPage;

/**
 * Instantiates the extension in the browser.
 */
async function boot() {
  let popup = 'html/popup.html',
      extensionName = 'Discogs Enhancer';

  browser = await puppeteer.launch(config);
  let page = await browser.newPage();
  await page.waitFor(100);

  let targets = await browser.targets();
  let extensionTarget = targets.find(({ _targetInfo }) => {
      return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
  });
  let extensionUrl = extensionTarget._targetInfo.url || '';
  let [,, extensionID] = extensionUrl.split('/');
  page.close();
  extensionPage = await browser.newPage();
  await extensionPage.goto(`chrome-extension://${extensionID}/${popup}`);
  await extensionPage.setRequestInterception(true);
  extensionPage.on('request', interceptedRequest => {
    if (interceptedRequest.url().startsWith('https://www.google-analytics.com/'))
      interceptedRequest.abort();
    else
      interceptedRequest.continue();
  });
}

describe('Functional Testing', function() {
  this.timeout(20000);
  before(async function() { await boot(); });

  describe('Search Features', async function() {
    it('should refine the features list', async function() {

      let searchElem = await extensionPage.$('#searchbox');
      assert.ok(searchElem, 'Search bar was not rendered');

      await extensionPage.type('#searchbox', 'cart');

      let showSellersInCart = await extensionPage.$eval('.show-sellers-in-cart', elem => !elem.closest('.toggle-group').classList.contains('hide'));

      let darkTheme = await extensionPage.$eval('.darkTheme', elem => elem.closest('.toggle-group').classList.contains('hide'));

      assert.equal(showSellersInCart, true, 'Error searching for Cart');
      assert.equal(darkTheme, true, 'Dark Theme option was not hidden');
      let clear = await extensionPage.$('.clear-search');
      clear.click();
    });
  });

  describe('Enable Dark Theme', async function() {
    it('should enable the Dark Theme when checked', async function() {

      Promise.all([
        extensionPage.waitForSelector('#toggleDarkTheme', { timeout: 10000 }),
        extensionPage.waitForSelector('#toggleDarkTheme + label .onoffswitch-switch'),
        extensionPage.waitForSelector('#toggleDarkTheme')
      ]);

      let darkTheme = await extensionPage.$('.darkTheme');
      assert.ok(darkTheme, 'Dark Theme Feature was not rendered');

      let toggle = await extensionPage.$('#toggleDarkTheme + label .onoffswitch-switch');
      let checkbox = await extensionPage.$('#toggleDarkTheme');
      let checked = await(await checkbox.getProperty('checked')).jsonValue();

      assert.equal(checked, false, 'Checkbox was already checked');

      await toggle.click();

      checked = await(await checkbox.getProperty('checked')).jsonValue();
      assert.equal(checked, true, 'Could not enable Dark Theme');
    });
  });

  describe('Dark Theme', async function() {
    it('should apply the Dark Theme to Discogs.com', async function() {

      await Promise.all([
        extensionPage.goto('https://www.discogs.com/sell/list'),
        extensionPage.waitFor('body')
      ]);

      await extensionPage.waitForSelector('.de-dark-theme', { timeout: 10000 });
      let hasDarkTheme = await extensionPage.$eval('.de-dark-theme', elem => elem.classList.contains('de-dark-theme'));
      assert.equal(hasDarkTheme, true, 'Dark Theme class was not found on documentElement');
    });
  });

  describe('Marketplace Highlights', async function() {
    it('should highlight media/sleeve conditions in the Marketplace', async function() {

      await extensionPage.waitForSelector('.very-good-plus', { timeout: 10000 });
      let hasHighlight = await extensionPage.$eval('.very-good-plus', elem => elem.classList.contains('very-good-plus'));

      assert.equal(hasHighlight, true, 'Highlights were not found in the DOM');
    });
  });

  describe('Currency Converter', async function() {
    it('should render the currency converter in the DOM', async function() {

      await extensionPage.waitForSelector('.currency-converter', { timeout: 10000 });
      let converter = await extensionPage.$eval('.currency-converter', elem => elem.classList.contains('currency-converter'));

      assert.equal(converter, true, 'Currency converter was not rendered');
    });
  });

  describe('Sort Buttons', async function() {
    it('show render sort buttons into the Marketplace filters', async function() {

      await Promise.all([
        await extensionPage.waitForSelector('.filter_currency .show_more_filters'),
        await extensionPage.$eval('.filter_currency .show_more_filters', elem => elem.click())
      ]);

      await extensionPage.waitForSelector('.hide_more_filters');

      let sortBtn = await extensionPage.$eval('#sortMpLists', elem => elem.classList.contains('button-blue'));

      assert.equal(sortBtn, true, 'Sort buttons were not rendered');
    });
  });

  describe('Everlasting Marketplace', async function() {
    it('renders EM headers in the DOM', async function() {
        let pageStamp = await extensionPage.waitForSelector('.de-page-stamp');
        assert.ok(pageStamp, 'Everlasting Marketplace headers were not rendered');
    });
  });

  describe('Release Durations', async function() {
    it('displays the release durations', async function() {

      await Promise.all([
        extensionPage.goto('https://www.discogs.com/Scorn-Evanescence/master/13043'),
        extensionPage.waitFor('body')
      ]);

      await extensionPage.waitForSelector('.tracklist_track.track_heading');

      let duration = await extensionPage.$eval('.tracklist_track.track_heading .tracklist_track_pos span', elem => elem.textContent === 'Total Time:');

      assert.equal(duration, true, 'Release durations were not rendered');
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
