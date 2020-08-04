const puppeteer = require('puppeteer');
const username = process.env.USERNAME || null;
const password = process.env.PASSWORD || null;
// Extension path
const path = require('path').join(__dirname, '../dist');
// Browser configuration
const config = {
  headless: false,
  ignoreHTTPSErrors: true,
  slowMo: 225,
  args: [
    `--disable-extensions-except=${path}`,
    `--load-extension=${path}`,
    '--no-sandbox'
  ]
};

let browser,
    page,
    id;

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
    popup.waitForSelector(`${featureID}`),
  ]);

  await popup.$(`${featureID} + label .onoffswitch-switch`);

  let checkbox = await popup.$(`${featureID}`);

  await popup.$eval(`${featureID} + label .onoffswitch-switch`, elem => elem.click());
  console.log(`Clicked ${featureID}`);
  let checked = await(await checkbox.getProperty('checked')).jsonValue();
  console.log(`${featureID} is `, checked ? 'enabled' : 'disabled');
  popup.close();
}

module.exports = { toggleFeature, openConfig, openPopup };

// ========================================================
// Functional Tests
// ========================================================

describe.skip('Functional Testing', function() {
  this.timeout(40000);
  before(async function() { await boot(); });

  // Search Extension Features
  // ------------------------------------------------------
  describe.skip('Search Features', async function() {
    it('should refine the features list', async function() {
      await require('./extension/extension-tests').search(page);
    });
  });

  // Extension Dark Theme
  // ------------------------------------------------------
  describe.skip('Extension Dark Theme', async function() {
    it('should apply the dark theme to the extension', async function() {
      await require('./extension/extension-tests').darkTheme(page);
    });
  });

  // Dark Theme
  // ------------------------------------------------------
  describe.skip('Dark Theme', async function() {
    it('should apply the Dark Theme to Discogs.com', async function() {
      await require('./unauthenticated/dark-theme').test(page);
    });
  });

  // Marketplace Hightlights
  // ------------------------------------------------------
  describe.skip('Marketplace Highlights', async function() {
    it('should highlight media/sleeve conditions in the Marketplace', async function() {
      await require('./unauthenticated/marketplace-highlights').test(page);
    });
  });

  // Currency Converter
  // ------------------------------------------------------
  describe.skip('Currency Converter', async function() {
    it('should render the currency converter in the DOM', async function() {
      await require('./unauthenticated/currency-converter').render(page);
    });

    it('should request rates from discogs-enhancer.com', async function() {
      await require('./unauthenticated/currency-converter').request(page);
    });

    it('should convert currencies', async function() {
      await require('./unauthenticated/currency-converter').convert(page);
    });
  });

  // Sort Buttons
  // ------------------------------------------------------
  describe.skip('Sort Buttons', async function() {
    it('show render sort buttons into the Marketplace filters', async function() {
      // TODO: test explore, list sorting
      await require('./unauthenticated/sort-buttons').test(page);
    });
  });

  // Everlasting Marketplace
  // ------------------------------------------------------
  describe.skip('Everlasting Marketplace', async function() {
    it('renders EM headers in the DOM', async function() {
      await require('./unauthenticated/everlasting-marketplace').test(page);
    });

    it('loads the next page in the Marketplace', async function() {
      await require('./unauthenticated/everlasting-marketplace').scrollMarketplace(page);
    });

    it('loads the next page on a single Release', async function() {
      await require('./unauthenticated/everlasting-marketplace').scrollRelease(page);
    });
  });

  // Release Durations
  // ------------------------------------------------------
  describe.skip('Release Durations', async function() {
    it('displays the release durations', async function() {
      await require('./unauthenticated/release-durations').test(page);
    });
  });

  // Large YouTube Playlists
  // ------------------------------------------------------
  describe.skip('Large YouTube Playlists', async function() {
    it('should embiggen the YouTube Playlists', async function() {
      await require('./unauthenticated/large-youtube-playlists').test(page);
    });
  });

  // Blurry Image Fix
  // ------------------------------------------------------
  describe.skip('Fix Blurry Gallery Images', async function() {
    it('should apply the .de-blurry-fix class to the thumb', async function() {
      await require('./unauthenticated/blurry-image-fix').init(page);
    });

    it('should apply the .de-blurry-fix class to the images', async function() {
      await require('./unauthenticated/blurry-image-fix').apply(page);
    });
  });

  // Rating Percentage
  // ------------------------------------------------------
  describe.skip('Rating Percentage', async function() {
    it('should show the Rating Percent on a release', async function() {
      await require('./unauthenticated/rating-percentage').test(page);
    });
  });

  // Tracklist Readability
  // ------------------------------------------------------
  describe.skip('Tracklist Readability', async function() {
    it('should render readability dividers in the tracklist', async function() {
      await require('./unauthenticated/tracklist-readability').test(page);
    });
  });

  // Tweak Discriminators
  // ------------------------------------------------------
  describe.skip('Tweak Discriminators', async function() {
    it('should render spans around discriminators', async function() {
      await require('./unauthenticated/tweak-discriminators').test(page);
    });
  });

  // Relative Last Sold Dates
  // ------------------------------------------------------
  describe.skip('Show Relative Last Sold Dates', async function() {
    it('should render the date in relative terms', async function() {
      await require('./unauthenticated/relative-sold-date').test(page);
    });
  });

  // Release Scanner
  // ------------------------------------------------------
  describe.skip('Release Scanner', async function() {
    it('should append the Scan Releases button', async function() {
      await require('./unauthenticated/release-scanner').addButton(page);
    });

    it('should scan releases when clicked', async function() {
      await require('./unauthenticated/release-scanner').scan(page);
    });
  });

  // Release Ratings
  // ------------------------------------------------------
  describe.skip('Release Ratings', async function() {

    it('should insert rating links into listings in the Marketplace', async function() {
      await require('./unauthenticated/release-ratings').addLinks(page);
    });

    it('should fetch the release rating', async function() {
      await require('./unauthenticated/release-ratings').fetchRelease(page);
    });
  });

  // Quick Search
  // ------------------------------------------------------
  describe.skip('Quick Search', async function() {
    it('should wrap the release title in a span', async function() {
      await require('./unauthenticated/quick-search').test(page);
    });
  });

  // Filter Shipping Countries
  // ------------------------------------------------------
  describe.skip('Filter Shipping Countries', async function() {
    it('should filter items based on their country of origin', async function() {
      await require('./unauthenticated/filter-shipping-country').filter(page);
    });

    it('should filter items based on their country of origin using native navigation', async function() {
      await require('./unauthenticated/filter-shipping-country').filterNative(page);
    });
  });

  // Filter Media Condition
  // ------------------------------------------------------
  describe.skip('Filter Media Condition', async function() {
    it('should filter items based on media condition', async function() {
      await require('./unauthenticated/filter-media-condition').filter(page);
    });

    it('should filter items based on media condition using native navigation', async function() {
      await require('./unauthenticated/filter-media-condition').filterNative(page);
    });
  });

  // Tag Seller Repuation
  // ------------------------------------------------------
  describe.skip('Tag Seller Repuation', async function() {
    it('should tag sellers with low repuations', async function() {
      await require('./unauthenticated/seller-rep').test(page);
    });
  });

  // Inventory Ratings
  // ------------------------------------------------------
  describe.skip('Inventory Ratings', async function() {
    it('should highlight ratings above a specified rating', async function() {
      await require('./unauthenticated/inventory-ratings').test(page);
    });
  });

  // Filter Sleeve Conditions
  // ------------------------------------------------------
  describe.skip('Filter Sleeve Conditions', async function() {
    it('should filter items below a specified condition', async function() {
      await require('./unauthenticated/filter-sleeve-condition').test(page);
    });
  });

  // Favorite Sellers
  // ------------------------------------------------------
  describe.skip('Favorite Sellers', async function() {
    it('should mark sellers as favorites', async function() {
      await require('./unauthenticated/favorite-sellers').mark(page);
    });

    it('should mark sellers as favorites on pagination clicks', async function() {
      await require('./unauthenticated/favorite-sellers').markNative(page);
    });

    it('should reset the favorite sellers list when done', async function() {
      // reset favorites list so theres no conflict with blocked sellers tests
      await require('./unauthenticated/favorite-sellers').reset(page);
    });
  });

  // Block Sellers
  // ------------------------------------------------------
  describe.skip('Block Sellers', async function() {
    it('should mark sellers as blocked', async function() {
      await require('./unauthenticated/block-sellers').block(page);
    });

    it('should mark sellers as blocked on pagination clicks', async function() {
      await require('./unauthenticated/block-sellers').blockNative(page);
    });

    it('should reset the blocked sellers list when done', async function() {
      // reset blocked list so theres no conflict with other tests
      await require('./unauthenticated/block-sellers').reset(page);
    });
  });

  // Auth Testing
  // ------------------------------------------------------
  if ( username && password ) {
    describe.skip('Authenticated feature testing', async function() {
      it('should authenticate the test user', async function() {
        await require('./authenticated/login').test(page, username, password);
      });
    });

    // Random Item Button
    // ------------------------------------------------------
    describe.skip('Random Item Button', async function() {
      it('should append an icon to the nav bar', async function() {
        await require('./authenticated/random-item').append(page);
      });

      it('should get a random item when clicked', async function() {
        await require('./authenticated/random-item').random(page);
      });
    });

    // Notes Counter
    // ------------------------------------------------------
    describe.skip('Notes Counter', async function() {
      it('should append the counter to the In Collection box', async function() {
        await require('./authenticated/notes-counter').appendCounter(page);
      });

      it('should count the characters in a note', async function() {
        await require('./authenticated/notes-counter').count(page);
      });
    });

    // Show Actual Add Dates
    // ------------------------------------------------------
    describe.skip('Show Actual Add Dates', async function() {
      it('should show the date the item was added', async function() {
        await require('./authenticated/show-actual-dates').test(page);
      });
    });

    // Collection Links In New Tabs
    // ------------------------------------------------------
    // describe.skip('Collection Links In New Tabs', async function() {
    //   it('should open links from the React Collection in new tabs', async function() {
    //     await require('./authenticated/collection-new-tabs').test(page);
    //   });
    // });

    // Hide Min Med Max Columns
    // ------------------------------------------------------
    describe.skip('Hide Min Med Max Columns', async function() {
      it('should hide the Min, Med, Max columns in the React Collection', async function() {
        await require('./authenticated/min-max-columns').test(page);
      });
    });

    // Show Average Price
    // ------------------------------------------------------
    describe.skip('Show Average Price', async function() {
      it('should show the average price paid for an item', async function() {
        await require('./authenticated/average-price').test(page);
      });
    });

    // Text Format Shortcuts
    // ------------------------------------------------------
    describe.skip('Text Format Shortcuts', async function() {
      it('should render text format shortcuts', async function() {
        await require('./authenticated/text-format-shortcuts').test(page);
      });
    });

    // Large BAOI Fields
    // ------------------------------------------------------
    describe.skip('Large BAOI Fields', async function() {
      it('should render large BAOI fields', async function() {
        await require('./authenticated/baoi-fields').test(page);
      });
    });

    // Remove From Wantlist Shortcuts
    // ------------------------------------------------------
    describe.skip('Remove From Wantlist Shortcuts', async function() {
      it('should render the shortcut in a listing', async function() {
        await require('./authenticated/remove-from-wantlist').render(page);
      });

      it('should render a prompt when clicked', async function() {
        await require('./authenticated/remove-from-wantlist').prompt(page);
      });
    });

    // Suggested Prices
    // ------------------------------------------------------
    describe.skip('Suggested Prices', async function() {
      it('should render links into the DOM', async function() {
        await require('./authenticated/suggested-prices').render(page);
      });

      it('should display a price when clicked', async function() {
        await require('./authenticated/suggested-prices').showPrice(page);
      });

      it('should display prices on a release page', async function() {
        await require('./authenticated/suggested-prices').showReleasePrice(page);
      });
    });

    // Seller Items In Cart
    // ------------------------------------------------------
    describe.skip('Show Sellers In Cart', async function() {
      it('should display an icon next to the seller\'s name', async function() {
        await require('./authenticated/seller-items-in-cart').test(page);
      });
    });

    // Feedback Notifications
    // ------------------------------------------------------

    // Block Buyers
    // ------------------------------------------------------

    after(async function() {
      await browser.close();
    });
  } else {
    after(async function() {
      await browser.close();
    });
  }
});
