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
  const PREFIX = 'de-editing-notepad';
  const notepadId = PREFIX;
  const notepadAreaId = `${PREFIX}-area`;
  const toggleButtonId = `${PREFIX}-toggle-button`;
  const editButtonId = `${PREFIX}-edit-button`;
  const areaWrapperId = `${PREFIX}-area-wrapper`;
  const notepadEditCoverId = `${PREFIX}-edit-cover`;
  const notepadEditingClass = `${PREFIX}-isediting`;
  const notepadFocusedClass = `${PREFIX}-isfocused`;
  const buttonClass = `${PREFIX}-button`;
  const buttonsWrapperClass = `${PREFIX}-buttons-wrapper`;
  const hiddenClass = `${PREFIX}-hidden`;
  const rotateClass = `${PREFIX}-rotate`;
  const visibleClass = `${PREFIX}-visible`;
  const notepadLinkClass = `${PREFIX}-link`;
  const discogsLoadingClass = "loading-placeholder";
  const showTitle = 'Show Notepad';
  const hideTitle = 'Hide Notepad';

  // Resource Library variables
  const notepadTextPreferenceId = 'notepadText';
  const visibilityPreferenceId = 'notepadVisible';

  // Private Methods

  function setNotepadTextPreference( text ) {
    rl.setPreference( notepadTextPreferenceId, text );
  }

  function getNotepadTextPreference() {
    return rl.getPreference( notepadTextPreferenceId );
  }

  function setNotepadVisiblePreference( isVisible ) {
    rl.setPreference( visibilityPreferenceId, isVisible );
  }

  function getNotepadVisiblePreference() {
    return rl.getPreference( visibilityPreferenceId );
  }

  // Logic

  if ( !getNotepadTextPreference() ) {
    // store an empty div so the notepad always has something
    setNotepadTextPreference( '<div></div>' );
  }

  const isNotepadInitiallyVisible = getNotepadVisiblePreference() === null ? false : true;

  const initialNotepadClasses = isNotepadInitiallyVisible ? '' : hiddenClass;
  const initialToggleButtonClasses = isNotepadInitiallyVisible ? rotateClass : '';
  const initialTitle = isNotepadInitiallyVisible ? hideTitle : showTitle;

  const markup = `
    <div id="${notepadEditCoverId}"></div>
    <div id="${notepadId}" class="${initialNotepadClasses}">
      <div>
        <div class="${buttonsWrapperClass}">
          <button id="${toggleButtonId}" class="${initialToggleButtonClasses} ${buttonClass} button" title="${initialTitle}">◀</button>
          <button id="${editButtonId}" class="${buttonClass} button" title="Edit">✎</button>
        </div>
        <div id="${areaWrapperId}">
          <p id="${notepadAreaId}" contenteditable="false" tabindex="-1"></p>
        </div>
      </div>
    </div>
  `;

  const css = `

    #${notepadEditCoverId} {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      visibility: hidden;
      display: none;
      z-index: 0;
    }

    #${notepadEditCoverId}.${visibleClass} {
      visibility: visible;
      display: unset;
    }

    #${notepadId} {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 700px;
      width: 500px;
      min-width: 500px;
      max-width: 500px;
      transition: all 0.3s ease-in-out;
      z-index: 1;
    }

    #${notepadId}.${hiddenClass} {
      right: -501px;
    }

    #${notepadId} > div {
      height: 100%;
      width: 100%;
      min-width: 500px;
      max-width: 500px;
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
      min-width: 500px;
      max-width: 500px;
      padding: 0;
      margin: 0;
      z-index: 1;
    }

    #${notepadAreaId} {
      height: 100%;
      width: 100%;
      min-width: 500px;
      max-width: 500px;
      margin: 0;
      background-color: white;
      outline: 1px solid grey !important;
      opacity: 0.7;
      transition: opacity 0.3s ease-in-out;
      overflow-y: auto;
      overflow-x: hidden;
      overflow-wrap: break-word;
    }

    .de-dark-theme #${notepadAreaId} {
      background-color: #292929 !important;
    }

    #${notepadAreaId} > *:first-child {
      padding-top: 5px;
    }

    #${notepadAreaId} > *:last-child {
      padding-bottom: 5px;
    }

    #${notepadAreaId} > * {
      padding-left: 5px;
    }

    .${notepadFocusedClass} #${notepadAreaId} {
      opacity: 1;
    }

    .${notepadEditingClass} #${notepadAreaId} {
      cursor: text;
      outline: 1px solid red !important;
      box-shadow: 0 0 10px red !important;
    }

    .${notepadEditingClass} #${notepadAreaId} * {
      cursor: text;
    }

    .${buttonsWrapperClass} {
      display: flex;
      flex-flow: column nowrap;
      justify-content: start;
      height: 100%;
    }

    .${buttonClass} {
      width: 1em;
      height: 1em;
      min-width: 1em;
      max-width: 1em;
      font-size: xx-large;
      padding: 0;
      line-height: 0;
      z-index: 0;
      border-radius: 5px 0 0 5px;
      margin: 5px 0;
      opacity: 1;
      user-select: none;
      transition: transform 0.3s linear, border-radius 0.3s linear, opacity 0.3s linear;
    }

    .${buttonClass}.${rotateClass} {
      transform: rotateY(180deg);
      border-radius: 0 5px 5px 0;
    }

    #${notepadId}:not(.${hiddenClass}):not(.${notepadFocusedClass}):not(.${notepadEditingClass}) #${toggleButtonId},
    #${notepadId}:not(.${hiddenClass}):not(.${notepadFocusedClass}):not(.${notepadEditingClass}) #${editButtonId}  {
      visibility: visible;
      opacity: 0.7;
    }

    #${editButtonId} {
      visibility: hidden;
      opacity: 0;
      transition: visibility 0.5s, opacity 0.3s linear;
    }

    #${notepadId}:not(.${hiddenClass}) #${editButtonId} {
      visibility: visible;
      opacity: 1;
    }

    .${notepadEditingClass} .${buttonClass} {
      border: 1px solid red !important;
      box-shadow: 0 0 10px red;
    }
  `;

  /**
   * Detects when the Edit page is done loading and loads the feature.
   */
  let loadingInterval = setInterval( () => {
    let loadingElement = document.querySelector( `.${discogsLoadingClass}` );

    if ( !loadingElement ) {
      clearInterval( loadingInterval );
      loadNotepad();
    }
  }, 100 );

  function loadNotepad() {

    rl.attachCss( 'editing-notepad', css );
    document.body.insertAdjacentHTML( 'beforeend', markup );

    const notepad = document.getElementById( notepadId )
    const notepadArea = document.getElementById( notepadAreaId );
    const notepadEditCover = document.getElementById( notepadEditCoverId );
    const toggleButton = document.getElementById( toggleButtonId );
    const editButton = document.getElementById( editButtonId );

    // populate notepad with saved text
    notepadArea.innerHTML = getNotepadTextPreference();

    function focusNotepadArea() {
      notepadArea.focus();
      notepad.classList.add( notepadFocusedClass );
    }

    function unfocusNotepadArea() {
      notepad.classList.remove( notepadFocusedClass );
    }

    function stopEditing() {
      notepadEditCover.classList.remove( visibleClass );
      notepadArea.contentEditable = false;
      notepad.classList.remove( notepadEditingClass );
    }

    function startEditing() {
      focusNotepadArea();
      notepad.classList.add( notepadEditingClass );
      notepadArea.contentEditable = true;
      notepadEditCover.classList.add( visibleClass );
    }

    function toggleEditing() {
      if ( notepad.classList.contains( notepadEditingClass ) ) {
        stopEditing();
      } else {
        startEditing();
      }
    }

    function showNotepad() {
      notepad.classList.remove( hiddenClass );
      toggleButton.classList.add( rotateClass );
      toggleButton.title = hideTitle;
      setNotepadVisiblePreference( true );
      focusNotepadArea();
    }

    function hideNotepad() {
      stopEditing();
      unfocusNotepadArea();
      notepad.classList.add( hiddenClass );
      toggleButton.classList.remove( rotateClass );
      toggleButton.title = showTitle;
      setNotepadVisiblePreference( false );
    }

    function toggleNotepad() {
      if ( notepad.classList.contains( hiddenClass ) ) {
        showNotepad();
      } else {
        hideNotepad();
      }
    }

    notepadArea.addEventListener( 'mousedown', focusNotepadArea );
    notepadArea.addEventListener( 'click', focusNotepadArea );
    notepadArea.addEventListener( 'mouseenter', focusNotepadArea );
    notepadArea.addEventListener( 'mouseleave', unfocusNotepadArea );

    notepadEditCover.addEventListener( 'click', stopEditing );

    editButton.addEventListener( 'click', toggleEditing );
    editButton.addEventListener( 'mouseenter', focusNotepadArea );
    editButton.addEventListener( 'mouseleave', unfocusNotepadArea );

    toggleButton.addEventListener( 'click', toggleNotepad );
    toggleButton.addEventListener( 'mouseenter', focusNotepadArea );
    toggleButton.addEventListener( 'mouseleave', unfocusNotepadArea );

    notepadArea.addEventListener( 'input', ( event ) => {
      setNotepadTextPreference( event.target.innerHTML );
    } );

    notepadArea.addEventListener( 'paste', ( event ) => {
      if ( notepadArea.isContentEditable ) {

        let paste = ( event.clipboardData || window.clipboardData ).getData( 'text' );

        if ( paste.startsWith( 'http://' ) || paste.startsWith( 'https://' ) ) {

          // assume this is a Url
          const selection = window.getSelection();
          if ( !selection.rangeCount ) {
            return false;
          }

          const link = document.createElement( 'a' );
          link.href = paste;
          link.text = paste;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.classList.add( notepadLinkClass );

          selection.deleteFromDocument();
          selection.getRangeAt( 0 ).insertNode( link )
          selection.collapseToEnd();

          event.preventDefault();

          // Since we have to preventDefault, we need to manually save
          // instead of relying on the input event listener to do it.
          setNotepadTextPreference( notepadArea.innerHTML );
        }
      }
    } );
  }
} );
