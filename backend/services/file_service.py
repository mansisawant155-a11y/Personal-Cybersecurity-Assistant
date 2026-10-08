import os


ALLOWED_EXTENSIONS = {
    ".txt",
    ".pdf",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg"
}


def is_allowed_file(filename):

    if not filename:
        return False

    extension = os.path.splitext(filename)[1].lower()

    return extension in ALLOWED_EXTENSIONS


def get_file_info(filename):

    if not filename:
        return {
            "success": False,
            "message": "Filename is required."
        }

    extension = os.path.splitext(filename)[1].lower()
    allowed = is_allowed_file(filename)

    return {
        "success": True,
        "filename": filename,
        "extension": extension,
        "allowed": allowed,
        "message": (
            "File type is allowed."
            if allowed
            else "File type is not allowed."
        )
    }


def check_file_risk(file_content):

    if not file_content:
        return "No file content provided."

    eicar_string = (
        "X5O!P%@AP[4\\PZX54(P^)7CC)7}$"
        "EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"
    )

    if eicar_string in file_content:
        return "CRITICAL / HIGH RISK: EICAR Test File Detected"

    return "Low Risk"