/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * The main header nav elements have been moved to
 * the shadow DOM which makes them inaccessible to css
 * that exists in the normal DOM. This is the workaround
 * which basically waits for the header wrap to exist, then
 * it injects these styles into the shadow DOM. It's not my
 * favorite thing.
 */
 rl.ready(() => {
  rl.waitForElement('[id^=__header_root_]').then(() => {

    let darkTheme = /*css*/`
          .de-dark-theme #notification-feed {
            background: var(--site-header-bg) !important;
          }
          .de-dark-theme header > [class*="_wrap"] {
            background: var(--site-header-bg) !important;
          }
          .de-dark-theme #notification-feed:hover {
            background: var(--black) !important;
          }
          .de-dark-theme .rnf-unseen-badge {
            outline: 2px solid var(--site-header-bg) !important;
          }
          .de-dark-theme img[class*="_avatar_"] {
            border: 1px solid var(--text-normal) !important;
          }
          .de-dark-theme form[class*="_search"] {
            border-radius: 4px;
            background: transparent;
          }
          .de-dark-theme form[class*="_search"]:not(:focus-within) {
            border-radius: 20px;
          }
          .de-dark-theme form[class*="_search"]:focus-within {
             outline: 2px solid var(--input-focus-border) !important;
             border-radius: 20px;
          }
          .de-dark-theme [class*=_logo_] svg {
            fill: var(--white) !important;
          }
          .de-dark-theme button[class*=_bars][class*=_isOpen] {
            background: var(--black) !important;
          }
          .de-dark-theme header[class*=_title_] {
            background: var(--black) !important;
          }
          .de-dark-theme div[class*="_wrapper"] button[class*="_dropdown"] {
            background: var(--site-header-bg) !important;
          }
          .de-dark-theme div[class*="_wrapper"] button[class*="_dropdown"]:hover,
          .de-dark-theme div[class*="_wrapper"][class*="_open"] button[class*="_dropdown"]:hover,
          .de-dark-theme div[class*=_dropdownWrap] {
            background: var(--black) !important;
          }
          .de-dark-theme div[class*=_tooltip_] {
            background: var(--black) !important;
          }
          .de-dark-theme button[type=submit] svg path {
            fill: var(--text-normal) !important;
          }
          .de-dark-theme button[type=submit],
          .de-dark-theme input {
            background: var(--input-bg) !important;
            color: var(--text-bold) !important;
          }
          .de-dark-theme a[class*="_advanced_"] {
            background: var(--input-bg) !important;
            color: var(--text-normal) !important;
            border-top: none;
          }
          .de-dark-theme .de-shortcut-item a:visited {
            color: var(--text-normal) !important;
          }
          .de-dark-theme .de-shortcut-item a svg[class*="_icon_"] path {
            fill: var(--text-normal) !important;
          }
          .de-dark-theme .de-random-item span svg path,
          .de-dark-theme svg[class*=_icon_] path,
          .de-dark-theme nav[class*="_user_"] div a svg path,
          .de-dark-theme nav[class*="_user_"] div button svg path {
            fill: var(--text-normal) !important;
          }
          .de-dark-theme div[class*=_listbox_] {
            background: var(--input-bg) !important;
            border: 1px solid var(--borders) !important;
          }
          .de-dark-theme div[class*=_listbox_] a {
            color: var(--text-normal) !important;
          }
          .de-dark-theme div[class*=_open],
          .de-dark-theme div[class*=_desktop] div[class*=_content] {
            background: var(--black) !important;
          }
          .de-dark-theme div[class*=_open] a,
          .de-dark-theme div[class*=_desktop] div[class*=_content] a {
            color: var(--text-normal) !important;
          }
          .de-dark-theme svg[class*=_spinner_] {
            fill: var(--text-normal) !important;
          }
          .de-dark-theme div[class*=_categories_] label[class*=_category_] {
            background: var(--headers) !important;
            color: var(--text-bold) !important;
            border: 1px solid var(--borders) !important;
            border-right: 1px solid var(--site-header-bg) !important;
          }
          .de-dark-theme div[class*=_categories_] label[class*=_selected_] {
            background: var(--skittle-inventory) !important;
            border-right: 1px solid var(--site-header-bg) !important;
            border-left: none !important;
          }
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_] {
            border-bottom: 1px solid var(--borders) !important;
          }
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_] [class*="_suheadingSubtitle_"],
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_] [class*="_formatCategory"],
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_] [class*="_formatMasterCategory"] {
            color: var(--text-normal) !important;
          }
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_] [class*="_formatCategoryDetails"] {
            color: var(--text-muted) !important;
          }
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_] span[class*=_link_] {
            color: var(--link) !important;
          }
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_]:hover {
            background: var(--search-results-active) !important;
          }
          .de-dark-theme div[class*=_suggestions_] li[class*=_result_][class*=_active_] {
            background: var(--search-results-active) !important;
            outline: 2px solid var(--input-focus-border) !important;
            border-radius: 4px;
          }
          .de-dark-theme div[class*=_listbox_] li {
            list-style: none;
            color: var(--skittle-inventory) !important;
          }
          .de-dark-theme span[class*=skittle_][class*=_collection_],
          .de-dark-theme div[class*=_skittle_][class*=_collection_] {
            background: var(--button-green) !important;
            color: var(--text-bold) !important;
          }
          .de-dark-theme span[class*=skittle_][class*=_collection_] svg path,
          .de-dark-theme div[class*=_skittle_][class*=_collection_] svg path {
            fill: var(--text-bold) !important;
          }
          .de-dark-theme span[class*=skittle_][class*=_wantlist_],
          .de-dark-theme div[class*=_skittle_][class*=_wantlist_] {
            background: var(--skittle-wantlist) !important;
            color: var(--text-bold) !important;
          }
          .de-dark-theme span[class*=skittle_][class*=_wantlist_] svg path,
          .de-dark-theme div[class*=_skittle_][class*=_wantlist_] svg path {
            fill: var(--text-bold) !important;
          }
          .de-dark-theme span[class*=skittle_][class*=_inventory_],
          .de-dark-theme div[class*=_skittle_][class*=_inventory_] {
            background: var(--skittle-inventory) !important;
            color: var(--text-bold) !important;
          }
          .de-dark-theme span[class*=skittle_][class*=_inventory_] svg path,
          .de-dark-theme div[class*=_skittle_][class*=_inventory_] svg path {
            fill: var(--text-bold) !important;
          }
          .de-dark-theme .de-random-item-tooltip {
            background: var(--black) !important;
          }
          .de-dark-theme nav[class*="_main_"] button,
          .de-dark-theme nav header[class*="_title"],
          .de-dark-theme nav[class*="_main_"] button:hover,
          .de-dark-theme nav[class*="_main_"] button:focus,
          .de-dark-theme nav[class*=_user] a,
          .de-dark-theme nav[class*=_user] a:visited {
            color: var(--text-normal) !important;
          }
          .de-dark-theme nav[class*=_user] a:hover,
          .de-dark-theme .de-shortcut-item:hover {
            background: var(--black) !important;
          }

          .de-dark-theme nav[class*=_user] ul[class*="_user-dropdown_"] a:hover,
          .de-dark-theme nav[class*="_secondary_"] ul li a[role="menuitem"]:hover  {
            background: var(--input-bg) !important;
          }
          .de-dark-theme nav[class*=_user] a[class*="_register_"] {
            color: var(--black) !important;
          }
          .de-dark-theme nav[class*="_main_"] button:hover {
            color: var(--white) !important;
            background: var(--site-header-bg) !important;
          }
          .de-dark-theme nav[class*="_main_"] div[class^="_open"] button,
          .de-dark-theme nav[class*="_main_"] div[class^="_open"] button:hover {
            background: var(--black) !important;
          }
          .de-dark-theme nav[class*=_main] ul[class*=_group] li a[role=menuitem],
          .de-dark-theme nav[class*=_user] ul[class*=_group] li a[role=menuitem] {
            color: var(--text-normal) !important;
          }
          .de-dark-theme nav[class*=_main] ul[class*=_group] li a[role=menuitem] svg path,
          .de-dark-theme nav[class*=_user] ul[class*=_group] li a[role=menuitem] svg path {
            fill: var(--text-normal) !important;
          }
          .de-dark-theme nav[class*=_user] ul[class*=_group] li[class*="_user-greeting_"] {
            color: var(--text-normal) !important;
          }
          .de-dark-theme #_rht_toaster div[class^="go"] div {
            background: var(--site-header-bg) !important;
          }
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content a.button {
            color: var(--button-blue-text) !important;
            background: var(--button-blue) !important;
            border: none !important;
          }
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content div p a,
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content ul li a,
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content tr a {
            color: var(--link) !important;
          }
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content div p a:hover,
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content ul li a:hover,
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content tr a:hover {
            color: var(--link-hover) !important;
          }
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content div p a:visited,
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content ul li a:visited,
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content tr a:visited {
            color: var(--link-visited) !important;
          }
          .de-dark-theme #_rht_toaster div[class^="go"] .notification-content i.general::before {
            filter: invert(1) contrast(2) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover__inner {
            border: 1px solid var(--borders) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover__inner h2.rnf-empty-feed__header {
            color: var(--text-bold) !important;
          }
          .de-dark-theme div.rnf-feed-provider .rnf-notification-cell {
            border-bottom: 1px solid var(--borders) !important;
          }
          .de-dark-theme div.rnf-feed-provider .rnf-notification-cell div.payload-name {
            filter: invert(1);
          }
          .de-dark-theme div.notification-content div.notification-header strong {
            color: var(--text-bold) !important;
          }
          .de-dark-theme div.notification-content div.feed-item {
            background: var(--input-bg) !important;
            border-bottom: 1px solid var(--borders) !important;
          }
          .de-dark-theme div.notification-content div.feed-item .image-wrapper {
            border: none !important;
          }
          .de-dark-theme div.notification-content div.feed-item div.item-details div span {
            background: var(--input-bg) !important;
          }
          .de-dark-theme div.notification-content div.feed-item div.item-details div div a {
            color: var(--white) !important;
            background: var(--skittle-collection) !important;
            border-radius: 50px;
          }
          .de-dark-theme div.notification-content div.feed-item div.item-details span a {
            filter: invert(1);
          }
          .de-dark-theme div.notification-content p,
          .de-dark-theme div.notification-content table tr td {
            color: var(--text-bold) !important;
          }
          .de-dark-theme div.notification-content blockquote,
          .de-dark-theme div.notification-content ul {
            color: var(--text-normal) !important;
            border: none !important;
            border-left: 4px solid var(--borders) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover span,
          .de-dark-theme .rnf-mark-all-as-read {
            color: var(--text-bold) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover span.rnf-notification-cell__timestamp {
            color: var(--text-muted) !important;
          }
          .de-dark-theme header.rnf-notification-feed__header {
            background: var(--site-header-bg) !important;
            border-bottom: 1px solid var(--borders) !important;
          }
          .de-dark-theme header[class*="_header"] div[class*="_bottom_"] nav[class*="_secondary_"] button {
            color: var(--text-normal) !important;
          }
          .de-dark-theme header[class*="_header"] div[class*="_bottom_"] nav[class*="_secondary_"] button span svg path {
            fill: var(--text-normal) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover select {
            color: var(--text-bold) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover div.rnf-notification-feed__container {
            background: var(--site-header-bg) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover button.rnf-mark-all-as-read:disabled {
            color: var(--text-placeholder) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover button.rnf-mark-all-as-read:disabled svg path {
            stroke: var(--text-placeholder) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .payload-name {
            color: var(--black) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .notification-content .feed-items-wrapper {
            background: var(--input-bg) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell {
            background: var(--input-bg) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell:hover,
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell:focus {
            background: var(--main-bg-color) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-tooltip--light {
            background: var(--black) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content i.general::before {
            filter: invert(1) contrast(2) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content div p a,
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content ul li a,
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content tr a {
            color: var(--link) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content div p a:hover,
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content ul li a:hover,
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content tr a:hover {
            color: var(--link-hover) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content div p a:visited,
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content ul li a:visited,
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content tr a:visited {
            color: var(--link-visited) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content a.button {
            color: var(--button-blue-text) !important;
            background: var(--button-blue) !important;
            border: none !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__content .notification-content a.button:visited {
            color: var(--button-blue-text) !important;
          }
          .de-dark-theme div.rnf-notification-feed-popover .rnf-notification-cell__unread-dot {
            border: 1px solid var(--input-focus-border) !important;
            background-color: var(--input-focus-border) !important;
          }
          .de-dark-theme nav#theme-nav {
            background: var(--headers) !important;
          }
          .de-dark-theme div.rnf-unseen-badge {
            background: var(--skittle-wantlist) !important;
            outline: 2px solid var(--site-header-bg) !important;
          }
          .de-dark-theme div.rnf-unseen-badge span.rnf-unseen-badge__count {
            color: var(--white) !important;
          }
    `;

    let host = document.querySelector('[id^=__header_root_]');

    const checkForShadowRoot = function() {

      if ( host && host.shadowRoot ) {

        clearInterval(handle);

        let css = document.createElement('style'),
            fragment = document.createDocumentFragment(),
            html = document.querySelector('.de-enabled');

        css.id = 'nav-dark-theme';
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.textContent = darkTheme;

        fragment.appendChild(css);
        host.shadowRoot.appendChild(fragment.cloneNode(true));

        if ( html.classList.contains('de-dark-theme') ) {
          host.shadowRoot.querySelector('div').classList.add('de-dark-theme');
        } else {
          host.shadowRoot.querySelector('div').classList.remove('de-dark-theme');
        }
      }
    };

    const handle = setInterval(checkForShadowRoot, 20);
  });
});
