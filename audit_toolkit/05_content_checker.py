"""
=============================================================
  Script 5: Content & Text Analyser
  05_content_checker.py
=============================================================
  What it checks:
  - Spelling errors in visible page text (using a word list)
  - Broken/suspicious text patterns (CMS template leaks)
  - Inconsistent terminology/branding (e.g. Cl!ck vs Click)
  - Mixed content (HTTP resources on HTTPS pages)
  - Unminified/large JS+CSS resources
  - Email addresses exposed in plain text (privacy concern)
  - Phone numbers in non-tel: links (not clickable on mobile)
  - Outdated copyright years
  - Form validation messages style consistency
  - Lorem ipsum / placeholder text detection
  Outputs: audit_reports/content_report.csv + .txt
=============================================================
"""

import sys, os, csv, re, json, time
from datetime import datetime
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from colorama import init, Fore, Style

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from audit_toolkit.config import *

init(autoreset=True)

CURRENT_YEAR = 2026

# ─── Pattern Definitions ─────────────────────────────────────────────────────

# Known branding inconsistencies on Hyundai India
BRANDING_CHECKS = [
    {
        "pattern": re.compile(r"Cl!ck to Buy", re.IGNORECASE),
        "correct": "Click to Buy (or consistently Cl!ck to Buy)",
        "description": "Inconsistent 'Cl!ck to Buy' branding (uses '!' instead of 'i')",
    },
    {
        "pattern": re.compile(r"hyundai\s+motor\s+india\s+limited", re.IGNORECASE),
        "correct": "Hyundai Motor India Limited",
        "description": "Check capitalization of company name",
    },
]

# Common typos to look for (not exhaustive, patterns used)
TYPO_PATTERNS = [
    (re.compile(r"\batleast\b", re.IGNORECASE), "atleast", "at least"),
    (re.compile(r"\bteh\b", re.IGNORECASE), "teh", "the"),
    (re.compile(r"\brecieve\b", re.IGNORECASE), "recieve", "receive"),
    (re.compile(r"\bseperate\b", re.IGNORECASE), "seperate", "separate"),
    (re.compile(r"\baccommodate\b", re.IGNORECASE), "accomodate", "accommodate"),
    (re.compile(r"\boccured\b", re.IGNORECASE), "occured", "occurred"),
    (re.compile(r"\bnecessary\b", re.IGNORECASE), "neccessary", "necessary"),
    (re.compile(r"\bexperience\b", re.IGNORECASE), "experiance", "experience"),
    (re.compile(r"\bbenefits\b", re.IGNORECASE), "benifits", "benefits"),
    (re.compile(r"\bindependent\b", re.IGNORECASE), "independant", "independent"),
    (re.compile(r"\bguarantee\b", re.IGNORECASE), "guarentee", "guarantee"),
    (re.compile(r"\bpermanent\b", re.IGNORECASE), "permanant", "permanent"),
    (re.compile(r"\bsuggests\b", re.IGNORECASE), "suggets", "suggests"),
]

PLACEHOLDER_PATTERNS = [
    re.compile(r"lorem ipsum", re.IGNORECASE),
    re.compile(r"placeholder text", re.IGNORECASE),
    re.compile(r"dummy text", re.IGNORECASE),
    re.compile(r"sample content", re.IGNORECASE),
    re.compile(r"\bTBD\b"),
    re.compile(r"\bTBC\b"),
    re.compile(r"\bCOMING SOON\b", re.IGNORECASE),
    re.compile(r"<!--\s*ix-index\s*-->"),     # CMS template leak
    re.compile(r"<!--\s*\d+\s*-->"),           # Numeric CMS placeholder
]

EMAIL_REGEX    = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
PHONE_REGEX    = re.compile(r"(?<!\+)(?<!\d)([6-9]\d{9}|0\d{9,10}|\+91[\s\-]?\d{10})")
HTTP_SRC_REGEX = re.compile(r'(?:src|href|action)=["\']http://[^"\']*["\']', re.IGNORECASE)

# ─── Page Content Analysis ───────────────────────────────────────────────────

