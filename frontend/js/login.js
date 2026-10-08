// =========================================
// PERSONAL CYBERSECURITY ASSISTANT
// LOGIN JAVASCRIPT
// =========================================


// -----------------------------------------
// API URL
// -----------------------------------------

const API_URL = "https://personal-cybersecurity-assistant-phli.onrender.com";


// -----------------------------------------
// GET HTML ELEMENTS
// -----------------------------------------

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");

const togglePassword =
    document.getElementById("togglePassword");

const eyeIcon =
    document.getElementById("eyeIcon");

const statusAlert =
    document.getElementById("statusAlert");


// -----------------------------------------
// SHOW STATUS MESSAGE
// -----------------------------------------

function showStatus(message, type = "error") {

    statusAlert.textContent = message;

    statusAlert.classList.remove(
        "hidden",
        "bg-red-50",
        "text-red-700",
        "border-red-200",
        "bg-green-50",
        "text-green-700",
        "border-green-200"
    );

    if (type === "success") {

        statusAlert.classList.add(
            "bg-green-50",
            "text-green-700",
            "border",
            "border-green-200"
        );

    } else {

        statusAlert.classList.add(
            "bg-red-50",
            "text-red-700",
            "border",
            "border-red-200"
        );
    }
}


// -----------------------------------------
// HIDE STATUS MESSAGE
// -----------------------------------------

function hideStatus() {

    statusAlert.textContent = "";

    statusAlert.classList.add("hidden");

}


// -----------------------------------------
// EMAIL VALIDATION
// -----------------------------------------

function validateEmail(email) {

    const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailPattern.test(email);
}


// -----------------------------------------
// PASSWORD VALIDATION
// -----------------------------------------

function validatePassword(password) {

    if (password.length < 6) {

        return "Password must be at least 6 characters long.";
    }

    if (!/[0-9]/.test(password)) {

        return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {

        return "Password must contain at least one special character.";
    }

    return null;
}


// -----------------------------------------
// LOGIN FORM
// -----------------------------------------

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        hideStatus();


        // -----------------------------------------
        // GET FORM VALUES
        // -----------------------------------------

        const email =
            emailInput.value.trim().toLowerCase();

        const password =
            passwordInput.value;


        // -----------------------------------------
        // CHECK EMPTY FIELDS
        // -----------------------------------------

        if (!email || !password) {

            showStatus(
                "Please enter your email and password."
            );

            return;
        }


        // -----------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------

        if (!validateEmail(email)) {

            showStatus(
                "Please enter a valid email address."
            );

            emailInput.focus();

            return;
        }


        // -----------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------

        const passwordError =
            validatePassword(password);

        if (passwordError) {

            showStatus(passwordError);

            passwordInput.focus();

            return;
        }


        // -----------------------------------------
        // DISABLE LOGIN BUTTON
        // -----------------------------------------

        loginBtn.disabled = true;

        loginBtn.classList.add(
            "opacity-70",
            "cursor-not-allowed"
        );

        loginBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Logging in...</span>
        `;


        // -----------------------------------------
        // SEND LOGIN REQUEST
        // -----------------------------------------

        try {

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            // -----------------------------------------
            // READ RESPONSE
            // -----------------------------------------

            const data =
                await response.json();

            console.log(
                "Login response:",
                data
            );


            // -----------------------------------------
            // LOGIN SUCCESS
            // -----------------------------------------

            if (
                response.ok &&
                data.success === true
            ) {

                console.log(
                    "Login successful"
                );


                // -----------------------------------------
                // SAVE LOGIN INFORMATION
                // -----------------------------------------

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                localStorage.setItem(
                    "username",
                    data.user.name
                );

                localStorage.setItem(
                    "userEmail",
                    data.user.email
                );

                localStorage.setItem(
                    "userId",
                    data.user.id
                );

                localStorage.setItem(
                    "lastLogin",
                    new Date().toISOString()
                );


                console.log(
                    "localStorage isLoggedIn:",
                    localStorage.getItem("isLoggedIn")
                );


                // -----------------------------------------
                // SHOW SUCCESS MESSAGE
                // -----------------------------------------

                showStatus(
                    "Login successful. Redirecting to dashboard...",
                    "success"
                );


                // -----------------------------------------
                // REDIRECT TO DASHBOARD
                // -----------------------------------------

                setTimeout(
                    function () {

                        console.log(
                            "Redirecting to dashboard..."
                        );

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );


                return;
            }


            // -----------------------------------------
            // LOGIN FAILED
            // -----------------------------------------

            showStatus(
                data.message ||
                "Invalid email or password."
            );

        } catch (error) {

            // -----------------------------------------
            // CONNECTION ERROR
            // -----------------------------------------

            console.error(
                "Login error:",
                error
            );

            showStatus(
                "Unable to connect to the server. Please make sure the backend is running."
            );

        } finally {

            // -----------------------------------------
            // ENABLE LOGIN BUTTON
            // -----------------------------------------

            loginBtn.disabled = false;

            loginBtn.classList.remove(
                "opacity-70",
                "cursor-not-allowed"
            );

            loginBtn.innerHTML = `
                <span>Login</span>
            `;
        }

    }
);


// -----------------------------------------
// SHOW / HIDE PASSWORD
// -----------------------------------------

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type === "password"
            ) {

                passwordInput.type = "text";

                eyeIcon.classList.remove(
                    "fa-eye"
                );

                eyeIcon.classList.add(
                    "fa-eye-slash"
                );

            } else {

                passwordInput.type = "password";

                eyeIcon.classList.remove(
                    "fa-eye-slash"
                );

                eyeIcon.classList.add(
                    "fa-eye"
                );
            }
        }
    );
}


// -----------------------------------------
// HIDE STATUS WHEN USER TYPES
// -----------------------------------------

emailInput.addEventListener(
    "input",
    hideStatus
);

passwordInput.addEventListener(
    "input",
    hideStatus
);


// -----------------------------------------
// FORGOT PASSWORD
// -----------------------------------------

const forgotPasswordLink =
    document.getElementById(
        "forgotPasswordLink"
    );

if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showStatus(
                "Password recovery is currently unavailable. Please contact the administrator."
            );
        }
    );
}


// -----------------------------------------
// GOOGLE LOGIN
// -----------------------------------------

const googleLoginBtn =
    document.getElementById(
        "googleLoginBtn"
    );

if (googleLoginBtn) {

    googleLoginBtn.addEventListener(
        "click",
        function () {

            showStatus(
                "Google login is currently unavailable. Please use your email and password."
            );
        }
    );
}