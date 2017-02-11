/**
* Removes multiple classes from a target
* @method removeClasses
* @param  {array}      ...remove [classnames to remove]
* @return {object}
*/
export function removeClasses(...remove) {
  remove.forEach(cls => { this.classList.remove(cls); });
}
/**
* Addes multiple classes to a target
* @method addClasses
* @param  {array}   ...add [classnames to add]
* @return {object}
*/
export function addClasses(...add) {
  add.forEach(cls => { this.classList.add(cls); });
}