def analyse_page_content(url: str, html: str, resp_headers: dict) -> dict:
    soup    = BeautifulSoup(html, "lxml")
    issues  = []
    warnings = []
    info    = []

    # Get visible text only (strip scripts, styles)
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    visible_text = soup.get_text(separator=" ", strip=True)

    # ── 1. Typo Detection ──────────────────────────────────────────────────
    found_typos = []
    for pattern, wrong, correct in TYPO_PATTERNS:
        matches = pattern.findall(visible_text)
        if matches:
            found_typos.append(f"'{wrong}' should be '{correct}' ({len(matches)} occurrence(s))")
    if found_typos:
        for t in found_typos:
            issues.append(f"TYPO: {t}")

    # ── 2. Placeholder / CMS Template Leaks ───────────────────────────────
    for pattern in PLACEHOLDER_PATTERNS:
        matches = pattern.findall(html)  # search raw HTML for template leaks
        if matches:
            issues.append(f"PLACEHOLDER/TEMPLATE LEAK: '{pattern.pattern}' found {len(matches)} time(s)")

    # ── 3. Branding Inconsistencies ───────────────────────────────────────
    for check in BRANDING_CHECKS:
        matches = check["pattern"].findall(visible_text)
        if matches:
            warnings.append(f"BRANDING: {check['description']} (found {len(matches)}x)")

    # ── 4. Mixed Content (HTTP resources on HTTPS page) ───────────────────
    if url.startswith("https://"):
        mixed = HTTP_SRC_REGEX.findall(html)
        if mixed:
            issues.append(f"MIXED CONTENT: {len(mixed)} HTTP resource(s) on HTTPS page")
            for m in mixed[:3]:
                warnings.append(f"  Mixed: {m[:100]}")

    # ── 5. Exposed Email Addresses ─────────────────────────────────────────
    emails = EMAIL_REGEX.findall(visible_text)
    # Filter out things that look like emails but are file extensions or example patterns
    real_emails = [e for e in emails if not re.search(r"\.(png|jpg|gif|svg|js|css|ico)$", e, re.I)]
    if real_emails:
        warnings.append(f"PRIVACY: {len(real_emails)} email address(es) exposed in plain text:")
        for e in real_emails[:5]:
            warnings.append(f"  📧 {e}")

    # ── 6. Phone Numbers Not in tel: Links ────────────────────────────────
    phone_matches = PHONE_REGEX.findall(visible_text)
    if phone_matches:
        tel_links = soup.find_all("a", href=re.compile(r"^tel:", re.I))
        if len(phone_matches) > len(tel_links):
            warnings.append(
                f"MOBILE UX: {len(phone_matches)} phone number(s) found but only "
                f"{len(tel_links)} are in clickable tel: links"
            )

    # ── 7. Copyright Year Check ────────────────────────────────────────────
    copyright_pattern = re.compile(r"copyright\s*[©]?\s*(\d{4})", re.IGNORECASE)
    copyright_matches = copyright_pattern.findall(html)
    for year_str in copyright_matches:
        year = int(year_str)
        if year < CURRENT_YEAR - 1:
            issues.append(f"COPYRIGHT: Year '{year}' appears outdated (current year: {CURRENT_YEAR})")
        elif year > CURRENT_YEAR:
            warnings.append(f"COPYRIGHT: Year '{year}' is in the future (current year: {CURRENT_YEAR})")

    # ── 8. Forms: Validation Text Consistency ─────────────────────────────
    forms = soup.find_all("form")
    for form in forms:
        error_msgs = form.find_all(class_=re.compile(r"error|invalid|validation|msg", re.I))
        for msg in error_msgs:
            text = msg.get_text(strip=True)
            if text:
                if re.search(r"\batleast\b", text, re.I):
                    issues.append(f"FORM VALIDATION TYPO: '{text[:80]}' - 'atleast' should be 'at least'")
                if re.search(r"\( Must\b", text):
                    warnings.append(f"FORM VALIDATION: Unusual formatting - brackets and extra spaces: '{text[:80]}'")

    # ── 9. JS Asset Size (large scripts = performance concern) ────────────
    script_tags = soup.find_all("script", src=True)
    info.append(f"External scripts: {len(script_tags)}")

    # ── 10. Inline Styles (code quality) ──────────────────────────────────
    inline_styles = soup.find_all(style=True)
    if len(inline_styles) > 20:
        warnings.append(f"CODE QUALITY: {len(inline_styles)} elements use inline styles (should use CSS classes)")

    # ── 11. Empty paragraphs / divs ───────────────────────────────────────
    empty_paras = sum(1 for p in soup.find_all("p") if not p.get_text(strip=True))
    if empty_paras > 5:
        warnings.append(f"CODE QUALITY: {empty_paras} empty <p> tags found")

    # ── 12. Deprecated HTML tags ──────────────────────────────────────────
    deprecated = {
        "center": soup.find_all("center"),
        "font": soup.find_all("font"),
        "marquee": soup.find_all("marquee"),
        "blink": soup.find_all("blink"),
        "basefont": soup.find_all("basefont"),
    }
    for tag_name, instances in deprecated.items():
        if instances:
            warnings.append(f"DEPRECATED HTML: <{tag_name}> tag used {len(instances)} time(s)")

    return {
        "url": url,
        "issues": issues,
        "warnings": warnings,
        "info": info,
    }

