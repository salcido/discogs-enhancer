const puppeteer = require('puppeteer');
const username = process.argv[2];
const password = process.argv[3];
const url = 'https://www.discogs.com/sell/list';
const path = require('path').join(__dirname, './dist');
const config = {
  headless: false,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: [
    `--disable-extensions-except=${path}`,
    `--load-extension=${path}`,
  ]
};

puppeteer.launch(config).then(async browser => {

  let page = await browser.newPage(),
      currencyConverter;

  await page.goto(url);
  // await page.type('#username', username);
  // await page.type('#password', password);
  // await page.click('button.green');

  currencyConverter = await page.evaluate(() => document.querySelectorAll('.currency-converter').length);
  console.log('Converter', currencyConverter);
  await browser.close();
});
