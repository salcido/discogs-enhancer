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
 * Marketplace such that the user remains on the page
 * and the item is added via fetch request in the background.
 */
rl.ready(() => {

  let language = rl.language(),
      translations = {
        de: 'Im Warenkorb',
        en: 'In Cart',
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

    let spinner = '<i class="icon icon-spinner icon-spin" aria-hidden="true"></i>';

    link.innerHTML = spinner;
    link.classList.remove('button-green');
    link.style.pointerEvents = 'none';
  }
  /**
   * Changes the button text / class names from `Add To Cart` to
   * `In Cart`.
   * @param {HTMLAnchorElement} link - The Add To Cart button to modify
   * @returns {undefined}
   */
  function showInCartStatus(link) {

    let markup = `<i class="icon icon-check" aria-hidden="true"></i>${translations[language]}`;

    link.classList.remove('cart-button');
    link.classList.add('in-cart-button');
    link.innerHTML = markup;
    link.style.pointerEvents = 'auto';
  }

  // ========================================================
  // Init / DOM Setup
  // ========================================================

  if ( rl.pageIs('myWants', 'allItems', 'seller', 'sellRelease') ) {

    document.body.addEventListener('click', (event) => {

      if ( event.target.classList.contains('cart-button') ) {

        let addToCartButton = event.target,
            cartLink = document.querySelector('nav[class*="_user"] a[href^="/sell/cart"]'),
            sellerName = addToCartButton
                          .closest('tr.shortcut_navigable')
                          .querySelector('td.seller_info div.seller_block strong a')
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

            let selector = 'nav[class*="_user"] a[href^="/sell/cart"]',
                cartTotal = document.querySelector(selector),
                cartIcon = cartTotal.querySelector('svg').cloneNode(true),
                currentCartTotal = Number(cartTotal?.textContent?.trim()) || 0,
                newCartTotal = currentCartTotal + 1;

            showInCartStatus(addToCartButton);

            let totalText = document.createTextNode(newCartTotal),
                toolTipId = document.querySelector(selector).getAttribute('aria-describedby');
            // Update total in header
            cartTotal.textContent = '';
            cartTotal.appendChild(cartIcon);
            cartTotal.appendChild(totalText);
            // Update tooltip
            document.getElementById(toolTipId).textContent = `${newCartTotal} ${tooltipTranslations[language]}`;
            // Update the sellersInCart data to work with
            // the `Show Sellers In Cart` feature
            if (window.sellerItemsInCart) {

              let namesData = rl.getPreference('sellersInCart'),
                  names = namesData?.names || [];

              names.push(sellerName);

              let newNamesData = {
                names: new Set([...names])
              };

              rl.setPreference('sellersInCart', newNamesData);
              window.sellerItemsInCart(newNamesData);
            }
          }
        })
        .catch((err) => {
          let markup = '<i class="icon icon-exclamation-triangle" aria-hidden="true"></i> Error';

          addToCartButton.innerHTML = markup;
          console.log('Discogs Enhancer: ' + err);
        });
      }
    });
  }
});
