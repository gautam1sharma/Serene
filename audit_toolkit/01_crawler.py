"""
=============================================================
  Script 1: Web Crawler & Broken Link Checker
  hyundai_crawler.py
=============================================================
  What it does:
  - Crawls all reachable pages from the seed URLs
  - Checks every internal & external link for HTTP status
  - Detects 404s, redirects, server errors, and dead links
  - Reports pages that are too slow (high TTFB)
  - Outputs: audit_reports/broken_links.csv and crawl_map.json
=============================================================
"""

import sys, os, csv, json, time, re
from urllib.parse import urljoin, urlparse, urldefrag
from datetime import datetime
from collections import defaultdict

import requests
from bs4 import BeautifulSoup
from colorama import init, Fore, Style
from tqdm import tqdm

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from audit_toolkit.config import *

init(autoreset=True)

# ─── Helpers ────────────────────────────────────────────────────────────────

def is_same_domain(url: str, host: str) -> bool:
    try:
        parsed = urlparse(url)
        return parsed.netloc == host or parsed.netloc.endswith("." + TARGET_DOMAIN)
    except:
        return False

def normalize_url(url: str) -> str:
    url, _ = urldefrag(url)  # Strip fragment (#section)
    return url.rstrip("/")

def get_session() -> requests.Session:
    sess = requests.Session()
    sess.headers.update(HEADERS)
    return sess

def check_link(session: requests.Session, url: str) -> dict:
    """Perform a HEAD request (fallback to GET) and return status info."""
    result = {
        "url": url,
        "status_code": None,
        "redirect_url": None,
        "ttfb_ms": None,
        "error": None,
    }
    try:
        start = time.time()
        resp = session.head(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        # Some servers don't support HEAD; retry with GET
        if resp.status_code in (405, 501):
            resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True, stream=True)
            resp.close()
        ttfb = round((time.time() - start) * 1000, 1)
        result["status_code"] = resp.status_code
        result["ttfb_ms"] = ttfb
        if resp.history:
            result["redirect_url"] = resp.url
    except requests.exceptions.SSLError as e:
        result["error"] = f"SSL Error: {str(e)[:80]}"
    except requests.exceptions.ConnectionError as e:
        result["error"] = f"Connection Error: {str(e)[:80]}"
    except requests.exceptions.Timeout:
        result["error"] = "Timeout"
    except Exception as e:
        result["error"] = f"Error: {str(e)[:80]}"
    return result

# ─── Crawler ────────────────────────────────────────────────────────────────

def extract_links(html: str, base_url: str) -> list[str]:
    soup = BeautifulSoup(html, "lxml")
    links = set()
    for tag in soup.find_all(["a", "link"], href=True):
        href = tag["href"].strip()
        if not href or href.startswith(("javascript:", "mailto:", "tel:", "data:")):
            continue
        full_url = normalize_url(urljoin(base_url, href))
        if full_url.startswith("http"):
            links.add(full_url)
    return list(links)

def crawl() -> dict:
    session = get_session()
    visited     = set()    # Pages we've fully crawled
    link_queue  = list(SEED_URLS)
    crawl_map   = {}       # url -> {status, links, title, ttfb}
    all_links   = defaultdict(list)  # link -> [pages that reference it]
    link_results = {}      # link -> check result

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  🕷️  HYUNDAI WEBSITE CRAWLER & BROKEN LINK CHECKER")
    print(f"{'='*60}{Style.RESET_ALL}\n")
    print(f"  Seed URLs  : {len(SEED_URLS)}")
    print(f"  Max pages  : {MAX_PAGES_TO_CRAWL}")
    print(f"  Crawl delay: {CRAWL_DELAY_SECONDS}s\n")

    pages_crawled = 0
    with tqdm(total=MAX_PAGES_TO_CRAWL, desc="Crawling pages", unit="page") as pbar:
        while link_queue and pages_crawled < MAX_PAGES_TO_CRAWL:
            url = normalize_url(link_queue.pop(0))
            if url in visited:
                continue
            if not is_same_domain(url, TARGET_HOST):
                continue
            visited.add(url)

            try:
                start = time.time()
                resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
                ttfb = round((time.time() - start) * 1000, 1)

                content_type = resp.headers.get("Content-Type", "")
                is_html = "text/html" in content_type

                soup = BeautifulSoup(resp.text, "lxml") if is_html else None
                title = soup.find("title").get_text(strip=True) if (soup and soup.find("title")) else ""

                page_links = extract_links(resp.text, url) if is_html else []
                for link in page_links:
                    all_links[link].append(url)
                    if is_same_domain(link, TARGET_HOST) and link not in visited:
                        link_queue.append(link)

                crawl_map[url] = {
                    "status_code": resp.status_code,
                    "ttfb_ms":     ttfb,
                    "title":       title,
                    "link_count":  len(page_links),
                    "is_html":     is_html,
                    "final_url":   resp.url if resp.url != url else None,
                }

                status_color = Fore.GREEN if resp.status_code == 200 else Fore.RED
                pbar.set_postfix({"url": url[-50:], "status": resp.status_code})
                pages_crawled += 1
                pbar.update(1)
                time.sleep(CRAWL_DELAY_SECONDS)

            except Exception as e:
                crawl_map[url] = {
                    "status_code": None,
                    "error": str(e)[:120],
                    "ttfb_ms": None,
                    "title": "",
                    "link_count": 0,
                    "is_html": False,
                    "final_url": None,
                }
                pages_crawled += 1
                pbar.update(1)

    print(f"\n{Fore.YELLOW}🔗 Checking {len(all_links)} unique links...{Style.RESET_ALL}\n")

    # Now check all discovered (external) links too - but only HEAD
    with tqdm(total=len(all_links), desc="Checking links", unit="link") as pbar:
        for link in list(all_links.keys()):
            if link not in link_results:
                link_results[link] = check_link(session, link)
            pbar.update(1)
            time.sleep(0.3)

    return crawl_map, all_links, link_results

