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
const path = require('path');

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

  let files = ['package.json', 'package-lock.json'];

  files.forEach((file) => {

    let filePath = path.resolve(__dirname, file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Skipped ${file}, not found.`);
      return;
    }

    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    data.version = version;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');

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
