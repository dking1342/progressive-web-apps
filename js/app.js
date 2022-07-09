const sideForm = document.querySelector("#side-form");
const sideFormExitBtn = document.querySelector(".side-form-exit");
const form = document.querySelector("form");


document.querySelector(".add-btn").addEventListener("click", e => {
  sideForm.style.transform = "translateX(0%)"
});

sideFormExitBtn.addEventListener("click", e => {
  sideForm.style.transform = "translateX(-100%)"
})

document.querySelector("#submit").addEventListener("click", async (e) => {
  e.preventDefault();

  let id = Math.ceil(Math.random() * 1000000);
  let title = document.querySelector("#recipe-title").value.trim();
  let recipeIngredients = document.querySelector("#ingredients").value.split(", ");
  recipeIngredients.forEach(item => item.trim())

  const body = {
    id,
    title,
    ingredients: recipeIngredients,
    createdAt: Date.now()
  }

  try {
    let response = await fetch("http://localhost:3000/recipes",{
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
    
    if(response.ok){
      let data = await response.json();
      console.log("response ok", data)
      location.reload()
    }
    
  } catch (error) {
    console.log({"error":error.message})    
  }

  sideForm.style.transform = "translateX(-100%)"

})

