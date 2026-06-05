from __future__ import annotations

import re

SPECIAL_CHAR_PATTERN = re.compile(r'[!@#$%^&*(),.?":{}|<>]')


def validate_password_rules(email: str, password: str) -> list[str]:
    errors: list[str] = []

    if len(password) < 8:
        errors.append("Password should be at least 8 characters.")
    if email in password:
        errors.append("Password should not contain e-mail.")
    if not any(char.isupper() for char in password):
        errors.append("Password should contain at least one uppercase letter.")
    if not SPECIAL_CHAR_PATTERN.search(password):
        errors.append("Password should contain at least one special character.")

    return errors
