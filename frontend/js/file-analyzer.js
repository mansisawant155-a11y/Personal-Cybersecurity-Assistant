document.addEventListener("DOMContentLoaded", function () {

    const fileInput = document.getElementById("fileInput");
    const dropZone = document.getElementById("dropZone");
    const fileLabel = document.getElementById("fileLabel");
    const fileForm = document.getElementById("fileForm");

    const scanStatus = document.getElementById("scanStatus");
    const statusBadge = document.getElementById("statusBadge");
    const statusMessage = document.getElementById("statusMessage");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    const fileResults = document.getElementById("fileResults");
    const analyzedFile = document.getElementById("analyzedFile");
    const resultStatus = document.getElementById("resultStatus");

    const overallRisk = document.getElementById("overallRisk");
    const fileNameResult = document.getElementById("fileNameResult");
    const fileTypeResult = document.getElementById("fileTypeResult");
    const fileSizeResult = document.getElementById("fileSizeResult");
    const fileExtensionResult = document.getElementById("fileExtensionResult");

    const checksPerformed = document.getElementById("checksPerformed");
    const issuesFound = document.getElementById("issuesFound");

    const findingList = document.getElementById("findingList");
    const recommendationList = document.getElementById("recommendationList");


    // =========================
    // CHECK ELEMENTS
    // =========================

    if (!fileInput || !dropZone || !fileForm) {
        console.error("File analyzer elements not found.");
        return;
    }


    // =========================
    // CLICK TO SELECT FILE
    // =========================

    dropZone.addEventListener("click", function () {
        fileInput.click();
    });


    // =========================
    // FILE SELECTED
    // =========================

    fileInput.addEventListener("change", function () {

        if (!fileInput.files || fileInput.files.length === 0) {
            return;
        }

        const file = fileInput.files[0];

        fileLabel.textContent = file.name;

        scanStatus.classList.add("hidden");
        fileResults.classList.add("hidden");

        console.log("Selected file:", file.name);
    });


    // =========================
    // DRAG OVER
    // =========================

    dropZone.addEventListener("dragover", function (event) {

        event.preventDefault();

        dropZone.classList.add("dragover");
    });


    // =========================
    // DRAG LEAVE
    // =========================

    dropZone.addEventListener("dragleave", function () {

        dropZone.classList.remove("dragover");
    });


    // =========================
    // DROP FILE
    // =========================

    dropZone.addEventListener("drop", function (event) {

        event.preventDefault();

        dropZone.classList.remove("dragover");

        const files = event.dataTransfer.files;

        if (!files || files.length === 0) {
            return;
        }

        fileInput.files = files;

        const file = files[0];

        fileLabel.textContent = file.name;

        scanStatus.classList.add("hidden");
        fileResults.classList.add("hidden");

        console.log("Dropped file:", file.name);
    });


    // =========================
    // FORM SUBMIT
    // =========================

    fileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!fileInput.files || fileInput.files.length === 0) {

            alert("Please select a file first.");
            return;
        }

        const file = fileInput.files[0];

        analyzeFile(file);
    });


    // =========================
    // FILE ANALYSIS
    // =========================

    function analyzeFile(file) {

        scanStatus.classList.remove("hidden");
        fileResults.classList.add("hidden");

        statusBadge.textContent = "Scanning";
        statusMessage.textContent =
            "Preparing file security analysis...";

        progressBar.style.width = "0%";
        progressText.textContent = "0";


        let progress = 0;

        const interval = setInterval(function () {

            progress += 20;

            progressBar.style.width = progress + "%";
            progressText.textContent = progress;

            if (progress === 20) {
                statusMessage.textContent =
                    "Checking file type...";
            }

            if (progress === 40) {
                statusMessage.textContent =
                    "Checking file size...";
            }

            if (progress === 60) {
                statusMessage.textContent =
                    "Checking filename...";
            }

            if (progress === 80) {
                statusMessage.textContent =
                    "Checking suspicious file patterns...";
            }

            if (progress >= 100) {

                clearInterval(interval);

                statusBadge.textContent = "Completed";

                statusMessage.textContent =
                    "Basic security analysis completed.";

                showResults(file);
            }

        }, 300);
    }


    // =========================
    // SHOW RESULTS
    // =========================

    function showResults(file) {

        const fileName = file.name;
        const fileSize = file.size;
        const fileType = file.type || "Unknown";

        const extension = getExtension(fileName);

        const issues = [];
        const recommendations = [];


        // =========================
        // CHECK 1 - FILE TYPE
        // =========================

        const dangerousExtensions = [
            ".exe",
            ".bat",
            ".cmd",
            ".scr",
            ".msi",
            ".vbs",
            ".js",
            ".jar",
            ".ps1"
        ];

        if (dangerousExtensions.includes(extension)) {

            issues.push(
                "Executable or script file type detected: " + extension
            );

            recommendations.push(
                "Do not open executable or script files from unknown sources."
            );
        }


        // =========================
        // CHECK 2 - FILE SIZE
        // =========================

        const maxSize = 50 * 1024 * 1024;

        if (fileSize > maxSize) {

            issues.push(
                "File size is larger than the recommended 50 MB limit."
            );

            recommendations.push(
                "Verify the source before opening large files."
            );
        }


        // =========================
        // CHECK 3 - DOUBLE EXTENSION
        // =========================

        const doubleExtensionPattern =
            /\.(pdf|docx|jpg|jpeg|png|txt|zip)\.(exe|bat|cmd|scr|js|vbs|msi)$/i;

        if (doubleExtensionPattern.test(fileName)) {

            issues.push(
                "Suspicious double file extension detected."
            );

            recommendations.push(
                "Do not open files such as document.pdf.exe from unknown sources."
            );
        }


        // =========================
        // CHECK 4 - SUSPICIOUS NAME
        // =========================

        const suspiciousWords = [
            "invoice",
            "payment",
            "urgent",
            "free",
            "winner",
            "prize",
            "password",
            "verify",
            "account"
        ];

        const lowerName = fileName.toLowerCase();

        const suspiciousName = suspiciousWords.some(function (word) {
            return lowerName.includes(word);
        });

        if (suspiciousName) {

            issues.push(
                "Filename contains words commonly used in suspicious files."
            );

            recommendations.push(
                "Verify the sender and source of the file before opening it."
            );
        }


        // =========================
        // CHECK 5 - HIDDEN EXECUTABLE
        // =========================

        if (
            lowerName.endsWith(".pdf.exe") ||
            lowerName.endsWith(".docx.exe") ||
            lowerName.endsWith(".jpg.exe") ||
            lowerName.endsWith(".png.exe")
        ) {

            issues.push(
                "File appears to disguise an executable as another file type."
            );

            recommendations.push(
                "Do not execute disguised files."
            );
        }


        // =========================
        // OVERALL RISK
        // =========================

        let risk = "Low Risk";

        if (issues.length >= 3) {
            risk = "High Risk";
        }
        else if (issues.length >= 1) {
            risk = "Suspicious";
        }


        // =========================
        // UPDATE UI
        // =========================

        analyzedFile.textContent = "File: " + fileName;

        fileNameResult.textContent = fileName;

        fileTypeResult.textContent = fileType;

        fileSizeResult.textContent =
            formatFileSize(fileSize);

        fileExtensionResult.textContent =
            extension || "None";

        checksPerformed.textContent = "5";

        issuesFound.textContent = issues.length;

        overallRisk.textContent = risk;


        // =========================
        // RISK STATUS
        // =========================

        if (risk === "Low Risk") {

            resultStatus.textContent = "Low Risk";

            resultStatus.className =
                "px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold";

        }
        else if (risk === "Suspicious") {

            resultStatus.textContent = "Suspicious";

            resultStatus.className =
                "px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold";

        }
        else {

            resultStatus.textContent = "High Risk";

            resultStatus.className =
                "px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold";
        }


        // =========================
        // FINDINGS
        // =========================

        findingList.innerHTML = "";

        if (issues.length === 0) {

            findingList.innerHTML = `
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-700">
                    <i class="fa-solid fa-circle-check mr-2"></i>
                    No obvious risky characteristics were found.
                </div>
            `;

        }
        else {

            issues.forEach(function (issue) {

                const item = document.createElement("div");

                item.className =
                    "p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800";

                item.innerHTML =
                    '<i class="fa-solid fa-triangle-exclamation mr-2"></i>' +
                    issue;

                findingList.appendChild(item);
            });
        }


        // =========================
        // RECOMMENDATIONS
        // =========================

        recommendationList.innerHTML = "";

        if (recommendations.length === 0) {

            const li = document.createElement("li");

            li.textContent =
                "File passed the basic security checks. Still verify the source before opening it.";

            recommendationList.appendChild(li);

        }
        else {

            recommendations.forEach(function (recommendation) {

                const li = document.createElement("li");

                li.textContent = recommendation;

                recommendationList.appendChild(li);
            });
        }


        // =========================
        // SHOW RESULT
        // =========================

        fileResults.classList.remove("hidden");

        fileResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // =========================
    // GET EXTENSION
    // =========================

    function getExtension(filename) {

        const lastDot = filename.lastIndexOf(".");

        if (lastDot === -1) {
            return "";
        }

        return filename.substring(lastDot).toLowerCase();
    }


    // =========================
    // FORMAT FILE SIZE
    // =========================

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 Bytes";
        }

        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];

        const index =
            Math.floor(Math.log(bytes) / Math.log(1024));

        return (
            (bytes / Math.pow(1024, index)).toFixed(2)
            + " "
            + units[index]
        );
    }


    console.log(
        "File Security Analyzer loaded successfully."
    );

});