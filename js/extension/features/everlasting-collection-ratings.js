/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 */

// ========================================================
// All of these functions are used with the Everlasting
// Collection feature. When appending new sets of pages
// to the DOM, the event listeners are not updated
// so the new elements will not function. These functions
// recreate the missing functionality on the new DOM
// elements.
// ========================================================

// ========================================================
// Functions (Alphabetical)
// ========================================================

/**
 * Returns the star value from the element
 * @param {object} elem The element to get the rating class from
 * @returns {string}
 */
window.getRatingClass = function getRatingClass(elem) {

	let classes = Array.from(elem.classList),
			num = /\d/g;

	classes = classes.join('');
	return classes.match(num)[0];
};

/**
 * Injects the star rating component template in to each
 * empty ratings td that has been inserted by the
 * everlasting-collection feature.
 * @returns {undefined}
 */
window.injectStars = function injectStars() {

	let ratings = [...document.querySelectorAll('span.rating')];

	ratings.forEach(rating => {

		if ( !rating.querySelector('.rating_icons') ) {

			let value = rating.dataset.value || 0;

			if ( value === 0 ) rating.classList.add('not_rated');

			rating.insertAdjacentHTML('beforeend', window.starTemplate(value));
		}
	});
};

/**
 * Posts the new rating to Discogs.
 * @param {string} releaseId The release_id to be rated
 * @param {string} rating The rating value that will be used to rate the release
 * @param {object} event The event object from the click event
 * @returns {method}
 */
window.postRating = async function postRating(releaseId, rating, event) {

	let
			value = `value=${rating}`,
			headers = { 'content-type': 'application/x-www-form-urlencoded' },
			url = `https://www.discogs.com/release/rate?release_id=${releaseId}`,
			initObj = {
				body: value,
				credentials: 'include',
				headers: headers,
				method: 'POST'
			},
			response = await fetch(url, initObj);

	if ( response.ok ) {

		// Update with the new rating
		if ( rating !== '0' ) {
			event.target.closest('.rating').dataset.value = rating;
			return event.target.closest('.rating').classList.remove('not_rated');
		}

		// ... or remove it if it was 0 ('x' was clicked)
		event.target.closest('.rating').removeAttribute('data-value');
		window.removeStarClass(event.target.closest('.rating').querySelector('.rating_range'));
		event.target.closest('.rating').querySelector('.rating_range').classList.add('fill0');
		return event.target.closest('.rating').classList.add('not_rated');
	}
};

/**
 * Previews the star rating when hovering over the star icons
 * @param {object} event The Event object
 * @returns {undefined}
 */
window.previewRating = function previewRating(event) {

	let rating = window.getRatingClass(event.target);

	window.removeStarClass(event.target.closest('.rating_range'));
	event.target.closest('.rating_range').classList.add(`fill${rating}`);
};

/**
 * Removes all of the `.fillN` classes from the passed element.
 * @param {object} elem The object to remove the classes from
 */
window.removeStarClass = function removeStarClass(elem) {
	for (let i = 0; i <= 5; i++) {
		elem.classList.remove(`fill${i}`);
	}
};

/**
 * Restores the initial rating of the release after the mouse leaves
 * @param {object} event The event object
 * @returns {undefined}
 */
window.restoreRating = function restoreRating(event) {

	let notRated = event.target.closest('.rating').classList.contains('not_rated'),
			target = event.target.closest('.rating .rating_range'),
			value = event.target.closest('.rating').dataset.value;

	if ( notRated ) {
		window.removeStarClass(target);
		target.classList.add('fill0');

	} else {
		window.removeStarClass(target);
		target.classList.add(`fill${value}`);
	}
};

/**
 * Initiates the POST to discogs with the new rating data
 * @param {object} event The event object
 * @returns {undefined}
 */
window.saveRating = function saveRating(event) {

	let nums = /\d+/g,
			releaseId = event.target.closest('.rating').dataset.postUrl.match(nums)[0],
			rating = event.target.dataset.value;

	window.postRating(releaseId, rating, event);
};

/**
 * Returns the markup for the star ratings
 * @param {number} value The rating value
 * @returns {string}
 */
window.starTemplate = function starTemplate(value) {
	let template = `<span class="rating_icons de-rating-icons"><span class="rating_range fill${value}"><a class="star star1 icon icon-star-o" tabindex="0" aria-label="Rate this release 1 star." data-value="1"></a><a class="star star1 icon icon-star" tabindex="0" aria-label="Rate this release 1 star." data-value="1"></a><a class="star star2 icon icon-star-o" tabindex="0" aria-label="Rate this release 2 stars." data-value="2"></a><a class="star star2 icon icon-star" tabindex="0" aria-label="Rate this release 2 stars." data-value="2"></a><a class="star star3 icon icon-star-o" tabindex="0" aria-label="Rate this release 3 stars." data-value="3"></a><a class="star star3 icon icon-star" tabindex="0" aria-label="Rate this release 3 stars." data-value="3"></a><a class="star star4 icon icon-star-o" tabindex="0" aria-label="Rate this release 4 stars." data-value="4"></a><a class="star star4 icon icon-star" tabindex="0" aria-label="Rate this release 4 stars." data-value="4"></a><a class="star star5 icon icon-star-o" tabindex="0" aria-label="Rate this release 5 stars." data-value="5"></a><a class="star star5 icon icon-star" tabindex="0" aria-label="Rate this release 5 stars." data-value="5"></a></span><i class="reset icon icon-times" tabindex="0" aria-label="Remove rating" data-value="0"></i></span>`;
	return template;
};

// ========================================================
// Event listeners
// ========================================================

document.querySelector('body').addEventListener('click', event => {

  let target = event.target;
  // save/reset star rating
  if ( target.closest('.de-rating-icons') ) {
    return window.saveRating(event);
  }
});

document.querySelector('body').addEventListener('mouseover', event => {

	let target = event.target;
	// hover over rating
	if ( target.closest('.de-rating-icons .rating_range') ) {
		return window.previewRating(event);
	}
});

document.querySelector('body').addEventListener('mouseout', event => {

	let target = event.target;
	// mouseout from rating
	if ( target.closest('.de-rating-icons .rating_range') ) {
		return window.restoreRating(event);
	}
});
