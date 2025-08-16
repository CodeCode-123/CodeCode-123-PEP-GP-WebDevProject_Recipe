/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let usernameInput = document.getElementById("username-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let repeatedPasswordInput = document.getElementById("repeat-password-input");
let registerButton = document.getElementById("register-button");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.addEventListener("click", processRegistration);

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const repeatedPassword = repeatedPasswordInput.value.trim();
    
    if (username.length > 0 && 
        email.length > 0 && 
        password.length > 0 && 
        repeatedPassword.length > 0 && 
        password === repeatedPassword) {
            // Example placeholder:
            // const registerBody = { username, email, password };
            const registerBody = {
                username: username,
                email: email,
                password: password
            };

            const requestOptions = {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(registerBody)
            };
            // await fetch(...)
            
            try {
                const response = await fetch(BASE_URL + "/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestOptions)
                });
                
                if (response.status === 201) {
                    setTimeout(function() {
                        window.location.href = "http://localhost:8081/login"
                    }, 500);
                } else if (response.status === 409) {
                    alert("Email already existed.");
                } else {
                    console.error("Error fetching data:", response.status, response.statusText);
                    alert("Registration failed.");
                }
            } catch(error) {
                console.error("Error:", error);
                alert("Registration failed.");
            }
    } else {
        alert("Registration failed.");
    }
}
