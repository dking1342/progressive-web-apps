const RecipeListTemplate = document.createElement("template");

RecipeListTemplate.innerHTML = `
  <link rel="stylesheet" href="../css/materialize.min.css">
  <link rel="stylesheet" href="../css/style.css">
  <style>
    .delete-btn {
      pointer-events: none;
    }
  </style>

  <div class="list"></div>  
`;




class RecipeList extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.shadowRoot.appendChild(RecipeListTemplate.content.cloneNode(true));
    this.recipes = [];
  }

  async getAll(){
    try {
      let dbOpen = self.indexedDB.open("FOOD_DB");
      return new Promise((resolve, reject) => {
        dbOpen.onsuccess = (e) => {
          let db = e.target.result;
          let transaction = db.transaction('recipes','readwrite');
          let store = transaction.objectStore('recipes');
          let allItems = store.getAll();
          
          allItems.onsuccess = event => {
            resolve(event.target.result)
          }
          allItems.onerror = event => {
            reject(event.target.error)
          }
        }
        
        dbOpen.onerror = () => {
          reject({error: dbOpen.error})
        }    
      })      
    } catch (error) {
      return { error }
    }
  }

  async fetchData(){
    try {
      const response = await fetch("http://localhost:3000/recipes");

      if(response.ok){
        const data = await response.json();
        const sortedData = data.sort((a,b) => b.createdAt - a.createdAt);
        this.recipes = sortedData;
        this.createList();
      } else {
        console.error("Error when fetching")
      }

    } catch (error) {
      console.error({"fetch error":error});      
    }
  }

  createList(){
    const container = this.shadowRoot.querySelector(".list");

    this.recipes.forEach(rec => {
      // card
      const card = document.createElement("div");
      card.classList.add("card-panel", "recipe", "white", "row");

      // card image
      const image = document.createElement("img");
      image.src = "/img/dish.png"
      image.alt = "recipe thumb"

      // card
      const cardBody = document.createElement("div");
      cardBody.classList.add("recipe-details")

      const cardTitle = document.createElement("div");
      cardTitle.classList.add("recipe-title");
      cardTitle.innerText=`${rec.title}`

      const cardSubtitle = document.createElement("div");
      cardSubtitle.classList.add("recipe-ingredients");
      cardSubtitle.innerText = `${rec.ingredients.join(", ")}`

      // delete section
      const deleteBtn = document.createElement("div");
      deleteBtn.classList.add("recipe-delete");
      deleteBtn.dataset.key = `${rec.id}`;
      deleteBtn.addEventListener("click", e => this.deleteRecipe(rec))

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("material-icons", "delete-btn");
      deleteIcon.innerText = "X"

      // card body creation
      cardBody.append(cardTitle);
      cardBody.append(cardSubtitle);

      // delete creation
      deleteBtn.append(deleteIcon);

      // card creation
      card.append(image);
      card.append(cardBody);
      card.append(deleteBtn);

      // row creation
      container.append(card);

    })
  }

  async deleteRecipe(recipe){
    try {
      const response = await fetch(`http://localhost:3000/recipes/${recipe.id}`,{
        method: 'DELETE', 
      });

      if(response.ok){
        console.log("deleted")
        location.reload();
      } else {
        console.log("error when fetching")
      }
      
    } catch (error) {
      console.log(error)
    }
    
  }

  connectedCallback(){

    window.addEventListener("DOMContentLoaded", async (e) => {
      await this.fetchData()
    });

  }
  
  disconnectedCallback(){
    window.removeEventListener();
  }


}

window.customElements.define("recipe-list", RecipeList);