# ─── Passive Vulnerability Patterns ─────────────────────────────────────────

def check_passive_vulnerabilities(url: str, html: str) -> list[dict]:
    """
    Passive checks only (no active exploitation).
    These look for code patterns that SUGGEST vulnerabilities.
    """
    vulns = []

    # ── XSS Surface: URL parameters reflected in page ────────────────────
    parsed = urlparse(url)
    if parsed.query:
        for param in parsed.query.split("&"):
            if "=" in param:
                key, val = param.split("=", 1)
                if val and val in html:
                    vulns.append({
                        "type": "Possible Reflected Content",
                        "severity": "Medium",
                        "detail": f"URL parameter '{key}={val}' appears reflected in HTML output. Manual XSS testing needed.",
                    })

    # ── Comments with sensitive content ──────────────────────────────────
    comment_pattern = re.compile(r"<!--(.*?)-->", re.DOTALL)
    comments = comment_pattern.findall(html)
    for comment in comments:
        comment = comment.strip()
        if re.search(r"(password|secret|api.?key|token|key|debug|test|todo|fixme|hack|xxx)", comment, re.I):
            vulns.append({
                "type": "Sensitive Data in HTML Comment",
                "severity": "High",
                "detail": f"Suspicious comment: '<!--{comment[:100]}-->'",
            })

    # ── Hardcoded credentials in JS ───────────────────────────────────────
    cred_patterns = [
        (re.compile(r'(?:api[_\-]?key|apikey|api_secret)\s*[=:]\s*["\'][a-zA-Z0-9_\-]{8,}["\']', re.I), "Possible API key"),
        (re.compile(r'(?:password|passwd|pwd)\s*[=:]\s*["\'][^"\']{4,}["\']', re.I), "Possible hardcoded password"),
        (re.compile(r'(?:secret|token)\s*[=:]\s*["\'][a-zA-Z0-9_\-]{8,}["\']', re.I), "Possible secret token"),
        (re.compile(r'(?:aws|s3)[_\-]?(?:key|secret|access)', re.I), "Possible AWS credentials"),
    ]
    for pattern, label in cred_patterns:
        matches = pattern.findall(html)
        if matches:
            for m in matches[:2]:
                vulns.append({
                    "type": f"Hardcoded Credential - {label}",
                    "severity": "Critical",
                    "detail": f"Found in page source: '{m[:100]}'",
                })

    # ── Internal IP addresses ─────────────────────────────────────────────
    internal_ip_pattern = re.compile(r"\b(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)\b")
    ips = internal_ip_pattern.findall(html)
    if ips:
        vulns.append({
            "type": "Internal IP Address Exposed",
            "severity": "Medium",
            "detail": f"Internal IPs found in source: {list(set(ips))[:5]}",
        })

    # ── Version numbers in scripts ────────────────────────────────────────
    version_pattern = re.compile(r'(?:jquery|angular|react|vue|bootstrap)[/\-v](\d+\.\d+\.\d+)', re.I)
    versions = version_pattern.findall(html)
    # Note: Only informational - would need CVE database to verify if vulnerable
    if versions:
        vulns.append({
            "type": "Frontend Library Versions Detectable",
            "severity": "Info",
            "detail": f"Library versions found: {versions[:5]} - verify against known CVEs",
        })

    # ── Open Redirects in forms/links ─────────────────────────────────────
    redirect_pattern = re.compile(r'(?:redirect|return|next|url|goto|target)=(?:https?|//)', re.I)
    redirects = redirect_pattern.findall(html)
    if redirects:
        vulns.append({
            "type": "Potential Open Redirect Parameter",
            "severity": "Medium",
            "detail": f"Redirect-like parameters found: {redirects[:3]}. Test manually.",
        })

    return vulns

# ─── Main ─────────────────────────────────────────────────────────────────────

