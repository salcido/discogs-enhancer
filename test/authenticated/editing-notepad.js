const assert = require( 'assert' );
const { toggleFeature } = require( '../test' );

const SAMPLE_RELEASE = 'https://www.discogs.com/release/edit/7796190';

async function notepadIsLoaded( page ) {
  await Promise.all( [
    page.goto( SAMPLE_RELEASE, { waitUntil: 'networkidle2' } ),
    page.waitFor( '#de-editing-notepad' )
  ] );
}

let hiddenOnFirstRun = async function ( page ) {
  await toggleFeature( '#toggleEditingNotepad' );
  await notepadIsLoaded( page );

  let isHidden = await page.$eval( '#de-editing-notepad', elem => elem.classList.contains( 'de-editing-notepad-hidden' ) );
  let editButtonVisibility = await page.$eval( '#de-editing-notepad-edit-button', elem => window.getComputedStyle( elem ).visibility );

  assert.strictEqual( isHidden, true, 'Notepad was not hidden on first run.' );
  assert.strictEqual( editButtonVisibility, 'hidden', 'Edit button was not hidden when notepad was hidden.' );
};

let expandedWhenClicked = async function ( page ) {
  await notepadIsLoaded( page );

  await page.$eval( '#de-editing-notepad-toggle-button', elem => elem.click() );
  let isVisible = await page.$eval( '#de-editing-notepad', elem => !elem.classList.contains( 'de-editing-notepad-hidden' ) );
  assert.strictEqual( isVisible, true, 'Notepad was not expanded when toggle button was clicked.' );

  await notepadIsLoaded( page );

  isVisible = false;
  isVisible = await page.$eval( '#de-editing-notepad', elem => !elem.classList.contains( 'de-editing-notepad-hidden' ) );
  assert.strictEqual( isVisible, true, 'Notepad did not stay expanded after a refresh.' );
}

let goesIntoEditMode = async function ( page ) {
  await notepadIsLoaded( page );

  await page.$eval( '#de-editing-notepad-edit-button', elem => elem.click() );

  let isEditing = await page.$eval( '#de-editing-notepad', elem => elem.classList.contains( 'de-editing-notepad-isediting' ) );
  let isContentEditable = await page.$eval( '#de-editing-notepad-area', elem => elem.isContentEditable );

  assert.strictEqual( isEditing, true, 'Notepad did not go into edit mode.' );
  assert.strictEqual( isContentEditable, true, 'Notepad text area is not editable.' );

  await notepadIsLoaded( page );

  isEditing = await page.$eval( '#de-editing-notepad', elem => elem.classList.contains( 'de-editing-notepad-isediting' ) );
  isContentEditable = await page.$eval( '#de-editing-notepad-area', elem => elem.isContentEditable );

  assert.strictEqual( isEditing, false, 'Notepad stayed in edit mode after a refresh.' );
  assert.strictEqual( isContentEditable, false, 'Notepad text area is editable after a refresh.' );
}

// these should be run in order
module.exports = { hiddenOnFirstRun, expandedWhenClicked, goesIntoEditMode };
