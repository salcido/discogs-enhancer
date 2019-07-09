const assert = require('assert');

// Append Counter
let appendCounter = async function(page) {
    await page.waitFor(3000);
    let pageUrl = await page.url();

    await Promise.all([
      page.goto(pageUrl, { waitUntil: 'networkidle2' }),
      page.waitFor('[data-field-name="Notes"]')
    ]);

    await page.$eval('[data-field-name="Notes"] .notes_show', elem => elem.click());

    await page.waitFor('.de-notes-count');

    let counter = await page.$eval('.de-notes-count', elem => elem.classList.contains('de-notes-count'));
    assert.equal(counter, true, 'Counter was not appended to Notes');
};

// Count
let count = async function(page) {
    await Promise.all([
        await page.waitFor('.notes_textarea'),
        await page.type('.notes_textarea', 'METALLICA!!!')
      ]);

      let counter = await page.$eval('.de-notes-count', elem => elem.textContent === '12 / 255');
      assert.equal(counter, true, 'Counter did not change after typing');
};

module.exports = { appendCounter, count };
