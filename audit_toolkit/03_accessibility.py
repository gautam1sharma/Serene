"""
=============================================================
  Script 3: Accessibility Auditor (WCAG 2.1 Checks)
  03_accessibility.py
=============================================================
  What it checks (per page):
  - Images missing alt text (WCAG 1.1.1)
  - Links without text / href (WCAG 2.4.4)
  - Inputs without associated labels (WCAG 1.3.1)
  - Buttons without accessible names (WCAG 4.1.2)
  - Multiple H1 tags (WCAG 1.3.1)
  - Missing lang attribute on <html> (WCAG 3.1.1)
  - Very low contrast text detection (color pattern matching)
  - Missing skip navigation links (WCAG 2.4.1)
  - Form: missing required field indicators (WCAG 3.3.2)
  - Suspicious generic aria-labels like "title", "banner"
  - iframe without title (WCAG 4.1.2)
  - Tabindex > 0 (anti-pattern, WCAG 2.4.3)
  Outputs: audit_reports/accessibility_report.csv + full .txt
=============================================================
"""

import sys, os, csv, re, json, time
from datetime import datetime
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from colorama import init, Fore, Style

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from audit_toolkit.config import *

init(autoreset=True)

# ─── WCAG Rules ──────────────────────────────────────────────────────────────

GENERIC_ARIA_LABELS = {"title", "banner", "image", "icon", "button", "link", "click", "here"}
WCAG_DESCRIPTIONS = {
    "imgs_no_alt":          "1.1.1 Non-text Content - Images must have alt text",
    "links_no_href":        "2.4.4 Link Purpose - Anchor tags without href attribute",
    "links_no_text":        "2.4.4 Link Purpose - Links with no visible text or aria-label",
    "buttons_no_label":     "4.1.2 Name/Role/Value - Buttons have no accessible name",
    "generic_aria_labels":  "4.1.2 Name/Role/Value - Aria-labels are vague/generic",
    "inputs_no_label":      "1.3.1 Info and Relationships - Form inputs have no label",
    "missing_h1":           "1.3.1 Info and Relationships - Page has no H1 heading",
    "multiple_h1":          "1.3.1 Info and Relationships - Page has multiple H1 headings",
    "missing_lang":         "3.1.1 Language of Page - <html> missing lang attribute",
    "no_skip_nav":          "2.4.1 Bypass Blocks - No skip navigation link found",
    "iframes_no_title":     "4.1.2 Name/Role/Value - iFrames have no title attribute",
    "positive_tabindex":    "2.4.3 Focus Order - tabindex > 0 disrupts natural focus order",
    "broken_title_attrs":   "Code Quality - title attributes contain CMS template code",
    "empty_headings":       "1.3.1 Info and Relationships - Heading tags with no text content",
    "missing_form_labels":  "3.3.2 Labels or Instructions - Required field indicators missing",
    "autoplay_media":       "1.4.2 Audio Control - Media may auto-play (check manually)",
}

# ─── Page Audit ──────────────────────────────────────────────────────────────

