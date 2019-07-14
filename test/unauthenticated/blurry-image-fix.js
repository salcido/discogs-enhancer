const assert = require('assert');
const { toggleFeature } = require('../test');

let init = async function(page) {
    await toggleFeature('#toggleBlurryImageFix');

    await Promise.all([
        page.goto('https://www.discogs.com/Various-After-Hours-2/release/77602', { waitUntil: 'networkidle2' }),
        page.waitFor('.de-blurry-fix')
    ]);

    let hasFixClass = await page.$eval('.de-blurry-fix', elem => elem.classList.contains('de-blurry-fix'));
    assert.equal(hasFixClass, true, 'Blurry Image Fix was not applied');
};

let apply = async function(page) {
    await page.$eval('.image_gallery', elem => elem.click());
    await Promise.all([
        page.waitFor('img.loaded'),
        page.waitFor('.image_gallery_thumb.current'),
        page.waitFor(300)
    ]);

    let hasFixClass = await page.$eval('.image_gallery_thumb.current', elem => elem.classList.contains('de-blurry-fix'));
    assert.equal(hasFixClass, true, 'Blurry Image Fix was not applied');
};

module.exports = { init, apply };
