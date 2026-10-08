// =========================================
// MESSAGE SECURITY ANALYZER
// PERSONAL CYBERSECURITY ASSISTANT
// =========================================


// -----------------------------------------
// 1. LOGIN CHECK
// -----------------------------------------

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}


// -----------------------------------------
// 2. API CONFIGURATION
// -----------------------------------------

const API_URL = "https://personal-cybersecurity-assistant-phli.onrender.com";


// -----------------------------------------
// 3. GET HTML ELEMENTS
// -----------------------------------------

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

const clearBtn = document.getElementById("clearBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultBox = document.getElementById("resultBox");
const resultHeader = document.getElementById("resultHeader");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");
const riskBadge = document.getElementById("riskBadge");

const issueCount = document.getElementById("issueCount");
const findingList = document.getElementById("findingList");
const recommendationList = document.getElementById("recommendationList");

const backendStatus = document.getElementById("backendStatus");


// -----------------------------------------
// 4. HIDE RESULT INITIALLY
// -----------------------------------------

if (resultBox) {
    resultBox.classList.add("hidden");
}


// -----------------------------------------
// 5. SUSPICIOUS PATTERNS
// -----------------------------------------

const urgencyPatterns = [
    "urgent",
    "immediately",
    "act now",
    "right now",
    "within 24 hours",
    "within 1 hour",
    "account will be closed",
    "account will be blocked",
    "last warning",
    "final warning"
];

const credentialPatterns = [
    "password",
    "enter your password",
    "confirm your password",
    "verify your account",
    "verify account",
    "login",
    "log in",
    "username",
    "user id",
    "credentials",
    "security code",
    "verification code",
    "otp",
    "one time password"
];

const financialPatterns = [
    "send money",
    "transfer money",
    "make payment",
    "payment required",
    "pay now",
    "bank account",
    "account number",
    "credit card",
    "debit card",
    "card number",
    "upi",
    "upi id",
    "refund",
    "investment",
    "loan",
    "fee",
    "processing fee"
];

const rewardPatterns = [
    "winner",
    "you won",
    "congratulations",
    "claim now",
    "claim your prize",
    "lottery",
    "prize",
    "reward",
    "cash prize",
    "free gift",
    "lucky winner"
];

const threatPatterns = [
    "account will be suspended",
    "account will be blocked",
    "legal action",
    "police complaint",
    "arrest",
    "penalty",
    "fine",
    "legal notice",
    "security alert",
    "unauthorized activity"
];

const suspiciousDomainPatterns = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "ow.ly",
    "is.gd",
    "cutt.ly",
    "shorturl.at",
    "rb.gy",
    ".xyz",
    ".top",
    ".click",
    ".gq",
    ".tk",
    ".ml",
    ".ga",
    ".cf"
];


// -----------------------------------------
// 6. FIND MATCHES
// -----------------------------------------

function findMatches(text, patterns) {

    const matches = [];

    patterns.forEach(function (pattern) {

        if (text.includes(pattern.toLowerCase())) {
            matches.push(pattern);
        }

    });

    return matches;
}


// -----------------------------------------
// 7. EXTRACT URLS
// -----------------------------------------

function extractUrls(text) {

    const urlPattern =
        /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

    return text.match(urlPattern) || [];
}


// -----------------------------------------
// 8. CHECK HTTP LINKS
// -----------------------------------------

function findInsecureLinks(urls) {

    return urls.filter(function (url) {

        return url.toLowerCase().startsWith("http://");

    });
}


// -----------------------------------------
// 9. CHECK SUSPICIOUS DOMAINS
// -----------------------------------------

function findSuspiciousDomains(urls) {

    return urls.filter(function (url) {

        const lowerUrl = url.toLowerCase();

        return suspiciousDomainPatterns.some(function (pattern) {

            return lowerUrl.includes(pattern);

        });

    });
}


// -----------------------------------------
// 10. ANALYZE MESSAGE
// -----------------------------------------

