# =========================================
# WEB SECURITY SERVICE
# PERSONAL CYBERSECURITY ASSISTANT
# =========================================

from urllib.parse import urlparse


# =========================================
# CHECK IP ADDRESS
# =========================================

def is_ip_address(hostname):

    if not hostname:
        return False

    parts = hostname.split(".")

    if len(parts) != 4:
        return False

    for part in parts:

        if not part.isdigit():
            return False

        number = int(part)

        if number < 0 or number > 255:
            return False

    return True


# =========================================
# ANALYZE WEBSITE
# =========================================

def analyze_website(url):

    if not url:
        return {
            "success": False,
            "message": "URL is required."
        }

    url = url.strip()

    # Add HTTPS if missing
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # Parse URL
    try:
        parsed = urlparse(url)
    except Exception:
        return {
            "success": False,
            "message": "Invalid URL."
        }

    # Validate URL
    if parsed.scheme not in ["http", "https"] or not parsed.netloc:
        return {
            "success": False,
            "message": "Invalid URL."
        }

    domain = parsed.hostname or ""
    scheme = parsed.scheme
    path = parsed.path or "/"
    query = parsed.query

    is_https = scheme == "https"

    # Port
    try:
        port = parsed.port
    except ValueError:
        return {
            "success": False,
            "message": "Invalid port in URL."
        }

    if port is None:
        port = 443 if is_https else 80

    # =========================================
    # VARIABLES
    # =========================================

    issues = []
    recommendations = []

    # =========================================
    # 1. HTTPS
    # =========================================

    if not is_https:

        issues.append({
            "title": "HTTPS is not enabled",
            "severity": "Medium",
            "description":
                "The website uses HTTP instead of HTTPS."
        })

        recommendations.append(
            "Prefer HTTPS websites when transmitting sensitive information."
        )

    # =========================================
    # 2. IP ADDRESS
    # =========================================

    ip_address = is_ip_address(domain)

    if ip_address:

        issues.append({
            "title": "Direct IP address detected",
            "severity": "Low",
            "description":
                "The URL uses a direct IP address instead of a domain name."
        })

        recommendations.append(
            "Verify the destination carefully when a website uses a direct IP address."
        )

    # =========================================
    # 3. @ SYMBOL
    # =========================================

    if "@" in url:

        issues.append({
            "title": "Suspicious @ character detected",
            "severity": "High",
            "description":
                "The URL contains an @ character that can make a URL misleading."
        })

        recommendations.append(
            "Verify the actual destination domain when a URL contains the @ symbol."
        )

    # =========================================
    # 4. LONG URL
    # =========================================

    if len(url) > 150:

        issues.append({
            "title": "Unusually long URL",
            "severity": "Low",
            "description":
                "The URL is unusually long and should be reviewed carefully."
        })

        recommendations.append(
            "Be cautious with unusually long URLs."
        )

    # =========================================
    # 5. ENCODED CHARACTERS
    # =========================================

    encoded_count = url.count("%")

    if encoded_count >= 5:

        issues.append({
            "title": "Multiple encoded characters detected",
            "severity": "Low",
            "description":
                "The URL contains several encoded characters."
        })

        recommendations.append(
            "Inspect encoded URL components carefully before visiting the destination."
        )

    # =========================================
    # 6. QUERY PARAMETERS
    # =========================================

    query_parameter_count = 0

    if query:
        query_parameter_count = len(query.split("&"))

    if query_parameter_count >= 5:

        issues.append({
            "title": "Multiple query parameters detected",
            "severity": "Low",
            "description":
                "The URL contains many query parameters."
        })

        recommendations.append(
            "Avoid sharing URLs that contain unnecessary or sensitive query parameters."
        )

    # =========================================
    # 7. SUSPICIOUS KEYWORDS
    # =========================================

    suspicious_keywords = [
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
        "urgent",
        "reward",
        "prize"
    ]

    url_lower = url.lower()

    matched_keywords = [
        keyword
        for keyword in suspicious_keywords
        if keyword in url_lower
    ]

    if matched_keywords:

        issues.append({
            "title": "Security-sensitive keywords detected",
            "severity": "Medium",
            "description":
                "The URL contains potentially sensitive or deceptive keywords: "
                + ", ".join(matched_keywords)
        })

        recommendations.append(
            "Verify that the domain belongs to the organization you intended to visit."
        )

    # =========================================
    # 8. NON-STANDARD PORT
    # =========================================

    if port not in [80, 443]:

        issues.append({
            "title": "Non-standard port detected",
            "severity": "Medium",
            "description":
                f"The website uses port {port}."
        })

        recommendations.append(
            "Confirm that the custom port is expected and belongs to the intended service."
        )

    # =========================================
    # 9. DOMAIN STRUCTURE
    # =========================================

    if "." not in domain:

        issues.append({
            "title": "Unusual domain structure",
            "severity": "Low",
            "description":
                "The hostname does not appear to use a typical domain structure."
        })

        recommendations.append(
            "Verify that the website address is correctly formatted."
        )

    # =========================================
    # RISK
    # =========================================

    issue_count = len(issues)

    if issue_count == 0:
        risk_level = "Low Risk"

    elif issue_count <= 2:
        risk_level = "Medium Risk"

    else:
        risk_level = "High Risk"

    # =========================================
    # DEFAULT RECOMMENDATIONS
    # =========================================

    if not recommendations:

        recommendations = [
            "Continue verifying website domains before entering sensitive information.",
            "Avoid opening unexpected links received from unknown sources."
        ]

    recommendations = list(dict.fromkeys(recommendations))

    # =========================================
    # FINAL RESPONSE
    # =========================================

    return {
        "success": True,
        "url": url,
        "domain": domain,
        "scheme": scheme,
        "secure_protocol": is_https,
        "https_status": "Enabled" if is_https else "Not Enabled",
        "port": port,
        "path": path,
        "query_parameter_count": query_parameter_count,
        "ip_address": ip_address,
        "matched_keywords": matched_keywords,
        "checks_performed": 9,
        "issues": issues,
        "issue_count": issue_count,
        "risk_level": risk_level,
        "security_status":
            "No basic URL security issues were detected."
            if issue_count == 0
            else "Some basic URL security issues were detected.",
        "recommendations": recommendations,
        "message": "Web security analysis completed successfully."
    }