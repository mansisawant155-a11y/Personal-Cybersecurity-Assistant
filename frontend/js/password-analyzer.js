// =========================================
// PERSONAL CYBERSECURITY ASSISTANT
// PASSWORD SECURITY ANALYZER
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const passwordForm =
    document.getElementById("passwordForm");

const passwordInput =
    document.getElementById("passwordInput");

const togglePassword =
    document.getElementById("togglePassword");

const showText =
    document.getElementById("showText");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const strengthContainer =
    document.getElementById("strengthContainer");

const strengthLabel =
    document.getElementById("strengthLabel");

const strengthBar =
    document.getElementById("strengthBar");

const resultBox =
    document.getElementById("resultBox");

const resultHeader =
    document.getElementById("resultHeader");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultDescription =
    document.getElementById("resultDescription");

const riskBadge =
    document.getElementById("riskBadge");

const lengthResult =
    document.getElementById("lengthResult");

const uppercaseResult =
    document.getElementById("uppercaseResult");

const lowercaseResult =
    document.getElementById("lowercaseResult");

const numberResult =
    document.getElementById("numberResult");

const specialResult =
    document.getElementById("specialResult");

const strengthResult =
    document.getElementById("strengthResult");

const recommendationList =
    document.getElementById("recommendationList");


// =========================================
// SHOW / HIDE PASSWORD
// =========================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            showText.textContent = "Hide";

        } else {

            passwordInput.type = "password";

            showText.textContent = "Show";
        }

    });

}


// =========================================
// LIVE PASSWORD STRENGTH
// =========================================

if (passwordInput) {

    passwordInput.addEventListener("input", function () {

        updateStrengthMeter(passwordInput.value);

    });

}


function updateStrengthMeter(password) {

    if (!password) {

        strengthContainer.classList.add("hidden");

        return;
    }


    strengthContainer.classList.remove("hidden");


    const hasUppercase =
        /[A-Z]/.test(password);

    const hasLowercase =
        /[a-z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    const hasSpecial =
        /[^A-Za-z0-9]/.test(password);


    let score = 0;


    // =====================================
    // LENGTH SCORE
    // =====================================

    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }


    // =====================================
    // CHARACTER TYPE SCORE
    // =====================================

    if (hasUppercase) {
        score++;
    }

    if (hasLowercase) {
        score++;
    }

    if (hasNumber) {
        score++;
    }

    if (hasSpecial) {
        score++;
    }


    // =====================================
    // UPDATE METER
    // =====================================

    if (score <= 2) {

        strengthLabel.textContent =
            "Weak";

        strengthLabel.className =
            "font-bold text-red-600";

        strengthBar.className =
            "h-full w-1/4 bg-red-500 transition-all duration-300";

    }

    else if (score <= 4) {

        strengthLabel.textContent =
            "Moderate";

        strengthLabel.className =
            "font-bold text-amber-600";

        strengthBar.className =
            "h-full w-2/4 bg-amber-500 transition-all duration-300";

    }

    else if (score === 5) {

        strengthLabel.textContent =
            "Good";

        strengthLabel.className =
            "font-bold text-sky-600";

        strengthBar.className =
            "h-full w-3/4 bg-sky-500 transition-all duration-300";

    }

    else {

        strengthLabel.textContent =
            "Strong";

        strengthLabel.className =
            "font-bold text-emerald-600";

        strengthBar.className =
            "h-full w-full bg-emerald-500 transition-all duration-300";
    }

}


// =========================================
// PASSWORD ANALYSIS
// =========================================

if (passwordForm) {

    passwordForm.addEventListener("submit", function (event) {

        event.preventDefault();

        analyzePassword();

    });

}


