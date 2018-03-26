/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will append a small icon to the nav bar that
 * when clicked will show a random item from the user's
 * collection. The functionality is identical to the
 * Random Item feature in the collection page but
 * makes it accessable from the nav bar.
 */


resourceLibrary.ready(function() {

  let button,
      icon = `<li style="position: relative;">
                <span>
                  <a class="nav_group_control de-random-item" style="font-size: 12px; margin-top: 2px;>
                    <span style="cursor: pointer;">
                      <span style="color: white;" title="Random Item">\u267A</span>
                    </span>
                  </a>
                </span>
              </li>`;

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Requests a random item from the user's collection
   * @method getRandomItem
   * @return {object}
   */
  function getRandomItem() {

    let data = 'Action.RandomItem=Random%2BItem',
        user = document.querySelector('#site_account_menu .user_image').alt,
        url = `https://www.discogs.com/user/${user}/collection`,
        xhr = new XMLHttpRequest();

    xhr.open('POST', url);

    xhr.onreadystatechange = () => {
      if (xhr.readyState > 3 && xhr.status === 200) {
        window.location = xhr.responseURL;
      }
    };

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(data);

    return xhr;
  }

  // ========================================================
  // DOM Setup
  // ========================================================

  // Append the markup
  document.getElementById('activity_menu').insertAdjacentHTML('beforeend', icon);

  button = document.getElementsByClassName('de-random-item')[0];

  // Add click functionality to badge markup
  button.addEventListener('click', () => {

    button.classList.add('rotate');
    getRandomItem();
  });
});
