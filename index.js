'use strict';
/*global $ */

const store = [
  { item: 'Papayas', checked: false },
  { item: 'Hummus', checked: true }
];
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
  let genString = compileShoppingListStrings(store);
  $('.js-shopping-list').html(genString);
}


function addNewItemObjectToStore(newItem) {
  const newShoppingItemObj = { item: newItem, checked: false };
  store.push(newShoppingItemObj);
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
  return (store[itemIndex].checked  === true ? store[itemIndex].checked  = false : store[itemIndex].checked  = true);
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
    console.log('delete button clicked', itemIndex);
    store.splice(itemIndex, 1);
    renderShoppingList(store);
  }); 
}

function handAllMainFunctions(){
  renderShoppingList(store);
  handleNewItems();
  handleItemCheckedToggle();
  handleItemDeleteButton();
}

handAllMainFunctions();