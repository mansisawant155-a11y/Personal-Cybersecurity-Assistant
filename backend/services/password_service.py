#  =========================================
#   PASSWORD SECURITY SERVICE
#   =========================================

from utils.security_utils import (
    hash_password,
    verify_password,
    validate_password
)


# =========================================
# CREATE PASSWORD HASH
# =========================================

def create_password(password):

    if not password:

        return {
            "success": False,
            "message": "Password is required."
        }


    if not validate_password(password):

        return {
            "success": False,
            "message": (
                "Password must be at least 6 characters long "
                "and contain at least one number and one "
                "special character."
            )
        }


    hashed = hash_password(password)


    return {
        "success": True,
        "hashed_password": hashed
    }


# =========================================
# CHECK PASSWORD
# =========================================

def check_password(
    password,
    hashed_password
):

    if not password or not hashed_password:

        return False


    return verify_password(
        password,
        hashed_password
    )