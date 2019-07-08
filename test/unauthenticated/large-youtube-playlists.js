const assert = require('assert');
const { toggleFeature } = require('../test');

let test = async function(page) {
  await toggleFeature('#toggleYtPlaylists');

  await Promise.all([
    page.goto('https://www.discogs.com/Various-After-Hours-2/release/77602'),
    page.waitFor('body')
  ]);

  let isLarge = await page.$eval('#youtube_tracklist', elem => elem.offsetHeight > 166);

  assert.equal(isLarge, true, 'YouTube playlists were not hugeified');
};

module.exports = { test };
