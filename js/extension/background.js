/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This is the background service worker. It handles setting up the initial
 * feature preferences, badge notifications, and adding / removing
 * contextual menu items.
 *
 */

// ========================================================
// Default preferences upon installing
// ========================================================
let prefs = {
  absoluteDate: false,
  averagePrice: false,
  baoiFields: false,
  blockBuyers: false,
  blockSellers: true,
  confirmBeforeRemoving: false,
  collectionBoxFix: false,
  compactArtist: false,
  converter: true,
  darkTheme: false,
  darkThemeVariant: '',
  darkThemeSystemPref: false,
  demandIndex: false,
  editingNotepad: false,
  everlastingMarket: true,
  favoriteSellers: true,
  feedback: true,
  filterMediaCondition: false,
  filterMediaConditionValue: 7,
  filterPrices: false,
  filterShippingCountry: false,
  filterSleeveCondition: false,
  filterSleeveConditionValue: 7,
  filterUnavailable: false,
  forceDashboard: false,
  formatShortcuts: true,
  fullWidthPages: false,
  hideMinMaxColumns: false,
  highlightMedia: true,
  inventoryRatings: false,
  notesCount: true,
  quickSearch: false,
  quickSearchTracklists: false,
  randomItem: false,
  ratingPercent: false,
  readability: false,
  relativeSoldDate: false,
  releaseScanner: false,
  releaseDurations: true,
  releaseRatings: false,
  removeFromWantlist: false,
  sellerItemsInCart: false,
  sellerRep: false,
  shoppingSpreeMode: false,
  sortButtons: true,
  sortByTotalPrice: false,
  suggestedPrices: false,
  tweakDiscrims: false,
  userCurrency: 'USD',
  ytPlaylists: false,
  //
  useAllDay: false,
  useBandcamp: false,
  useBeatport: false,
  useBoomkat: false,
  useCDandLP: false,
  useClone: false,
  useDecks: false,
  useDeejay: false,
  useDiscogs: true,
  useEarcave: false,
  useEbay: false,
  useGramaphone: false,
  useHardwax: false,
  useJuno: false,
  useMediations: false,
  useNorman: false,
  useOye: false,
  usePhonica: false,
  useRateYourMusic: false,
  useRedeye: false,
  useRubadub: false,
  useRushhour: false,
  useSotu: false,
  useSoundcloud: false,
  useTraxsource: false,
  useYoutube: false
};

// NOTE: featureDefaults are default settings for the chrome.storage.sync'd preferences of features
// that have submenus / management pages (block sellers, filter countries, etc...)
// Features that use localStorage to save things on the DOM side need to be saved outside
// of `featureData` since they will get overwritten when the `newPrefs` object is created
// in user-preferences.js.
let featureDefaults = {
      blockList: { list:[], hide: 'tag' },
      countryList: { list: [], currency: false, include: false },
      discriminators: {
          hide: false,
          superscript: true,
          unselectable: true,
          transparent: false,
        },
      favoriteList: { list: [] },
      filterPrices: { minimum: 0, maximum: 100 },
      linksInTabs: {
          artists: false,
          collection: false,
          dashboard: false,
          labels: false,
          lists: false,
          marketplace: false,
          releases: false,
          wantlist: false,
        },
      mediaCondition: 7,
      minimumRating: 4.5,
      navbarShortcuts: {
        collection: false,
        inventory: false,
        itemsIWant: false,
        orders: false,
        purchases: false,
        subsAndDrafts: false,
      },
      readability: {
          indexTracks: false,
          nth: 10,
          otherMediaReadability: true,
          otherMediaThreshold: 15,
          size: 0.5,
          vcReadability: true,
          vcThreshold: 8
        },
      sellerRep: 99,
      sellerRepColor: 'darkorange',
      sellerRepFilter: false,
      sellerRepFilterNewSellers: false,
      sleeveCondition: { value: 7, generic: false, noCover: false },
      usDateFormat: false,
    };

// ========================================================
// Install/Update Notifications
// ========================================================
chrome.runtime.onInstalled.addListener((details) => {

  let previousVersion,
      thisVersion;

    if (details.reason === 'install') {

      chrome.storage.sync.set({
        didUpdate: false,
        prefs: prefs,
        featureData: featureDefaults,
        migrated: true,
        uid: Math.random().toString(16).slice(2)
      }).then(() => console.log('Welcome to the pleasuredome!'));

      // Launch quick start guide
      chrome.tabs.create({ url: '../html/welcome.html' });

    } else if (details.reason === 'update') {
      // - Don't show an update notice on patches -
      previousVersion = details.previousVersion.split('.');

      thisVersion = chrome.runtime.getManifest().version.split('.');

      if ( Number(thisVersion[0]) > Number(previousVersion[0])
           || Number(thisVersion[1]) > Number(previousVersion[1]) ) {

          chrome.action.setBadgeText({text: ' '});

          chrome.action.setBadgeBackgroundColor({color: '#4cb749'});

          chrome.storage.sync.set({ didUpdate: true }, function() {});
      }
    }

  // Uninstall action
  if ( details.reason === chrome.runtime.OnInstalledReason.INSTALL ) {
    chrome.runtime.setUninstallURL('https://www.discogs-enhancer.com/uninstall');
  }
  // Instantiate Contextual Menu Options
  updateContextMenus();
});

