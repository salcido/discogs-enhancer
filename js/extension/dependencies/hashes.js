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
 const USER_TYPE = 'UserReleaseData',
       RELEASE_TYPE = 'DeferredReleaseData',
       MASTER_TYPE = 'DeferredMasterData';

 let releaseDataObserver,
     masterDataObserver,
     userDataObserver,
     releaseHash = '',
     masterHash = '',
     userHash = '',
     userData = '';


function onReleaseRequestsObserved(batch) {
  let name = batch.getEntries()[0].name;
  // Release Data
  if (name.includes(RELEASE_TYPE)) {
    releaseHash = extractHash(name);
    updateHash('releaseHash', releaseHash);
    releaseDataObserver.disconnect();
  }
}

function onMasterRequestsObserved(batch) {
  let name = batch.getEntries()[0].name;
  // Master Data
  if (name.includes(MASTER_TYPE)) {
    masterHash = extractHash(name);
    updateHash('masterHash', masterHash);
    masterDataObserver.disconnect();
  }
}

function onUserRequestsObserved(batch) {
  let name = batch.getEntries()[0].name;
  // User Data
  if (name.includes(USER_TYPE)) {
    userHash = extractHash(name);
    updateHash('userHash', userHash);
    userDataObserver.disconnect();
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

function fetchData(type, hash, releaseId) {
  return new Promise((resolve) => {
    let url = `/internal/release-page/api/graphql?operationName=${type}&variables={"discogsId":${releaseId}}&extensions={"persistedQuery":{"version":1,"sha256Hash":"${hash}"}}`;
    return fetch(url)
      .then(response => response.json())
      .then(res => {
        if (type === USER_TYPE) {
          userData = res.data.release.collectionItems.edges;
          return resolve(userData);
        }

        if (type === RELEASE_TYPE) {
          // TODO: just return release and have feature grab review count
          let releaseData = res.data.release?.reviews?.totalCount || 0;
          return resolve(releaseData);
        }

        if (type === MASTER_TYPE) {
          let masterData = res.data.masterRelease?.reviews?.totalCount || 0;
          return resolve(masterData);
        }
    }).catch(err => console.log(`Discogs Enhancer could not fetchData for ${type}`, err));
  });
}

window.getUserData = function getUserData(releaseId) {
  return new Promise((resolve) => {
    if (userData) {
      return resolve(userData);
    } else {
      let usrHash = rl.getPreference('userHash');
      return resolve(fetchData(USER_TYPE, usrHash, releaseId));
    }
  });
};

window.getReleaseData = function getReleaseData(releaseId) {
  return new Promise((resolve) => {
    let rlsHash = rl.getPreference('releaseHash');
    return resolve(fetchData(RELEASE_TYPE, rlsHash, releaseId));
  });
};

window.getMasterData = function getMasterData(masterId) {
  return new Promise((resolve) => {
    let mstrHash = rl.getPreference('masterHash');
    return resolve(fetchData(MASTER_TYPE, mstrHash, masterId));
  });
};

// ========================================================
// DOM setup
// ========================================================
if ( rl.pageIs('release') || rl.pageIs('master') ) {

  releaseDataObserver = new PerformanceObserver(onReleaseRequestsObserved);
  masterDataObserver = new PerformanceObserver(onMasterRequestsObserved);
  userDataObserver = new PerformanceObserver(onUserRequestsObserved);

  releaseDataObserver.observe( { type: 'resource' } );
  masterDataObserver.observe( { type: 'resource' } );
  userDataObserver.observe( { type: 'resource' } );
}
