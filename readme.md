<p align="center">
  <img width="360" src="https://github.com/salcido/Discogs-Enhancer/blob/master/assets/de-logo.gif" alt="Discogs Enhancer" style="height: 100%;">
</p>


<p align="center">
  <a href="https://travis-ci.com/salcido/discogs-enhancer">
    <img src="https://img.shields.io/travis/salcido/discogs-enhancer/master?style=for-the-badge" alt="Build Status">
  </a>
  <a href="https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn">
    <img src="https://img.shields.io/badge/users-6.5k-brightgreen?style=for-the-badge" alt="Chrome Web Store">
  </a>
  <a href="https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn">
    <img src="https://img.shields.io/badge/rating-4.85%2F5-blue?style=for-the-badge" alt="Chrome Web Store">
  </a>
  <img src="https://img.shields.io/badge/License-GPL%203.0-blue.svg?style=for-the-badge" alt="License GPL 3.0">
</p>

***

#### Project Overview

100% vanilla JS Chrome extension for Discogs.com.

<https://www.discogs-enhancer.com>

#### Chrome Webstore Link
<https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn>

## A Web Extension for Chrome

Discogs Enhancer adds extra features to both Discogs.com and Chrome. You can block sellers, use a dark theme, see price comparisons, get feedback notifications, convert foreign currencies, search Discogs and other online record shops with any highlighted text, improve tracklist readability, customize lots of Marketplace aspects, and more! Every feature is optional so you can choose the features you want to use.

### Features

* Block Sellers
* Block Buyer Shortcuts
* Favorite Sellers
* Compare suggested prices to listed prices
* Contextual menu searching
* Ask for confirmation before removing items from your Collection
* Quick currency conversion
* Dark Theme (WCAG 2.0 AA compliant)
* Demand Index
* Scan Artist/Label releases for comments
* Scan your seller inventory for items priced below the median Marketplace value
* Tweak Artist/Label Discriminators
* Everlasting Collection
* Everlasting Marketplace
* Buyer/Seller feedback notifications
* Seller inventory ratings
* Get larger BAOI fields when editing releases
* Tag Sellers based on reputation
* Filter Marketplace items by media condition
* Filter Marketplace items by sleeve condition
* Filter Marketplace items by shipping country
* Filter Marketplace items by availability
* Filter Marketplace items by price
* Open items in Lists in new tabs
* Editing notepad for Releases
* Search Google for releases by clicking on the release title
* Hide Min, Median, Max columns on the Collection page
* Marketplace Media/Sleeve condition highlights
* See the number of ratings/votes a release received in the Marketplace
* See icons next to seller's names in the Marketplace when you have items of theirs in your cart
* See release ratings/votes expressed as a percentage
* Notes character counter
* See actual dates an item was added to your Collection/Wantlist
* See the relative date an item was last sold in the Marketplace
* See the average sale price on the Release page
* Tag seller's names with an icon in the Marketplace when you have an item of theirs in your cart
* View a random item from your collection from any page
* Remove an item from your Wantlist directly from the Marketplace
* See the total playing time for any release when track times are provided
* Sort dialog boxes and Marketplace filters alphabetically
* Easily format comments/reviews using Text Formatting Shortcuts
* Improve Tracklist readability

## Performance

