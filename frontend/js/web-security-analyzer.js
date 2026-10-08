// =====================================================
// WEB SECURITY ANALYZER
// =====================================================

const API_URL = "http://127.0.0.1:5000";

// =====================================================
// LOGIN GUARD
// =====================================================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// =====================================================
// GET ELEMENTS
// =====================================================

const webForm = document.getElementById("webForm");
const urlInput = document.getElementById("urlInput");
const analyzeBtn = document.getElementById("analyzeBtn");

const scannerStatus = document.getElementById("scannerStatus");

const scanStatus = document.getElementById("scanStatus");
const statusBadge = document.getElementById("statusBadge");
const statusMessage = document.getElementById("statusMessage");
const progressBar = document.getElementById("progressBar");

const webResults = document.getElementById("webResults");
const analyzedUrl = document.getElementById("analyzedUrl");

const overallRisk = document.getElementById("overallRisk");
const checksPerformed = document.getElementById("checksPerformed");
const issuesFound = document.getElementById("issuesFound");
const analysisResultStatus =
    document.getElementById("analysisResultStatus");

const protocolResult = document.getElementById("protocolResult");
const domainResult = document.getElementById("domainResult");
const portResult = document.getElementById("portResult");
const httpsResult = document.getElementById("httpsResult");
const pathResult = document.getElementById("pathResult");
const queryResult = document.getElementById("queryResult");

const findingList = document.getElementById("findingList");
const recommendationList =
    document.getElementById("recommendationList");

// =====================================================
// INITIAL STATE
// =====================================================

if (scanStatus) {
    scanStatus.classList.add("hidden");
}

if (webResults) {
    webResults.classList.add("hidden");
}

// =====================================================
// PROGRESS
// =====================================================

function updateProgress(value) {
    if (progressBar) {
        progressBar.style.width = value + "%";
    }
}

// =====================================================
// FINDING
// =====================================================

function createFinding(title, description, status) {

    if (!findingList) {
        return;
    }

    const item = document.createElement("div");

    item.className =
        "result-item p-4 rounded-2xl border border-slate-200 bg-white flex items-start justify-between gap-4";

    const info = document.createElement("div");
    info.className = "min-w-0";

    const titleElement = document.createElement("div");
    titleElement.className =
        "font-bold text-sm text-slate-800";
    titleElement.textContent = title;

    const descriptionElement = document.createElement("p");
    descriptionElement.className =
        "text-xs text-slate-500 mt-1 leading-relaxed";
    descriptionElement.textContent = description;

    info.appendChild(titleElement);
    info.appendChild(descriptionElement);

    const statusElement = document.createElement("span");

    statusElement.className =
        "shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold";

    if (status === "Passed") {

        statusElement.classList.add(
            "bg-emerald-100",
            "text-emerald-700"
        );

    } else {

        statusElement.classList.add(
            "bg-amber-100",
            "text-amber-700"
        );
    }

    statusElement.textContent = status;

    item.appendChild(info);
    item.appendChild(statusElement);

    findingList.appendChild(item);
}

// =====================================================
// RECOMMENDATION
// =====================================================

function createRecommendation(text) {

    if (!recommendationList) {
        return;
    }

    const item = document.createElement("li");
    item.textContent = text;

    recommendationList.appendChild(item);
}

// =====================================================
// URL NORMALIZATION
// =====================================================

function normalizeURL(value) {

    let urlText = value.trim();

    if (!urlText) {
        return null;
    }

    if (
        !urlText.startsWith("http://") &&
        !urlText.startsWith("https://")
    ) {
        urlText = "https://" + urlText;
    }

    try {

        const parsedURL = new URL(urlText);

        if (
            parsedURL.protocol !== "http:" &&
            parsedURL.protocol !== "https:"
        ) {
            return null;
        }

        if (!parsedURL.hostname) {
            return null;
        }

        return parsedURL;

    } catch (error) {
        return null;
    }
}

// =====================================================
// IP CHECK
// =====================================================

function isIPAddress(hostname) {

    const ipv4Pattern =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return ipv4Pattern.test(hostname);
}

// =====================================================
// SUSPICIOUS KEYWORDS
// =====================================================

function containsSuspiciousKeywords(url) {

    const keywords = [
        "login",
        "verify",
        "verification",
        "account",
        "password",
        "bank",
        "banking",
        "secure",
        "security",
        "update",
        "confirm",
        "payment",
        "wallet",
        "bonus",
        "claim",
        "free",
        "gift",
        "urgent"
    ];

    const lowerURL = url.toLowerCase();

    return keywords.some(function (keyword) {
        return lowerURL.includes(keyword);
    });
}

// =====================================================
// URL ANALYSIS
// =====================================================

