// =========================================
// PERSONAL CYBERSECURITY ASSISTANT
// DASHBOARD JAVASCRIPT
// =========================================


// -----------------------------------------
// 1. CHECK LOGIN STATUS
// -----------------------------------------

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}


// -----------------------------------------
// 2. GET USER INFORMATION
// -----------------------------------------

const currentUsername =
    localStorage.getItem("username") || "User";

const currentEmail =
    localStorage.getItem("userEmail") || "";

const currentUserId =
    localStorage.getItem("userId") || "";


// -----------------------------------------
// 3. DISPLAY USER INITIAL
// -----------------------------------------

const userInitial =
    document.getElementById("userInitial");

if (userInitial) {
    userInitial.textContent =
        currentUsername.charAt(0).toUpperCase();
}


// -----------------------------------------
// 4. DISPLAY USERNAME
// -----------------------------------------

const welcomeUsername =
    document.getElementById("welcomeUsername");

if (welcomeUsername) {
    welcomeUsername.textContent = currentUsername;
}


// -----------------------------------------
// 5. DISPLAY EMAIL IF ELEMENT EXISTS
// -----------------------------------------

const userEmail =
    document.getElementById("userEmail");

if (userEmail) {
    userEmail.textContent = currentEmail;
}


// -----------------------------------------
// 6. LOGOUT FUNCTION
// -----------------------------------------

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmLogout =
            confirm("Are you sure you want to logout?");

        if (!confirmLogout) {
            return;
        }

        // Remove login information
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("lastLogin");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "login.html";
    });
}


// -----------------------------------------
// 7. SECURITY TOOL NAVIGATION
// -----------------------------------------

const toolCards =
    document.querySelectorAll("[data-page]");

toolCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const page =
            card.getAttribute("data-page");

        if (page) {
            window.location.href = page;
        }

    });

});


// -----------------------------------------
// 8. CURRENT USER DETAILS IN CONSOLE
// -----------------------------------------

console.log(
    "Logged in user:",
    currentUsername
);

console.log(
    "User email:",
    currentEmail
);

console.log(
    "User ID:",
    currentUserId
);


// -----------------------------------------
// 9. DASHBOARD LOADED MESSAGE
// -----------------------------------------

console.log(
    "Personal Cybersecurity Assistant Dashboard loaded successfully."
);