"""
=============================================================
  Script 6: Performance & Network Analyser
  06_performance.py
=============================================================
  What it measures:
  - Time to first byte (TTFB) for all seed pages
  - Page size (HTML, total transfer estimate)
  - Number of requests per page (scripts, stylesheets, images)
  - Render-blocking resources count
  - Image optimization opportunities (large images without lazy-loading)
  - Gzip/Brotli compression check
  - HTTP/2 support detection
  - Cache-Control headers analysis
  - Third-party script count and domains
  - Page weight breakdown by resource type
  Outputs: audit_reports/performance_report.csv + .txt
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

FIRST_PARTY_DOMAINS = {TARGET_HOST, "www.hyundai.com", "hyundai.com"}
RENDER_BLOCKING_MEDIA = re.compile(r'<(?:script|link)[^>]*(?:src|href)=["\']([^"\']+)["\']', re.I)

# ─── Page Performance Analysis ───────────────────────────────────────────────

def analyse_page_performance(url: str, session: requests.Session) -> dict:
    result = {
        "url": url,
        "ttfb_ms": None,
        "total_size_bytes": None,
        "status_code": None,
        "http_version": None,
        "gzip": False,
        "brotli": False,
        "cache_control": None,
        "etag": None,
        "issues": [],
        "warnings": [],
        "info": [],
        "scripts": {"total": 0, "inline": 0, "external": 0, "render_blocking": 0, "third_party": 0},
        "stylesheets": {"total": 0, "inline": 0, "external": 0, "render_blocking": 0},
        "images": {"total": 0, "no_lazy": 0, "no_dimensions": 0},
        "iframes": 0,
        "third_party_domains": [],
    }

    try:
        start = time.time()
        resp  = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        ttfb  = round((time.time() - start) * 1000, 1)

        result["ttfb_ms"]       = ttfb
        result["status_code"]   = resp.status_code
        result["total_size_bytes"] = len(resp.content)

        # HTTP version
        result["http_version"] = getattr(resp.raw, "version", None)
        # 20 = HTTP/2, 11 = HTTP/1.1 in urllib3
        if result["http_version"] == 20:
            result["info"].append("✅ HTTP/2 supported")
        elif result["http_version"] == 11:
            result["warnings"].append("⚠️  Using HTTP/1.1 - consider upgrading to HTTP/2")

        # Compression
        content_encoding = resp.headers.get("Content-Encoding", "").lower()
        result["gzip"]   = "gzip" in content_encoding
        result["brotli"] = "br" in content_encoding
        if result["brotli"]:
            result["info"].append("✅ Brotli compression enabled")
        elif result["gzip"]:
            result["info"].append("✅ Gzip compression enabled")
        else:
            result["issues"].append("❌ No compression (neither gzip nor brotli) - wastes bandwidth")

        # Cache-Control
        cache_control = resp.headers.get("Cache-Control", "")
        result["cache_control"] = cache_control
        if not cache_control:
            result["warnings"].append("⚠️  No Cache-Control header set")
        elif "no-store" in cache_control or "no-cache" in cache_control:
            result["warnings"].append(f"⚠️  Aggressive no-cache policy: '{cache_control}'")
        else:
            result["info"].append(f"Cache-Control: {cache_control}")

        # ETag
        etag = resp.headers.get("ETag", "")
        result["etag"] = etag
        if etag:
            result["info"].append("✅ ETag header present (conditional requests supported)")
        else:
            result["warnings"].append("⚠️  No ETag header found")

        # TTFB performance thresholds
        if ttfb > 3000:
            result["issues"].append(f"❌ CRITICAL: TTFB {ttfb}ms is very slow (>3s)")
        elif ttfb > 1500:
            result["warnings"].append(f"⚠️  TTFB {ttfb}ms is slow (>1.5s, target: <800ms)")
        elif ttfb > 800:
            result["warnings"].append(f"⚠️  TTFB {ttfb}ms could be improved (target: <800ms)")
        else:
            result["info"].append(f"✅ Good TTFB: {ttfb}ms")

        # Page size analysis
        size_kb = result["total_size_bytes"] / 1024
        if size_kb > 500:
            result["issues"].append(f"❌ Large HTML payload: {size_kb:.1f} KB (target: <100 KB)")
        elif size_kb > 150:
            result["warnings"].append(f"⚠️  HTML size {size_kb:.1f} KB (consider reducing)")
        else:
            result["info"].append(f"✅ HTML size OK: {size_kb:.1f} KB")

        # Parse HTML for resources
        if "text/html" in resp.headers.get("Content-Type", ""):
            soup = BeautifulSoup(resp.text, "lxml")
            third_party_domains = set()

            # ── Scripts ──────────────────────────────────────────────────
            scripts = soup.find_all("script")
            result["scripts"]["total"] = len(scripts)
            for s in scripts:
                src = s.get("src", "")
                if src:
                    result["scripts"]["external"] += 1
                    parsed_src = urlparse(src)
                    if parsed_src.netloc and parsed_src.netloc not in FIRST_PARTY_DOMAINS:
                        result["scripts"]["third_party"] += 1
                        third_party_domains.add(parsed_src.netloc)
                    # Render-blocking: external script without async or defer
                    if not s.get("async") and not s.get("defer") and not s.get("type") == "module":
                        result["scripts"]["render_blocking"] += 1
                else:
                    result["scripts"]["inline"] += 1

            if result["scripts"]["render_blocking"] > 3:
                result["warnings"].append(
                    f"⚠️  {result['scripts']['render_blocking']} render-blocking scripts "
                    f"(add async/defer attributes)"
                )

            # ── Stylesheets ────────────────────────────────────────────────
            link_tags = soup.find_all("link", rel=lambda r: r and "stylesheet" in r)
            result["stylesheets"]["total"] = len(link_tags)
            for l in link_tags:
                href = l.get("href", "")
                if href:
                    result["stylesheets"]["external"] += 1
                    # CSS in <head> is render-blocking by default
                    parsed_href = urlparse(href)
                    if parsed_href.netloc and parsed_href.netloc not in FIRST_PARTY_DOMAINS:
                        third_party_domains.add(parsed_href.netloc)
                    # Preloaded or media-specific CSS is not render-blocking
                    if l.get("rel") and "preload" not in l.get("rel"):
                        result["stylesheets"]["render_blocking"] += 1

            # ── Images ────────────────────────────────────────────────────
            imgs = soup.find_all("img")
            result["images"]["total"] = len(imgs)
            for img in imgs:
                if not img.get("loading") and not img.get("data-src"):  # No lazy loading
                    result["images"]["no_lazy"] += 1
                if not img.get("width") or not img.get("height"):
                    result["images"]["no_dimensions"] += 1
            if result["images"]["no_lazy"] > 10:
                result["warnings"].append(
                    f"⚠️  {result['images']['no_lazy']} images without lazy-loading "
                    f"(add loading='lazy' attribute)"
                )
            if result["images"]["no_dimensions"] > 10:
                result["warnings"].append(
                    f"⚠️  {result['images']['no_dimensions']} images without width/height "
                    f"(causes Cumulative Layout Shift)"
                )

            # ── iFrames ───────────────────────────────────────────────────
            result["iframes"] = len(soup.find_all("iframe"))

            # ── Third-party domain summary ────────────────────────────────
            result["third_party_domains"] = sorted(third_party_domains)
            if len(third_party_domains) > 10:
                result["warnings"].append(
                    f"⚠️  {len(third_party_domains)} third-party domains (privacy & performance impact)"
                )
            else:
                result["info"].append(f"Third-party domains: {sorted(third_party_domains)}")

    except Exception as e:
        result["issues"].append(f"❌ Error: {str(e)[:100]}")

    return result

# ─── Main ─────────────────────────────────────────────────────────────────────

def run_performance_audit():
    session = requests.Session()
    session.headers.update(HEADERS)
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  ⚡  PERFORMANCE & NETWORK ANALYSER")
    print(f"{'='*60}{Style.RESET_ALL}\n")

    all_results = []
    csv_rows    = []

    for url in SEED_URLS:
        print(f"\n  🔍 {url}")
        result = analyse_page_performance(url, session)
        all_results.append(result)

        # Console output
        ttfb = result["ttfb_ms"]
        size_kb = (result["total_size_bytes"] or 0) / 1024
        ttfb_color = (Fore.GREEN if (ttfb or 9999) < 800 else
                      Fore.YELLOW if (ttfb or 9999) < 1500 else Fore.RED)
        print(f"     TTFB          : {ttfb_color}{ttfb}ms{Style.RESET_ALL}")
        print(f"     HTML size     : {size_kb:.1f} KB")
        print(f"     Scripts       : {result['scripts']['total']} ({result['scripts']['render_blocking']} blocking, {result['scripts']['third_party']} 3rd-party)")
        print(f"     Stylesheets   : {result['stylesheets']['total']} ({result['stylesheets']['render_blocking']} blocking)")
        print(f"     Images        : {result['images']['total']} ({result['images']['no_lazy']} without lazy-load)")
        print(f"     iFrames       : {result['iframes']}")
        print(f"     Compression   : {'Brotli' if result['brotli'] else 'Gzip' if result['gzip'] else Fore.RED + 'NONE' + Style.RESET_ALL}")
        print(f"     HTTP/2        : {'Yes (v=20)' if result['http_version'] == 20 else 'No'}")

        for issue in result["issues"]:
            print(f"     {Fore.RED}{issue}{Style.RESET_ALL}")
        for warn in result["warnings"]:
            print(f"     {Fore.YELLOW}{warn}{Style.RESET_ALL}")

        csv_rows.append({
            "url":                   url,
            "status_code":           result["status_code"],
            "ttfb_ms":               result["ttfb_ms"],
            "html_size_kb":          round(size_kb, 1),
            "gzip":                  result["gzip"],
            "brotli":                result["brotli"],
            "http_version":          result["http_version"],
            "scripts_total":         result["scripts"]["total"],
            "scripts_blocking":      result["scripts"]["render_blocking"],
            "scripts_3rd_party":     result["scripts"]["third_party"],
            "stylesheets_total":     result["stylesheets"]["total"],
            "stylesheets_blocking":  result["stylesheets"]["render_blocking"],
            "images_total":          result["images"]["total"],
            "images_no_lazy":        result["images"]["no_lazy"],
            "images_no_dimensions":  result["images"]["no_dimensions"],
            "iframes":               result["iframes"],
            "third_party_domains":   len(result["third_party_domains"]),
            "third_party_domain_list": ", ".join(result["third_party_domains"][:10]),
            "issues_count":          len(result["issues"]),
            "warnings_count":        len(result["warnings"]),
            "issues":                "; ".join(result["issues"])[:300],
        })

        time.sleep(CRAWL_DELAY_SECONDS)

    # ── Save Reports ──────────────────────────────────────────────────────
    csv_path   = os.path.join(output_dir, f"performance_{timestamp}.csv")
    json_path  = os.path.join(output_dir, f"performance_{timestamp}.json")
    txt_path   = os.path.join(output_dir, f"performance_report_{timestamp}.txt")

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        if csv_rows:
            writer = csv.DictWriter(f, fieldnames=csv_rows[0].keys())
            writer.writeheader()
            writer.writerows(csv_rows)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False, default=str)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("HYUNDAI INDIA - PERFORMANCE & NETWORK REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*70 + "\n\n")
        for r in all_results:
            f.write(f"PAGE: {r['url']}\n")
            f.write(f"  TTFB: {r['ttfb_ms']}ms | Size: {(r['total_size_bytes'] or 0)/1024:.1f}KB\n")
            f.write(f"  Compression: {'Brotli' if r['brotli'] else 'Gzip' if r['gzip'] else 'NONE'}\n")
            f.write(f"  Scripts: {r['scripts']['total']} ({r['scripts']['render_blocking']} blocking)\n")
            f.write(f"  Third-party domains: {', '.join(r['third_party_domains'])}\n")
            for issue in r["issues"]:
                f.write(f"  {issue}\n")
            for warn in r["warnings"]:
                f.write(f"  {warn}\n")
            f.write("\n")

    # Summary
    if all_results:
        valid_ttfbs = [r["ttfb_ms"] for r in all_results if r["ttfb_ms"]]
        avg_ttfb    = sum(valid_ttfbs) / len(valid_ttfbs) if valid_ttfbs else 0
        worst_page  = max(all_results, key=lambda r: r.get("ttfb_ms") or 0)
        best_page   = min(all_results, key=lambda r: r.get("ttfb_ms") or 99999)

        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"  📊  PERFORMANCE SUMMARY")
        print(f"{'='*60}{Style.RESET_ALL}")
        print(f"  Pages tested   : {len(all_results)}")
        print(f"  Avg TTFB       : {Fore.YELLOW}{avg_ttfb:.0f}ms{Style.RESET_ALL}")
        print(f"  Fastest page   : {Fore.GREEN}{best_page['url'][-50:]} ({best_page['ttfb_ms']}ms){Style.RESET_ALL}")
        print(f"  Slowest page   : {Fore.RED}{worst_page['url'][-50:]} ({worst_page['ttfb_ms']}ms){Style.RESET_ALL}")
        total_issues = sum(len(r["issues"]) for r in all_results)
        print(f"  Total issues   : {Fore.RED}{total_issues}{Style.RESET_ALL}")
        print(f"\n  Reports saved:")
        print(f"    • {csv_path}")
        print(f"    • {json_path}")
        print(f"    • {txt_path}")


if __name__ == "__main__":
    run_performance_audit()
