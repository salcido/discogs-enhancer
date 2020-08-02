const assert = require('assert');
const { toggleFeature } = require('../test');

// Add links to page
let addLinks = async function(page) {
  await toggleFeature('#toggleReleaseRatings');
  await Promise.all([
    page.goto('https://www.discogs.com/sell/list', { waitUntil: 'networkidle2' }),
    page.waitFor('.de-rating-link')
  ]);
  let hasRatingLinks = await page.$eval('.de-rating-link', elem => elem.classList.contains('de-rating-link'));
  assert.equal(hasRatingLinks, true, 'Rating links were not rendered');
};

// Fetch release
let fetchRelease = async function(page) {
  await page.$eval('.de-rating-link', elem => elem.click());
  let isFetching;

  await page.waitForResponse(response => {
    if ( response.request().resourceType() !== undefined ) {
      isFetching = true;
      return isFetching;
    }
  });

  assert.equal(isFetching, true, 'Fetch was not initiated');
};

module.exports = { addLinks, preloader, fetchRelease };