Discogs Enhancer gets a near perfect score with [Google's Lighthouse](https://developers.google.com/web/tools/lighthouse/) when it comes to impact on user experience. Audit was performed using [Exhouse](https://github.com/treosh/exthouse) in June of 2019.

![Discogs Enhancer flow overview](https://github.com/salcido/Discogs-Enhancer/blob/master/assets/performance-audit.png "Discogs Enhancer Lighthouse Audit: 96/100")

## Overview
![Discogs Enhancer flow overview](https://github.com/salcido/Discogs-Enhancer/blob/master/assets/de-flow-overview.png "Discogs Enhancer flow overview")

***

#### Installation

* `git clone https://github.com/salcido/discogs-enhancer.git`
* change into the new directory
* `npm install`

#### Running / Development

* Watch for changes:
  * `npm run watch`

#### Testing

* Run `unauthenticated` functional tests:

  * `npm test`


* Run `authenticated` functional tests:
  > Note: If you want to run authenticated tests you'll need an account to log in with and run them with one of the commands below. When running the `authenticated` tests, the `unauthenticated` tests will also be run.

  * `env USERNAME=<username> env PASSWORD=<password> npm test`
    * This will try to log you in automatically using Discogs authentication.
  * `env USEOAUTH=true npm test`
    * This will pop up the login page to allow you to manually login via supported OAuth providers; Google, Facebook, or Apple.


#### Building
* Export the extension to `dist` directory:
  * `npm run build:production`
  * Go to `chrome://extensions` in a new Chrome tab
  * Click "Developer Mode" in the upper-right corner
  * Click "Load Unpacked" and choose the exported `dist` folder and you're done!

***

## Functional Tests
<details>
  <summary>Test Checklist (33/37)</summary>
  <p>

  #### AUTHENTICATED
  - [ ] Better Collection UI
  - [ ] Block Buyers _(Requires user w/ sales history)_
  - [ ] Everlasting Collection
  - [ ] Feedback Notifications _(Requires user w/ Buyer/Seller feedback)_
  - [x] Hide Min/Med/Max columns
  - [x] Larger BAOI Fields
  - [x] Notes Counter
  - [x] Random Item
  - [x] Remove From Wantlist Shortcuts
  - [x] Seller Items In Cart
  - [x] Show Actual Add Date
  - [x] Show Average Prices
  - [x] Suggested Prices
  - [x] Text Format Shortcuts

  #### UNAUTHENTICATED
  - [x] Block Sellers
  - [x] Blurry Image Fix
  - [x] Favorite Sellers
  - [x] Filter Sleeve Condition
  - [x] Inventory Ratings
  - [x] Seller Rep
  - [x] Currency Converter
  - [x] Dark Theme
  - [x] Everlasting Marketplace
  - [x] Filter Media Condition
  - [x] Filter Shipping Country
  - [x] Large YouTube playlists
  - [x] Lists In New Tabs
  - [x] Marketplace Condition Highlights
  - [x] Quick Search
  - [x] Rating Percentage
  - [x] Relative Last Sold Dates
  - [x] Release Durations
  - [x] Release Ratings
  - [x] Release Scanner
  - [x] Sort Buttons
  - [x] Tracklist Readability
  - [x] Tweak Discriminators

  </p>
</details>

***

## 🏗 Adding a Feature

In order to add a togglable feature to the extension you'll need to update the files listed below. This guide assumes you've added a new `<feature>.js` file to `js/extension/features/` and that it does not require additional CSS files, configuration pages, or submenus. Features that require their own configuration pages or submenus are more complex and are out of scope for this guide.

### 1️⃣ background.js

- Add a new property to the `prefs` object of `background.js`. It should be a `boolean` and have a unique name that easily identifies the feature. Make sure to add the property in the correct alphabetical position.

### 2️⃣ user-preferences.js

- Add a conditional check for the new `prefs` property under the `User Preferences` comment block. This should check the preference and create a DOM element that contains the necessary script files for the new feature.

> Example:

```javascript
  if ( result.prefs.featureName ) {

    let featureName = document.createElement('script');

    featureName.type = 'text/javascript';
    featureName.src = chrome.extension.getURL('js/extension/features/feature-name.js');
    featureName.className = 'de-init';

    elems.push(featureName);
  }
```

### 3️⃣ popup.html

- Modify `popup.html` with the new preference menu option. Update the markup with a unique `id`, help-bubble text, and meta keywords. Make sure to add the markup in the correct alphabetical position.

> Example:

```html
    <!-- title of the new feature -->
    <div class="toggle-group">
      <p class="label">title of the new feature</p>
      <div class="meta hide">Keywords that represent the feature go here. These are used as metadata when searching.</div>

      <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="toggleNewFeatureName" checked>
        <label class="onoffswitch-label" for="toggleNewFeatureName">
          <span class="onoffswitch-inner"></span>
          <span class="onoffswitch-switch"></span>
        </label>
      </div>

      <div class="help feature-name">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle" color="#384047"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>
        <div class="help-bubble">
          <div class="help-text">
            A short description of the new feature goes here.
          </div>
          <div class="arrow-right stroke"></div><div class="arrow-right"></div>
        </div>
      </div> <!-- /.help -->
    </div>
  ```

### 4️⃣ manifest.json and webpack.config.js

- Modify `webpack.config.js` with the paths to the new feature files.

> Example:

`webpack.config.js`

```javascript
  [features + 'feature-name']: `${features}feature-name.js`,
```

### 5️⃣ utils.js

- Update the `applySave` method in `utils.js` with the same property name used in `background.js`. Be sure to reference the `id` set in the `popup.html` markup and add the property in the correct alphabetical position.

> Example:

```javascript
export function applySave(message, event) {

  let prefs = {
    ...
    featureName: document.getElementById('toggleFeatureName').checked,
    ...
  }
}
```

### 6️⃣ popup.js

Make the following changes to `popup.js`:
- Update the `load` eventListener  with the new property.
- Add a new `change` eventListener under the `Event listeners for toggles` comment block.
- Update the `chrome.storage.sync.get` callback with the new property.

### 7️⃣ learn.html

Add the feature description to `learn.html`. Make sure to insert the new markup block in the correct alphabetical order.

> Example:

```HTML
    <div class="feature-block">
      <!-- Feature Name -->
      <h2 id="featureName">Feature Name</h2>

      <p>Supporting text describing how the feature works.</p>
      <!-- supporting image(s) if needed -->
      <img src="../img/learn/feature-image.png" class="max-width" />
    </div>
```

### 📦 Build The Extension

Since changes have been made to `webpack`, the extension will need to be rebuilt by running `npm run build`. Once the build is finished, load the extension in Chrome by going to `chrome://extensions`. Make sure `Developer Mode` is checked, then click 'Load unpacked' and choose the newly exported `dist` folder. You should now be able to enable the feature from the popup menu.

***

## Author

* **Matthew Salcido** - [salcido](https://github.com/salcido)
<a href="https://www.buymeacoffee.com/salcido" rel="nofollow">
 <img src="https://github.com/salcido/Discogs-Enhancer/blob/master/img/learn/coffee-btn.png" alt="Buy Me A Coffee" style="max-width: 100%;">
</a>

## License

This project is licensed under the GPL License - see the [LICENSE](LICENSE) file for details