function analyzePassword() {

    const password =
        passwordInput.value;


    // =====================================
    // EMPTY PASSWORD CHECK
    // =====================================

    if (!password) {

        alert("Please enter a password to analyze.");

        passwordInput.focus();

        return;
    }


    // =====================================
    // CHARACTER CHECKS
    // =====================================

    const hasUppercase =
        /[A-Z]/.test(password);

    const hasLowercase =
        /[a-z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    const hasSpecial =
        /[^A-Za-z0-9]/.test(password);


    // =====================================
    // CALCULATE SCORE
    // =====================================

    let score = 0;


    // Password length

    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }


    // Character types

    if (hasUppercase) {
        score++;
    }

    if (hasLowercase) {
        score++;
    }

    if (hasNumber) {
        score++;
    }

    if (hasSpecial) {
        score++;
    }


    // =====================================
    // DETERMINE STRENGTH
    // =====================================

    let strength;
    let risk;
    let progress;


    if (score <= 2) {

        strength = "Weak";

        risk = "High Risk";

        progress = 25;

    }

    else if (score <= 4) {

        strength = "Moderate";

        risk = "Medium Risk";

        progress = 60;

    }

    else if (score === 5) {

        strength = "Good";

        risk = "Low Risk";

        progress = 80;

    }

    else {

        strength = "Strong";

        risk = "Low Risk";

        progress = 100;
    }


    // =====================================
    // UPDATE LIVE STRENGTH
    // =====================================

    strengthContainer.classList.remove("hidden");

    strengthLabel.textContent =
        strength;


    if (strength === "Weak") {

        strengthLabel.className =
            "font-bold text-red-600";

        strengthBar.className =
            "h-full w-1/4 bg-red-500 transition-all duration-300";

    }

    else if (strength === "Moderate") {

        strengthLabel.className =
            "font-bold text-amber-600";

        strengthBar.className =
            "h-full w-2/4 bg-amber-500 transition-all duration-300";

    }

    else if (strength === "Good") {

        strengthLabel.className =
            "font-bold text-sky-600";

        strengthBar.className =
            "h-full w-3/4 bg-sky-500 transition-all duration-300";

    }

    else {

        strengthLabel.className =
            "font-bold text-emerald-600";

        strengthBar.className =
            "h-full w-full bg-emerald-500 transition-all duration-300";
    }


    // =====================================
    // BUTTON LOADING STATE
    // =====================================

    analyzeBtn.disabled = true;

    analyzeBtn.classList.add(
        "opacity-70",
        "cursor-not-allowed"
    );

    analyzeBtn.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i>' +
        '<span>Analyzing Password...</span>';


    // =====================================
    // SHOW RESULT AFTER SHORT DELAY
    // =====================================

    setTimeout(function () {

        displayResults(
            password,
            strength,
            risk,
            progress,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecial
        );

        analyzeBtn.disabled = false;

        analyzeBtn.classList.remove(
            "opacity-70",
            "cursor-not-allowed"
        );

        analyzeBtn.innerHTML =
            '<i class="fa-solid fa-shield-halved font-normal"></i>' +
            '<span>Analyze Password</span>';

    }, 700);

}


// =========================================
// DISPLAY RESULTS
// =========================================

