
$('.release_list_table.table_block.table_responsive.layout_med th').each(function() {

  if ($(this).children().length === 0 && $(this).text().length > 0) {

    let name = $(this).text();
    let language = resourceLibrary.language();
    let username = $('#site_account_menu').find('.user_image').attr('alt'); //TODO move this to resourceLibrary and replace in feedback-notifier
    let markup = '<a href="/' + language + '/user/' + username + '/collection?sort=' + encodeURI(name) + '&amp;sort_order=" class="sortable_link asc"><span class="link_text">' + name + '</span></a>';

    $(this).remove($(this).text()).html(markup);

  }
});




// before
//<a href="/user/mattsalcido/collection?sort=added&amp;sort_order=desc" class="sortable_link asc"><span class="link_text">Added</span></a>

// after
// <a href="/user/mattsalcido/collection?sort=added&amp;sort_order=asc" class="sortable_link asc sortable_link_selected"><span class="link_text">Added</span>&nbsp;<i class="icon icon-chevron-down"></i></a>

// after second click
// <a href="/user/mattsalcido/collection?sort=added&amp;sort_order=desc" class="sortable_link asc sortable_link_selected"><span class="link_text">Added</span>&nbsp;<i class="icon icon-chevron-up"></i></a>
