/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      bottomSelectFolder,
      checkboxes,
      interval,
      loc = window.location.href,
      marketPlaceBtn,
      moveButtonMarkup,
      moveButtons,
      topSelectFolder;

  if (loc.indexOf('/collection') > -1) {

    interval = setInterval(function() {

      if ( $('#move_folder_id_bottom').length ) {

        clearInterval(interval);

        bottomSelectFolder = $('#move_folder_id_bottom').html();
        moveButtonMarkup = $('[name^="Action.MoveItems"]').html();
        topSelectFolder = $('#move_folder_id_top').html();

        $('label[for="folder_top"]').text('Current folder: ');

        $('#random_list_form').css({ float: 'right', marginTop: '11px' });

        $('.release_list_remove').addClass('button_red');

        $('[name^="Action.MoveItems"]').addClass('button_green');

        $('.release_list_actions.multiple_buttons.top .fright').html(
          '<button class="button button_green" disabled type="submit" name="Action.MoveItems">' + moveButtonMarkup + '</button>' +
          ' &nbsp; to folder: &nbsp; ' +
          '<select id="move_folder_id_top" name="move_folder_id" class="button move_folder_select top">' + topSelectFolder + '</select>');

        $('.release_list_actions.multiple_buttons.bottom .fright').html(
          '<button class="button button_green" disabled type="submit" name="Action.MoveItems">' + moveButtonMarkup + '</button>' +
          ' &nbsp; to folder: &nbsp; ' +
          '<select id="move_folder_id_bottom" name="move_folder_id" class="button move_folder_select botom">' + bottomSelectFolder + '</select>');

        $('input[type="checkbox"]').change(function() {

            moveButtons = $('[name^="Action.MoveItems"]');

            checkboxes = $('input[type="checkbox"]');

            return moveButtons.prop('disabled', checkboxes.filter(':checked').length < 1);
        });
      }
    }, 100);
  }

  if (loc.indexOf('/mywantlist') > -1) {

    marketPlaceBtn = $('ul.table_actions_list.wantlist li:eq(1)').clone();

    $('li a[href^="/sell/mywants?ev=wsim"]').hide();

    $('ul.table_actions_list.wantlist').prepend('<li>' + marketPlaceBtn.html() + '</li>');

    $('.release_list_remove').addClass('button_red');

    $('#random_list_form').css({ float: 'right', marginTop: '11px' });

    $('[name^="Action.MoveToCollection"]').addClass('button_green').prop('disabled', true);

    $('input[type="checkbox"]').change(function() {

        moveButtons = $('[name^="Action.MoveToCollection"]');

        checkboxes = $('input[type="checkbox"]');

        return moveButtons.prop('disabled', checkboxes.filter(':checked').length < 1);
    });
  }
});
