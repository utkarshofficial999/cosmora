"""Cosmos Platform — Slug Utility.

Provides slugification helper functions for text strings.
"""

import re
import unicodedata


def slugify(text: str) -> str:
    """Convert a text string into a clean, URL-friendly slug.

    Example:
        'The Space Race (1955 - 1975)!' -> 'the-space-race-1955-1975'
    """
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-")
