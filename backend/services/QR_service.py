from urllib.parse import urlparse, parse_qs


def get_QR_info(data):
    if not data:
        return {
            "success": False,
            "message": "QR data is empty."
        }

    data = data.strip()

    # =========================================
    # UPI ID
    # =========================================

    if "@" in data and not data.lower().startswith(("http://", "https://")):

        return {
            "success": True,
            "type": "UPI",
            "risk_level": "Medium",
            "message": (
                "UPI payment identifier detected. "
                "Verify the recipient before making a payment."
            ),
            "upi_id": data
        }

    # =========================================
    # UPI QR
    # =========================================

    if data.lower().startswith("upi://pay"):
        parsed = urlparse(data)
        params = parse_qs(parsed.query)

        upi_id = params.get("pa", [""])[0]
        payee_name = params.get("pn", [""])[0]
        amount = params.get("am", [""])[0]
        currency = params.get("cu", ["INR"])[0]

        return {
            "success": True,
            "type": "UPI",
            "risk_level": "Medium",
            "message": (
                "UPI payment QR detected. "
                "Verify the recipient and payment details before making a payment."
            ),
            "upi_id": upi_id,
            "payee_name": payee_name,
            "amount": amount,
            "currency": currency
        }

    # =========================================
    # URL
    # =========================================

    if data.lower().startswith(("http://", "https://")):

        if data.lower().startswith("https://"):
            risk = "Low"
            message = "Secure HTTPS URL detected. Verify the website before opening it."
        else:
            risk = "Medium"
            message = "HTTP URL detected. The connection is not encrypted."

        return {
            "success": True,
            "type": "URL",
            "risk_level": risk,
            "message": message,
            "url": data
        }

    # =========================================
    # Normal Text
    # =========================================

    return {
        "success": True,
        "type": "Text",
        "risk_level": "Low",
        "message": "Normal text content detected.",
        "content": data
    }