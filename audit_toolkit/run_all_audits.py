"""
=============================================================
  🚀 HYUNDAI INDIA WEBSITE AUDIT TOOLKIT - MASTER LAUNCHER
  run_all_audits.py
=============================================================
  Usage:
    python run_all_audits.py              → Run ALL audits
    python run_all_audits.py --crawl      → Crawler only
    python run_all_audits.py --security   → Security only
    python run_all_audits.py --access     → Accessibility only
    python run_all_audits.py --seo        → SEO only
    python run_all_audits.py --content    → Content/Vuln only
    python run_all_audits.py --perf       → Performance only
    python run_all_audits.py --report     → Generate HTML report from existing results

  NOTE: Running all audits takes ~15-30 minutes due to
        respectful rate limiting. Please be patient.
=============================================================
"""

import sys, os, json, glob, csv, argparse
from datetime import datetime

from colorama import init, Fore, Style

init(autoreset=True)

# ─── Banner ──────────────────────────────────────────────────────────────────

BANNER = f"""
{Fore.CYAN}
  ██╗  ██╗██╗   ██╗██╗   ██╗███╗   ██╗██████╗  █████╗ ██╗
  ██║  ██║╚██╗ ██╔╝██║   ██║████╗  ██║██╔══██╗██╔══██╗██║
  ███████║ ╚████╔╝ ██║   ██║██╔██╗ ██║██║  ██║███████║██║
  ██╔══██║  ╚██╔╝  ██║   ██║██║╚██╗██║██║  ██║██╔══██║██║
  ██║  ██║   ██║   ╚██████╔╝██║ ╚████║██████╔╝██║  ██║██║
  ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝
{Style.RESET_ALL}
{Fore.WHITE}  Website Audit Toolkit — Hyundai Autoever QA Team{Style.RESET_ALL}
{Fore.YELLOW}  Target: https://www.hyundai.com/in/en{Style.RESET_ALL}
"""

# ─── HTML Report Generator ────────────────────────────────────────────────────

