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
 * Run it in the terminal like `npm run bump <version number>`
 *
 */

const fs = require('fs');

// new version number {string}
const newVersion = process.argv[2];

// ========================================================
// Functions (Alphabetical)
// ========================================================
/**
 * Updates the manifest and package json files
 * with a new version string
 * @param {string} version A version number (x.x.x)
 * @returns {undefined}
 */
function updateJSONfiles(version) {

  let files = [
    './chrome-dist/manifest.json',
    './firefox-dist/manifest.json',
    'package.json',
    'package-lock.json'
  ];

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
}
