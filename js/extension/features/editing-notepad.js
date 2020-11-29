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

  // HTML variables
  const className = 'de-editing-notepad';
  const textAreaId = 'de-editing-notepad-textarea';
  const toggleButtonId = 'de-editing-notepad-toggle-button';
  const hiddenClass = 'de-editing-notepad-hidden';
  const rotateClass = 'de-editing-notepad-rotate';
  const showTitle = 'Show Notepad';
  const hideTitle = 'Hide Notepad';

  // Resource Library variables
  const preferenceId = 'notepadText';
  const visibilityPreferenceId = 'notepadVisible';

  function setNotepadText( text ) {
    rl.setPreference( preferenceId, text );
  }

  function getNotepadText() {
    return rl.getPreference( preferenceId );
  }

  function setNotepadVisible( isVisible ) {
    rl.setPreference( visibilityPreferenceId, isVisible );
  }

  function getNotepadVisible() {
    return rl.getPreference( visibilityPreferenceId );
  }

  if ( !getNotepadText() ) {
    setNotepadText( 'Notepad for storing information!' );
  }

  const isNotepadInitiallyVisible = getNotepadVisible();

  const initialTextAreaClasses = isNotepadInitiallyVisible ? '' : hiddenClass;
  const initialToggleButtonClasses = isNotepadInitiallyVisible ? rotateClass : '';
  const initialTitle = isNotepadInitiallyVisible ? hideTitle : showTitle;

  const markup = `
    <div class="${className}">
      <div>
        <button id="${toggleButtonId}" class="${initialToggleButtonClasses}" title="${initialTitle}">◀</button>
        <textarea id="${textAreaId}" class="${initialTextAreaClasses}">${getNotepadText()}</textarea>
      </div>
    </div>
  `;

  const css = `
    .${className} {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 600px;
      width: 400px;
    }

    .${className} > div {
      height: 100%;
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
    }

    #${textAreaId} {
      height: 100%;
      width: 100%;
      margin; 5px;
    }

    #${textAreaId}.${hiddenClass} {
      display: none;
      visibility: hidden;
    }

    #${toggleButtonId} {
      width: auto;
      height: 1.1em;
      font-size: xx-large;
    }

    #${toggleButtonId}.${rotateClass} {
      transform: rotateY(180deg);
    }
  `;

  rl.attachCss( 'editing-notepad', css );
  document.body.insertAdjacentHTML( 'beforeend', markup );

  const textArea = document.getElementById( textAreaId );
  const toggleButton = document.getElementById( toggleButtonId );

  textArea.addEventListener( 'input', ( event ) => {
    setNotepadText( event.target.value );
  } );

  toggleButton.addEventListener( 'click', ( event ) => {
    if ( textArea.classList.contains( hiddenClass ) ) {
      textArea.classList.remove( hiddenClass );
      toggleButton.classList.add( rotateClass );
      toggleButton.title = hideTitle;
      setNotepadVisible( true );
    } else {
      textArea.classList.add( hiddenClass );
      toggleButton.classList.remove( rotateClass );
      toggleButton.title = showTitle;
      setNotepadVisible( false );
    }
  } );
} );
