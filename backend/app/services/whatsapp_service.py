from urllib.parse import quote


def format_phone_to_wa(number: str | None) -> str | None:
    if not number:
        return None
    digits = "".join(ch for ch in number if ch.isdigit())
    if digits.startswith("0"):
        digits = "62" + digits[1:]
    return digits or None


def build_wa_link(number: str | None, message: str) -> str | None:
    formatted = format_phone_to_wa(number)
    if not formatted:
        return None
    return f"https://wa.me/{formatted}?text={quote(message)}"
