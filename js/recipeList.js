const RecipeListTemplate = document.createElement("template");

RecipeListTemplate.innerHTML = `
  <head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="../css/style.css">
  </head>

  <div class="recipes container grey-text text-darken-1"></div>  
`;


class RecipeList extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.shadowRoot.appendChild(RecipeListTemplate.content.cloneNode(true));
    this.recipes = [];
  }

  async fetchData(){
    try {
      const response = await fetch("http://localhost:3000/recipes");

      if(response.ok){
        const data = await response.json();
        this.recipes = data;
        this.createList();
      } else {
        console.error("Error when fetching")
      }

    } catch (error) {
      console.error(error);      
    }
  }

  createList(){
    const container = this.shadowRoot.querySelector(".recipes");

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

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("material-icons");
      deleteIcon.innerText = "delete_outline"

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

  connectedCallback(){
    window.addEventListener("DOMContentLoaded", e => {
      this.fetchData()
    });
  }
  
  disconnectedCallback(){
    window.removeEventListener();
  }


}

window.customElements.define("recipe-list", RecipeList);