function analyzeURLSecurity(target, parsedURL) {

    let issues = 0;

    const findings = [];
    const recommendations = [];

    // 1. HTTPS

    if (parsedURL.protocol === "https:") {

        findings.push({
            title: "HTTPS Protocol",
            description:
                "The URL uses HTTPS for encrypted communication.",
            status: "Passed"
        });

    } else {

        issues++;

        findings.push({
            title: "HTTPS Protocol",
            description:
                "The URL uses HTTP instead of HTTPS.",
            status: "Review"
        });

        recommendations.push(
            "Prefer HTTPS websites when transmitting sensitive information."
        );
    }

    // 2. IP ADDRESS

    if (isIPAddress(parsedURL.hostname)) {

        issues++;

        findings.push({
            title: "IP Address URL",
            description:
                "The destination uses a direct IP address instead of a domain name.",
            status: "Review"
        });

        recommendations.push(
            "Verify the destination carefully when a website uses a direct IP address."
        );

    } else {

        findings.push({
            title: "Domain-Based URL",
            description:
                "The URL uses a domain name.",
            status: "Passed"
        });
    }

    // 3. @ SYMBOL

    if (target.includes("@")) {

        issues++;

        findings.push({
            title: "URL Contains @ Symbol",
            description:
                "The URL contains an @ symbol and should be reviewed carefully.",
            status: "Review"
        });

        recommendations.push(
            "Verify the actual destination domain when a URL contains the @ symbol."
        );

    } else {

        findings.push({
            title: "URL @ Symbol Check",
            description:
                "No @ symbol was detected.",
            status: "Passed"
        });
    }

    // 4. LONG URL

    if (target.length > 150) {

        issues++;

        findings.push({
            title: "Unusually Long URL",
            description:
                "The URL is unusually long.",
            status: "Review"
        });

        recommendations.push(
            "Be cautious with unusually long URLs."
        );

    } else {

        findings.push({
            title: "URL Length",
            description:
                "The URL length is within the basic analysis threshold.",
            status: "Passed"
        });
    }

    // 5. ENCODED CHARACTERS

    const encodedCharacters =
        target.match(/%[0-9a-f]{2}/gi);

    if (
        encodedCharacters &&
        encodedCharacters.length >= 5
    ) {

        issues++;

        findings.push({
            title: "Encoded Characters",
            description:
                "The URL contains several encoded characters.",
            status: "Review"
        });

        recommendations.push(
            "Inspect encoded URL components carefully."
        );

    } else {

        findings.push({
            title: "Encoded Character Check",
            description:
                "No unusually high number of encoded characters was detected.",
            status: "Passed"
        });
    }

    // 6. KEYWORDS

    if (containsSuspiciousKeywords(target)) {

        issues++;

        findings.push({
            title: "Security-Sensitive Keywords",
            description:
                "The URL contains security-sensitive or account-related keywords.",
            status: "Review"
        });

        recommendations.push(
            "Verify that the domain belongs to the organization you intended to visit."
        );

    } else {

        findings.push({
            title: "Keyword Check",
            description:
                "No commonly monitored security-sensitive keywords were detected.",
            status: "Passed"
        });
    }

    // 7. PORT

    if (parsedURL.port !== "") {

        const port = Number(parsedURL.port);

        if (port !== 80 && port !== 443) {

            issues++;

            findings.push({
                title: "Non-Standard Port",
                description:
                    "The URL uses a non-standard web port.",
                status: "Review"
            });

            recommendations.push(
                "Confirm that the custom port is expected."
            );

        } else {

            findings.push({
                title: "Port Configuration",
                description:
                    "The URL uses a standard web port.",
                status: "Passed"
            });
        }

    } else {

        findings.push({
            title: "Port Configuration",
            description:
                "No custom port was specified.",
            status: "Passed"
        });
    }

    // 8. QUERY PARAMETERS

    const queryCount =
        Array.from(parsedURL.searchParams.keys()).length;

    if (queryCount >= 5) {

        issues++;

        findings.push({
            title: "Multiple Query Parameters",
            description:
                "The URL contains several query parameters.",
            status: "Review"
        });

        recommendations.push(
            "Avoid sharing URLs containing unnecessary or sensitive query parameters."
        );

    } else {

        findings.push({
            title: "Query Parameter Check",
            description:
                "The number of query parameters is within the basic threshold.",
            status: "Passed"
        });
    }

    // 9. DOMAIN FORMAT

    if (parsedURL.hostname.includes(".")) {

        findings.push({
            title: "Domain Format",
            description:
                "The hostname uses a standard domain structure.",
            status: "Passed"
        });

    } else {

        issues++;

        findings.push({
            title: "Domain Format",
            description:
                "The hostname does not appear to use a typical domain structure.",
            status: "Review"
        });
    }

    // 10. LIMITATION

    findings.push({
        title: "Website Security Check",
        description:
            "A URL alone cannot fully verify server-side vulnerabilities or security configuration.",
        status: "Review"
    });

    if (recommendations.length === 0) {

        recommendations.push(
            "Verify website domains before entering sensitive information."
        );

        recommendations.push(
            "Avoid opening unexpected links from unknown sources."
        );
    }

    return {
        issues: issues,
        findings: findings,
        recommendations: [...new Set(recommendations)]
    };
}

