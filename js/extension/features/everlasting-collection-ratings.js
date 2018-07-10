
let value = 5;
let template = `
	<span class="rating_icons">
		<span class="rating_range fill${value}">
			<a class="star star1 icon icon-star-o" tabindex="0" aria-label="Rate this release 1 star." data-value="1"></a>
			<a class="star star1 icon icon-star" tabindex="0" aria-label="Rate this release 1 star." data-value="1"></a>
			<a class="star star2 icon icon-star-o" tabindex="0" aria-label="Rate this release 2 stars." data-value="2"></a>
			<a class="star star2 icon icon-star" tabindex="0" aria-label="Rate this release 2 stars." data-value="2"></a>
			<a class="star star3 icon icon-star-o" tabindex="0" aria-label="Rate this release 3 stars." data-value="3"></a>
			<a class="star star3 icon icon-star" tabindex="0" aria-label="Rate this release 3 stars." data-value="3"></a>
			<a class="star star4 icon icon-star-o" tabindex="0" aria-label="Rate this release 4 stars." data-value="4"></a>
			<a class="star star4 icon icon-star" tabindex="0" aria-label="Rate this release 4 stars." data-value="4"></a>
			<a class="star star5 icon icon-star-o" tabindex="0" aria-label="Rate this release 5 stars." data-value="5"></a>
			<a class="star star5 icon icon-star" tabindex="0" aria-label="Rate this release 5 stars." data-value="5"></a>
		</span>
		<i class="reset icon icon-times" tabindex="0" aria-label="Remove rating" data-value="0"></i>
  </span>`;

  let ratings = [...document.querySelectorAll('span.rating')];

  ratings.forEach(rating => {
    if (!rating.querySelector('.rating_icons')) {
      console.log(rating.dataset.value);
      rating.insertAdjacentHTML('beforeend', template);
    }
  });

  let classes = ['star', 'star1', 'icon', 'icon-star'];
  classes = classes.join('');

  let num = /\d/g;

  console.log(classes.match(num)[0]);