def generate_html_report(output_dir: str):
    """Reads all generated CSVs and creates a unified interactive HTML dashboard."""

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    html_path = os.path.join(os.path.dirname(output_dir), f"AUDIT_DASHBOARD_{timestamp}.html")

    def read_latest_csv(pattern):
        files = sorted(glob.glob(os.path.join(output_dir, pattern)))
        if not files:
            return []
        with open(files[-1], encoding="utf-8") as f:
            return list(csv.DictReader(f))

    security_rows    = read_latest_csv("security_headers_*.csv")
    access_rows      = read_latest_csv("accessibility_*.csv")
    seo_rows         = read_latest_csv("seo_*.csv")
    content_rows     = read_latest_csv("content_*.csv")
    perf_rows        = read_latest_csv("performance_*.csv")
    broken_rows      = read_latest_csv("broken_links_*.csv")

    def make_table(rows, title, color):
        if not rows:
            return f'<div class="section"><h2>{title}</h2><p class="empty">No data available - run the corresponding audit script first.</p></div>'
        headers = list(rows[0].keys())
        rows_html = ""
        for row in rows:
            cells = ""
            for h in headers:
                val = row.get(h, "")
                # Color-code based on value
                cell_class = ""
                try:
                    fval = float(val)
                    if h in ("issues_count", "critical_vulns", "imgs_no_alt", "buttons_no_label"):
                        cell_class = "bad" if fval > 0 else "good"
                    elif h == "score":
                        cell_class = "good" if fval >= 80 else ("warn" if fval >= 50 else "bad")
                    elif h == "ttfb_ms":
                        cell_class = "good" if fval < 800 else ("warn" if fval < 1500 else "bad")
                except:
                    if h == "grade":
                        cell_class = "good" if val in ("A+","A") else ("warn" if val in ("B","C") else "bad")

                cells += f'<td class="{cell_class}">{val[:120] if isinstance(val, str) else val}</td>'
            rows_html += f"<tr>{cells}</tr>"

        header_html = "".join(f"<th>{h.replace('_',' ').title()}</th>" for h in headers)
        return f"""
        <div class="section">
            <h2 style="border-left-color:{color}">{title}
                <span class="badge" style="background:{color}">{len(rows)} pages</span>
            </h2>
            <div class="table-wrap">
                <table>
                    <thead><tr>{header_html}</tr></thead>
                    <tbody>{rows_html}</tbody>
                </table>
            </div>
        </div>"""

    def count_issues(rows, col):
        try:
            return sum(int(r.get(col, 0)) for r in rows)
        except:
            return 0

    total_issues = (count_issues(security_rows, "headers_missing") +
                    count_issues(access_rows, "issues_count") +
                    count_issues(seo_rows, "issues_count") +
                    count_issues(content_rows, "issues_count") +
                    count_issues(perf_rows, "issues_count") +
                    len(broken_rows))

    critical_count = count_issues(content_rows, "critical_vulns")
    broken_count   = len(broken_rows)
    pages_audited  = max(len(access_rows), len(seo_rows), len(perf_rows))

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hyundai India Website Audit Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {{
    --bg: #0f1117; --surface: #1a1d27; --accent: #00b4d8; --accent2: #0077B6;
    --text: #e8eaf0; --muted: #8892a4; --good: #2ecc71; --warn: #f39c12; --bad: #e74c3c;
    --border: #2a2d3e;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }}
  header {{ background: linear-gradient(135deg, #0077B6, #00b4d8); padding: 40px; text-align: center; }}
  header h1 {{ font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 8px; }}
  header p {{ color: rgba(255,255,255,0.85); font-size: 1rem; }}
  .stats-bar {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px;
                padding: 24px 40px; background: var(--surface); border-bottom: 1px solid var(--border); }}
  .stat {{ text-align: center; }}
  .stat .value {{ font-size: 2.5rem; font-weight: 700; line-height: 1; }}
  .stat .label {{ font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }}
  .stat.bad  .value {{ color: var(--bad); }}
  .stat.warn .value {{ color: var(--warn); }}
  .stat.good .value {{ color: var(--good); }}
  .stat.info .value {{ color: var(--accent); }}
  main {{ padding: 32px 40px; max-width: 1600px; margin: 0 auto; }}
  .section {{ background: var(--surface); border-radius: 12px; padding: 24px; margin-bottom: 28px;
               border: 1px solid var(--border); }}
  .section h2 {{ font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;
                 padding-left: 16px; border-left: 4px solid var(--accent); display: flex;
                 align-items: center; gap: 12px; }}
  .badge {{ font-size: 0.7rem; background: var(--accent); color: #fff; padding: 2px 10px;
             border-radius: 20px; font-weight: 500; }}
  .empty {{ color: var(--muted); font-style: italic; padding: 20px 0; }}
  .table-wrap {{ overflow-x: auto; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 0.8rem; }}
  th {{ background: rgba(255,255,255,0.05); color: var(--muted); padding: 10px 12px;
         text-align: left; font-weight: 500; white-space: nowrap; border-bottom: 1px solid var(--border); }}
  td {{ padding: 9px 12px; border-bottom: 1px solid rgba(255,255,255,0.04);
         word-break: break-all; max-width: 300px; }}
  tr:hover td {{ background: rgba(255,255,255,0.03); }}
  td.good {{ color: var(--good); font-weight: 500; }}
  td.warn {{ color: var(--warn); font-weight: 500; }}
  td.bad  {{ color: var(--bad); font-weight: 500; }}
  .nav {{ display: flex; gap: 12px; padding: 16px 40px; background: var(--surface);
           border-bottom: 1px solid var(--border); flex-wrap: wrap; position: sticky; top: 0; z-index: 100; }}
  .nav a {{ color: var(--muted); text-decoration: none; font-size: 0.8rem; padding: 6px 14px;
             border-radius: 6px; transition: all 0.2s; border: 1px solid transparent; }}
  .nav a:hover {{ color: var(--accent); border-color: var(--accent); }}
  footer {{ text-align: center; padding: 24px; color: var(--muted); font-size: 0.8rem; border-top: 1px solid var(--border); }}
</style>
</head>
<body>
<header>
  <h1>🚗 Hyundai India Website Audit Dashboard</h1>
  <p>Target: https://www.hyundai.com/in/en &nbsp;|&nbsp; Generated: {datetime.now().strftime('%d %B %Y, %I:%M %p')}</p>
</header>
<nav class="nav">
  <a href="#security">🔒 Security</a>
  <a href="#accessibility">♿ Accessibility</a>
  <a href="#seo">🔍 SEO</a>
  <a href="#content">📝 Content</a>
  <a href="#performance">⚡ Performance</a>
  <a href="#broken">🔗 Broken Links</a>
</nav>
<div class="stats-bar">
  <div class="stat bad"><div class="value">{total_issues}</div><div class="label">Total Issues</div></div>
  <div class="stat bad"><div class="value">{critical_count}</div><div class="label">Critical Vulns</div></div>
  <div class="stat bad"><div class="value">{broken_count}</div><div class="label">Broken Links</div></div>
  <div class="stat info"><div class="value">{pages_audited}</div><div class="label">Pages Audited</div></div>
</div>
<main>
  <div id="security">{make_table(security_rows, "🔒 Security Headers Audit", "#e74c3c")}</div>
  <div id="accessibility">{make_table(access_rows, "♿ Accessibility Audit (WCAG 2.1)", "#9b59b6")}</div>
  <div id="seo">{make_table(seo_rows, "🔍 SEO Analysis", "#f39c12")}</div>
  <div id="content">{make_table(content_rows, "📝 Content & Vulnerability Audit", "#e67e22")}</div>
  <div id="performance">{make_table(perf_rows, "⚡ Performance & Network Audit", "#27ae60")}</div>
  <div id="broken">{make_table(broken_rows, "🔗 Broken Links Report", "#3498db")}</div>
</main>
<footer>
  Hyundai Autoever QA Audit — For internal use only — {datetime.now().year}
</footer>
</body>
</html>"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"\n  {Fore.GREEN}✅ Interactive HTML Dashboard saved:{Style.RESET_ALL}")
    print(f"  {Fore.CYAN}  → {html_path}{Style.RESET_ALL}")
    print(f"     Open this file in your browser to view the full report.\n")
    return html_path

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Hyundai India Website Audit Toolkit",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--crawl",    action="store_true", help="Run web crawler & broken link checker")
    parser.add_argument("--security", action="store_true", help="Run security headers audit")
    parser.add_argument("--access",   action="store_true", help="Run accessibility audit (WCAG 2.1)")
    parser.add_argument("--seo",      action="store_true", help="Run SEO analysis")
    parser.add_argument("--content",  action="store_true", help="Run content & vuln analysis")
    parser.add_argument("--perf",     action="store_true", help="Run performance audit")
    parser.add_argument("--report",   action="store_true", help="Only generate HTML report from existing data")
    args = parser.parse_args()

    script_dir  = os.path.dirname(os.path.abspath(__file__))
    output_dir  = os.path.join(script_dir, "..", OUTPUT_DIR)
    toolkit_dir = os.path.join(script_dir, "audit_toolkit")

    sys.path.insert(0, script_dir)
    from audit_toolkit.config import OUTPUT_DIR

    print(BANNER)

    # If no args given, run all
    run_all = not any([args.crawl, args.security, args.access, args.seo,
                        args.content, args.perf, args.report])

    results = {}

    if args.report:
        generate_html_report(os.path.join(script_dir, "..", OUTPUT_DIR))
        return

    if run_all or args.security:
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"Running Script 2/6: Security Headers Audit")
        print(f"{'='*60}{Style.RESET_ALL}")
        from audit_toolkit.security_headers_02 import run_security_audit
        from audit_toolkit import security_headers_02 as sh
        sh.run_security_audit()

    if run_all or args.access:
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"Running Script 3/6: Accessibility Audit")
        print(f"{'='*60}{Style.RESET_ALL}")
        from audit_toolkit.accessibility_03 import run_accessibility_audit
        from audit_toolkit import accessibility_03 as acc
        acc.run_accessibility_audit()

    if run_all or args.seo:
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"Running Script 4/6: SEO Analysis")
        print(f"{'='*60}{Style.RESET_ALL}")
        from audit_toolkit.seo_checker_04 import run_seo_audit
        from audit_toolkit import seo_checker_04 as seo
        seo.run_seo_audit()

    if run_all or args.content:
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"Running Script 5/6: Content & Vulnerability Analysis")
        print(f"{'='*60}{Style.RESET_ALL}")
        from audit_toolkit.content_checker_05 import run_content_audit
        from audit_toolkit import content_checker_05 as cc
        cc.run_content_audit()

    if run_all or args.perf:
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"Running Script 6/6: Performance Audit")
        print(f"{'='*60}{Style.RESET_ALL}")
        from audit_toolkit.performance_06 import run_performance_audit
        from audit_toolkit import performance_06 as perf
        perf.run_performance_audit()

    if run_all or args.crawl:
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"Running Script 1/6: Crawler & Broken Link Checker")
        print(f"⚠️  This may take 10-20 minutes (respects crawl delay)")
        print(f"{'='*60}{Style.RESET_ALL}")
        from audit_toolkit.crawler_01 import crawl, generate_reports
        from audit_toolkit import crawler_01 as cw
        crawl_map, all_links, link_results = cw.crawl()
        cw.generate_reports(crawl_map, all_links, link_results,
                              os.path.join(script_dir, "..", OUTPUT_DIR))

    # Always generate HTML report at end
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"Generating Interactive HTML Dashboard...")
    print(f"{'='*60}{Style.RESET_ALL}")
    output_dir_abs = os.path.abspath(os.path.join(script_dir, "..", OUTPUT_DIR))
    html_path = generate_html_report(output_dir_abs)

    print(f"\n{Fore.GREEN}{'='*60}")
    print(f"  ✅ ALL AUDITS COMPLETE!")
    print(f"{'='*60}{Style.RESET_ALL}")
    print(f"  Reports → {Fore.CYAN}{output_dir_abs}{Style.RESET_ALL}")
    print(f"  Dashboard → {Fore.CYAN}{html_path}{Style.RESET_ALL}\n")