// ========================================================
// Contextual Menus
// ========================================================
/**
 * Creates a context menu in Chrome
 * @param {string} name - The name that is displayed in the context menu
 */
function createContextMenu(name) {

  let id = name.split(' ').join('').toLowerCase();

  chrome.contextMenus.create({
    contexts: ['selection'],
    id: id,
    title: 'Search for "%s" on ' + name
  });
}

/**
 * Creates contextual menus based on the user's saved preferences
 * @returns {undefined}
 */
function updateContextMenus() {
  chrome.storage.sync.get('prefs', ({ prefs }) => {

    // Add Discogs on install
    if (!prefs) {
      createContextMenu('Discogs');
    }
    // Put Discogs first...
    if (prefs.useDiscogs) createContextMenu('Discogs');
    // Then the remaining stores in alphabetical order
    if (prefs.useAllDay) createContextMenu('All Day');
    if (prefs.useBandcamp) createContextMenu('Bandcamp');
    if (prefs.useBeatport) createContextMenu('Beatport');
    if (prefs.useBoomkat) createContextMenu('Boomkat');
    if (prefs.useCDandLP) createContextMenu('CDandLP');
    if (prefs.useClone) createContextMenu('Clone');
    if (prefs.useDecks) createContextMenu('Decks');
    if (prefs.useDeejay) createContextMenu('DeeJay');
    if (prefs.useEarcave) createContextMenu('Earcave');
    if (prefs.useEbay) createContextMenu('eBay');
    if (prefs.useGramaphone) createContextMenu('Gramaphone');
    if (prefs.useHardwax) createContextMenu('Hardwax');
    if (prefs.useJuno) createContextMenu('Juno');
    if (prefs.useMeditations) createContextMenu('Meditations');
    if (prefs.useNorman) createContextMenu('Norman');
    if (prefs.useOye) createContextMenu('Oye');
    if (prefs.usePhonica) createContextMenu('Phonica');
    if (prefs.useRateYourMusic) createContextMenu('Rate Your Music');
    if (prefs.useRedeye) createContextMenu('Red Eye');
    if (prefs.useRubadub) createContextMenu('Rubadub');
    if (prefs.useRushhour) createContextMenu('Rush Hour');
    if (prefs.useSotu) createContextMenu('SOTU');
    if (prefs.useSoundcloud) createContextMenu('Soundcloud');
    if (prefs.useTraxsource) createContextMenu('Traxsource');
    if (prefs.useYoutube) createContextMenu('YouTube');
  });
}

// ========================================================
// Contextual Menu Add / Remove
// ========================================================
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(msg) {

    if (msg.request === 'updateContextMenu') {
      chrome.contextMenus.removeAll();
      updateContextMenus();
    }
  });
});

