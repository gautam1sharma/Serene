"""
=============================================================
  Script 4: SEO Analyser
  04_seo_checker.py
=============================================================
  What it checks:
  - Page title: length, presence, duplicates
  - Meta description: length, presence, duplicates
  - Canonical tag: presence and correctness
  - Robots meta tag: noindex/nofollow detection
  - robots.txt: validity and disallowed paths
  - sitemap.xml: presence, validity, URL count
  - Open Graph / Twitter Card tags
  - Structured data (JSON-LD)
  - Heading hierarchy (H1-H6 structure)
  - Image alt text (duplicate check)
  - Thin content (word count)
  - Duplicate page titles / descriptions
  Outputs: audit_reports/seo_report.csv + .txt
=============================================================
"""

import sys, os, csv, re, json, time
from datetime import datetime
from urllib.parse import urljoin, urlparse
from collections import Counter

import requests
from bs4 import BeautifulSoup
from colorama import init, Fore, Style

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from audit_toolkit.config import *

init(autoreset=True)

# ─── robots.txt Checker ──────────────────────────────────────────────────────

def check_robots_txt(session: requests.Session, base_url: str) -> dict:
    robots_url = f"{urlparse(base_url).scheme}://{urlparse(base_url).netloc}/robots.txt"
    result = {
        "url": robots_url,
        "found": False,
        "has_sitemap": False,
        "sitemap_url": None,
        "disallowed_paths": [],
        "crawl_delay": None,
        "raw": "",
    }
    try:
        resp = session.get(robots_url, timeout=REQUEST_TIMEOUT)
        if resp.status_code == 200:
            result["found"] = True
            result["raw"] = resp.text[:2000]
            for line in resp.text.splitlines():
                line = line.strip()
                if line.lower().startswith("disallow:"):
                    path = line.split(":", 1)[1].strip()
                    if path:
                        result["disallowed_paths"].append(path)
                elif line.lower().startswith("sitemap:"):
                    result["has_sitemap"] = True
                    result["sitemap_url"] = line.split(":", 1)[1].strip()
                elif line.lower().startswith("crawl-delay:"):
                    try:
                        result["crawl_delay"] = float(line.split(":", 1)[1].strip())
                    except:
                        pass
    except Exception as e:
        result["error"] = str(e)
    return result

# ─── sitemap.xml Checker ─────────────────────────────────────────────────────

def check_sitemap(session: requests.Session, sitemap_url: str) -> dict:
    result = {
        "url": sitemap_url,
        "found": False,
        "url_count": 0,
        "sample_urls": [],
        "has_lastmod": False,
        "has_priority": False,
        "is_index": False,
        "child_sitemaps": [],
    }
    if not sitemap_url:
        sitemap_url = urljoin(BASE_URL, "/sitemap.xml")
    try:
        resp = session.get(sitemap_url, timeout=REQUEST_TIMEOUT)
        if resp.status_code == 200:
            result["found"] = True
            soup = BeautifulSoup(resp.text, "xml")
            # Sitemap index?
            if soup.find("sitemapindex"):
                result["is_index"] = True
                for loc in soup.find_all("loc")[:10]:
                    result["child_sitemaps"].append(loc.get_text(strip=True))
            else:
                locs = soup.find_all("loc")
                result["url_count"] = len(locs)
                result["sample_urls"] = [l.get_text(strip=True) for l in locs[:5]]
                result["has_lastmod"] = bool(soup.find("lastmod"))
                result["has_priority"] = bool(soup.find("priority"))
    except Exception as e:
        result["error"] = str(e)
    return result

# ─── Page SEO Analysis ───────────────────────────────────────────────────────