# ─── Report Generation ──────────────────────────────────────────────────────

def generate_reports(crawl_map, all_links, link_results, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # ── 1. Broken Links CSV ────────────────────────────────────────────────
    broken_links_path = os.path.join(output_dir, f"broken_links_{timestamp}.csv")
    broken_count = 0
    slow_pages = []

    with open(broken_links_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["URL", "Status Code", "Error", "TTFB (ms)", "Redirect To", "Found On Pages"])

        for url, result in sorted(link_results.items()):
            status = result.get("status_code")
            is_broken = (status is None or status >= 400 or result.get("error"))
            if is_broken:
                found_on = "; ".join(all_links.get(url, [])[:3])
                writer.writerow([
                    url,
                    status or "N/A",
                    result.get("error", ""),
                    result.get("ttfb_ms", ""),
                    result.get("redirect_url", ""),
                    found_on,
                ])
                broken_count += 1

    # ── 2. Slow Pages ─────────────────────────────────────────────────────
    slow_pages_path = os.path.join(output_dir, f"slow_pages_{timestamp}.csv")
    with open(slow_pages_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["URL", "TTFB (ms)", "Status", "Title"])
        for url, info in sorted(crawl_map.items(), key=lambda x: x[1].get("ttfb_ms") or 0, reverse=True):
            ttfb = info.get("ttfb_ms")
            if ttfb and ttfb > 2000:
                writer.writerow([url, ttfb, info.get("status_code"), info.get("title")])
                slow_pages.append((url, ttfb))

    # ── 3. Full Crawl Map JSON ────────────────────────────────────────────
    crawl_map_path = os.path.join(output_dir, f"crawl_map_{timestamp}.json")
    with open(crawl_map_path, "w", encoding="utf-8") as f:
        json.dump(crawl_map, f, indent=2, ensure_ascii=False)

    # ── 4. Console Summary ────────────────────────────────────────────────
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  📊  CRAWLER RESULTS SUMMARY")
    print(f"{'='*60}{Style.RESET_ALL}")
    print(f"  Pages crawled      : {Fore.WHITE}{len(crawl_map)}{Style.RESET_ALL}")
    print(f"  Unique links found : {Fore.WHITE}{len(all_links)}{Style.RESET_ALL}")
    print(f"  Broken links       : {Fore.RED}{broken_count}{Style.RESET_ALL}")
    print(f"  Slow pages (>2s)   : {Fore.YELLOW}{len(slow_pages)}{Style.RESET_ALL}")

    # HTTP status distribution
    status_dist = defaultdict(int)
    for url, result in link_results.items():
        code = result.get("status_code") or "Error"
        status_dist[str(code)] += 1
    print(f"\n  HTTP Status Distribution:")
    for code, count in sorted(status_dist.items()):
        color = Fore.GREEN if code == "200" else (Fore.RED if str(code) >= "400" else Fore.YELLOW)
        print(f"    {color}{code}: {count} links{Style.RESET_ALL}")

    print(f"\n  Reports saved to {Fore.CYAN}{output_dir}/{Style.RESET_ALL}")
    print(f"    • {broken_links_path}")
    print(f"    • {slow_pages_path}")
    print(f"    • {crawl_map_path}")

    return broken_count

# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), OUTPUT_DIR)
    crawl_map, all_links, link_results = crawl()
    generate_reports(crawl_map, all_links, link_results, output_dir)