// ========================================================
// Contextual Menu Event Listeners
// ========================================================
chrome.contextMenus.onClicked.addListener((event) => {

  let path,
      suffix = '';

  switch (event.menuItemId) {
    case 'allday':
      path = 'https://www.alldayrecords.com/search?type=product&q=';
      break;

    case 'bandcamp':
      path = 'https://bandcamp.com/search?q=';
      break;

    case 'beatport':
      path = 'https://www.beatport.com/search?q=';
      break;

    case 'boomkat':
      path = 'https://boomkat.com/products?q[keywords]=';
      break;

    case 'cdandlp':
      path = 'https://www.cdandlp.com/search/?q=';
      break;

    case 'clone':
      path = 'https://clone.nl/all/search?query=';
      break;

    case 'decks':
      path = 'https://www.decks.de/decks/workfloor/search_db.php?such=';
      break;

    case 'deejay':
      path = 'http://www.deejay.de/';
      break;

    case 'discogs':
      path = 'http://www.discogs.com/search?q=';
      break;

    case 'earcave':
      path = 'https://earcave.com/search?type=product&q=';
      break;

    case 'ebay':
      path = 'https://www.ebay.com/sch/i.html?&_nkw=';
      break;

    case 'gramaphone':
      path = 'https://gramaphonerecords.com/search?q=';
      break;

    case 'hardwax':
      path = 'https://hardwax.com/?find=';
      break;

    case 'juno':
      path = 'https://www.juno.co.uk/search/?q%5Ball%5D%5B%5D=';
      break;

    case 'meditations':
      path = 'https://meditations.jp/a/search?type=product&q=';
      break;

    case 'norman':
      path = 'https://www.normanrecords.com/cloudsearch/index.php?q=';
      break;

    case 'oye':
      path = 'https://oye-records.com/search?q=';
      break;

    case 'phonica':
      path = 'http://www.phonicarecords.com/search/';
      break;

    case 'rateyourmusic':
      path = 'https://rateyourmusic.com/search?searchterm=';
      suffix = '&type=l';
      break;

    case 'redeye':
      path = 'https://www.redeyerecords.co.uk/search/?searchType=Artist&keywords=';
      suffix = '&type=l';
      break;

    case 'rubadub':
      path = 'https://rubadub.co.uk/search?q=';
      break;

    case 'rushhour':
      path = 'http://www.rushhour.nl/search?sort_by=&query=';
      break;

    case 'sotu':
      path = 'https://soundsoftheuniverse.com/search/';
      suffix = '/';
      break;

    case 'soundcloud':
      path = 'https://soundcloud.com/search?q=';
      break;

    case 'traxsource':
      path = 'https://www.traxsource.com/search?term=';
      break;

    case 'youtube':
      path = 'https://www.youtube.com/results?search_query=';
      break;
  }

  let str = event.selectionText,
      encodeStr = encodeURIComponent(str);

  // Some shops can't handle encoded URIs
  if ( path.includes('phonica') ) {
    encodeStr = str.replace(/ /g, '-');
  }

  if ( path.includes('meditations') ) {
    encodeStr = str.replace(/ /g, '+');
  }

  if ( path.includes('sotu') ) {
    encodeStr = str.replace(/ /g, '+');
  }

  if ( path.includes('juno') ) {
    encodeStr = str.replace('–', '');
  }


  chrome.tabs.create({ url: path + encodeStr + suffix });
});

/**
 * Iterates over the features array and looks for any enabled
 * features that are contained within it.
 * @param {Array} features - An array of feature names returned from /issues endpoint
 * @returns {Boolean}
 */
async function hasFeatureEnabled(features) {

  let featureEnabled = false,
      { prefs } = await chrome.storage.sync.get('prefs');

  for ( let [key] of Object.entries(prefs) ) {
    if ( features.includes('any') || prefs[key] && features.includes(key) ) {
      featureEnabled = true;
    }
  }

  return featureEnabled;
}

/**
 * Compares version numbers and returns a boolean
 * which is used to display a note about any known site issues.
 * @param {String} vA - Current version - a version string (1.0.0)
 * @param {String} vB - Version with issue - a version string (1.0.1)
 * @returns {boolean}
 */
function compareVersions(vA, vB) {
  return vA.localeCompare(vB, undefined, { numeric: true }) <= 0;
}

/**
 * Fetches known issues from discogs-enhancer.com/issues
 * @returns {Object} - Performance issue data: { content: <string>, version: <string>, features: <array>, url: string }
 */
function getIssues() {
  return chrome.storage.sync.get(['featureData']).then(async ({ featureData }) => {

    let url = 'https://discogs-enhancer.com/issues',
        { blockList } = featureData;

    if (blockList
        && blockList.list
        && blockList.list.includes('development')
      ) {
      url = 'http://localhost:3000/issues';
    }

    return fetch(url)
      .then(async response => {

        let res = await response.json(),
            { didUpdate } = await chrome.storage.sync.get('didUpdate'),
            manifest = chrome.runtime.getManifest(),
            thisVersion = manifest.version,
            versionWithIssue = res.version;

        if ( res.content
              && res.content.length
              && didUpdate === false
              && compareVersions(thisVersion, versionWithIssue)
              && await hasFeatureEnabled(res.features) ) {

          chrome.action.setBadgeText({ text: '⚠' });
          chrome.action.setBadgeBackgroundColor({ color: 'orange' });

        } else if ( didUpdate === false ) {
          chrome.action.setBadgeText({ text:'' });
        }
      })
      .catch(() => {
        return { content: null, version: null, features: [], url: null };
      });
  });
}

/**
 * Calls getIssues() when features are toggled which will show or hide
 * the alert icon on the extension in the browser's toolbar depending
 * on the features contained in the response from the issues API endpoint
 */
chrome.storage.onChanged.addListener(() => {
  getIssues();
});
