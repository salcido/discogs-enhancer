/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This is a utility that will update the version
 * number in Discogs Enhancer's `manifest.json`
 * and `package.json` files as well as update the badges
 * within the `readme.md` file.
 *
 * Run it in the terminal like `npm run bump <version number> <updateBadges>`
 * where `<version number>` is a semver string like `x.x.x` and `<updateBadges>`
 * is either `true` (which will gather new badge data) or omitted completely.
 *
 */

const fs = require('fs');
const puppeteer = require('puppeteer');

// new version number {string}
const newVersion = process.argv[2];
// Whether to update the badge data in the readme.md file {boolean}
const updateBadges = process.argv[3] && process.argv[3] === 'true' ? true : null;
// URL to get new badge data from
const url = 'https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn';

let rating,
    votes,
    users;

// ========================================================
// Functions (Alphabetical)
// ========================================================
/**
 * Converts a number to an abbreviation (e.g.: 1,000 -> 1k)
 * @param {Number} number The number of users to convert
 * @param {Number} decPlaces The number of decimal places
 * @returns {Number} - The converted number
 */
function abbrNum(number, decPlaces) {

  let abbrev = [ 'k', 'm', 'b', 't' ];

  decPlaces = Math.pow(10,decPlaces);

  for (let i=abbrev.length - 1; i>=0; i--) {

    let size = Math.pow(10, (i + 1) * 3);

    if (size <= number) {
      number = Math.round(number * decPlaces / size) / decPlaces;

      if ( (number === 1000) && (i < abbrev.length - 1) ) {
        number = 1;
        i++;
      }
      number += abbrev[i];
      break;
    }
  }
  return number;
}
/**
 * Updates the manifest and package json files
 * with a new version string
 * @param {string} version A version number (x.x.x)
 * @returns {undefined}
 */
function updateJSONfiles(version) {

  let files = ['manifest.json', 'package.json'];

  files.forEach(file => {

    let data = JSON.parse(fs.readFileSync(file));

    data.version = version;
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    // add new line to end of file
    fs.appendFileSync(file, '\n');

    console.log(`✅  Updated ${file} to ${version}.`);
  });
}

/**
 * Updates the readme markdown file with
 * new badge stats.
 * @returns {undefined}
 */
function updateBadgeData() {

  let readme = fs.readFileSync('readme.md', 'utf8'),
      ratingRegex = /\d*\.*\d/,
      strUsers = /\d\.*\dk/g,
      strRating = /\d\.\d*%2F5/g,
      strVotes = /\d+%20/g,
      nums = /\w+/g;

  rating = parseFloat(rating.match(ratingRegex));
  votes = parseInt(votes.match(nums));
  users = abbrNum(users, 1);

  readme = readme.replace(strUsers, `${users}`)
                 .replace(strRating, `${rating}%2F5`)
                 .replace(strVotes, `${votes}%20`);

  fs.writeFileSync('readme.md', readme);

  console.log(`✅  Updated badges with new data: Users: ${users}, Rating: ${rating}, Votes: ${votes}`);
}

/**
 * Validates that the version string is in
 * the correct format
 * @param {string} version The version number
 * @returns {undefined}
 */
function validateVersion(version) {

  let pattern = /\d+\.\d+\.\d/;

  if ( !version ) return console.log('⚠️  Error: No version argument was passed.');

  if ( !pattern.test(version) ) return console.log('⚠️  Error: Invalid version.');

  return true;
}

// ========================================================
// Init
// ========================================================

// Kick things off...
if ( validateVersion(newVersion) ) {

  updateJSONfiles(newVersion);

  // If true was passed update the badges
  if ( updateBadges ) {

    console.log('🕐  Getting new badge data...');

    puppeteer.launch().then(async browser => {

      let page = await browser.newPage(),
          regex = /\d+/g,
          userData;

      await page.goto(url);
      await page.waitFor('.KnRoYd-N-nd');

      rating = await page.evaluate(() => document.querySelector('.e-f-Sa-L .KnRoYd-N-k').title);
      votes = await page.evaluate(() => document.querySelector('.KnRoYd-N-nd').textContent);
      userData = await page.evaluate(() => document.querySelector('.e-f-ih').textContent);
      users = userData.match(regex).reduce((a, n) => a + n);
      browser.close();
      updateBadgeData();
    });
  }
}
