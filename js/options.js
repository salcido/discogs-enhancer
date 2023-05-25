// Settings that we want to fetch
const settings = ['host', 'port', 'user'];

// Fetch and populate the settings
chrome.storage.sync.get(settings, function (items) {
    if (!Object.keys(items).length) {
        console.error('Error getting items with the following keys', settings);
        return;
    }
    console.log('Successfully fetched settings', items);
    // Assign the stored values to the input field
    for (const setting of settings) {
        if (items[setting]) {
            document.getElementById(setting).value = items[setting];
        }
    }
});

// Save settings
document
    .getElementById('settings')
    .addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting
        const values = settings.reduce((obj, setting) => {
            obj[setting] = document.getElementById(setting).value;
            return obj;
        }, {});
        chrome.storage.sync.set(values, function () {
            console.log('Successfully saved settings');
        });
    });
