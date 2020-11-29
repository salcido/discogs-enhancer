/**
 *
 * Discogs Enhancer
 *
 * @author: Ross Lancaster
 * @github: https://github.com/ToastyMallows
 *
 * Puts a notepad in the editing window to store any editing
 * information like artists names or links relevant to editing on Discogs.
 */
rl.ready( () => {

  if ( rl.pageIsNot( 'edit', 'update' ) ) {
    // Only add Editing Notepad on edit pages
    return;
  }

  function setNotepadText( text ) {
    rl.setPreference( preferenceId, text );
  }

  function getNotepadText() {
    return rl.getPreference( preferenceId );
  }

  const className = 'de-editing-notepad';
  const id = 'de-editing-notepad-textarea';
  const preferenceId = 'notepadText';

  if ( !getNotepadText() ) {
    setNotepadText( 'Notepad for storing information!' );
  }

  const markup = `
    <div class="${className}">
      <div><textarea id="${id}">${getNotepadText()}</textarea></div>
    </div>
  `;

  const css = `
    .${className} {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background-color: red !important;
      height: 400px;
      width: 300px;
    }

    .${className} div {
      height: 100%;
      width: 100%;

    }

    .${className} textarea {
      height: 100%;
      width: 100%;
      margin; 5px;
    }
  `;

  rl.attachCss( 'editing-notepad', css );
  document.body.insertAdjacentHTML( 'beforeend', markup );

  document.getElementById( id ).addEventListener( 'input', ( event ) => {
    setNotepadText( event.target.value );
  } );
} );