def analyse_page_seo(url: str, html: str, final_url: str) -> dict:
    soup = BeautifulSoup(html, "lxml")
    result = {
        "url": url,
        "final_url": final_url,
        "issues": [],
        "warnings": [],
        "passed": [],
    }

    # ── Title ─────────────────────────────────────────────────────────────
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""
    result["title"] = title
    if not title:
        result["issues"].append("MISSING: No <title> tag found")
    elif len(title) > MAX_TITLE_LENGTH:
        result["warnings"].append(f"Title too long ({len(title)} chars, max {MAX_TITLE_LENGTH}): '{title[:60]}...'")
    elif len(title) < MIN_TITLE_LENGTH:
        result["warnings"].append(f"Title too short ({len(title)} chars, min {MIN_TITLE_LENGTH}): '{title}'")
    else:
        result["passed"].append(f"Title OK ({len(title)} chars)")

    # ── Meta Description ──────────────────────────────────────────────────
    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_desc     = meta_desc_tag.get("content", "").strip() if meta_desc_tag else ""
    result["meta_description"] = meta_desc
    if not meta_desc:
        result["issues"].append("MISSING: No meta description found")
    elif len(meta_desc) > MAX_META_DESCRIPTION_LENGTH:
        result["warnings"].append(f"Meta desc too long ({len(meta_desc)} chars, max {MAX_META_DESCRIPTION_LENGTH})")
    elif len(meta_desc) < MIN_META_DESCRIPTION_LENGTH:
        result["warnings"].append(f"Meta desc too short ({len(meta_desc)} chars, min {MIN_META_DESCRIPTION_LENGTH}): '{meta_desc}'")
    elif meta_desc.strip().endswith(("See more.", "Read more.", "click here")):
        result["warnings"].append(f"Meta description ends with a call-to-action placeholder: '{meta_desc[-30:]}'")
    else:
        result["passed"].append(f"Meta description OK ({len(meta_desc)} chars)")

    # ── Canonical ──────────────────────────────────────────────────────────
    canonical = soup.find("link", rel="canonical")
    if not canonical:
        result["warnings"].append("No canonical tag found")
    else:
        canon_href = canonical.get("href", "")
        result["canonical"] = canon_href
        if canon_href != final_url and canon_href != url:
            result["warnings"].append(f"Canonical ({canon_href}) != page URL ({final_url})")
        else:
            result["passed"].append("Canonical tag present and matches URL")

    # ── Robots meta tag ───────────────────────────────────────────────────
    robots_meta = soup.find("meta", attrs={"name": re.compile("robots", re.I)})
    if robots_meta:
        content = robots_meta.get("content", "").lower()
        result["robots_meta"] = content
        if "noindex" in content:
            result["issues"].append(f"🚨 Page has robots noindex: '{content}' - Search engines will not index this page!")
        if "nofollow" in content:
            result["warnings"].append(f"Page has robots nofollow: '{content}'")

    # ── H1 ─────────────────────────────────────────────────────────────────
    h1_tags = soup.find_all("h1")
    result["h1_count"] = len(h1_tags)
    result["h1_texts"] = [h.get_text(strip=True) for h in h1_tags]
    if not h1_tags:
        result["issues"].append("MISSING: No H1 tag found")
    elif len(h1_tags) > 1:
        result["warnings"].append(f"Multiple H1 tags ({len(h1_tags)}): {result['h1_texts']}")
    else:
        result["passed"].append(f"Single H1: '{h1_tags[0].get_text(strip=True)[:60]}'")

    # Check heading hierarchy
    headings = []
    for level in range(1, 7):
        for h in soup.find_all(f"h{level}"):
            headings.append((level, h.get_text(strip=True)[:60]))
    result["heading_count"] = len(headings)
    # Check for skipped heading levels
    prev_level = 0
    for (level, text) in headings:
        if level > prev_level + 1 and prev_level > 0:
            result["warnings"].append(f"Heading level skipped: H{prev_level} → H{level} ('{text}')")
        prev_level = level

    # ── Word Count ────────────────────────────────────────────────────────
    body = soup.find("body")
    if body:
        text = body.get_text(separator=" ", strip=True)
        word_count = len(text.split())
        result["word_count"] = word_count
        if word_count < 300:
            result["warnings"].append(f"Thin content: only {word_count} words (recommended: 300+)")
        elif word_count > 200:
            result["passed"].append(f"Word count OK: {word_count} words")

    # ── Open Graph ────────────────────────────────────────────────────────
    og_title = soup.find("meta", property="og:title")
    og_desc  = soup.find("meta", property="og:description")
    og_image = soup.find("meta", property="og:image")
    og_url   = soup.find("meta", property="og:url")
    result["og_tags"] = {
        "og:title":       og_title.get("content") if og_title else None,
        "og:description": og_desc.get("content") if og_desc else None,
        "og:image":       og_image.get("content") if og_image else None,
        "og:url":         og_url.get("content") if og_url else None,
    }
    missing_og = [k for k, v in result["og_tags"].items() if not v]
    if missing_og:
        result["warnings"].append(f"Missing Open Graph tags: {', '.join(missing_og)}")
    else:
        result["passed"].append("All key Open Graph tags present")

    # ── Twitter Card ──────────────────────────────────────────────────────
    tw_card = soup.find("meta", attrs={"name": "twitter:card"})
    result["twitter_card"] = tw_card.get("content") if tw_card else None
    if not tw_card:
        result["warnings"].append("Missing twitter:card meta tag")

    # ── Structured Data (JSON-LD) ─────────────────────────────────────────
    ld_scripts = soup.find_all("script", type="application/ld+json")
    result["structured_data_count"] = len(ld_scripts)
    ld_types = []
    for script in ld_scripts:
        try:
            data = json.loads(script.string or "{}")
            ld_types.append(data.get("@type", "Unknown"))
        except:
            result["warnings"].append("Invalid JSON-LD structured data found")
    result["structured_data_types"] = ld_types
    if not ld_scripts:
        result["warnings"].append("No JSON-LD structured data found")
    else:
        result["passed"].append(f"Structured data present: {ld_types}")

    # ── Image alt text duplicates check ──────────────────────────────────
    alt_texts = [img.get("alt", "") for img in soup.find_all("img") if img.get("alt")]
    dup_alts  = {a: c for a, c in Counter(alt_texts).items() if c > 3 and a}
    if dup_alts:
        result["warnings"].append(f"Duplicate alt text used too many times: {list(dup_alts.items())[:3]}")

    # ── URL Issues ────────────────────────────────────────────────────────
    parsed = urlparse(url)
    if len(parsed.path) > 100:
        result["warnings"].append(f"URL is very long ({len(parsed.path)} chars)")
    if "_" in parsed.path:
        result["warnings"].append("URL uses underscores (prefer hyphens for SEO)")

    return result