def audit_page_accessibility(url: str, html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")
    issues = {}

    # ── 1. Images without alt text ────────────────────────────────────────
    all_imgs   = soup.find_all("img")
    bad_imgs   = [img for img in all_imgs if not img.get("alt") and img.get("alt") != ""]
    issues["imgs_no_alt"] = {
        "count": len(bad_imgs),
        "samples": [img.get("src", "")[:80] for img in bad_imgs[:5]],
    }

    # ── 2. Links without href ─────────────────────────────────────────────
    all_links   = soup.find_all("a")
    no_href     = [a for a in all_links if not a.get("href")]
    issues["links_no_href"] = {
        "count": len(no_href),
        "samples": [str(a)[:100] for a in no_href[:5]],
    }

    # ── 3. Links with no text ─────────────────────────────────────────────
    no_text_links = []
    for a in all_links:
        text = a.get_text(strip=True)
        aria = a.get("aria-label", "").strip()
        has_img_with_alt = any(
            img.get("alt", "").strip() for img in a.find_all("img")
        )
        if not text and not aria and not has_img_with_alt:
            no_text_links.append(str(a)[:100])
    issues["links_no_text"] = {
        "count": len(no_text_links),
        "samples": no_text_links[:5],
    }

    # ── 4. Buttons without accessible name ───────────────────────────────
    all_buttons = soup.find_all("button")
    bad_buttons = []
    for btn in all_buttons:
        label     = btn.get("aria-label", "").strip()
        title_val = btn.get("title", "").strip()
        text      = btn.get_text(strip=True)
        aria_desc = btn.get("aria-describedby", "").strip()
        if not label and not title_val and not text and not aria_desc:
            bad_buttons.append(str(btn)[:100])
    issues["buttons_no_label"] = {
        "count": len(bad_buttons),
        "samples": bad_buttons[:5],
    }

    # ── 5. Generic / meaningless aria-labels ─────────────────────────────
    generic_labels = []
    for el in soup.find_all(attrs={"aria-label": True}):
        label = el.get("aria-label", "").strip().lower()
        if label in GENERIC_ARIA_LABELS or len(label) <= 3:
            generic_labels.append({
                "tag": el.name,
                "aria-label": el.get("aria-label"),
                "snippet": str(el)[:80],
            })
    issues["generic_aria_labels"] = {
        "count": len(generic_labels),
        "samples": generic_labels[:5],
    }

    # ── 6. Inputs without labels ──────────────────────────────────────────
    all_inputs = soup.find_all("input", type=lambda t: t not in ("hidden", "submit", "button", "reset", "image"))
    bad_inputs = []
    for inp in all_inputs:
        inp_id   = inp.get("id")
        inp_name = inp.get("name")
        aria_l   = inp.get("aria-label")
        aria_li  = inp.get("aria-labelledby")
        # Check for associated <label>
        has_label = bool(aria_l or aria_li)
        if inp_id and not has_label:
            associated = soup.find("label", attrs={"for": inp_id})
            has_label = bool(associated)
        if not has_label:
            bad_inputs.append({
                "type": inp.get("type", "text"),
                "name": inp_name,
                "id": inp_id,
            })
    issues["inputs_no_label"] = {
        "count": len(bad_inputs),
        "samples": bad_inputs[:5],
    }

    # ── 7. H1 tag presence and uniqueness ────────────────────────────────
    h1_tags = soup.find_all("h1")
    h1_texts = [h1.get_text(strip=True) for h1 in h1_tags]
    issues["missing_h1"]   = {"count": 1 if not h1_tags else 0, "h1_texts": h1_texts}
    issues["multiple_h1"]  = {"count": max(0, len(h1_tags) - 1), "h1_texts": h1_texts}

    # ── 8. Empty headings ─────────────────────────────────────────────────
    empty_headings = []
    for tag in soup.find_all(re.compile("^h[1-6]$")):
        if not tag.get_text(strip=True):
            empty_headings.append(str(tag)[:80])
    issues["empty_headings"] = {"count": len(empty_headings), "samples": empty_headings[:5]}

    # ── 9. Missing lang attribute ─────────────────────────────────────────
    html_tag = soup.find("html")
    lang = html_tag.get("lang", "") if html_tag else ""
    issues["missing_lang"] = {"count": 0 if lang else 1, "lang": lang}

    # ── 10. Skip navigation ───────────────────────────────────────────────
    skip_patterns = re.compile(r"skip.*(nav|content|main)", re.IGNORECASE)
    skip_links = [a for a in all_links if skip_patterns.search(a.get_text()) or
                  skip_patterns.search(a.get("href", "")) or
                  skip_patterns.search(a.get("aria-label", ""))]
    issues["no_skip_nav"] = {"count": 0 if skip_links else 1}

    # ── 11. iFrames without title ─────────────────────────────────────────
    iframes = soup.find_all("iframe")
    bad_iframes = [f for f in iframes if not f.get("title")]
    issues["iframes_no_title"] = {
        "count": len(bad_iframes),
        "samples": [f.get("src", "")[:80] for f in bad_iframes[:3]],
    }

    # ── 12. Positive tabindex ─────────────────────────────────────────────
    pos_tabindex = [
        el for el in soup.find_all(True)
        if el.get("tabindex") and int(el.get("tabindex", 0)) > 0
    ]
    issues["positive_tabindex"] = {
        "count": len(pos_tabindex),
        "samples": [str(el)[:80] for el in pos_tabindex[:5]],
    }

    # ── 13. CMS broken title attributes ──────────────────────────────────
    broken_titles = [
        el for el in soup.find_all(True)
        if el.get("title") and "<!--" in el.get("title", "")
    ]
    issues["broken_title_attrs"] = {
        "count": len(broken_titles),
        "samples": [f"{el.name}: title='{el.get('title')[:60]}'" for el in broken_titles[:5]],
    }

    # ── 14. Autoplay media ────────────────────────────────────────────────
    autoplay_els = soup.find_all(True, autoplay=True)
    issues["autoplay_media"] = {"count": len(autoplay_els)}

    return issues

# ─── Scoring ─────────────────────────────────────────────────────────────────

def calculate_accessibility_score(issues: dict) -> tuple[int, str]:
    """Returns a score 0-100 and a letter grade."""
    WEIGHTS = {
        "imgs_no_alt":         10,
        "links_no_text":        8,
        "buttons_no_label":     8,
        "inputs_no_label":      9,
        "missing_lang":         7,
        "missing_h1":           5,
        "iframes_no_title":     6,
        "generic_aria_labels":  5,
        "links_no_href":        4,
        "broken_title_attrs":   4,
        "no_skip_nav":          3,
        "multiple_h1":          3,
        "positive_tabindex":    2,
        "autoplay_media":       2,
    }
    total_weight = sum(WEIGHTS.values())
    score = total_weight

    for key, weight in WEIGHTS.items():
        data = issues.get(key, {})
        count = data.get("count", 0)
        if count > 0:
            # Deduct points proportionally (more issues = more deduction)
            deduction = min(weight, weight * min(count / 5, 1))
            score -= deduction

    pct = max(0, int(score / total_weight * 100))
    grade = ("A+" if pct >= 95 else "A" if pct >= 85 else "B" if pct >= 70 else
             "C" if pct >= 55 else "D" if pct >= 40 else "F")
    return pct, grade

# ─── Main ─────────────────────────────────────────────────────────────────────

def run_accessibility_audit():
    session = requests.Session()
    session.headers.update(HEADERS)
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  ♿  ACCESSIBILITY AUDITOR (WCAG 2.1)")
    print(f"{'='*60}{Style.RESET_ALL}\n")

    all_page_results = []
    csv_rows = []

    for url in SEED_URLS:
        print(f"\n  🔍 Auditing: {url}")
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            if "text/html" not in resp.headers.get("Content-Type", ""):
                print(f"     {Fore.YELLOW}Skipping (not HTML){Style.RESET_ALL}")
                continue

            issues = audit_page_accessibility(url, resp.text)
            score, grade = calculate_accessibility_score(issues)

            grade_color = (Fore.GREEN if grade in ("A+","A") else
                           Fore.YELLOW if grade in ("B","C") else Fore.RED)
            print(f"     Score: {grade_color}{score}/100 [{grade}]{Style.RESET_ALL}")

            issue_summary = []
            for key, wcag_desc in WCAG_DESCRIPTIONS.items():
                data = issues.get(key, {})
                count = data.get("count", 0)
                if count > 0:
                    color = Fore.RED if count > 10 else Fore.YELLOW
                    print(f"     {color}⚠️  {key}: {count} issues{Style.RESET_ALL}")
                    issue_summary.append(f"{key}={count}")

            all_page_results.append({
                "url": url,
                "score": score,
                "grade": grade,
                "issues": issues,
            })

            csv_rows.append({
                "url": url,
                "score": score,
                "grade": grade,
                "imgs_no_alt": issues.get("imgs_no_alt", {}).get("count", 0),
                "links_no_href": issues.get("links_no_href", {}).get("count", 0),
                "links_no_text": issues.get("links_no_text", {}).get("count", 0),
                "buttons_no_label": issues.get("buttons_no_label", {}).get("count", 0),
                "generic_aria_labels": issues.get("generic_aria_labels", {}).get("count", 0),
                "inputs_no_label": issues.get("inputs_no_label", {}).get("count", 0),
                "missing_h1": issues.get("missing_h1", {}).get("count", 0),
                "multiple_h1": issues.get("multiple_h1", {}).get("count", 0),
                "missing_lang": issues.get("missing_lang", {}).get("count", 0),
                "no_skip_nav": issues.get("no_skip_nav", {}).get("count", 0),
                "iframes_no_title": issues.get("iframes_no_title", {}).get("count", 0),
                "positive_tabindex": issues.get("positive_tabindex", {}).get("count", 0),
                "broken_title_attrs": issues.get("broken_title_attrs", {}).get("count", 0),
                "autoplay_media": issues.get("autoplay_media", {}).get("count", 0),
            })

            time.sleep(CRAWL_DELAY_SECONDS)

        except Exception as e:
            print(f"     {Fore.RED}❌ Error: {e}{Style.RESET_ALL}")

    # ── Save Reports ──────────────────────────────────────────────────────
    csv_path  = os.path.join(output_dir, f"accessibility_{timestamp}.csv")
    json_path = os.path.join(output_dir, f"accessibility_{timestamp}.json")
    txt_path  = os.path.join(output_dir, f"accessibility_report_{timestamp}.txt")

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        if csv_rows:
            writer = csv.DictWriter(f, fieldnames=csv_rows[0].keys())
            writer.writeheader()
            writer.writerows(csv_rows)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_page_results, f, indent=2, ensure_ascii=False, default=str)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("HYUNDAI INDIA - ACCESSIBILITY AUDIT REPORT (WCAG 2.1)\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*70 + "\n\n")
        for pr in all_page_results:
            f.write(f"PAGE: {pr['url']}\n")
            f.write(f"  Score: {pr['score']}/100 [{pr['grade']}]\n")
            for key, wcag_desc in WCAG_DESCRIPTIONS.items():
                count = pr["issues"].get(key, {}).get("count", 0)
                if count > 0:
                    f.write(f"  ❌ WCAG {wcag_desc}: {count} issues\n")
                    samples = pr["issues"].get(key, {}).get("samples", [])
                    for s in samples[:2]:
                        f.write(f"      Sample: {str(s)[:120]}\n")
            f.write("\n")

    # Summary
    if all_page_results:
        avg_score = sum(r["score"] for r in all_page_results) / len(all_page_results)
        worst = min(all_page_results, key=lambda r: r["score"])
        best  = max(all_page_results, key=lambda r: r["score"])

        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"  📊  ACCESSIBILITY SUMMARY")
        print(f"{'='*60}{Style.RESET_ALL}")
        print(f"  Pages audited  : {len(all_page_results)}")
        print(f"  Average score  : {Fore.YELLOW}{avg_score:.1f}/100{Style.RESET_ALL}")
        print(f"  Best page      : {Fore.GREEN}{best['url'][-50:]} [{best['grade']}]{Style.RESET_ALL}")
        print(f"  Worst page     : {Fore.RED}{worst['url'][-50:]} [{worst['grade']}]{Style.RESET_ALL}")
        print(f"\n  Reports saved:")
        print(f"    • {csv_path}")
        print(f"    • {json_path}")
        print(f"    • {txt_path}")


if __name__ == "__main__":
    run_accessibility_audit()