if __name__ == "__main__":
    # Run from the audit_toolkit directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, os.path.dirname(script_dir))

    # Dynamically call each sub-module
    from audit_toolkit.config import OUTPUT_DIR
    output_dir_abs = os.path.abspath(os.path.join(script_dir, "..", OUTPUT_DIR))
    os.makedirs(output_dir_abs, exist_ok=True)

    print(BANNER)
    print(f"  {Fore.WHITE}Running all audit modules...{Style.RESET_ALL}\n")

    modules = [
        ("02_security_headers", "run_security_audit"),
        ("03_accessibility",    "run_accessibility_audit"),
        ("04_seo_checker",      "run_seo_audit"),
        ("05_content_checker",  "run_content_audit"),
        ("06_performance",      "run_performance_audit"),
        ("07_vulnerability_passive", "run_vulnerability_audit"),
    ]

    for fname, func_name in modules:
        module_path = os.path.join(script_dir, f"{fname}.py")
        print(f"\n{Fore.CYAN}  ▶  Running: {fname.py}{Style.RESET_ALL}")
        try:
            import importlib.util
            spec = importlib.util.spec_from_file_location(fname, module_path)
            mod  = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            getattr(mod, func_name)()
        except Exception as e:
            print(f"  {Fore.RED}❌ Error in {fname}: {e}{Style.RESET_ALL}")

    # Crawler runs last (takes longest)
    print(f"\n{Fore.YELLOW}  ▶  Running: 01_crawler (this takes longest - crawling up to {__import__('audit_toolkit.config', fromlist=['MAX_PAGES_TO_CRAWL']).MAX_PAGES_TO_CRAWL} pages...){Style.RESET_ALL}")
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("01_crawler", os.path.join(script_dir, "01_crawler.py"))
        mod  = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        crawl_map, all_links, link_results = mod.crawl()
        mod.generate_reports(crawl_map, all_links, link_results, output_dir_abs)
    except Exception as e:
        print(f"  {Fore.RED}❌ Error in crawler: {e}{Style.RESET_ALL}")

    generate_html_report(output_dir_abs)