function analyzeMessage(message) {

    const text = message.toLowerCase().trim();

    const findings = [];

    const recommendations = [];

    // -------------------------------------
    // URGENCY CHECK
    // -------------------------------------

    const urgencyMatches =
        findMatches(text, urgencyPatterns);

    if (urgencyMatches.length > 0) {

        findings.push({
            type: "Urgency / Pressure",
            severity: "Medium",
            details:
                "The message uses urgent or threatening language to pressure the recipient."
        });

        recommendations.push(
            "Do not make decisions under pressure. Verify the message independently."
        );
    }


    // -------------------------------------
    // CREDENTIAL CHECK
    // -------------------------------------

    const credentialMatches =
        findMatches(text, credentialPatterns);

    if (credentialMatches.length > 0) {

        findings.push({
            type: "Credential Request",
            severity: "High",
            details:
                "The message contains terms related to passwords, login details, OTPs or account verification."
        });

        recommendations.push(
            "Never share passwords, OTPs or login credentials through messages or unknown links."
        );
    }


    // -------------------------------------
    // FINANCIAL CHECK
    // -------------------------------------

    const financialMatches =
        findMatches(text, financialPatterns);

    if (financialMatches.length > 0) {

        findings.push({
            type: "Financial Request",
            severity: "High",
            details:
                "The message contains financial or payment-related language."
        });

        recommendations.push(
            "Verify payment requests directly with the bank, company or person using an official contact method."
        );
    }


    // -------------------------------------
    // REWARD / PRIZE CHECK
    // -------------------------------------

    const rewardMatches =
        findMatches(text, rewardPatterns);

    if (rewardMatches.length > 0) {

        findings.push({
            type: "Reward / Prize Claim",
            severity: "Medium",
            details:
                "The message contains prize, reward or unexpected-winner language."
        });

        recommendations.push(
            "Be careful with unexpected prizes or rewards that ask you to click a link or provide personal information."
        );
    }


    // -------------------------------------
    // THREAT CHECK
    // -------------------------------------

    const threatMatches =
        findMatches(text, threatPatterns);

    if (threatMatches.length > 0) {

        findings.push({
            type: "Threat / Fear Tactic",
            severity: "High",
            details:
                "The message uses threats, penalties or fear to influence the recipient."
        });

        recommendations.push(
            "Do not respond to threats immediately. Verify the claim through an official source."
        );
    }


    // -------------------------------------
    // URL CHECK
    // -------------------------------------

    const urls = extractUrls(message);

    if (urls.length > 0) {

        const insecureLinks =
            findInsecureLinks(urls);

        const suspiciousDomains =
            findSuspiciousDomains(urls);


        // ---------------------------------
        // HTTP URL
        // ---------------------------------

        if (insecureLinks.length > 0) {

            findings.push({
                type: "Insecure HTTP Link",
                severity: "Medium",
                details:
                    "The message contains a link using HTTP instead of HTTPS."
            });

            recommendations.push(
                "Avoid entering sensitive information on HTTP websites."
            );
        }


        // ---------------------------------
        // SHORTENED / SUSPICIOUS URL
        // ---------------------------------

        if (suspiciousDomains.length > 0) {

            findings.push({
                type: "Suspicious Link",
                severity: "High",
                details:
                    "The message contains a shortened or potentially suspicious domain."
            });

            recommendations.push(
                "Do not open suspicious or shortened links unless you can independently verify their destination."
            );
        }
    }


    // -------------------------------------
    // CALCULATE RISK
    // -------------------------------------

    let riskLevel = "Low Risk";

    if (findings.length === 0) {

        riskLevel = "Low Risk";

    } else {

        const hasHighRisk =
            findings.some(function (finding) {

                return finding.severity === "High";

            });

        if (hasHighRisk || findings.length >= 3) {

            riskLevel = "High Risk";

        } else {

            riskLevel = "Medium Risk";

        }
    }


    // -------------------------------------
    // DEFAULT RECOMMENDATIONS
    // -------------------------------------

    if (findings.length === 0) {

        recommendations.push(
            "No obvious phishing or scam indicators were detected."
        );

        recommendations.push(
            "Still verify unexpected messages before clicking links or sharing information."
        );
    }


    // Remove duplicate recommendations

    const uniqueRecommendations =
        [...new Set(recommendations)];


    return {
        riskLevel: riskLevel,
        findings: findings,
        recommendations: uniqueRecommendations,
        urls: urls
    };
}


// -----------------------------------------
// 11. DISPLAY RISK BADGE
// -----------------------------------------

