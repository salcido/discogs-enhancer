const assert = require('assert');

let test = async function(page, username, password) {

    await Promise.all([
        await page.goto('https://auth.discogs.com/login?service=https%3A//www.discogs.com/login%3Freturn_to%3D%252Fmy'),
        page.waitFor('button.green')
    ]);

    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('button.green');

    let pageUrl = await page.url();
    assert.equal(pageUrl, 'https://www.discogs.com/my', 'Login was unsuccessful');
};

module.exports = { test };
