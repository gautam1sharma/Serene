"""
=============================================================
  Hyundai India Website Audit Toolkit - Configuration File
=============================================================
"""

# ─── Target Configuration ────────────────────────────────
BASE_URL    = "https://www.hyundai.com/in/en"
TARGET_HOST = "www.hyundai.com"
TARGET_DOMAIN = "hyundai.com"

# Specific pages to always audit
SEED_URLS = [
    "https://www.hyundai.com/in/en",
    "https://www.hyundai.com/in/en/find-a-car",
    "https://www.hyundai.com/in/en/click-to-buy.html",
    "https://www.hyundai.com/in/en/connect-to-service.html",
    "https://www.hyundai.com/in/en/contact-us.html",
    "https://www.hyundai.com/in/en/utility/contact-us",
    "https://www.hyundai.com/in/en/find-a-car/creta/highlights.html",
    "https://www.hyundai.com/in/en/find-a-car/venue/highlights.html",
    "https://www.hyundai.com/in/en/find-a-car/i20/highlights.html",
    "https://www.hyundai.com/in/en/find-a-car/verna/highlights.html",
    "https://www.hyundai.com/in/en/find-a-car/tucson/highlights.html",
    "https://www.hyundai.com/in/en/find-a-car/alcazar/highlights.html",
    "https://www.hyundai.com/in/en/find-a-car/ioniq5/highlights.html",
    "https://www.hyundai.com/in/en/find-a-car/exter/highlights.html",
    "https://www.hyundai.com/in/en/hyundai-story",
    "https://www.hyundai.com/in/en/blog",
    "https://www.hyundai.com/in/en/utility/find-a-dealer",
    "https://www.hyundai.com/in/en/utility/contact-us/enquiry/sales-enquiry",
    "https://www.hyundai.com/in/en/utility/contact-us/enquiry/service-enquiry",
]

# ─── Crawler Settings ─────────────────────────────────────
MAX_PAGES_TO_CRAWL = 100       # Limit to be respectful to the server
CRAWL_DELAY_SECONDS = 1.5      # Delay between requests (be polite!)
REQUEST_TIMEOUT = 20           # Seconds
MAX_RETRIES = 2

# Only follow links within the same domain
STAY_ON_DOMAIN = True

# ─── HTTP Headers (mimic a real browser) ─────────────────
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/121.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}

# ─── Output Settings ─────────────────────────────────────
OUTPUT_DIR = "audit_reports"

# ─── Security Audit Settings ─────────────────────────────
# Expected security headers
EXPECTED_SECURITY_HEADERS = {
    "Content-Security-Policy":    "Restricts sources for scripts/styles (XSS prevention)",
    "X-Frame-Options":            "Prevents clickjacking attacks",
    "X-Content-Type-Options":     "Prevents MIME-type sniffing",
    "Strict-Transport-Security":  "Enforces HTTPS (HSTS)",
    "Referrer-Policy":            "Controls referrer info sent to other sites",
    "Permissions-Policy":         "Controls browser feature access",
    "X-XSS-Protection":          "Legacy XSS filter (older browsers)",
}

# Headers that reveal sensitive server info
SENSITIVE_HEADERS = [
    "Server",
    "X-Powered-By",
    "X-AspNet-Version",
    "X-AspNetMvc-Version",
    "X-Generator",
    "X-Drupal-Cache",
    "X-Runtime",
]

# ─── Accessibility Settings ───────────────────────────────
WCAG_CHECKS = [
    "images_without_alt",
    "links_without_href",
    "links_without_text",
    "buttons_without_label",
    "inputs_without_label",
    "multiple_h1_tags",
    "missing_lang_attribute",
    "empty_links",
]

# ─── SEO Settings ────────────────────────────────────────
MAX_META_DESCRIPTION_LENGTH = 160
MIN_META_DESCRIPTION_LENGTH = 50
MAX_TITLE_LENGTH = 60
MIN_TITLE_LENGTH = 10
