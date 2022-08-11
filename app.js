//Storage Controller
const StorageCtrl = (function(){



  //Public methods
  return{
    storeItem: function(item){
      let items;

      //check if any item in ls
      if(localStorage.getItem('items') === null){
        items = [];
        //push new item
        items.push(item);
        //set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //get what is alreay in ls
        items = JSON.parse(localStorage.getItem('items'));

        //push new item
        items.push(item);

        //reset local storage
        localStorage.setItem('items', JSON.stringify(items));
      }

    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else{
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(item.id === updatedItem.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(item.id === id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearitemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();



//Item Ccontroller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data structure
  const data = {
    // items: [
    //   // {id:0, name:'Steak Dinner', calories: 1200},
    //   // {id:1, name:'Cookie', calories: 400},
    //   // {id:3, name:'Eggs', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }


  
 //Public method 
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      //create id automatically
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //calories to numbers
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);

      //add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      //loop through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });

      return found;
    },
    updateItem: function(name, calories){
      //calories to number
      calories = parseInt(calories);
      
      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id){
      //Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      //Get index
      const index = ids.indexOf(id);

      //Remove item
      data.items.splice(index, 1);

    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;

      //loop through items and add cals
      data.items.forEach(function(item){
        total += item.calories;
      });

      //set total cal in data structure
      data.totalCalories = total;

      //return total Calories
      return data.totalCalories;
    },
    logData: function() {
      return data;
    },


  }

})();



//UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemsList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    clearBtn: '.clear-btn',
   backBtn: '.back-btn',
    itemNameInput:'#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }





  //Public method
  return{
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class=" edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      //Insert list in the dom
      document.querySelector(UISelectors.itemsList ).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    }, 
    addListItem: function(item){
      //show the list
      document.querySelector(UISelectors.itemsList).style.display = 'block';
      //create element
      const li = document.createElement('li');
      // Add class name
      li.className = 'collection-item';
      //Add id
      li.id = `item-${item.id}`;
      //add Html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class=" edit-item fa fa-pencil"></i>
      </a>`;
      //insert item
      document.querySelector(UISelectors.itemsList).insertAdjacentElement('beforeend', li); 
    },
    updateListItem: function(item){

      let listItems = document.querySelectorAll(UISelectors.listItems)

      //turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML =`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class=" edit-item fa fa-pencil"></i>
          </a>`;
        } 
      });

    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.itemsList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    }, 
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();






//App Controller
const App = (function(ItemCtrl,StorageCtrl, UICtrl){
  //load event Listeners
  const loadEventListeners = function(){
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    //Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keycode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });



    //Edit icon click event
    document.querySelector(UISelectors.itemsList).addEventListener('click', itemEditClick);

    //Update item Submit
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Delete item Submit
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Back icon 
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState); 

    //clear icon 
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick); 

  }


  //Add item submit
  const itemAddSubmit = function(e){
    //Get form input from UI controller
    const input = UICtrl.getItemInput();

    //check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      //Add items
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add list to UI list
      UICtrl.addListItem(newItem);

      //get calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //show total calories in the ui
      UICtrl.showTotalCalories(totalCalories);

      //store in local Storage
      StorageCtrl.storeItem(newItem);
 
      //clear Input
      UICtrl.clearInput();

     
    }
    
    e.preventDefault();
  }

  //Click edit item
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
    // get list item id(item-0 e.t.c)
      const listId = e.target.parentNode.parentNode.id;
      
      //Break into an arr
      const listIdArr = listId.split('-');
      console.log(listIdArr)

      // get actual id
      const id = parseInt(listIdArr[1]);
      console.log(id)

      //get item
      const itemToEdit = ItemCtrl.getItemById(id);
      console.log(itemToEdit)

      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();


    }



    e.preventDefault();
  }


  //update item Submit
  const itemUpdateSubmit = function(e){
    //Get item iput
    const input = UICtrl.getItemInput();

    //Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update Ui
    UICtrl.updateListItem(updatedItem);

    //get calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //show total calories in the ui
    UICtrl.showTotalCalories(totalCalories);

    //Update localstorage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();


    e.preventDefault();
  }

  //item delete submit
  const itemDeleteSubmit = function(e){
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete from ui
    UICtrl.deleteListItem(currentItem.id);

    //get calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //show total calories in the ui
    UICtrl.showTotalCalories(totalCalories);

    
    //Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);


    UICtrl.clearEditState();


    e.preventDefault();
  }

  //Clear items Event
  const clearAllItemsClick = function(e){
    //Delete all items from data structure
    ItemCtrl.clearAllItems();

    //get calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //show total calories in the ui
    UICtrl.showTotalCalories(totalCalories);

    //Remove from UI
    UICtrl.removeItems();

    //clear from local stoage
    StorageCtrl.clearitemsFromStorage();

    UICtrl.hideList();

    e.preventDefault();
  }






  //Public method
  return{
    init:function(){
      //set initial state
      UICtrl.clearEditState();

      //fetch items from the data structure and put in a variable
      const items = ItemCtrl.getItems();

        // Check if any items
        if(items.length === 0){
          UICtrl.hideList();
        } else {
          // Populate list with items
          UICtrl.populateItemList(items);
        }

      //get calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //show total calories in the ui
      UICtrl.showTotalCalories(totalCalories);

      //load Events
      loadEventListeners();
      console.log('app init');

    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);


App.init();