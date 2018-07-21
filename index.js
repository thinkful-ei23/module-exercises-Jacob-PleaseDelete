'use strict';
/*global $ */
// 2 buttons and a switch added to the DOM
$('#js-shopping-list-form button:last-child').after('<button type="submit" id="js-search-button">Search</button>');
$('#js-shopping-list-form button:last-child').after('<button type="reset" id="reset">Reset</button><br><br>');
$('#js-shopping-list-form').after('<span class="slider round"> Click to hide checked items </span><input class="js-hide-checked" type="checkbox">');

const store = { 
  items: [ 
    { item: 'Papayas', checked: false }, 
    { item: 'Hummus', checked: true } 
  ],
  checkedHide: false
};
//generates a string which pulls data from the above store object.
function generateItemElement(obj, index){
  return `
    <li class="js-item-index-element" data-item-index="${index}">
      <span class="shopping-item js-shopping-item ${obj.checked ? 'shopping-item__checked' : ''}">${obj.item}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}
// checks if "checkedHide" is true (button switched on) if so, this function will complile only the string elements of objects with checked: false.  If "checkedHide" is false, this funtion complile all current item objects in the store object
function compileShoppingListStrings(arr) {
  const elements = arr.map(function(obj, index) {
    return generateItemElement(obj, index);
  });
  return elements.join('');
}
function renderShoppingList(store) {
  if ( store.checkedHide === true) {
    let filteredItems = store.items.filter(function(item){
      return item.checked === false;
    });
    let genString = compileShoppingListStrings(filteredItems);
    $('.js-shopping-list').html(genString);
  } else {
    let genString = compileShoppingListStrings(store.items);
    $('.js-shopping-list').html(genString);
  }
}
//takes the value from the following function and uses it to add a new item object to the store object
function addNewItemObjectToStore(newItem) {
  const newShoppingItemObj = { item: newItem, checked: false };
  store.items.push(newShoppingItemObj);
}
// listens for clicks on the "Add" button. It then retrieves the string value from the text input and if it is not a "" empty string, it runs the value through "addNewItemObjectToStore" function and then re renders the shopping list
function handleNewItems(){
  $('#js-shopping-list-form button:first').on('click', function(event){
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    if (newItemName !== '') {
      $('.js-shopping-list-entry').val('');
      addNewItemObjectToStore(newItemName);
      renderShoppingList(store);
    }
  });
}
//takes an element and searches for the nearest li.  It returns "data-item-index" value after parsing from string to number
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}
// with a number parameter this function toggles the checked value of the corosponding index
function toggleChecked(itemIndex) {
  return (store.items[itemIndex].checked  === true ? store.items[itemIndex].checked  = false : store.items[itemIndex].checked  = true);
}
// listens for a click on the "check" button and toggles the checked value in corosponding element in store object of items. after this rerenders the shopping list.
function handleItemCheckedToggle(){
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event) {  
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleChecked(itemIndex);
    renderShoppingList(store);
  });
}
// listens for click on "Delete" button, then deletes corosponding elelment in store object, then rerenders shopping list
function handleItemDeleteButton() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(event) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    store.items.splice(itemIndex, 1);
    renderShoppingList(store);
  }); 
}
// toggles the store.checkHide boolean value
function toggleCheckHide() {
  return store.checkedHide = !store.checkedHide;
}
// listens for switch change and runs the toggleCheckHide function and rerenders shopping list
function hideCheckedItems(store) {
  $('.js-hide-checked').on('click', function(event) {
    toggleCheckHide();
    renderShoppingList(store);
  });
}
// listens for click on search button and captures value in text field. uses value to filter store to show only items matching
function handleSearchForItem(){
  $('#js-search-button').on('click', function(event) {
    event.preventDefault();
    const searchTerm = $('.js-shopping-list-entry').val();
    //if statment makes no change if empty search submited
    if (searchTerm !== '') {
      const filteredItems = store.items.filter(function(obj){
        //works even if casing is different
        return (obj.item === searchTerm || obj.item.toLowerCase() === searchTerm);
      });
      let genString = compileShoppingListStrings(filteredItems);
      $('.js-shopping-list').html(genString);
    }
    $('.search-for-item').val('');
  });
}
// listens for click on reset button and then rerenders shopping list.
function resetListRendering() {
  $('#js-shopping-list-form button:last-child').on('click', function(){
    renderShoppingList(store);
  });
}
// after item text has been clicked to change, when text has been input and button clicked the object in the store object is changed to new text and page is rerended.
function updateNewItemTitle() {
  $('.js-update-name-button').on('click', function(event){
    event.preventDefault();
    let newItemTitle = $('.shopping-item-change').val();
    let indexOfItemToBeChanged = getItemIndexFromElement(event.currentTarget);
    if ( newItemTitle !== '') {
      store.items[indexOfItemToBeChanged].item = newItemTitle;
      renderShoppingList(store);
    } else {
      renderShoppingList(store);
    }
  });
}
// listens for click on item text, then changes text element to a text input with button.  then runs "updateNewItemTitle()" to complete the change of item text.
function editItemTitle() {
  $('.js-shopping-list').on('click', '.js-shopping-item', function(event) {
    $(event.currentTarget).closest('li').html('<form id="shopping-item-change"><input class="shopping-item-change" type="text" name="change-item" placeholder="change item here"><button type="submit" class="js-update-name-button">Update</button></form>');
    updateNewItemTitle();
  });
}
// all non callback functions are placed in this handle main function
function handAllMainFunctions(){
  renderShoppingList(store);
  handleNewItems();
  handleItemCheckedToggle();
  handleItemDeleteButton();
  hideCheckedItems(store);
  handleSearchForItem();
  resetListRendering();
  editItemTitle();
}
// runs all main functions
handAllMainFunctions();