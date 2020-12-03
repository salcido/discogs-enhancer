const assert = require('assert');

let test = async function(page, username, password) {

  await Promise.all( [
    await page.goto( 'https://auth.discogs.com/login?service=https%3A//www.discogs.com/login%3Freturn_to%3D%252Fmy' ),
    await page.waitFor( 'button.green' ),
    await page.waitForSelector( '#onetrust-accept-btn-handler' )
  ]);

  await page.click( '#onetrust-accept-btn-handler' );

  await page.type('#username', username);
  await page.type('#password', password);
  await page.click('button.green');

  let pageUrl = await page.url();
  assert.equal(pageUrl, 'https://www.discogs.com/my', 'Login was unsuccessful');
};

module.exports = { test };
