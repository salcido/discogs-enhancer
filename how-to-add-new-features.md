# Adding a new feature to Discogs Enhancer

This is intended to give you a basic overview of how to add a new feature to Discogs Enhancer.

In order to add a simple, togglable feature to the extension, you'll need to update the files listed below. This guide assumes you've added a new `<feature>.js` file to `js/extension/features/` that does not require additional `CSS` files, configuration pages, or submenus. Features that require their own configuration pages or submenus are more complex and are out of scope for this guide. I plan on adding a more in-depth guide in the future.

## background.js

- Add a new property to the `prefs` object of `background.js`. It should be a `boolean` and have a unique name that easily identifies the feature. Make sure to add the property in the corrrect alphabetical position.

- Add a conditional check for the new `prefs` property under the `User Preferences` comment block. This should check the preference and create a DOM element that contains the necessary script files for the new feature.

#### Example:

```javascript
  if ( result.prefs.releaseRatings ) {

    let releaseRatings = document.createElement('script');

    releaseRatings.type = 'text/javascript';
    releaseRatings.src = chrome.extension.getURL('js/extension/features/release-ratings.js');
    releaseRatings.className = 'de-init';

    elems.push(releaseRatings);
  }
```

## popup.html

- Update `popup.html` with the new preference menu option. Make sure to update the markup with a unique `id`, help-bubble text, and meta keywords.

#### Example:

```html
    <!-- title of the new feature -->
    <div class="toggle-group">
      <p class="label">title of the new feature</p>
      <div class="meta hide">key words that represent the feature go here. These are used when using the search bar.</div>

      <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="toggleNewFeatureName" checked>
        <label class="onoffswitch-label" for="toggleNewFeatureName">
          <span class="onoffswitch-inner"></span>
          <span class="onoffswitch-switch"></span>
        </label>
      </div>

      <div class="help">
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

## manifest.json and webpack.config.js

- Update `webpack.config.js` and `manifest.json` with the paths to the new feature files.

#### Example:

`manifest.json`

```JSON
  "js/extension/features/release-ratings.js",
```

`webpack.config.js`

```javascript
  [features + 'release-ratings']: `${features}release-ratings.js`,
```

## utils.js

- Update the `applySave` method in `utils.js` with the same property name used in `background.js`. Be sure to reference the `id` set in the `popup.html` markup.

#### Example:

```javscript
  releaseDurations: document.getElementById('toggleReleaseDurations').checked,
```

## popup.js

Make the following changes to `popup.js`:
- Update the `load` eventListener  with the new property.
- Add a new `change` eventListener under the `Event listeners for toggles` comment block.
- Update the `chrome.storage.sync.get` callback with the new property.

## learn.html

Add the feature description to `learn.html`. Make sure to insert the new markup block in the correct alphabetical order.

#### Example:

```HTML
    <div class="feature-block">
      <!-- Feature Name -->
      <h2 id="featureName">Feature Name</h2>

      <p>Supporting text describing how the feature works.</p>
      <!-- supporting image(s) if needed -->
      <img src="../img/learn/feature-image.png" class="max-width" />
    </div>
```

## Build The Extension

Since we've made changes to `webpack`, we'll need to rebuild the extension by running `npm run build`. This will create a fresh version of the extension with the new feature assets. Once the build is finished, load the extension in Chrome by going to `chrome://extensions`, make sure `Developer Mode` is checked, then click 'Load unpacked' and choose the newly exported `dist` folder. You can now enable the feature from the popup menu.
