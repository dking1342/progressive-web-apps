const sideForm = document.querySelector("#side-form");
const sideFormExitBtn = document.querySelector(".side-form-exit");
const form = document.querySelector("form");


document.querySelector(".add-btn").addEventListener("click", e => {
  sideForm.style.transform = "translateX(0%)"
});

sideFormExitBtn.addEventListener("click", e => {
  sideForm.style.transform = "translateX(-100%)"
})

document.querySelector("#submit").addEventListener("submit", async (e) => {
  console.log("submit")
  e.preventDefault();

  let id = Math.ceil(Math.random() * 1000000);
  let title = document.querySelector("#recipe-title").value.trim();
  let recipeIngredients = document.querySelector("#ingredients").value.split(", ");
  recipeIngredients.forEach(item => item.trim())

  const body = {
    id,
    title,
    ingredients: recipeIngredients
  }

  sideForm.style.transform = "translateX(-100%)"

  if(Boolean(body.title) && Boolean(body.ingredients)){
    console.log("fetch")
    let data = await fetch("http://localhost:3000/recipes",{
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
    console.log(data)
  } else {
    console.log({"error":"did not post"})
  }
  

})

