const sideForm = document.querySelector("#side-form");
const sideFormExitBtn = document.querySelector(".side-form-exit");
const form = document.querySelector("form");

document.querySelector(".add-btn").addEventListener("click", e => {
  sideForm.style.transform = "translateX(0%)"
});

sideFormExitBtn.addEventListener("click", e => {
  sideForm.style.transform = "translateX(-100%)"
})

document.querySelector("#add-recipe").addEventListener("click", async (e) => {
  e.preventDefault();

  let id = Math.ceil(Math.random() * 1000000);
  let title = document.querySelector("#recipe-title").value.trim();
  let recipeIngredients = document.querySelector("#ingredients").value.split(", ");

  const body = {
    id,
    title,
    ingredients: recipeIngredients
  }

  const response = await fetch("http://localhost:3000/recipes",{
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(body) 
  });
  const data = await response.json();
  console.log(data);

  // sideForm.style.transform = "translateX(-100%)"
})