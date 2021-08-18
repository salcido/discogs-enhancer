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
      let releaseHash = rl.getPreference('releaseHash'),
          hash = extractHash(batch);

      if (!releaseHash || releaseHash && releaseHash !== hash) {
        rl.setPreference('releaseHash', hash);
      }
    }
    // User Data
    if (name.includes('UserReleaseData')) {
      let userHash = rl.getPreference('userHash'),
          hash = extractHash(batch);

      if (!userHash || userHash && userHash !== hash) {
        rl.setPreference('userHash', hash);
      }
    }
}

function extractHash(batch) {
  let name = batch.getEntries()[0].name,
      uri = decodeURIComponent(name),
      object = uri.toString().split('extensions='),
      hash = JSON.parse(object[1]).persistedQuery.sha256Hash;

  return hash;
}

let requestObserver = new PerformanceObserver(onRequestsObserved);
requestObserver.observe( { type: 'resource' } );


