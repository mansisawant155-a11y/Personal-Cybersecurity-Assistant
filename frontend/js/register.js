// =====================================================
// PERSONAL CYBERSECURITY ASSISTANT
// REGISTER JAVASCRIPT
// =====================================================

const API_URL = "http://127.0.0.1:5000";

// =====================================================
// ELEMENTS
// =====================================================

const registerForm = document.getElementById("registerForm");

const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const registerBtn = document.getElementById("registerBtn");
const registerBtnText = document.getElementById("registerBtnText");
const messageBox = document.getElementById("messageBox");

const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

const lengthRule = document.getElementById("lengthRule");
const numberRule = document.getElementById("numberRule");
const specialRule = document.getElementById("specialRule");
const nameRule = document.getElementById("nameRule");

const googleRegisterBtn =
    document.getElementById("googleRegisterBtn");


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(message, type = "error") {

    messageBox.textContent = message;

    messageBox.classList.remove(
        "success",
        "error",
        "info"
    );

    messageBox.classList.add(type);

    messageBox.style.display = "block";
}


// =====================================================
// HIDE MESSAGE
// =====================================================

function hideMessage() {

    messageBox.textContent = "";

    messageBox.style.display = "none";

    messageBox.classList.remove(
        "success",
        "error",
        "info"
    );
}


// =====================================================
// EMAIL VALIDATION
// =====================================================

function validateEmail(email) {

    const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailPattern.test(email);
}


// =====================================================
// PASSWORD VALIDATION
// =====================================================

function validatePassword(password, username) {

    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return "Password must contain at least one special character.";
    }

    if (
        username.length > 0 &&
        password.toLowerCase().includes(username.toLowerCase())
    ) {
        return "Password must not contain your username.";
    }

    return null;
}


// =====================================================
// UPDATE PASSWORD RULES
// =====================================================

function updatePasswordRules() {

    const password = passwordInput.value;
    const username = usernameInput.value.trim();

    updateRule(
        lengthRule,
        password.length >= 6
    );

    updateRule(
        numberRule,
        /[0-9]/.test(password)
    );

    updateRule(
        specialRule,
        /[^A-Za-z0-9]/.test(password)
    );

    const usernameRuleValid =
        username.length > 0 &&
        !password.toLowerCase().includes(username.toLowerCase());

    updateRule(
        nameRule,
        usernameRuleValid
    );
}


// =====================================================
// UPDATE RULE
// =====================================================

function updateRule(element, valid) {

    const icon = element.querySelector("i");

    if (valid) {

        element.classList.remove("text-slate-500");
        element.classList.add("text-green-600");

        icon.classList.remove("fa-circle-xmark");
        icon.classList.add("fa-circle-check");

    } else {

        element.classList.remove("text-green-600");
        element.classList.add("text-slate-500");

        icon.classList.remove("fa-circle-check");
        icon.classList.add("fa-circle-xmark");
    }
}


// =====================================================
// PASSWORD LIVE VALIDATION
// =====================================================

passwordInput.addEventListener("input", function () {

    updatePasswordRules();

    hideMessage();

});


// =====================================================
// USERNAME LIVE VALIDATION
// =====================================================

usernameInput.addEventListener("input", function () {

    updatePasswordRules();

});


// =====================================================
// EMAIL LIVE VALIDATION
// =====================================================

emailInput.addEventListener("input", function () {

    hideMessage();

});


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }

});


// =====================================================
// REGISTRATION FORM
// =====================================================

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    hideMessage();

    const email =
        emailInput.value.trim().toLowerCase();

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    // -------------------------------------------------
    // EMPTY CHECK
    // -------------------------------------------------

    if (
        email === "" ||
        username === "" ||
        password === ""
    ) {

        showMessage(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }


    // -------------------------------------------------
    // EMAIL CHECK
    // -------------------------------------------------

    if (!validateEmail(email)) {

        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        emailInput.focus();

        return;
    }


    // -------------------------------------------------
    // USERNAME CHECK
    // -------------------------------------------------

    if (username.length < 3) {

        showMessage(
            "Username must be at least 3 characters long.",
            "error"
        );

        usernameInput.focus();

        return;
    }


    // -------------------------------------------------
    // PASSWORD CHECK
    // -------------------------------------------------

    const passwordError =
        validatePassword(
            password,
            username
        );

    if (passwordError !== null) {

        showMessage(
            passwordError,
            "error"
        );

        passwordInput.focus();

        updatePasswordRules();

        return;
    }


    // -------------------------------------------------
    // DISABLE BUTTON
    // -------------------------------------------------

    registerBtn.disabled = true;

    registerBtn.classList.add(
        "opacity-70",
        "cursor-not-allowed"
    );

    registerBtnText.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Creating Account...';


    try {

        // =============================================
        // SEND DATA TO FLASK BACKEND
        // =============================================

        const response = await fetch(
            `${API_URL}/api/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password
                })
            }
        );


        // =============================================
        // GET RESPONSE
        // =============================================

        const data = await response.json();

        console.log(
            "Registration response:",
            data
        );


        // =============================================
        // SUCCESS
        // =============================================

        if (
            response.status === 201 &&
            data.success === true
        ) {

            showMessage(
                "Registration successful. Please log in.",
                "success"
            );

            registerForm.reset();

            updatePasswordRules();


            setTimeout(function () {

                window.location.href = "login.html";

            }, 1500);

            return;
        }


        // =============================================
        // DUPLICATE EMAIL
        // =============================================

        if (response.status === 409) {

            showMessage(
                "An account with this email already exists. Please log in.",
                "error"
            );

            return;
        }


        // =============================================
        // BACKEND ERROR
        // =============================================

        showMessage(
            data.message ||
            "Registration failed. Please try again.",
            "error"
        );

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        showMessage(
            "Unable to connect to the server. Please make sure the backend is running.",
            "error"
        );

    } finally {

        registerBtn.disabled = false;

        registerBtn.classList.remove(
            "opacity-70",
            "cursor-not-allowed"
        );

        registerBtnText.textContent =
            "Create Account";
    }

});


// =====================================================
// GOOGLE REGISTER
// =====================================================

googleRegisterBtn.addEventListener("click", function () {

    showMessage(
        "Google registration is currently unavailable. Please register using your email and password.",
        "info"
    );

});


// =====================================================
// INITIAL PASSWORD RULES
// =====================================================

updatePasswordRules();