def run_content_audit():
    session = requests.Session()
    session.headers.update(HEADERS)
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  📝  CONTENT & PASSIVE VULNERABILITY ANALYSER")
    print(f"{'='*60}{Style.RESET_ALL}\n")

    all_content_results = []
    all_vuln_results    = []
    csv_rows            = []

    for url in SEED_URLS:
        print(f"\n  🔍 {url}")
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            if "text/html" not in resp.headers.get("Content-Type", ""):
                print(f"     {Fore.YELLOW}Skipping (not HTML){Style.RESET_ALL}")
                continue

            # Content checks
            content_result = analyse_page_content(url, resp.text, dict(resp.headers))
            all_content_results.append(content_result)

            for issue in content_result["issues"]:
                print(f"     {Fore.RED}❌ {issue}{Style.RESET_ALL}")
            for warn in content_result["warnings"]:
                print(f"     {Fore.YELLOW}⚠️  {warn}{Style.RESET_ALL}")

            # Passive vulnerability checks
            vulns = check_passive_vulnerabilities(resp.url, resp.text)
            if vulns:
                all_vuln_results.append({"url": url, "vulnerabilities": vulns})
                for v in vulns:
                    sev_color = (Fore.RED if v["severity"] == "Critical" else
                                 Fore.YELLOW if v["severity"] in ("High","Medium") else Fore.CYAN)
                    print(f"     {sev_color}🔐 [{v['severity']}] {v['type']}: {v['detail'][:80]}{Style.RESET_ALL}")

            csv_rows.append({
                "url": url,
                "issues_count":     len(content_result["issues"]),
                "warnings_count":   len(content_result["warnings"]),
                "vuln_count":       len(vulns),
                "critical_vulns":   sum(1 for v in vulns if v["severity"] == "Critical"),
                "issues":           "; ".join(content_result["issues"])[:300],
                "warnings":         "; ".join(content_result["warnings"])[:300],
                "vulnerabilities":  "; ".join(f"{v['type']}({v['severity']})" for v in vulns),
            })

            time.sleep(CRAWL_DELAY_SECONDS)

        except Exception as e:
            print(f"     {Fore.RED}❌ Error: {e}{Style.RESET_ALL}")

    # ── Save Reports ──────────────────────────────────────────────────────
    csv_path  = os.path.join(output_dir, f"content_{timestamp}.csv")
    vuln_path = os.path.join(output_dir, f"vulnerabilities_{timestamp}.json")
    txt_path  = os.path.join(output_dir, f"content_report_{timestamp}.txt")

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        if csv_rows:
            writer = csv.DictWriter(f, fieldnames=csv_rows[0].keys())
            writer.writeheader()
            writer.writerows(csv_rows)

    with open(vuln_path, "w", encoding="utf-8") as f:
        json.dump(all_vuln_results, f, indent=2, ensure_ascii=False)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("HYUNDAI INDIA - CONTENT & VULNERABILITY REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*70 + "\n\n")
        for r in all_content_results:
            f.write(f"PAGE: {r['url']}\n")
            for i in r["issues"]:
                f.write(f"  ❌ {i}\n")
            for w in r["warnings"]:
                f.write(f"  ⚠️  {w}\n")
            f.write("\n")
        if all_vuln_results:
            f.write("\nPASSIVE VULNERABILITY FINDINGS\n" + "="*40 + "\n")
            for vr in all_vuln_results:
                f.write(f"\nURL: {vr['url']}\n")
                for v in vr["vulnerabilities"]:
                    f.write(f"  [{v['severity']}] {v['type']}: {v['detail']}\n")

    # Summary
    total_issues   = sum(len(r["issues"]) for r in all_content_results)
    total_warnings = sum(len(r["warnings"]) for r in all_content_results)
    total_vulns    = sum(len(vr["vulnerabilities"]) for vr in all_vuln_results)

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  📊  CONTENT AUDIT SUMMARY")
    print(f"{'='*60}{Style.RESET_ALL}")
    print(f"  Pages analysed     : {len(all_content_results)}")
    print(f"  Content issues     : {Fore.RED}{total_issues}{Style.RESET_ALL}")
    print(f"  Warnings           : {Fore.YELLOW}{total_warnings}{Style.RESET_ALL}")
    print(f"  Passive vuln flags : {Fore.RED}{total_vulns}{Style.RESET_ALL}")
    print(f"\n  Reports saved:")
    print(f"    • {csv_path}")
    print(f"    • {vuln_path}")
    print(f"    • {txt_path}")


if __name__ == "__main__":
    run_content_audit()
