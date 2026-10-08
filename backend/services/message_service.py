# =========================================
# MESSAGE SECURITY SERVICE
# PERSONAL CYBERSECURITY ASSISTANT
# =========================================

import re
from urllib.parse import urlparse


# =========================================
# MAIN MESSAGE ANALYSIS
# =========================================

def analyze_message(text):

    # -------------------------------------
    # INPUT VALIDATION
    # -------------------------------------

    if not text:

        return {
            "success": False,
            "message": "Message text is required."
        }

    text = text.strip()

    text_lower = text.lower()

    indicators = []
    details = []
    phishing_indicators = []
    scam_indicators = []
    recommendations = []


    # =====================================
    # 1. URGENCY CHECK
    # =====================================

    urgency_keywords = [

        "urgent",
        "immediately",
        "act now",
        "last chance",
        "within 24 hours",
        "account will be blocked",
        "account will be closed",
        "respond now",
        "do it now"

    ]

    matched_urgency = [

        keyword
        for keyword in urgency_keywords
        if keyword in text_lower

    ]

    if matched_urgency:

        indicators.append(
            "Urgency or pressure"
        )

        details.append({

            "type":
                "Urgency or pressure",

            "matched_terms":
                matched_urgency,

            "severity":
                "Medium"

        })

        phishing_indicators.extend(
            matched_urgency
        )

        recommendations.append(
            "Do not act immediately just because a message creates urgency or pressure."
        )


    # =====================================
    # 2. CREDENTIAL REQUEST CHECK
    # =====================================

    credential_keywords = [

        "password",
        "username",
        "login",
        "verify your account",
        "verify account",
        "confirm your account",
        "account verification",
        "otp",
        "one time password",
        "pin",
        "upi pin",
        "cvv",
        "card number",
        "bank details"

    ]

    matched_credentials = [

        keyword
        for keyword in credential_keywords
        if keyword in text_lower

    ]

    if matched_credentials:

        indicators.append(
            "Credential or sensitive information request"
        )

        details.append({

            "type":
                "Credential or sensitive information request",

            "matched_terms":
                matched_credentials,

            "severity":
                "High"

        })

        phishing_indicators.extend(
            matched_credentials
        )

        recommendations.append(
            "Never share passwords, OTPs, PINs or banking credentials through unexpected messages."
        )


    # =====================================
    # 3. FINANCIAL REQUEST CHECK
    # =====================================

    financial_keywords = [

        "send money",
        "transfer money",
        "payment",
        "pay now",
        "make payment",
        "bank account",
        "bank details",
        "upi",
        "upi payment",
        "refund",
        "fee",
        "processing fee",
        "transaction"

    ]

    matched_financial = [

        keyword
        for keyword in financial_keywords
        if keyword in text_lower

    ]

    if matched_financial:

        indicators.append(
            "Financial request"
        )

        details.append({

            "type":
                "Financial request",

            "matched_terms":
                matched_financial,

            "severity":
                "High"

        })

        scam_indicators.extend(
            matched_financial
        )

        recommendations.append(
            "Verify financial requests through an official source before making any payment."
        )


    # =====================================
    # 4. REWARD / PRIZE CHECK
    # =====================================

    reward_keywords = [

        "winner",
        "won",
        "prize",
        "lottery",
        "reward",
        "bonus",
        "gift",
        "free gift",
        "claim now",
        "cash prize",
        "congratulations"

    ]

    matched_rewards = [

        keyword
        for keyword in reward_keywords
        if keyword in text_lower

    ]

    if matched_rewards:

        indicators.append(
            "Prize or reward claim"
        )

        details.append({

            "type":
                "Prize or reward claim",

            "matched_terms":
                matched_rewards,

            "severity":
                "Medium"

        })

        scam_indicators.extend(
            matched_rewards
        )

        recommendations.append(
            "Be cautious of unexpected prizes, rewards or gifts that require payment or personal information."
        )


    # =====================================
    # 5. THREAT / ACCOUNT BLOCK CHECK
    # =====================================

    threat_keywords = [

        "account blocked",
        "account suspended",
        "account closed",
        "legal action",
        "police complaint",
        "penalty",
        "fine",
        "your account will be blocked",
        "your account will be suspended"

    ]

    matched_threats = [

        keyword
        for keyword in threat_keywords
        if keyword in text_lower

    ]

    if matched_threats:

        indicators.append(
            "Threat or account suspension claim"
        )

        details.append({

            "type":
                "Threat or account suspension claim",

            "matched_terms":
                matched_threats,

            "severity":
                "High"

        })

        phishing_indicators.extend(
            matched_threats
        )

        recommendations.append(
            "Verify account warnings through the organization's official website or application."
        )


    # =====================================
    # 6. URL CHECK
    # =====================================

    url_pattern = (
        r"(https?://[^\s]+|"
        r"www\.[^\s]+)"
    )

    urls = re.findall(
        url_pattern,
        text,
        re.IGNORECASE
    )

    if urls:

        indicators.append(
            "Link detected"
        )

        details.append({

            "type":
                "Link detected",

            "matched_terms":
                urls,

            "severity":
                "Medium"

        })

        phishing_indicators.extend(
            urls
        )

        recommendations.append(
            "Avoid opening unexpected links. Verify the website address before entering information."
        )

        # ---------------------------------
        # URL SECURITY CHECK
        # ---------------------------------

        for url in urls:

            clean_url = url.rstrip(
                ".,!?;:)"
            )

            if clean_url.lower().startswith(
                "www."
            ):

                parsed_url = urlparse(
                    "https://" + clean_url
                )

            else:

                parsed_url = urlparse(
                    clean_url
                )

            hostname = (
                parsed_url.hostname or ""
            )

            # -----------------------------
            # HTTP CHECK
            # -----------------------------

            if parsed_url.scheme == "http":

                indicators.append(
                    "Insecure HTTP link"
                )

                details.append({

                    "type":
                        "Insecure HTTP link",

                    "matched_terms":
                        [clean_url],

                    "severity":
                        "High"

                })

                phishing_indicators.append(
                    clean_url
                )

                recommendations.append(
                    "Avoid entering sensitive information on websites using HTTP."
                )

            # -----------------------------
            # SHORTENED URL CHECK
            # -----------------------------

            shortened_domains = [

                "bit.ly",
                "tinyurl.com",
                "t.co",
                "goo.gl",
                "is.gd",
                "cutt.ly",
                "ow.ly",
                "shorturl.at"

            ]

            if hostname.lower() in (
                shortened_domains
            ):

                indicators.append(
                    "Shortened URL detected"
                )

                details.append({

                    "type":
                        "Shortened URL detected",

                    "matched_terms":
                        [hostname],

                    "severity":
                        "Medium"

                })

                phishing_indicators.append(
                    hostname
                )

                recommendations.append(
                    "Check the final destination of shortened links before opening them."
                )


    # =====================================
    # 7. SUSPICIOUS MESSAGE TERMS
    # =====================================

    suspicious_terms = [

        "click here",
        "click the link",
        "verify now",
        "confirm now",
        "claim now",
        "limited time",
        "special offer",
        "exclusive offer",
        "free money",
        "cashback",
        "investment opportunity",
        "double your money"

    ]

    matched_suspicious = [

        term
        for term in suspicious_terms
        if term in text_lower

    ]

    if matched_suspicious:

        indicators.append(
            "Suspicious promotional or action language"
        )

        details.append({

            "type":
                "Suspicious promotional or action language",

            "matched_terms":
                matched_suspicious,

            "severity":
                "Medium"

        })

        scam_indicators.extend(
            matched_suspicious
        )

        recommendations.append(
            "Verify unexpected offers or requests through an official source."
        )


    # =====================================
    # REMOVE DUPLICATES
    # =====================================

    indicators = list(
        dict.fromkeys(indicators)
    )

    phishing_indicators = list(
        dict.fromkeys(
            phishing_indicators
        )
    )

    scam_indicators = list(
        dict.fromkeys(
            scam_indicators
        )
    )

    recommendations = list(
        dict.fromkeys(
            recommendations
        )
    )


    # =====================================
    # CALCULATE ISSUE COUNT
    # =====================================

    issue_count = len(
        indicators
    )


    # =====================================
    # CALCULATE RISK LEVEL
    # =====================================

    has_high_severity = any(

        detail["severity"] == "High"

        for detail in details

    )

    if has_high_severity:

        risk_level = "High Risk"

        result_message = (
            "Potential phishing or scam indicators detected."
        )

    elif issue_count >= 2:

        risk_level = "Medium Risk"

        result_message = (
            "Suspicious message indicators detected."
        )

    elif issue_count == 1:

        risk_level = "Medium Risk"

        result_message = (
            "One suspicious message indicator was detected."
        )

    else:

        risk_level = "Low Risk"

        result_message = (
            "No obvious phishing or scam indicators detected."
        )


    # =====================================
    # DEFAULT RECOMMENDATIONS
    # =====================================

    if not recommendations:

        recommendations = [

            "Do not share passwords, OTPs or financial information through unexpected messages.",

            "Verify important requests using an official website or trusted contact method."

        ]


    # =====================================
    # FINAL RESULT
    # =====================================

    return {

        "success":
            True,

        "result":
            result_message,

        "risk_level":
            risk_level,

        "indicator_count":
            issue_count,

        "indicators":
            indicators,

        "details":
            details,

        "phishing_indicators":
            phishing_indicators,

        "scam_indicators":
            scam_indicators,

        "recommendations":
            recommendations,

        "message":
            "Message security analysis completed successfully."

    }