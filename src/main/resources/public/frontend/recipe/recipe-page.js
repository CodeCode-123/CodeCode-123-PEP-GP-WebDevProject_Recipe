/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL
//const filename = "/workspace/CodeCode-123-PEP-GP-WebDevProject_Recipe/src/main/resources/public/frontend";

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
   let addRecipeNameInput = document.getElementById("add-recipe-name-input");
   let addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
   let addRecipeSubmitButton = document.getElementById("add-recipe-submit-input");

   let updateRecipeNameInput = document.getElementById("update-recipe-name-input");
   let updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
   let updateRecipeSubmitButton = document.getElementById("update-recipe-submit-input");

   let deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
   let deleteRecipeSubmitButton = document.getElementById("delete-recipe-submit-input");

   let recipeListContainer = document.getElementById("recipe-list");

   let adminLink = document.getElementById("admin-link");
   let logoutButton = document.getElementById("logout-button");
   let backLink = document.getElementById("back-link");

   let searchInput = document.getElementById("search-input");
   let searchInputButton = document.getElementById("search-button");

   let recipes = [];

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    const token = sessionStorage.getItem("auth-token").trim();
    if (token.length > 0) {
        logoutButton.style.visibility = "visible";
    }


    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    const isAdmin = sessionStorage.getItem("is-admin").trim();
    if (isAdmin === "true") {
        adminLink.style.visibility = "visible";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitButton.addEventListener("click", addRecipe);
    updateRecipeSubmitButton.addEventListener("click", updateRecipe);
    deleteRecipeSubmitButton.addEventListener("click", deleteRecipe);
    searchInputButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);


    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    window.onload = getRecipes;


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTermInputValue = searchInput.value.trim();
        try {
            const response = await fetch(BASE_URL + "/recipes?name=" + searchTermInputValue);

            if (response.ok) {
                refreshRecipeList();
            } else {
                console.error("Error fetching data:", response.status, response.statusText);
                alert("Search recipes failed.");
            }
        } catch(error) {
            console.error("Error:", error);
            alert("Search recipes failed.");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const addRecipeNameInputValue = addRecipeNameInput.value.trim();
        const addRecipeInstructionsInputValue = addRecipeInstructionsInput.value.trim();
        const token = sessionStorage.getItem("auth-token").trim();
        if (addRecipeNameInputValue.length > 0 && 
            addRecipeInstructionsInputValue.length > 0 && 
            token.length > 0) {
            try {
                const requestBody = {
                    name: addRecipeNameInputValue, 
                    instructions: addRecipeInstructionsInputValue
                };

                const requestOptions = {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*"
                    },
                    redirect: "follow",
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify(requestBody)
                };

                const response = await fetch(BASE_URL + "/recipes", requestOptions);
                
                if (response.status === 201) {
                    addRecipeNameInput.value = "";
                    addRecipeInstructionsInput.value = "";
                    getRecipes();
                    refreshRecipeList();
                } else {
                    console.error("Error fetching data:", response.status, response.statusText);
                    //alert("Add recipe failed.");
                }
            } catch(error) {
                console.error("Error:", error);
                //alert("Add recipe failed.");
            }
        } else {
            console.error("Error:", error);
            //alert("Add recipe failed.");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const updateRecipeNameInputValue = updateRecipeNameInput.value.trim();
        const updateRecipeInstructionsInputValue = updateRecipeInstructionsInput.value.trim();
        if (updateRecipeNameInputValue.length > 0 && updateRecipeInstructionsInputValue.length > 0) {
            const elements = recipes;
            for (const element of elements) {
                if (element.textContent === updateRecipeNameInputValue) {
                    const id = element.getId();
                    element.setInstructions(updateRecipeInstructionsInputValue);
                    if (id) {
                        try {
                            const response = fetch(BASE_URL + `/recipes/${id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(element)
                            });

                            if (response.ok) {
                                updateRecipeNameInput.value = "";
                                updateRecipeInstructionsInput.value = "";
                                getRecipes();
                                refreshRecipeList();
                            } else {
                                console.error("Error fetching data:", response.status, response.statusText);
                                //alert("Update recipe failed.");
                            }
                        } catch(error) {
                            console.error("Error:", error);
                            //alert("Update recipe failed.");
                        }
                    }
                    break;
                }
            }
        } else {
            console.error("Error:", error);
            //alert("Update recipe failed.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        try {
            const deleteRecipeNameInputValue = deleteRecipeNameInput.value.trim();
            const elements = recipes;
            let isFound = false;
            for (const element of elements) {
                if (element.textContent === deleteRecipeNameInputValue) {
                    const id = element.getId();
                    isFound = true;
                    if (id) {
                        const response = await fetch(BASE_URL + `/recipes/${id}`, {
                            method: "DELETE"
                        });

                        if (response.ok) {
                            deleteRecipeNameInput.value = "";
                            //getRecipes();
                            refreshRecipeList();
                        } else {
                            //alert("Delete recipe failed.");
                            console.error("Error fetching data:", response.status, response.statusText); 
                        }
                        break;
                    }
                } 
            }  
            if (isFound === false) {
                //alert("Recipe not found.");
                console.error("Error:", error);
            }
        } catch(error) {
            // alert("Delete recipe failed.");
            console.error("Error:", error);
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch(BASE_URL + "/recipes");

            if (response.ok) {
                let data = await response.json();
                for (let i = 0; i < data.length; i++) {
                    const id = data[i].getId();
                    const name = data[i].getName();
                    const instructions = data[i].getInstructions();
                    const author = data[i].getAuthor();
                    const newObject = {
                        id: id,
                        name: name,
                        instructions: instructions,
                        author: author
                    }
                    recipes.push(newObject);
                }

                refreshRecipeList();
            } else {
                console.error("Error fetching data:", response.status, response.statusText);
                //alert("Get recipes failed.");
            }
        } catch(error) {
            console.error("Error:", error);
            //alert("Get recipes failed.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        while (recipeListContainer.firstChild) {
            recipeListContainer.removeChild(recipeListContainer.firstChild);
        }
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const name = recipe.name;
            const instructions = recipe.instructions;
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.textContent = name + ": " + instructions;
            li.appendChild(p);
            recipeListContainer.appendChild(li);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        const token = sessionStorage.getItem("auth-token").trim();
        try {
            const response = await fetch(BASE_URL + "/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(sessionStorage)
            });

            if (response.ok) {
                sessionStorage.setItem("auth-token", null);
                sessionStorage.setItem("is-admin", "false");

                logoutButton.style.visibility = "hidden";
                
                setTimeout(function() {
                    window.location.href = "../login/login-page.html";
                }, 500);
            } else {
                console.error("Error fetching data:", response.status, response.statusText);
                alert("Process logout failed.");
            }
        } catch(error) {
            console.error("Error:", error);
            alert("Process logout failed.");
        }
    }

});
