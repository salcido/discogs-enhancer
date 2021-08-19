/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * The new Release page uses GraphQL and requires a hash as part of the
 * request to return the release data. The hash is a build artifact that
 * can change anytime so this script monitors the page requests and
 * updates the hashes when they change so that requests made by
 * the extension will be successful.
 */

 function onRequestsObserved(batch) {
  let name = batch.getEntries()[0].name;
  // Release Data
  if (name.includes('DeferredReleaseData')) {
    let hash = extractHash(name);
    updateHash('releaseHash', hash);
  }
  // User Data
  if (name.includes('UserReleaseData')) {
    let hash = extractHash(name);
    updateHash('userHash', hash);
  }
}

/**
* Writes a hash string to the userPreferences object in localStorage
* @param {string} hashName - The property name of the hash string: releaseHash || userHash
* @param {string} hash - The hash extracted from the GET request
*/
function updateHash(hashName, hash) {
  let savedHash = rl.getPreference(hashName);

  if ( !savedHash || savedHash && savedHash !== hash ) {
    rl.setPreference(hashName, hash);
  }
}

/**
* Retrieves the hash string from the network requests
* @param {string} name - The get request url made in the background
* @returns {string} - The sha256Hash value from the request parameters
*/
function extractHash(name) {

  let uri = decodeURIComponent(name),
      object = uri.toString().split('extensions='),
      hash = JSON.parse(object[1]).persistedQuery.sha256Hash;

  return hash;
}

if ( rl.pageIs('release') ) {
  let requestObserver = new PerformanceObserver(onRequestsObserved);
  requestObserver.observe( { type: 'resource' } );
}
