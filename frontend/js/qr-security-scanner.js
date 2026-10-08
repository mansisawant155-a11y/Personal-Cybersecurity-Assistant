// =========================================
// QR SECURITY SCANNER
// =========================================

console.log("NEW QR SECURITY JS LOADED");

// =========================================
// CONFIGURATION
// =========================================

const API_BASE_URL = "http://127.0.0.1:5000";

// =========================================
// LOGIN CHECK
// =========================================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// =========================================
// GET ELEMENTS
// =========================================

const qrForm = document.getElementById("qrForm");
const qrInput = document.getElementById("qrInput");
const qrFileInput = document.getElementById("qrFileInput");
const qrFileLabel = document.getElementById("qrFileLabel");
const uploadDropzone = document.getElementById("uploadDropzone");
const scanBtn = document.getElementById("scanBtn");

const resultBox = document.getElementById("resultBox");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

// =========================================
// FILE UPLOAD CLICK
// =========================================

if (uploadDropzone && qrFileInput) {
    uploadDropzone.addEventListener("click", function () {
        qrFileInput.click();
    });
}

// =========================================
// FILE SELECT
// =========================================

if (qrFileInput) {
    qrFileInput.addEventListener("change", function () {
        displayQRFileName();
    });
}

function displayQRFileName() {

    if (!qrFileInput.files || !qrFileInput.files[0]) {
        qrFileLabel.textContent = "Click to upload QR code image";
        return;
    }

    const file = qrFileInput.files[0];

    qrFileLabel.textContent = file.name;
    qrFileLabel.classList.add("text-emerald-700", "font-bold");
}

// =========================================
// FORM SUBMIT
// =========================================

if (qrForm) {

    qrForm.addEventListener("submit", function (event) {

        event.preventDefault();

        handleQRScan();

    });

}

// =========================================
// HANDLE QR SCAN
// =========================================

async function handleQRScan() {

    const textValue = qrInput
        ? qrInput.value.trim()
        : "";

    const hasFile =
        qrFileInput &&
        qrFileInput.files &&
        qrFileInput.files.length > 0;

    // No input
    if (!textValue && !hasFile) {

        showResult(
            "info",
            "Input Required",
            "Please enter QR content or upload a QR code image."
        );

        return;
    }

    // Both inputs
    if (textValue && hasFile) {

        showResult(
            "info",
            "Choose One Input",
            "Please enter QR content or upload a QR image, not both at the same time."
        );

        return;
    }

    setLoadingState(true);

    if (resultBox) {
        resultBox.classList.add("hidden");
    }

    try {

        if (hasFile) {

            await analyzeQRImage();

        } else {

            await analyzeQRText(textValue);

        }

    } catch (error) {

        console.error("QR Scanner Error:", error);

        showResult(
            "error",
            "Analysis Failed",
            "Unable to complete the QR security analysis. Please try again."
        );

    } finally {

        setLoadingState(false);

    }
}

// =========================================
// ANALYZE QR TEXT
// =========================================

async function analyzeQRText(content) {

    const response = await fetch(
        `${API_BASE_URL}/api/tools/qr`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                data: content
            })
        }
    );

    const data = await response.json();

    if (response.ok && data.success) {

        displayBackendResult(data);

        return;
    }

    showResult(
        "error",
        "Analysis Failed",
        data.message || "Unable to analyze the QR content."
    );
}

// =========================================
// ANALYZE QR IMAGE
// =========================================

async function analyzeQRImage() {

    if (
        !qrFileInput ||
        !qrFileInput.files ||
        !qrFileInput.files[0]
    ) {

        showResult(
            "info",
            "Image Required",
            "Please select a QR code image."
        );

        return;
    }

    const file = qrFileInput.files[0];

    // =====================================
    // FILE TYPE
    // =====================================

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

        showResult(
            "error",
            "Unsupported Image",
            "Please upload a PNG, JPG, or WEBP QR code image."
        );

        return;
    }

    // =====================================
    // FILE SIZE
    // =====================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

        showResult(
            "error",
            "Image Too Large",
            "Please upload a QR image smaller than 5 MB."
        );

        return;
    }

    // =====================================
    // SEND IMAGE TO BACKEND
    // =====================================

    const formData = new FormData();

    formData.append("file", file);

    console.log("Sending QR image to backend:", file.name);

    const response = await fetch(
        `${API_BASE_URL}/api/tools/qr`,
        {
            method: "POST",
            body: formData
        }
    );

    console.log("QR image backend response:", response.status);

    const data = await response.json();

    console.log("QR image backend data:", data);

    // =====================================
    // SUCCESS
    // =====================================

    if (response.ok && data.success) {

        displayBackendResult(data);

        return;
    }

    // =====================================
    // DECODE FAILED
    // =====================================

    showResult(
        "error",
        "QR Code Not Detected",
        data.message ||
        "No readable QR code was detected in the uploaded image."
    );
}

// =========================================
// DISPLAY BACKEND RESULT
// =========================================

