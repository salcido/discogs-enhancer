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
  const notepadId = 'de-editing-notepad';
  const notepadAreaId = 'de-editing-notepad-area';
  const toggleButtonId = 'de-editing-notepad-toggle-button';
  const areaWrapperId = 'de-editing-notepad-area-wrapper';
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

  const initialNotepadClasses = isNotepadInitiallyVisible ? '' : hiddenClass;
  const initialToggleButtonClasses = isNotepadInitiallyVisible ? rotateClass : '';
  const initialTitle = isNotepadInitiallyVisible ? hideTitle : showTitle;

  const markup = `
    <div id="${notepadId}" class="${initialNotepadClasses}">
      <div>
        <button id="${toggleButtonId}" class="${initialToggleButtonClasses} button" title="${initialTitle}">◀</button>
        <div id="${areaWrapperId}">
          <p id="${notepadAreaId}" contenteditable="true">${getNotepadText()}</p>
        </div>
      </div>
    </div>
  `;

  const css = `
    #${notepadId} {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 600px;
      width: 400px;
      transition: all 0.3s ease-in-out;
    }

    #${notepadId}.${hiddenClass} {
      right: -375px;
    }

    #${notepadId} > div {
      height: 100%;
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
      padding: 0;
      margin: 0;
    }

    #${areaWrapperId} {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
    }

    #${notepadAreaId} {
      height: 100%;
      width: 100%;
      padding: 5px 0 0 5px;
      margin: 0;
      background-color: white;
      border: 1px solid grey !important;
    }

    .de-dark-theme #${notepadAreaId} {
      background-color: #292929 !important;
    }

    #${toggleButtonId} {
      width: auto;
      height: 1.1em;
      font-size: xx-large;
      padding: 0;
      line-height: 0;
      transition: all 0.3s ease-in-out;
    }

    #${toggleButtonId}.${rotateClass} {
      transform: rotateY(180deg);
    }
  `;

  rl.attachCss( 'editing-notepad', css );
  document.body.insertAdjacentHTML( 'beforeend', markup );

  const notepad = document.getElementById( notepadId )
  const notepadArea = document.getElementById( notepadAreaId );
  const toggleButton = document.getElementById( toggleButtonId );

  notepadArea.addEventListener( 'input', ( event ) => {
    setNotepadText( event.target.value );
  } );

  toggleButton.addEventListener( 'click', ( event ) => {
    if ( notepad.classList.contains( hiddenClass ) ) {
      // Show the Notepad
      notepad.classList.remove( hiddenClass );
      toggleButton.classList.add( rotateClass );
      toggleButton.title = hideTitle;
      setNotepadVisible( true );
    } else {
      // Hide the Notepad
      notepad.classList.add( hiddenClass );
      toggleButton.classList.remove( rotateClass );
      toggleButton.title = showTitle;
      setNotepadVisible( false );
    }
  } );
} );