function displayResults(
    password,
    strength,
    risk,
    progress,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial
) {

    resultBox.classList.remove("hidden");


    // =====================================
    // BASIC VALUES
    // =====================================

    lengthResult.textContent =
        password.length + " characters";

    uppercaseResult.textContent =
        hasUppercase ? "Present" : "Missing";

    lowercaseResult.textContent =
        hasLowercase ? "Present" : "Missing";

    numberResult.textContent =
        hasNumber ? "Present" : "Missing";

    specialResult.textContent =
        hasSpecial ? "Present" : "Missing";

    strengthResult.textContent =
        strength;


    // =====================================
    // COLORS FOR CHECK RESULTS
    // =====================================

    setCheckColor(
        uppercaseResult,
        hasUppercase
    );

    setCheckColor(
        lowercaseResult,
        hasLowercase
    );

    setCheckColor(
        numberResult,
        hasNumber
    );

    setCheckColor(
        specialResult,
        hasSpecial
    );


    // =====================================
    // RISK RESULT
    // =====================================

    riskBadge.textContent =
        risk;


    if (strength === "Weak") {

        resultHeader.className =
            "p-4 bg-red-50";

        resultIcon.className =
            "w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-red-600";

        resultIcon.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';

        resultTitle.className =
            "font-bold text-sm text-red-900";

        resultTitle.textContent =
            "Weak Password";

        resultDescription.className =
            "text-xs mt-1 text-red-700";

        resultDescription.textContent =
            "This password has several security weaknesses.";

        riskBadge.className =
            "px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-red-100 text-red-700";

    }

    else if (strength === "Moderate") {

        resultHeader.className =
            "p-4 bg-amber-50";

        resultIcon.className =
            "w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600";

        resultIcon.innerHTML =
            '<i class="fa-solid fa-shield-halved"></i>';

        resultTitle.className =
            "font-bold text-sm text-amber-900";

        resultTitle.textContent =
            "Moderate Password";

        resultDescription.className =
            "text-xs mt-1 text-amber-700";

        resultDescription.textContent =
            "The password has some security weaknesses that should be improved.";

        riskBadge.className =
            "px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-amber-100 text-amber-700";

    }

    else if (strength === "Good") {

        resultHeader.className =
            "p-4 bg-sky-50";

        resultIcon.className =
            "w-10 h-10 rounded-xl flex items-center justify-center bg-sky-100 text-sky-600";

        resultIcon.innerHTML =
            '<i class="fa-solid fa-shield-halved"></i>';

        resultTitle.className =
            "font-bold text-sm text-sky-900";

        resultTitle.textContent =
            "Good Password";

        resultDescription.className =
            "text-xs mt-1 text-sky-700";

        resultDescription.textContent =
            "The password satisfies most of the basic security checks.";

        riskBadge.className =
            "px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-sky-100 text-sky-700";

    }

    else {

        resultHeader.className =
            "p-4 bg-emerald-50";

        resultIcon.className =
            "w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600";

        resultIcon.innerHTML =
            '<i class="fa-solid fa-circle-check"></i>';

        resultTitle.className =
            "font-bold text-sm text-emerald-900";

        resultTitle.textContent =
            "Strong Password";

        resultDescription.className =
            "text-xs mt-1 text-emerald-700";

        resultDescription.textContent =
            "The password meets the basic complexity checks.";

        riskBadge.className =
            "px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-emerald-100 text-emerald-700";
    }


    // =====================================
    // RECOMMENDATIONS
    // =====================================

    const recommendations = [];


    if (password.length < 8) {

        recommendations.push(
            "Use at least 8 characters. A longer password is generally better."
        );

    }

    else if (password.length < 12) {

        recommendations.push(
            "Consider using 12 or more characters for better protection."
        );
    }


    if (!hasUppercase) {

        recommendations.push(
            "Add uppercase letters such as A, B, or C."
        );
    }


    if (!hasLowercase) {

        recommendations.push(
            "Include lowercase letters such as a, b, or c."
        );
    }


    if (!hasNumber) {

        recommendations.push(
            "Add numbers to improve password complexity."
        );
    }


    if (!hasSpecial) {

        recommendations.push(
            "Add special characters such as !, @, #, or $."
        );
    }


    if (recommendations.length === 0) {

        recommendations.push(
            "Your password meets the basic complexity checks."
        );

        recommendations.push(
            "Avoid reusing the same password on multiple accounts."
        );

        recommendations.push(
            "Consider using a password manager to create and store unique passwords."
        );
    }


    // =====================================
    // DISPLAY RECOMMENDATIONS
    // =====================================

    recommendationList.innerHTML = "";


    recommendations.forEach(function (recommendation) {

        const listItem =
            document.createElement("li");

        listItem.className =
            "flex items-start gap-2";

        listItem.innerHTML =
            '<i class="fa-solid fa-circle-info text-sky-500 mt-0.5"></i>' +
            '<span></span>';

        listItem.querySelector("span").textContent =
            recommendation;

        recommendationList.appendChild(
            listItem
        );

    });


    // =====================================
    // SCROLL TO RESULTS
    // =====================================

    resultBox.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


// =========================================
// CHECK RESULT COLOR
// =========================================

function setCheckColor(element, isPresent) {

    if (isPresent) {

        element.className =
            "font-semibold text-emerald-600";

    } else {

        element.className =
            "font-semibold text-red-600";
    }

}