function displayBackendResult(data) {

    if (!data) {

        showResult(
            "error",
            "Analysis Failed",
            "No valid result was received from the QR security service."
        );

        return;
    }

    const risk = String(
        data.risk_level ||
        data.risk ||
        data.status ||
        ""
    ).toLowerCase();

    const message =
        data.message ||
        data.description ||
        "QR security analysis completed successfully.";

    const type = String(
        data.type || ""
    ).toLowerCase();

    // =====================================
    // HIGH RISK
    // =====================================

    if (
        risk.includes("high") ||
        risk.includes("critical") ||
        risk.includes("danger")
    ) {

        showResult(
            "danger",
            "High Risk QR Content",
            message
        );

        return;
    }

    // =====================================
    // MEDIUM RISK
    // =====================================

    if (
        risk.includes("medium") ||
        risk.includes("warning") ||
        risk.includes("suspicious")
    ) {

        showResult(
            "warning",
            "Review QR Content",
            message
        );

        return;
    }

    // =====================================
    // UPI
    // =====================================

    if (type.includes("upi")) {

        showResult(
            "info",
            "UPI Payment Identifier Detected",
            message
        );

        return;
    }

    // =====================================
    // SUCCESS
    // =====================================

    showResult(
        "safe",
        "QR Security Analysis Complete",
        message
    );
}

// =========================================
// SHOW RESULT
// =========================================

function showResult(type, title, message) {

    if (
        !resultBox ||
        !resultIcon ||
        !resultTitle ||
        !resultMessage
    ) {

        console.error(
            "QR result elements are missing from the HTML."
        );

        return;
    }

    resultBox.className =
        "mt-6 p-4 rounded-2xl text-xs";

    resultIcon.className =
        "text-lg mt-0.5";

    resultTitle.className =
        "font-bold text-sm";

    resultMessage.className =
        "text-xs mt-1 leading-relaxed";

    // =====================================
    // SAFE
    // =====================================

    if (type === "safe") {

        resultBox.classList.add(
            "bg-emerald-50",
            "border",
            "border-emerald-200"
        );

        resultIcon.classList.add(
            "fa-solid",
            "fa-circle-check",
            "text-emerald-600"
        );

        resultTitle.classList.add(
            "text-emerald-900"
        );

        resultMessage.classList.add(
            "text-emerald-800"
        );
    }

    // =====================================
    // WARNING
    // =====================================

    else if (type === "warning") {

        resultBox.classList.add(
            "bg-amber-50",
            "border",
            "border-amber-200"
        );

        resultIcon.classList.add(
            "fa-solid",
            "fa-triangle-exclamation",
            "text-amber-600"
        );

        resultTitle.classList.add(
            "text-amber-900"
        );

        resultMessage.classList.add(
            "text-amber-800"
        );
    }

    // =====================================
    // DANGER
    // =====================================

    else if (type === "danger") {

        resultBox.classList.add(
            "bg-red-50",
            "border",
            "border-red-200"
        );

        resultIcon.classList.add(
            "fa-solid",
            "fa-shield-halved",
            "text-red-600"
        );

        resultTitle.classList.add(
            "text-red-900"
        );

        resultMessage.classList.add(
            "text-red-800"
        );
    }

    // =====================================
    // ERROR
    // =====================================

    else if (type === "error") {

        resultBox.classList.add(
            "bg-red-50",
            "border",
            "border-red-200"
        );

        resultIcon.classList.add(
            "fa-solid",
            "fa-circle-exclamation",
            "text-red-600"
        );

        resultTitle.classList.add(
            "text-red-900"
        );

        resultMessage.classList.add(
            "text-red-800"
        );
    }

    // =====================================
    // INFO
    // =====================================

    else {

        resultBox.classList.add(
            "bg-sky-50",
            "border",
            "border-sky-200"
        );

        resultIcon.classList.add(
            "fa-solid",
            "fa-circle-info",
            "text-sky-600"
        );

        resultTitle.classList.add(
            "text-sky-900"
        );

        resultMessage.classList.add(
            "text-sky-800"
        );
    }

    resultTitle.textContent = title;
    resultMessage.textContent = message;

    resultBox.classList.remove("hidden");

    setTimeout(function () {

        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }, 100);
}

// =========================================
// BUTTON LOADING STATE
// =========================================

function setLoadingState(isLoading) {

    if (!scanBtn) {
        return;
    }

    if (isLoading) {

        scanBtn.disabled = true;

        scanBtn.innerHTML =
            '<i class="fa-solid fa-circle-notch fa-spin"></i>' +
            '<span>Analyzing QR Content...</span>';

    } else {

        scanBtn.disabled = false;

        scanBtn.innerHTML =
            '<i class="fa-solid fa-magnifying-glass font-normal"></i>' +
            '<span>Scan QR Code</span>';
    }
}

// =========================================
// END
// =========================================

console.log("QR Security Scanner loaded successfully.");