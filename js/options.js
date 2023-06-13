// Settings that we want to fetch
const settings = ['username'];

// Fetch and populate the settings
chrome.storage.sync.get(['username'], function (items) {
    if (!Object.keys(items).length) {
        console.error('Error getting username', settings);
        return;
    }
    console.log('Successfully fetched settings', items);
    // Assign the stored values to the input field
    if (items.username) {
        document.getElementById('username').value = items.username;
    }
});

// Save settings
document
    .getElementById('settings')
    .addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting
        chrome.storage.sync.set({
            username: document.getElementById('username').value,
        }, function () {
            console.log('Successfully saved settings');
        });
    });
