const assert = require('assert');

async function autoScroll(page) {
  return await page.evaluate(async () => {
      return await new Promise(resolve => {
          let distance = 200;
          let mpTarget = 'discogs.com/sell/list?page=';
          let releaseTarget = 'discogs.com/sell/release/2897713?page=';
          let timer = setInterval(() => {
              window.scrollBy(0, distance);
              if ( document.location.href.includes(mpTarget) ||
                   document.location.href.includes(releaseTarget) ) {
                  clearInterval(timer);
                  return resolve(true);
              }
          }, 100);
      });
  });
}

let test = async function(page) {
  let pageStamp = await page.waitForSelector('.de-page-stamp');
  assert.ok(pageStamp, 'Everlasting Marketplace headers were not rendered');
};

let scrollMarketplace = async function(page) {
  let nextPage = await autoScroll(page);
  assert.equal(nextPage, true, 'Next page was not loaded')
}

let scrollRelease = async function(page) {
  await page.goto('https://www.discogs.com/sell/release/2897713');
  let nextPage = await autoScroll(page);
  assert.equal(nextPage, true, 'Next page was not loaded')
}

module.exports = { test, scrollMarketplace, scrollRelease };
