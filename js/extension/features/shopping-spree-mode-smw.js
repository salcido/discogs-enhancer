/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * -------------------------------------------
 * Overview
 * -------------------------------------------
 *
 * This feature modifies the Add To Cart buttons in the
 * Shop My Wants Marketplace such that the user remains on the page
 * and the item is added via fetch request in the background.
 */
 rl.ready(() => {

  let language = rl.language(),
      translations = {
        de: 'Im Warenkorb',
        en: 'In cart',
        es: 'En el carrito',
        fr: 'Dans le panier',
        it: 'Nel carrello',
        ja: 'カートの中身',
        ko: '장바구니에 있음',
        pt: 'No carrinho',
        ru: 'В корзине',
      },
      tooltipTranslations = {
        de: 'Artikel im Warenkorb',
        en: 'in Cart',
        es: 'en el carrito',
        fr: 'dans le panier',
        it: 'nel carrello',
        ja: 'カートの中身',
        ko: '장바구니에 있음',
        pt: 'no carrinho',
        ru: 'в корзине',
      };
  /**
   * Changes the button content from `Add To Cart` to the
   * Spinner icon while the fetch request is in progress.
   * @param {HTMLAnchorElement} link - The Add To Cart button to modify
   * @returns {undefined}
   */
  function showFetchingStatus(link) {

    let spinner = rl.css.preloaderSMW;

    link.innerHTML = spinner;
    link.classList.remove('bg-brand-green700');
    link.classList.add('bg-brand-white', 'text-brand-green700');
    link.style.pointerEvents = 'none';
  }
  /**
   * Changes the button text / class names from `Add To Cart` to
   * `In Cart`.
   * @param {HTMLAnchorElement} link - The Add To Cart button to modify
   * @returns {undefined}
   */
  function showInCartStatus(link) {
    let markup = `${translations[language]}`;

    link.classList.remove('hover:underline', 'border-brand-green800', 'bg-brand-green700', 'text-brand-white', 'hover:bg-brand-green800');
    link.classList.add('border-brand-green700', 'bg-brand-white', 'text-brand-green700');
    link.innerHTML = markup;
    link.removeAttribute('href');
    link.style.pointerEvents = 'auto';
  }

  let rules = /* css */`
    .de-preloader-sm {
      width: 14px;
      height: 14px;
    }
  `;

  // ========================================================
  // Init / DOM Setup
  // ========================================================
  if ( rl.pageIs('shopMyWants') ) {
    // Add CSS
    rl.attachCss('shoppingSpreeMode', rules);

    document.body.addEventListener('click', (event) => {

      if ( event.target.classList.contains('border-brand-green800') ) {

        let addToCartButton = event.target,
            host = document.querySelector('[id^=__header_root_]'),
            _header = host.shadowRoot.querySelector('div[class^="_amped_"] header'),
            cartLink = _header.querySelector('nav[class*="_user"] a[href*="/sell/cart"]'),
            sellerName = addToCartButton
                          .closest('.flex-row.justify-between.gap-4').querySelector('.text-brand-textSecondary.brand-item-copy.flex.items-center a.brand-item-copy-link')
                          .textContent.trim();

        event.preventDefault();
        // The `In Cart` tooltip text cannot be updated until the user triggers
        // it for the first time. This creates a focus event so the tooltip
        // can be updated correctly.
        cartLink.focus({ preventScroll: true });
        cartLink.blur();

        showFetchingStatus(addToCartButton);

        fetch(addToCartButton.href).then(res => {

          if (res.ok) {

            let selector = 'nav[class*="_user"] a[href*="/sell/cart"]',
                cartTotal = _header.querySelector(selector + ' .rnf-unseen-badge__count'),
                currentCartTotal = Number(cartTotal?.textContent?.trim()) || 0,
                newCartTotal = currentCartTotal + 1;

            if (!cartTotal) {
              _header.querySelector(selector + ' div').className = 'rnf-unseen-badge';
              _header.querySelector(selector + ' div span').className = 'rnf-unseen-badge__count';
            }

            showInCartStatus(addToCartButton);

            let toolTipId = _header.querySelector(selector).getAttribute('aria-describedby');
            // Update total in header
            _header.querySelector(selector + ' .rnf-unseen-badge__count').textContent = newCartTotal;
            // Update tooltip
            _header.querySelector(`[id*="${toolTipId}"]`).textContent = `${newCartTotal} ${tooltipTranslations[language]}`;
            // Update the sellersInCart data to work with
            // the `Show Sellers In Cart` feature
            if (window.sellerItemsInCart) {

              let namesData = rl.getPreference('sellersInCart'),
                  names = namesData?.names || [];

              names.push(sellerName);

              let newNamesData = {
                names: [...new Set(names)]
              };

              rl.setPreference('sellersInCart', newNamesData);
              window.sellerItemsInCart(newNamesData);
            }
          }
        })
        .catch((err) => {
          let markup = 'Error';

          addToCartButton.innerHTML = markup;
          console.error('Discogs Enhancer: ' + err);
        });
      }
    });
  }
});
