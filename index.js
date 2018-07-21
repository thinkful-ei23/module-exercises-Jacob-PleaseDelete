'use strict';
/*global $ */
$('#js-shopping-list-form').after('<input class="js-hide-checked" type="checkbox"><span class="slider round"> Click to hide checked items</span>');
$('#js-shopping-list-form').after('<form id="js-search-item"><label for="search-for-item">Search For Item</label><input type="text" name="search-for-item" class="search-for-item" placeholder="e.g., hotdog"><button type="submit">Add item</button></form>');
const store = { 
  items: [ 
    { item: 'Papayas', checked: false }, 
    { item: 'Hummus', checked: true } 
  ],
  checkedHide: false
};
function handleSearchForItem(store){
  $('#js-search-item').submit(function(event){
    event.preventDefault();
    const searchTerm = $('.search-for-item').val();
    $('.search-for-item').val('');
    console.log(searchTerm);
    let filteredStore = store.items.filter(function(searchTerm, item){
      console.log(searchTerm);
    });
  });
}

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
  $('#js-shopping-list-form').submit(function(event){
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addNewItemObjectToStore(newItemName);
    renderShoppingList(store);
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
//User can edit the title of an item



function handAllMainFunctions(){
  renderShoppingList(store);
  handleNewItems();
  handleItemCheckedToggle();
  handleItemDeleteButton();
  hideCheckedItems(store);
  handleSearchForItem()
}

handAllMainFunctions();