function updateRiskBadge(riskLevel) {

    if (!riskBadge) {
        return;
    }

    riskBadge.textContent = riskLevel;

    riskBadge.classList.remove(
        "bg-green-100",
        "text-green-700",
        "bg-yellow-100",
        "text-yellow-700",
        "bg-orange-100",
        "text-orange-700",
        "bg-red-100",
        "text-red-700"
    );


    if (riskLevel === "Low Risk") {

        riskBadge.classList.add(
            "bg-green-100",
            "text-green-700"
        );

    } else if (riskLevel === "Medium Risk") {

        riskBadge.classList.add(
            "bg-yellow-100",
            "text-yellow-700"
        );

    } else {

        riskBadge.classList.add(
            "bg-red-100",
            "text-red-700"
        );
    }
}


// -----------------------------------------
// 12. DISPLAY FINDINGS
// -----------------------------------------

function displayFindings(findings) {

    if (!findingList) {
        return;
    }

    findingList.innerHTML = "";


    if (findings.length === 0) {

        findingList.innerHTML = `
            <div class="p-4 rounded-lg bg-green-50 border border-green-200">
                <p class="text-green-700 font-medium">
                    No obvious security issues detected.
                </p>
            </div>
        `;

        return;
    }


    findings.forEach(function (finding) {

        let severityClass =
            "bg-yellow-50 border-yellow-200 text-yellow-700";

        if (finding.severity === "High") {

            severityClass =
                "bg-red-50 border-red-200 text-red-700";

        } else if (finding.severity === "Medium") {

            severityClass =
                "bg-orange-50 border-orange-200 text-orange-700";
        }


        const findingElement = document.createElement("div");

        findingElement.className =
            `p-4 rounded-lg border ${severityClass} mb-3`;


        findingElement.innerHTML = `
            <div class="flex items-start justify-between gap-3">

                <div>
                    <p class="font-semibold">
                        ${finding.type}
                    </p>

                    <p class="text-sm mt-1">
                        ${finding.details}
                    </p>
                </div>

                <span class="text-xs font-semibold px-2 py-1 rounded-full bg-white">
                    ${finding.severity}
                </span>

            </div>
        `;


        findingList.appendChild(findingElement);

    });
}


// -----------------------------------------
// 13. DISPLAY RECOMMENDATIONS
// -----------------------------------------

function displayRecommendations(recommendations) {

    if (!recommendationList) {
        return;
    }

    recommendationList.innerHTML = "";


    recommendations.forEach(function (recommendation) {

        const li = document.createElement("li");

        li.className =
            "flex items-start gap-2 mb-2";


        li.innerHTML = `
            <i class="fa-solid fa-check mt-1"></i>
            <span>${recommendation}</span>
        `;


        recommendationList.appendChild(li);

    });
}


// -----------------------------------------
// 14. DISPLAY RESULT
// -----------------------------------------

