// let request = self.indexedDB.open("FOOD_DB");
// let db;
// let transaction;
// let recipeStore;


// request.onsuccess = (event) => {
//   // some sample recipe data
//   let recipes = [
//     {id: 1, title: 'Pizza', ingredients: ["Cheese", "Bread"]},
//     {id: 2, title: 'Soup', ingredients: ["Water", "Oil"]},
//     {id: 3, title: 'Taco', ingredients: ["Meat", "Shell"]}
//   ];

//   // get database from event
//   db = event.target.result;

//   // create transaction from database
//   transaction = db.transaction('recipes', 'readwrite');

//   // add success event handleer for transaction
//   // you should also add onerror, onabort event handlers
//   transaction.onsuccess = function(event) {
//       console.log('[Transaction] ALL DONE!');
//   };

//   transaction.onerror = function(event) {
//     console.log({"transaction error": "an error happened when making a transaction","error":event})
//   }

//   // get store from transaction
//   recipeStore = transaction.objectStore('recipes');

//   /*************************************/

//   // put recipe data in recipeStore
//   recipes.forEach(function(recipe){
//       var db_op_req = recipeStore.add(recipe);

//       db_op_req.onsuccess = function(event) {
//           console.log({"transaction result": event.target.result == recipe.id ? true : false}); // true
//       }
//   });

//   // count number of objects in store
//   recipeStore.count().onsuccess = function(event) {
//       console.log({"recipe count":event.target.result});
//   };

//   // get product with id 1
//   recipeStore.get(1).onsuccess = function(event) {
//       console.log("Get recipe by id: 1",event.target.result)
//   };

//   // update product with id 1
//   recipes[0].title = 'Blue Men T-shirt';
//   recipeStore.put(recipes[0]).onsuccess = function(event) {
//     console.log("Update recipe", event.target.result)
//   };

//   // delete product with id 2
//   recipeStore.delete(2).onsuccess = function(event) {
//       console.log("Delete recipe by id", event.target.result);
//   };

//   let newRecipe = {id:4,title:"Calzone",ingredients:["bread", "water"]};
//   recipeStore.add(newRecipe).onsuccess = function(event) {
//     console.log("Create recipe", event.target.result);
//   }

//   recipeStore.getAll().onsuccess = function(event) {
//     console.log("all recipes");
//     console.log(event.target.result)
//   }

//   recipeStore.onerror = function(event){
//     console.log("something went wrong")
//   }
// }


// request.onerror = function(event) {
//   console.log('[onerror]', request.error);
// };

// request.onupgradeneeded = function(event) {
//   var db = event.target.result;
//   var recipeStore = db.createObjectStore('recipes', {keyPath: 'id'});
// };

const dbOpen = async (dbName,storeName) => {
  const dbOpen = indexedDB.open(dbName)

  dbOpen.onsuccess = (e) => {
    db = e.target.result;
    console.log(db)
  }

  dbOpen.onerror = () => {
    console.log(dbOpen.error)
  }

  dbOpen.onupgradeneeded = e => {
    const db = e.target.result;
    const store = db.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true});
    store.createIndex("id","id",{unique:true})
  }; 
}


