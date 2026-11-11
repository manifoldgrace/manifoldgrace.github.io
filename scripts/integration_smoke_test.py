"""Non-invasive site integration checks. No form submissions or live API calls."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
FORM_ENDPOINT = "https://formspree.io/f/xoeebzbg"
ERRORS = []

class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.forms = []
        self.inputs = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "form":
            self.forms.append(a)
        if tag in ("input", "select", "textarea"):
            self.inputs.append(a)
        if tag in ("a", "script", "link"):
            self.links.append((tag, a.get("href") or a.get("src") or ""))

def check_page(filename, form_id=None):
    path = ROOT / filename
    if not path.is_file():
        ERRORS.append(f"{filename}: missing page")
        return
    html = path.read_text(encoding="utf-8")
    parser = Inspector()
    parser.feed(html)
    if form_id:
        if not any(f.get("id") == form_id and f.get("action") == FORM_ENDPOINT and f.get("method", "").upper() == "POST" for f in parser.forms):
            ERRORS.append(f"{filename}: expected configured POST form {form_id} not found")
        if not any(i.get("name") == "email" and i.get("type") == "email" for i in parser.inputs):
            ERRORS.append(f"{filename}: expected email input missing")
        if not any(i.get("name") == "consent" and "required" in i for i in parser.inputs):
            ERRORS.append(f"{filename}: required consent missing")
    for tag, link in parser.links:
        if not link or link.startswith(("#", "http:", "https:", "mailto:", "tel:", "javascript:", "data:")):
            continue
        relative = link.split("#", 1)[0].split("?", 1)[0]
        if not relative or relative.startswith(("/", "//")):
            continue
        target = (path.parent / relative).resolve()
        if not target.is_relative_to(ROOT.resolve()) or not target.exists():
            # Only audit local JavaScript/CSS on these integration-critical pages.
            if tag in ("script", "link") and relative.endswith((".js", ".css")):
                ERRORS.append(f"{filename}: missing local dependency {relative}")
    print(f"CHECKED {filename}")

check_page("index.html")
check_page("contact.html", "mg-contact-prep")
check_page("team.html", "mg-volunteer-application")
check_page("careers.html")
check_page("services.html")
check_page("products.html")
check_page("my-book.html")
bank = ROOT / "assets/bank-request.js"
if not bank.is_file() or FORM_ENDPOINT not in bank.read_text(encoding="utf-8"):
    ERRORS.append("assets/bank-request.js: configured enquiry endpoint missing")
else:
    print("CHECKED shared enquiry integration configuration")
if ERRORS:
    for err in ERRORS:
        print("FAIL", err, file=sys.stderr)
    sys.exit(1)
print("PASS: static integration configuration checks. No live delivery or payment validation performed.")
