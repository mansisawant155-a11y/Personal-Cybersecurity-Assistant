import bcrypt
import re


# =========================
# HASH PASSWORD
# =========================

def hash_password(password):

    password_bytes = password.encode("utf-8")

    salt = bcrypt.gensalt()

    hashed = bcrypt.hashpw(
        password_bytes,
        salt
    )

    return hashed.decode("utf-8")


# =========================
# VERIFY PASSWORD
# =========================

def verify_password(password, hashed_password):

    password_bytes = password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(
        password_bytes,
        hashed_bytes
    )


# =========================
# VALIDATE EMAIL
# =========================

def validate_email(email):

    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"

    return re.match(
        pattern,
        email
    ) is not None


# =========================
# VALIDATE PASSWORD
# =========================

def validate_password(password):

    # Minimum 6 characters
    if len(password) < 6:
        return False

    # At least one number
    if not re.search(r"[0-9]", password):
        return False

    # At least one special character
    if not re.search(r"[^A-Za-z0-9]", password):
        return False

    return True


# =========================
# PASSWORD CONTAINS NAME
# =========================

def password_contains_name(password, name):

    if not password or not name:
        return False

    password_lower = password.lower()
    name_lower = name.lower().strip()

    if not name_lower:
        return False

    return name_lower in password_lower