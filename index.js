'use strict';
/*global $ */
$('#js-shopping-list-form').after('<input class="js-hide-checked" type="checkbox"><span class="slider round"> Click to hide checked items</span>');
$('#js-shopping-list-form button:last-child').after('<button type="submit" id="js-search-button">Search</button>');
$('#js-shopping-list-form button:last-child').after('<button type="reset" id="reset">Reset</button>');
const store = { 
  items: [ 
    { item: 'Papayas', checked: false }, 
    { item: 'Hummus', checked: true } 
  ],
  checkedHide: false
};

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
function addNewItemObjectToStore(newItem) {
  const newShoppingItemObj = { item: newItem, checked: false };
  store.items.push(newShoppingItemObj);
}
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
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}
function toggleChecked(itemIndex) {
  return (store.items[itemIndex].checked  === true ? store.items[itemIndex].checked  = false : store.items[itemIndex].checked  = true);
}
function handleItemCheckedToggle(){
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event) {  
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleChecked(itemIndex);
    renderShoppingList(store);
  });
}

function handleItemDeleteButton() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(event) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    store.items.splice(itemIndex, 1);
    renderShoppingList(store);
  }); 
}

//User can press a switch/checkbox to toggle between displaying all items or displaying only items that are unchecked

function toggleCheckHide() {
  return store.checkedHide = !store.checkedHide;
}
function hideCheckedItems(store) {
  $('.js-hide-checked').on('click', function(event) {
    toggleCheckHide();
    renderShoppingList(store);
  });
}
//User can type in a search term and the displayed list will be filtered by item names only containing that search term
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
function resetListRendering() {
  $('#js-shopping-list-form button:last-child').on('click', function(){
    renderShoppingList(store);
  });
}

//User can edit the title of an item
function editItemTitle() {
  $('.js-shopping-list').on('click', '.js-shopping-item', function(event) {
    $(event.currentTarget).closest('li').html('<form id="shopping-item-change"><input class="shopping-item-change" type="text" name="change-item" placeholder="change item here"><button type="submit" class="js-update-name-button">Update</button></form>');
    updateNewItemTitle();
  });
}
function updateNewItemTitle() {
  $('.js-update-name-button').on('click', function(event){
    event.preventDefault();
    let newItemTitle = $('.shopping-item-change').val();
    let indexOfItemToBeChanged = getItemIndexFromElement(event.currentTarget);
    store.items[indexOfItemToBeChanged].item = newItemTitle;
    renderShoppingList(store);
  });
}


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

handAllMainFunctions();