# ─── Main ─────────────────────────────────────────────────────────────────────

def run_seo_audit():
    session = requests.Session()
    session.headers.update(HEADERS)
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  🔍  SEO ANALYSER")
    print(f"{'='*60}{Style.RESET_ALL}\n")

    # ── robots.txt ─────────────────────────────────────────────────────────
    print(f"{Fore.YELLOW}[1/3] Checking robots.txt...{Style.RESET_ALL}")
    robots = check_robots_txt(session, BASE_URL)
    if robots["found"]:
        print(f"  {Fore.GREEN}✅ robots.txt found{Style.RESET_ALL}")
        print(f"  Disallowed paths: {len(robots['disallowed_paths'])}")
        for p in robots["disallowed_paths"][:5]:
            print(f"    - {p}")
        if robots["has_sitemap"]:
            print(f"  {Fore.GREEN}✅ Sitemap referenced: {robots['sitemap_url']}{Style.RESET_ALL}")
        else:
            print(f"  {Fore.RED}❌ No Sitemap referenced in robots.txt{Style.RESET_ALL}")
    else:
        print(f"  {Fore.RED}❌ robots.txt NOT found or returned error{Style.RESET_ALL}")

    # ── sitemap.xml ────────────────────────────────────────────────────────
    print(f"\n{Fore.YELLOW}[2/3] Checking sitemap.xml...{Style.RESET_ALL}")
    sitemap = check_sitemap(session, robots.get("sitemap_url"))
    if sitemap["found"]:
        print(f"  {Fore.GREEN}✅ Sitemap found: {sitemap['url']}{Style.RESET_ALL}")
        if sitemap["is_index"]:
            print(f"  Sitemap Index with {len(sitemap['child_sitemaps'])} child sitemaps")
            for cs in sitemap["child_sitemaps"][:3]:
                print(f"    - {cs}")
        else:
            print(f"  URL count     : {sitemap['url_count']}")
            print(f"  Has <lastmod> : {sitemap['has_lastmod']}")
            print(f"  Has <priority>: {sitemap['has_priority']}")
    else:
        print(f"  {Fore.RED}❌ sitemap.xml NOT found{Style.RESET_ALL}")

    # ── Per-page SEO ───────────────────────────────────────────────────────
    print(f"\n{Fore.YELLOW}[3/3] Analysing SEO for {len(SEED_URLS)} pages...{Style.RESET_ALL}\n")
    all_results = []
    titles       = []
    meta_descs   = []

    for url in SEED_URLS:
        print(f"  🔍 {url}")
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            if "text/html" not in resp.headers.get("Content-Type", ""):
                continue
            result = analyse_page_seo(url, resp.text, resp.url)
            all_results.append(result)

            titles.append(result.get("title", ""))
            meta_descs.append(result.get("meta_description", ""))

            for issue in result["issues"]:
                print(f"     {Fore.RED}❌ {issue}{Style.RESET_ALL}")
            for warn in result["warnings"]:
                print(f"     {Fore.YELLOW}⚠️  {warn}{Style.RESET_ALL}")
            if not result["issues"] and not result["warnings"]:
                print(f"     {Fore.GREEN}✅ No major SEO issues{Style.RESET_ALL}")

            time.sleep(CRAWL_DELAY_SECONDS)
        except Exception as e:
            print(f"     {Fore.RED}❌ Error: {e}{Style.RESET_ALL}")

    # ── Cross-page Duplicate Checks ────────────────────────────────────────
    print(f"\n{Fore.YELLOW}Checking for duplicate titles and meta descriptions...{Style.RESET_ALL}")
    dup_titles = {t: c for t, c in Counter(titles).items() if c > 1 and t}
    dup_metas  = {m: c for m, c in Counter(meta_descs).items() if c > 1 and m}
    if dup_titles:
        print(f"  {Fore.RED}❌ Duplicate page titles found:{Style.RESET_ALL}")
        for title, count in dup_titles.items():
            print(f"     '{title[:60]}' used {count} times")
    if dup_metas:
        print(f"  {Fore.RED}❌ Duplicate meta descriptions found:{Style.RESET_ALL}")
        for desc, count in dup_metas.items():
            print(f"     '{desc[:80]}' used {count} times")

    # ── Save Reports ──────────────────────────────────────────────────────
    csv_path  = os.path.join(output_dir, f"seo_{timestamp}.csv")
    json_path = os.path.join(output_dir, f"seo_{timestamp}.json")

    csv_rows = []
    for r in all_results:
        csv_rows.append({
            "url":              r["url"],
            "title":            r.get("title", "")[:100],
            "title_len":        len(r.get("title", "")),
            "meta_desc":        r.get("meta_description", "")[:100],
            "meta_desc_len":    len(r.get("meta_description", "")),
            "h1_count":         r.get("h1_count", 0),
            "h1_text":          str(r.get("h1_texts", []))[:100],
            "word_count":       r.get("word_count", 0),
            "structured_data":  len(r.get("structured_data_types", [])),
            "issues_count":     len(r.get("issues", [])),
            "warnings_count":   len(r.get("warnings", [])),
            "issues":           "; ".join(r.get("issues", []))[:200],
            "warnings":         "; ".join(r.get("warnings", []))[:200],
        })

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        if csv_rows:
            writer = csv.DictWriter(f, fieldnames=csv_rows[0].keys())
            writer.writeheader()
            writer.writerows(csv_rows)

    with open(json_path, "w", encoding="utf-8") as f:
        full_data = {
            "robots_txt": robots,
            "sitemap": sitemap,
            "pages": all_results,
            "duplicate_titles": list(dup_titles.items()),
            "duplicate_meta_descs": list(dup_metas.items()),
        }
        json.dump(full_data, f, indent=2, ensure_ascii=False, default=str)

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  📊  SEO SUMMARY")
    print(f"{'='*60}{Style.RESET_ALL}")
    total_issues   = sum(len(r.get("issues", [])) for r in all_results)
    total_warnings = sum(len(r.get("warnings", [])) for r in all_results)
    print(f"  Pages analysed     : {len(all_results)}")
    print(f"  Critical issues    : {Fore.RED}{total_issues}{Style.RESET_ALL}")
    print(f"  Warnings           : {Fore.YELLOW}{total_warnings}{Style.RESET_ALL}")
    print(f"  Duplicate titles   : {Fore.RED}{len(dup_titles)}{Style.RESET_ALL}")
    print(f"  Duplicate meta desc: {Fore.RED}{len(dup_metas)}{Style.RESET_ALL}")
    print(f"\n  Reports saved:")
    print(f"    • {csv_path}")
    print(f"    • {json_path}")


if __name__ == "__main__":
    run_seo_audit()
