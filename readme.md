# Discogs Enhancer

[![Chrome Web Store](https://img.shields.io/badge/users-3.4k-brightgreen.svg)](https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/fljfmblajgejeicncojogelbkhbobejn.svg)](https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating-count/fljfmblajgejeicncojogelbkhbobejn.svg?color=blue&label=rating%20count)](https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn)
 ![License GPL 3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)

#### Project Overview

100% vanilla JS Chrome extension for Discogs.com.

<https://www.discogs-enhancer.com>

#### Chrome Webstore Link
<https://chrome.google.com/webstore/detail/discogs-enhancer/fljfmblajgejeicncojogelbkhbobejn>

## A Web Extension for Chrome

Discogs Enhancer adds extra features to both Discogs.com and Chrome. You can block sellers, use a dark theme, see price comparisons, get feedback notifications, convert foreign currencies, search Discogs and other online record shops with any highlighted text, improve tracklist readability, customize lots of Marketplace aspects, and more! Every feature is optional so you can choose the features you want to use.

### Features

* Block Sellers
* Favorite Sellers
* Compare suggested prices to listed prices
* Contextual menu searching
* Quick currency conversion
* Dark Theme (WCAG 2.0 AA compliant)
* Scan Artist/Label releases for comments
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
* Open release links from your Collection in new tabs
* Open items in Lists in new tabs
* Search Google for releases by clicking on the release title
* Hide Min, Median, Max columns on the Collection page
* Marketplace Media/Sleeve condition highlights
* See the number of ratings/votes a release received in the Marketplace
* See icons next to seller's names in the Marketplace when you have items of theirs in your cart
* See release ratings/votes expressed as a percentage
* Notes character counter
* See actual dates an item was added to your Collection/Wantlist
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
![Discogs Enhancer flow overview](https://github.com/salcido/Discogs-Enhancer/blob/master/assets/de-flow-overview.gif "Discogs Enhancer flow overview")

***

#### Installation

* `git clone https://github.com/salcido/discogs-enhancer.git` (this repository)
* change into the new directory
* `npm install`

#### Running / Development

* Watch for changes:
  * `npm run watch`

#### Building
* Export the extension to `dist` directory:
  * `npm run build`
  * Go to `chrome://extensions` in a new Chrome tab
  * Click "Developer Mode" in the upper-right corner
  * Click "Load Unpacked" and choose the exported `dist` folder and you're done!

***

## 🏗 Adding a Feature

In order to add a simple, togglable feature to the extension, you'll need to update the files listed below. This guide assumes you've added a new `<feature>.js` file to `js/extension/features/` and that it does not require additional CSS files, configuration pages, or submenus. Features that require their own configuration pages or submenus are more complex and are out of scope for this guide. I plan on adding a more in-depth guide in the future.

### 1️⃣ background.js

- Add a new property to the `prefs` object of `background.js`. It should be a `boolean` and have a unique name that easily identifies the feature. Make sure to add the property in the corrrect alphabetical position.

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

### 2️⃣ popup.html

- Modify `popup.html` with the new preference menu option. Update the markup with a unique `id`, help-bubble text, and meta keywords. Make sure to add the markup in the corrrect alphabetical position.

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

### 3️⃣ manifest.json and webpack.config.js

- Modify `manifest.json` and `webpack.config.js` with the paths to the new feature files.

> Example:

`manifest.json`

```JSON
  "js/extension/features/feature-name.js",
```

`webpack.config.js`

```javascript
  [features + 'feature-name']: `${features}feature-name.js`,
```

### 4️⃣ utils.js

- Update the `applySave` method in `utils.js` with the same property name used in `background.js`. Be sure to reference the `id` set in the `popup.html` markup and add the property in the corrrect alphabetical position.

> Example:

```javscript
export function applySave(message, event) {

  let prefs = {
    ...
    featureName: document.getElementById('toggleFeatureName').checked,
    ...
  }
}
```

### 5️⃣ popup.js

Make the following changes to `popup.js`:
- Update the `load` eventListener  with the new property.
- Add a new `change` eventListener under the `Event listeners for toggles` comment block.
- Update the `chrome.storage.sync.get` callback with the new property.

### 6️⃣ learn.html

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
