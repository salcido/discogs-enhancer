const assert = require('assert');

let test = async function(page) {
  await Promise.all([
    page.goto('https://www.discogs.com/Scorn-Evanescence/master/13043'),
    page.waitFor('body')
  ]);

  await page.waitForSelector('.tracklist_track.track_heading');

  let duration = await page.$eval('.tracklist_track.track_heading .tracklist_track_pos span', elem => elem.textContent === 'Total Time:');

  assert.equal(duration, true, 'Release durations were not rendered');
};

module.exports = { test };
