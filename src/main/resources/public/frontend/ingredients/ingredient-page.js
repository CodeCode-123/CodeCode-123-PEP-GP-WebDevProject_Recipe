/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/*
    * TODO: Get references to various DOM elements
    * - addIngredientNameInput
    * - deleteIngredientNameInput
    * - ingredientListContainer
    * - searchInput (optional for future use)
    * - adminLink (if visible conditionally)
    */
    let addIngredientNameInput = document.getElementById("add-ingredient-name-input");
    let addIngredientSubmitButton = document.getElementById("add-ingredient-submit-button");
    let deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
    let deleteIngredientSubmitButton = document.getElementById("delete-ingredient-submit-button");
    let ingredientListContainer = document.getElementById("ingredient-list");
    //let searchInput = document.querySelectorAll("li");
    let adminLink = document.getElementById("back-link");

    /*
    * TODO: Attach 'onclick' events to:
    * - "add-ingredient-submit-button" → addIngredient()
    * - "delete-ingredient-submit-button" → deleteIngredient()
    */
    addIngredientSubmitButton.addEventListener("click", addIngredient);
    deleteIngredientSubmitButton.addEventListener("click", deleteIngredient);
    // addIngredientSubmitButton.onclick = addIngredient;
    // deleteIngredientSubmitButton.onclick = deleteIngredient;


    /*
    * TODO: Create an array to keep track of ingredients
    */
   let ingredients = [];


    /*
    * TODO: On page load, call getIngredients()
    */
   window.onload = addIngredient;


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    let addIngredientNameInputValue = addIngredientNameInput.value.trim();
    const token = sessionStorage.getItem("auth-token");
    if (addIngredientNameInputValue.length > 0) {
        try {
            const response = await fetch(BASE_URL + "/ingredients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(new Ingredient(addIngredientNameInputValue))
            });

            if (response.ok) {
                addIngredientNameInput.value = "";
                getIngredients();
                refreshIngredientList();
            } else {
                console.error("Error fetching data:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Adding ingredient failed.");
        }
    } else {
        alert("Adding ingredient failed.");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(BASE_URL + "/ingredients");

        if (response.ok) {
            let data = await response.json();
            for (let i = 0; i < data.length; i++) {
                const id = data[i].getId;
                const name = data[i].getName;
                ingredients.push(new Ingredient(id, name));
            }

            refreshIngredientList();
        } else {
            console.error("Error fetching data:", response.status, response.statusText);
        }
    } catch(error) {
        console.error("Error:", error);
        alter("Get ingredients failed.");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    let deleteIngredientNameInputValue = deleteIngredientNameInput.value.trim();
    const elements = ingredients;
    let isFound = false;
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.textContent == deleteIngredientNameInputValue) {
            isFound = true;
            const id = element.getId();
            if (id) {
                try {
                    const response = await fetch(BASE_URL + `/ingredients/${id}`, {
                        method: "DELETE"
                    });

                    if (response.status === 204) {
                        getIngredients();
                        refreshIngredientList();
                        deleteIngredientNameInput.value = "";
                    } else {
                        console.error("Error fetching data:", response.status, response.statusText);
                    }
                } catch(error) {
                    console.error("Error:", error);
                    alter("Delete ingredients failed.");
                }
            }
            break;
        }

    }
    if (isFound === false) {
        alert("Ingredient not found.");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    while (ingredientListContainer.firstChild) {
        ingredientListContainer.removeChild(ingredientListContainer.firstChild);
    }
    for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        let li = document.createElement("li");
        let p = document.createElement("p");
        p.textContent = ingredient.getName();
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    }
}
