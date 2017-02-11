/**
 * Utitlity methods used by the popup
 */

// ========================================================
// _acknowledgeUpdate
// ========================================================
/**
 * Clears the update notification
 * @method   _acknowledgeUpdate
 * @param    {string}          message [The message displayed to the user]
 * @return   {undefined}
 */
export function _acknowledgeUpdate(message) {

  chrome.storage.sync.set({didUpdate: false}, function() { /*noop*/ });
}
// ========================================================
// _fadeOut
// ========================================================
/**
 * Fades out an element via CSS animation
 * @method _fadeOut
 * @param  {object} elem [the element to fade]
 * @return {undefined}
 */
export function _fadeOut(elem) {

  elem.classList.add('fadeOut');
  elem.classList.remove('fadeIn');

  setTimeout(() => {

    elem.removeClasses('fadeOut', 'show');
    elem.classList.add('hide');
  }, 400);
}
// ========================================================
// _fadeIn
// ========================================================
/**
 * Fades in an element via CSS animation
 * @method _fadeIn
 * @param  {object} elem [the element to fade]
 * @return {undefined}
 */
export function _fadeIn(elem) {

  elem.removeClasses('fadeOut', 'hide');
  elem.addClasses('fadeIn', 'show');
}
// ========================================================
// _isHidden
// ========================================================
/**
 * Returns true when an element has classname 'hide'
 * @method _isHidden
 * @param  {element}  element [the element to examine]
 * @return {Boolean}
 */
export function _isHidden(element) {
  return element.parentNode.className.includes('hide');
}
// ========================================================
// _optionsToggle
// ========================================================
/**
 * Displays the options in the popup menu
 * @method _optionsToggle
 * @param  {object}    options      [the DOM element to display]
 * @param  {object}    toggleGroup  [the actual feature in the popup menu]
 * @param  {number}    height       [the height that `target` will expand to]
 * @param  {string}    parentClass  [the parent class of the animated arrow]
 * @return {undefined}
 */
export function _optionsToggle(options, toggleGroup, parentClass, height) {

  let arrow = document.querySelector(`${parentClass} .arrow`),
      status = document.querySelector(`${parentClass} .status`);

  options = document.querySelector(options);

  // Expand
  // Check the current height and either expand or collapse it
  if (toggleGroup.clientHeight === 50) {

    toggleGroup.style.height = height + 'px';

    arrow.classList.add('rotate90');

    let int = setInterval(function() {

      if ( toggleGroup.clientHeight >= 30 ) {

        _fadeIn(options);

        if (status) { _fadeOut(status); }

        clearInterval(int);
      }
    }, 100);
  }
  // Collapse
  // (don't collapse when clicking these elements)
  else if (event.target.nodeName !== 'INPUT' &&
           event.target.type !== 'checkbox' &&
           event.target.nodeName !== 'LABEL' &&
           event.target.nodeName !== 'SPAN' &&
           event.target.nodeName !== 'A' &&
           event.target.nodeName !== 'SELECT') {

    _fadeOut(options);

    if (status) { status.classList.add('fadeIn'); }

    arrow.classList.remove('rotate90');

    let int = setInterval(function() {

     if (options.offsetParent === null) {

        toggleGroup.style.height = '50px';

       clearInterval(int);
     }
    }, 100);
  }
}
// ========================================================
// _setEnabledStatus
// ========================================================
/**
 * Sets the enabled/disabled text status on SUBMENUS
 * @method _setEnabledStatus
 * @param  {object}         target [the DOM element]
 * @param  {string}         status [Enabled/Disabled]
 */
export function _setEnabledStatus(target, status) {

  if (status === 'Enabled') {

    target.classList.add('enabled');
    target.classList.remove('disabled');

  } else {

    target.classList.add('disabled');
    target.classList.remove('enabled');
  }

  return target.textContent = status;
}