function displayResult(result) {

    if (!resultBox) {
        return;
    }

    resultBox.classList.remove("hidden");


    // -------------------------------------
    // ISSUE COUNT
    // -------------------------------------

    if (issueCount) {

        issueCount.textContent =
            result.findings.length;
    }


    // -------------------------------------
    // RISK
    // -------------------------------------

    updateRiskBadge(result.riskLevel);


    // -------------------------------------
    // TITLE / DESCRIPTION
    // -------------------------------------

    if (resultTitle) {

        if (result.riskLevel === "High Risk") {

            resultTitle.textContent =
                "Potential Security Threat Detected";

        } else if (result.riskLevel === "Medium Risk") {

            resultTitle.textContent =
                "Message Requires Attention";

        } else {

            resultTitle.textContent =
                "No Obvious Threat Detected";
        }
    }


    if (resultDescription) {

        if (result.riskLevel === "High Risk") {

            resultDescription.textContent =
                "The message contains multiple indicators commonly associated with phishing or scam attempts.";

        } else if (result.riskLevel === "Medium Risk") {

            resultDescription.textContent =
                "The message contains some suspicious characteristics. Verify the message before taking action.";

        } else {

            resultDescription.textContent =
                "No obvious phishing or scam indicators were detected in this message.";
        }
    }


    // -------------------------------------
    // ICON
    // -------------------------------------

    if (resultIcon) {

        resultIcon.className =
            "fa-solid";


        if (result.riskLevel === "High Risk") {

            resultIcon.classList.add(
                "fa-triangle-exclamation"
            );

        } else if (result.riskLevel === "Medium Risk") {

            resultIcon.classList.add(
                "fa-circle-exclamation"
            );

        } else {

            resultIcon.classList.add(
                "fa-circle-check"
            );
        }
    }


    // -------------------------------------
    // FINDINGS
    // -------------------------------------

    displayFindings(result.findings);


    // -------------------------------------
    // RECOMMENDATIONS
    // -------------------------------------

    displayRecommendations(
        result.recommendations
    );


    // -------------------------------------
    // SCROLL TO RESULT
    // -------------------------------------

    resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// -----------------------------------------
// 15. BACKEND ANALYSIS
// -----------------------------------------

async function sendToBackend(message) {

    if (backendStatus) {

        backendStatus.textContent =
            "Checking with security analysis service...";
    }


    try {

        const response = await fetch(
            `${API_URL}/api/tools/message`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: message
                })
            }
        );


        const data = await response.json();

        console.log(
            "Message backend response:",
            data
        );


        if (response.ok && data.success === true) {

            if (backendStatus) {

                backendStatus.textContent =
                    "Backend analysis completed successfully.";
            }

            return data;
        }


        if (backendStatus) {

            backendStatus.textContent =
                "Frontend analysis completed. Backend returned an issue.";
        }


        return null;

    } catch (error) {

        console.error(
            "Message backend error:",
            error
        );


        if (backendStatus) {

            backendStatus.textContent =
                "Backend unavailable. Frontend security analysis was used.";
        }


        return null;
    }
}


// -----------------------------------------
// 16. ANALYZE BUTTON
// -----------------------------------------

messageForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const message =
            messageInput.value.trim();


        // ---------------------------------
        // EMPTY MESSAGE
        // ---------------------------------

        if (!message) {

            alert(
                "Please enter a message to analyze."
            );

            messageInput.focus();

            return;
        }


        // ---------------------------------
        // BUTTON LOADING
        // ---------------------------------

        analyzeBtn.disabled = true;

        analyzeBtn.classList.add(
            "opacity-70",
            "cursor-not-allowed"
        );


        analyzeBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Analyzing...</span>
        `;


        // ---------------------------------
        // FRONTEND ANALYSIS
        // ---------------------------------

        const frontendResult =
            analyzeMessage(message);


        // ---------------------------------
        // DISPLAY FRONTEND RESULT
        // ---------------------------------

        displayResult(frontendResult);


        // ---------------------------------
        // BACKEND ANALYSIS
        // ---------------------------------

        const backendResult =
            await sendToBackend(message);


        // ---------------------------------
        // OPTIONAL BACKEND INFORMATION
        // ---------------------------------

        if (backendResult) {

            console.log(
                "Backend risk level:",
                backendResult.risk_level
            );

            console.log(
                "Backend indicators:",
                backendResult.indicators
            );
        }


        // ---------------------------------
        // RESTORE BUTTON
        // ---------------------------------

        analyzeBtn.disabled = false;

        analyzeBtn.classList.remove(
            "opacity-70",
            "cursor-not-allowed"
        );


        analyzeBtn.innerHTML = `
            <i class="fa-solid fa-shield-halved"></i>
            <span>Analyze Message</span>
        `;
    }
);


// -----------------------------------------
// 17. CLEAR BUTTON
// -----------------------------------------

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            messageInput.value = "";

            if (resultBox) {
                resultBox.classList.add("hidden");
            }

            if (findingList) {
                findingList.innerHTML = "";
            }

            if (recommendationList) {
                recommendationList.innerHTML = "";
            }

            if (issueCount) {
                issueCount.textContent = "0";
            }

            if (backendStatus) {
                backendStatus.textContent = "";
            }

            messageInput.focus();
        }
    );
}


// -----------------------------------------
// 18. INPUT CLEANUP
// -----------------------------------------

messageInput.addEventListener(
    "input",
    function () {

        if (resultBox) {
            resultBox.classList.add("hidden");
        }

        if (backendStatus) {
            backendStatus.textContent = "";
        }
    }
);


// -----------------------------------------
// 19. CONSOLE MESSAGE
// -----------------------------------------

console.log(
    "Message Security Analyzer loaded successfully."
);