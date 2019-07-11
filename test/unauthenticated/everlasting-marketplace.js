const assert = require('assert');

async function autoScroll(page) {
  return await page.evaluate(async () => {
      return await new Promise(resolve => {
          let distance = 200;
          let timer = setInterval(() => {
              window.scrollBy(0, distance);
              if (document.location.href === 'https://www.discogs.com/sell/list?page=2') {
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

let scroll = async function(page) {
  let nextPage = await autoScroll(page);
  assert.equal(nextPage, true, 'Next page was not loaded')
}

module.exports = { test, scroll };