// =====================================================
// DISPLAY RESULTS
// =====================================================

function displayResults(target, parsedURL, analysis) {

    if (!webResults) {
        return;
    }

    webResults.classList.remove("hidden");

    analyzedUrl.textContent =
        "URL: " + target;

    protocolResult.textContent =
        parsedURL.protocol
            .replace(":", "")
            .toUpperCase();

    domainResult.textContent =
        parsedURL.hostname;

    if (parsedURL.port) {

        portResult.textContent =
            parsedURL.port;

    } else {

        portResult.textContent =
            parsedURL.protocol === "https:"
                ? "443 (default)"
                : "80 (default)";
    }

    httpsResult.textContent =
        parsedURL.protocol === "https:"
            ? "Enabled"
            : "Not Enabled";

    pathResult.textContent =
        parsedURL.pathname || "/";

    const queryCount =
        Array.from(parsedURL.searchParams.keys()).length;

    queryResult.textContent =
        queryCount === 0
            ? "None"
            : queryCount + " detected";

    // Findings

    findingList.innerHTML = "";

    analysis.findings.forEach(function (finding) {

        createFinding(
            finding.title,
            finding.description,
            finding.status
        );
    });

    // Recommendations

    recommendationList.innerHTML = "";

    analysis.recommendations.forEach(
        function (recommendation) {

            createRecommendation(
                recommendation
            );
        }
    );

    checksPerformed.textContent =
        analysis.findings.length;

    issuesFound.textContent =
        analysis.issues;

    analysisResultStatus.textContent =
        "Completed";

    let risk = "Low Risk";

    if (analysis.issues >= 3) {
        risk = "High Risk";
    } else if (analysis.issues >= 1) {
        risk = "Medium Risk";
    }

    overallRisk.textContent = risk;

    overallRisk.className =
        "text-xl font-extrabold mt-1";

    if (risk === "Low Risk") {

        overallRisk.classList.add(
            "text-emerald-600"
        );

    } else if (risk === "Medium Risk") {

        overallRisk.classList.add(
            "text-amber-600"
        );

    } else {

        overallRisk.classList.add(
            "text-red-600"
        );
    }

    webResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// =====================================================
// BACKEND ANALYSIS
// =====================================================

async function analyzeWithBackend(url) {

    try {

        const response = await fetch(
            `${API_URL}/api/tools/web`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: url
                })
            }
        );

        const data = await response.json();

        console.log(
            "Backend Web Analysis:",
            data
        );

        return data;

    } catch (error) {

        console.error(
            "Backend Web Analysis Error:",
            error
        );

        return null;
    }
}

// =====================================================
// FORM SUBMIT
// =====================================================

if (webForm) {

    webForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const enteredURL =
                urlInput.value.trim();

            if (!enteredURL) {

                alert(
                    "Please enter a website URL."
                );

                return;
            }

            const parsedURL =
                normalizeURL(enteredURL);

            if (!parsedURL) {

                alert(
                    "Please enter a valid website URL."
                );

                return;
            }

            const finalURL =
                parsedURL.href;

            // Show status

            scanStatus.classList.remove(
                "hidden"
            );

            webResults.classList.add(
                "hidden"
            );

            analyzeBtn.disabled = true;

            analyzeBtn.innerHTML =
                '<i class="fa-solid fa-circle-notch fa-spin"></i>' +
                '<span>Analyzing Web Security...</span>';

            scannerStatus.textContent =
                "Analysis Running";

            statusBadge.textContent =
                "Running";

            statusMessage.textContent =
                "Preparing web security analysis...";

            updateProgress(20);

            // Progress

            let progress = 20;

            const progressInterval =
                setInterval(function () {

                    progress += 15;

                    if (progress <= 80) {

                        updateProgress(progress);

                        if (progress < 40) {

                            statusMessage.textContent =
                                "Parsing website URL...";

                        } else if (progress < 65) {

                            statusMessage.textContent =
                                "Checking URL security characteristics...";

                        } else {

                            statusMessage.textContent =
                                "Preparing security findings...";
                        }
                    }

                }, 300);

            // Local analysis

            const localAnalysis =
                analyzeURLSecurity(
                    finalURL,
                    parsedURL
                );

            // Backend request

            await analyzeWithBackend(
                finalURL
            );

            clearInterval(
                progressInterval
            );

            updateProgress(100);

            statusBadge.textContent =
                "Completed";

            statusMessage.textContent =
                "Web security analysis completed successfully.";

            scannerStatus.textContent =
                "Ready to Inspect URL";

            analyzeBtn.disabled = false;

            analyzeBtn.innerHTML =
                '<i class="fa-solid fa-magnifying-glass"></i>' +
                '<span>Analyze Website</span>';

            // Display local result

            displayResults(
                finalURL,
                parsedURL,
                localAnalysis
            );
        }
    );
}

// =====================================================
// READY
// =====================================================

console.log(
    "Web Security Analyzer loaded successfully."
);