"""
Hyundai India Website Audit — Dashboard Generator
Reads all CSV reports from audit_reports/ and builds a unified dark-themed HTML dashboard
with a Before vs After improvement comparison section.
"""
import os, csv, glob
from datetime import datetime

OUTPUT_DIR = "audit_reports"
script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, OUTPUT_DIR)

# ─── Read CSVs ────────────────────────────────────────────────────────────────

def read_latest_csv(pattern):
    files = sorted(glob.glob(os.path.join(output_dir, pattern)))
    if not files:
        return []
    with open(files[-1], encoding="utf-8") as f:
        return list(csv.DictReader(f))

security_rows = read_latest_csv("security_headers_*.csv")
access_rows   = read_latest_csv("accessibility_*.csv")
seo_rows      = read_latest_csv("seo_*.csv")
content_rows  = read_latest_csv("content_*.csv")
perf_rows     = read_latest_csv("performance_*.csv")
broken_rows   = read_latest_csv("broken_links_*.csv")
vuln_rows     = read_latest_csv("passive_vuln_*.csv")

# ─── Helpers ─────────────────────────────────────────────────────────────────

def count_issues(rows, col):
    try: return sum(int(r.get(col, 0) or 0) for r in rows)
    except: return 0

def avg_val(rows, col):
    try:
        vals = [float(r[col]) for r in rows if r.get(col)]
        return sum(vals)/len(vals) if vals else 0
    except: return 0

def make_table(rows, title, color, section_id):
    if not rows:
        return f'<div class="section" id="{section_id}"><h2 style="border-left-color:{color}">{title}</h2><p class="empty">No data yet — run the corresponding audit script first.</p></div>'
    headers = list(rows[0].keys())
    rows_html = ""
    for row in rows:
        cells = ""
        for h in headers:
            val = str(row.get(h, ""))
            cell_class = ""
            try:
                fval = float(val)
                if h in ("issues_count","warnings_count","critical_vulns","imgs_no_alt",
                          "buttons_no_label","links_no_href","inputs_no_label",
                          "iframes_no_title","broken_title_attrs","headers_missing",
                          "missing_h1","multiple_h1","missing_lang","no_skip_nav",
                          "scripts_blocking","stylesheets_blocking","images_no_lazy",
                          "images_no_dimensions","vuln_count"):
                    cell_class = "bad" if fval > 5 else ("warn" if fval > 0 else "good")
                elif h == "score":
                    cell_class = "good" if fval >= 80 else ("warn" if fval >= 50 else "bad")
                elif h == "ttfb_ms":
                    cell_class = "good" if fval < 800 else ("warn" if fval < 1500 else "bad")
                elif h in ("gzip","brotli"):
                    cell_class = "good" if val.lower() == "true" else "warn"
            except:
                if h == "grade":
                    cell_class = "good" if val in ("A+","A") else ("warn" if val in ("B","C") else "bad")
            cells += f'<td class="{cell_class}" title="{val}">{val[:90]}</td>'
        rows_html += f"<tr>{cells}</tr>"
    header_html = "".join(f"<th>{h.replace('_',' ').title()}</th>" for h in headers)
    return f"""
<div class="section" id="{section_id}">
  <h2 style="border-left-color:{color}">{title} <span class="badge" style="background:{color}">{len(rows)} pages</span></h2>
  <div class="table-wrap"><table>
    <thead><tr>{header_html}</tr></thead>
    <tbody>{rows_html}</tbody>
  </table></div>
</div>"""

# ─── Compute Metrics for Before/After ────────────────────────────────────────

missing_headers_total = count_issues(security_rows, "headers_missing")
a11y_issues_total     = count_issues(access_rows,   "issues_count")
seo_issues_total      = count_issues(seo_rows,       "issues_count")
content_issues_total  = count_issues(content_rows,  "issues_count")
perf_issues_total     = count_issues(perf_rows,      "issues_count")
broken_total          = len(broken_rows)
passive_vulns_total   = count_issues(vuln_rows,     "vuln_count")

unlabelled_btns       = count_issues(access_rows,   "buttons_no_label")
missing_alt           = count_issues(access_rows,   "imgs_no_alt")
avg_ttfb              = avg_val(perf_rows, "ttfb_ms")
avg_score_a11y        = avg_val(access_rows, "score")
blocking_scripts      = count_issues(perf_rows, "scripts_blocking")
images_no_lazy        = count_issues(perf_rows, "images_no_lazy")

total_issues = (missing_headers_total + a11y_issues_total + seo_issues_total +
                content_issues_total + perf_issues_total + broken_total + passive_vulns_total)

# ─── Before/After Card Builder ────────────────────────────────────────────────

def ba_card(icon, title, before_val, after_val, before_label, after_label, effort, impact, recommendations):
    recs_html = "".join(f"<li>{r}</li>" for r in recommendations)
    effort_color = {"Low":"#3fb950","Medium":"#d29922","High":"#f85149"}.get(effort, "#8b949e")
    impact_color = {"Low":"#8b949e","Medium":"#d29922","High":"#3fb950","Critical":"#f85149"}.get(impact,"#8b949e")
    return f"""
<div class="ba-card">
  <div class="ba-header">
    <span class="ba-icon">{icon}</span>
    <span class="ba-title">{title}</span>
    <span class="ba-effort" style="background:{effort_color}22;color:{effort_color};border-color:{effort_color}">
      Effort: {effort}
    </span>
    <span class="ba-effort" style="background:{impact_color}22;color:{impact_color};border-color:{impact_color}">
      Impact: {impact}
    </span>
  </div>
  <div class="ba-compare">
    <div class="ba-before">
      <div class="ba-label">🔴 BEFORE (Current)</div>
      <div class="ba-value before-val">{before_val}</div>
      <div class="ba-sublabel">{before_label}</div>
    </div>
    <div class="ba-arrow">→</div>
    <div class="ba-after">
      <div class="ba-label">🟢 AFTER (Projected)</div>
      <div class="ba-value after-val">{after_val}</div>
      <div class="ba-sublabel">{after_label}</div>
    </div>
  </div>
  <ul class="ba-recs">{recs_html}</ul>
</div>"""

# ─── Compute Before/After Cards ───────────────────────────────────────────────

ba_cards = []

# 1. Security Headers
ba_cards.append(ba_card(
    "🔒", "Security Headers",
    before_val=f"{missing_headers_total} missing",
    after_val="0 missing",
    before_label=f"across {len(security_rows)} pages — Grade: F on all pages",
    after_label="All critical headers present — Grade: A+",
    effort="Low", impact="Critical",
    recommendations=[
        "Add <code>Content-Security-Policy</code> header via Cloudflare or server config — blocks XSS attacks",
        "Add <code>X-Content-Type-Options: nosniff</code> — prevents MIME-type sniffing",
        "Add <code>Strict-Transport-Security</code> with <code>max-age=31536000; includeSubDomains</code>",
        "Add <code>X-Frame-Options: SAMEORIGIN</code> — prevents clickjacking",
        "Add <code>Referrer-Policy: strict-origin-when-cross-origin</code>",
        "Remove <code>Server: cloudflare</code> and <code>X-Powered-By</code> headers (info disclosure)",
        "Fix CORS wildcard: change <code>Access-Control-Allow-Origin: *</code> to specific domains",
        "<strong>Estimated fix time: 1–2 days</strong> (Cloudflare header rules or Nginx config change)",
    ]
))

# 1.5 Passive Vulnerabilities
ba_cards.append(ba_card(
    "🛡️", "Passive Vulnerability Test",
    before_val=f"{passive_vulns_total} issues",
    after_val="0 issues",
    before_label="CORS misconfigurations, missing SRI, dangerous HTTP methods, and server info leaks",
    after_label="Secure default configurations across APIs and resources",
    effort="Low", impact="Critical",
    recommendations=[
        "Ensure CORS <code>Access-Control-Allow-Origin</code> never reflects exactly the user origin or uses wildcards for sensitive endpoints.",
        "Add <code>integrity</code> hashes to all scripts fetched from third-party domains.",
        "Disable HTTP methods like <code>PUT</code>, <code>DELETE</code>, and <code>TRACE</code> at the server level if unused.",
        "Remove framework headers like <code>X-AspNet-Version</code> to prevent easy server fingerprinting.",
        "<strong>Estimated fix time: 1–2 days</strong> (Server configuration)",
    ]
))

# 2. Accessibility
ba_cards.append(ba_card(
    "♿", "Accessibility (WCAG 2.1)",
    before_val=f"Avg {avg_score_a11y:.0f}/100",
    after_val="Avg 85/100",
    before_label=f"{a11y_issues_total} total issues — {unlabelled_btns} unlabelled buttons, {missing_alt} images missing alt",
    after_label="WCAG 2.1 Level AA compliant — screen-reader friendly",
    effort="Medium", impact="High",
    recommendations=[
        f"Add <code>aria-label</code> to all {unlabelled_btns} buttons that have no visible text (e.g. carousel arrows, close buttons)",
        f"Add descriptive <code>alt</code> text to {missing_alt} images — avoid generic 'image' or filename as alt",
        "Add <code>lang=\"en-IN\"</code> to the <code>&lt;html&gt;</code> tag on all pages",
        "Add a skip-navigation link as first element: <code>&lt;a href='#main' class='skip-link'&gt;Skip to content&lt;/a&gt;</code>",
        "Add <code>title</code> attributes to all iFrames (maps, YouTube embeds, chat widgets)",
        "Fix all form inputs to have matching <code>&lt;label for=&quot;...&quot;&gt;</code> or <code>aria-label</code>",
        "Remove all <code>tabindex &gt; 0</code> — use natural DOM order instead",
        "<strong>Estimated fix time: 3–5 days</strong> (HTML + template changes across CMS)",
    ]
))

# 3. SEO
ba_cards.append(ba_card(
    "🔍", "SEO & Discoverability",
    before_val=f"{seo_issues_total} issues",
    after_val="0 critical issues",
    before_label="Missing meta desc on some pages, duplicate titles, no structured data on key pages",
    after_label="+15–25% organic traffic improvement estimated",
    effort="Low", impact="High",
    recommendations=[
        "Add unique <code>&lt;meta name='description'&gt;</code> (140–160 chars) to every page",
        "Ensure every page has exactly one unique <code>&lt;h1&gt;</code> tag matching the page topic",
        "Add <code>JSON-LD</code> structured data for: Organization, Car model pages (Product schema), FAQ, BreadcrumbList",
        "Fix canonical tags to use absolute URLs matching the page's final URL exactly",
        "Add <code>og:image</code>, <code>og:title</code>, <code>og:description</code> Open Graph tags on all pages for social sharing",
        "Submit updated sitemap.xml to Google Search Console after fixes",
        "Ensure sitemap.xml is referenced in robots.txt — currently missing on some pages",
        "<strong>Estimated fix time: 2–3 days</strong> + CMS template updates",
    ]
))

# 4. Performance
ttfb_projected = max(200, avg_ttfb * 0.45)  # Estimated 55% TTFB improvement
ba_cards.append(ba_card(
    "⚡", "Page Load Performance",
    before_val=f"Avg TTFB: {avg_ttfb:.0f}ms",
    after_val=f"Target TTFB: <{ttfb_projected:.0f}ms",
    before_label=f"{blocking_scripts} render-blocking scripts, {images_no_lazy} images without lazy-load, no Brotli compression",
    after_label="~55% TTFB reduction, Core Web Vitals pass, better mobile ranking",
    effort="High", impact="High",
    recommendations=[
        f"Add <code>async</code> or <code>defer</code> to all {blocking_scripts} render-blocking <code>&lt;script&gt;</code> tags",
        f"Add <code>loading='lazy'</code> to all {images_no_lazy} below-the-fold images",
        "Enable Brotli compression on the CDN/server (currently serving uncompressed or gzip only)",
        "Set <code>Cache-Control: public, max-age=31536000, immutable</code> for all static assets (JS, CSS, images)",
        "Add <code>width</code> and <code>height</code> attributes to all <code>&lt;img&gt;</code> tags to prevent Cumulative Layout Shift (CLS)",
        "Convert large JPEG/PNG hero images to WebP/AVIF format — typically 30–50% smaller",
        "Preload critical fonts and hero images using <code>&lt;link rel='preload'&gt;</code> in <code>&lt;head&gt;</code>",
        "Audit and remove unused third-party scripts (analytics, chat widgets, ad pixels) on pages where not needed",
        "<strong>Estimated fix time: 1–2 sprints</strong> (requires build pipeline + CDN config changes)",
    ]
))

# 5. Content & Typos
ba_cards.append(ba_card(
    "📝", "Content Quality & Typos",
    before_val=f"{content_issues_total} issues",
    after_val="0 issues",
    before_label="Spelling errors, CMS template leaks in title attrs, exposed email addresses, outdated copyright",
    after_label="Clean, professional content — no brand integrity issues",
    effort="Low", impact="Medium",
    recommendations=[
        "Fix <code>title</code> attribute CMS template leaks (e.g. <code>title='&lt;!--ix-index--&gt;'</code>) — replace with proper descriptive text",
        "Install a spell-check step in the CMS publishing pipeline (e.g. Vale linter or Grammarly for Teams)",
        "Replace plain-text email links with <code>&lt;a href='mailto:...'&gt;</code> or a contact form to prevent spam harvesting",
        "Wrap all phone numbers in <code>&lt;a href='tel:+91XXXXXXXXXX'&gt;</code> for one-tap mobile calling",
        "Update copyright footer to <code>© 2026 Hyundai Motor India Limited</code>",
        "Standardise branding: choose either 'Click to Buy' or 'Cl!ck to Buy' and apply consistently site-wide",
        "Remove all developer HTML comments before production builds (use build-time comment stripping)",
        "<strong>Estimated fix time: 1–2 days</strong> (content team + CMS template fix)",
    ]
))

# 6. Broken Links
ba_cards.append(ba_card(
    "🔗", "Broken Links & Redirects",
    before_val=f"{broken_total} broken",
    after_val="0 broken",
    before_label="404 errors and failed resources found by crawler",
    after_label="All links resolve correctly — improved crawlability & UX",
    effort="Low", impact="Medium",
    recommendations=[
        "Review the <code>broken_links_*.csv</code> report and fix or redirect each 404 URL",
        "Set up 301 permanent redirects for any URLs that have moved (don't return 404)",
        "Use a tool like Screaming Frog or Ahrefs monthly to catch new broken links proactively",
        "Audit all external links (social media, partner sites) — these break without warning",
        "Add a custom 404 page with navigation back to home and a search bar",
        "<strong>Estimated fix time: 0.5–1 day</strong> (bulk redirect config)",
    ]
))

ba_section_html = "".join(ba_cards)

# ─── Summary Stats ────────────────────────────────────────────────────────────

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
html_path = os.path.join(script_dir, f"AUDIT_DASHBOARD_{timestamp}.html")

# ─── HTML ─────────────────────────────────────────────────────────────────────

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hyundai India Audit Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{{
  --bg:#0d1117;--surface:#161b22;--surface2:#21262d;--accent:#58a6ff;
  --text:#c9d1d9;--muted:#8b949e;--good:#3fb950;--warn:#d29922;--bad:#f85149;
  --border:#30363d;--radius:8px;
}}
*{{box-sizing:border-box;margin:0;padding:0;}}
body{{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.5;}}

/* ── Header ── */
header{{background:linear-gradient(135deg,#0d47a1 0%,#1565c0 40%,#1976d2 70%,#29b6f6 100%);
  padding:48px 40px;text-align:center;position:relative;overflow:hidden;}}
header::before{{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at top,rgba(255,255,255,0.06) 0%,transparent 70%);}}
header h1{{font-size:2.2rem;font-weight:700;color:#fff;margin-bottom:8px;position:relative;}}
header p{{color:rgba(255,255,255,0.75);font-size:0.95rem;position:relative;}}
.tag{{display:inline-block;background:rgba(255,255,255,0.15);border-radius:20px;
  padding:3px 14px;font-size:0.75rem;margin:4px 3px 0;color:rgba(255,255,255,0.9);}}

/* ── Stats bar ── */
.stats-bar{{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
  background:var(--surface);border-bottom:1px solid var(--border);}}
.stat{{padding:22px 16px;text-align:center;border-right:1px solid var(--border);}}
.stat:last-child{{border-right:none;}}
.stat .num{{font-size:2.5rem;font-weight:700;line-height:1;}}
.stat .lbl{{font-size:0.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:6px;}}
.num.bad{{color:var(--bad);}} .num.warn{{color:var(--warn);}} .num.good{{color:var(--good);}} .num.info{{color:var(--accent);}}

/* ── Nav ── */
nav{{position:sticky;top:0;background:rgba(13,17,23,0.96);backdrop-filter:blur(12px);
  border-bottom:1px solid var(--border);padding:10px 40px;z-index:200;display:flex;gap:6px;flex-wrap:wrap;}}
nav a{{color:var(--muted);text-decoration:none;font-size:0.78rem;padding:6px 14px;
  border-radius:var(--radius);border:1px solid transparent;transition:all 0.2s;white-space:nowrap;}}
nav a:hover{{color:var(--accent);border-color:var(--accent);background:rgba(88,166,255,0.08);}}
nav .nav-sep{{color:var(--border);padding:0 4px;align-self:center;font-size:0.9rem;}}

/* ── Sections ── */
main{{padding:32px 40px;max-width:1800px;margin:0 auto;}}
.section{{background:var(--surface);border:1px solid var(--border);border-radius:12px;
  padding:24px;margin-bottom:24px;}}
.section h2{{font-size:1rem;font-weight:600;margin-bottom:20px;padding-left:14px;
  border-left:4px solid var(--accent);display:flex;align-items:center;gap:10px;flex-wrap:wrap;}}
.badge{{font-size:0.68rem;padding:2px 10px;border-radius:20px;color:#fff;font-weight:500;}}
.empty{{color:var(--muted);font-style:italic;padding:12px 0;}}

/* ── Tables ── */
.table-wrap{{overflow-x:auto;border-radius:var(--radius);border:1px solid var(--border);}}
table{{width:100%;border-collapse:collapse;font-size:0.75rem;}}
th{{background:var(--surface2);color:var(--muted);padding:10px 12px;text-align:left;
  font-weight:500;white-space:nowrap;border-bottom:1px solid var(--border);}}
td{{padding:9px 12px;border-bottom:1px solid rgba(255,255,255,0.04);
  max-width:350px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}
tr:last-child td{{border-bottom:none;}}
tr:hover td{{background:rgba(255,255,255,0.03);}}
td.good{{color:var(--good);font-weight:600;}}
td.warn{{color:var(--warn);font-weight:600;}}
td.bad {{color:var(--bad); font-weight:600;}}

/* ── Before/After Section ── */
.ba-section-title{{
  font-size:1.5rem;font-weight:700;margin:8px 0 24px;
  background:linear-gradient(90deg,#58a6ff,#d29922);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}}
.ba-subtitle{{color:var(--muted);margin-bottom:32px;font-size:0.9rem;}}
.ba-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(480px,1fr));gap:20px;}}
.ba-card{{background:var(--surface);border:1px solid var(--border);border-radius:12px;
  padding:22px;transition:border-color 0.2s;}}
.ba-card:hover{{border-color:rgba(88,166,255,0.4);}}
.ba-header{{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;}}
.ba-icon{{font-size:1.4rem;}}
.ba-title{{font-weight:600;font-size:0.95rem;flex:1;}}
.ba-effort{{font-size:0.68rem;padding:3px 10px;border-radius:20px;border:1px solid;font-weight:500;}}
.ba-compare{{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;
  background:var(--surface2);border-radius:10px;padding:16px;margin-bottom:16px;}}
.ba-before,.ba-after{{text-align:center;}}
.ba-label{{font-size:0.65rem;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:6px;}}
.ba-value{{font-size:1.4rem;font-weight:700;margin-bottom:4px;}}
.before-val{{color:var(--bad);}}
.after-val{{color:var(--good);}}
.ba-sublabel{{font-size:0.7rem;color:var(--muted);line-height:1.4;}}
.ba-arrow{{font-size:1.8rem;color:var(--accent);font-weight:300;}}
.ba-recs{{padding-left:18px;}}
.ba-recs li{{font-size:0.78rem;color:var(--muted);margin-bottom:7px;line-height:1.5;}}
.ba-recs li:last-child{{margin-bottom:0;color:var(--text);font-style:italic;}}
.ba-recs code{{background:rgba(88,166,255,0.12);color:var(--accent);padding:1px 5px;
  border-radius:4px;font-family:monospace;font-size:0.75rem;}}
.ba-recs strong{{color:var(--warn);}}

/* ── Footer ── */
footer{{text-align:center;padding:24px;color:var(--muted);font-size:0.75rem;
  border-top:1px solid var(--border);margin-top:8px;}}

/* ── Tooltip ── */
td[title]:hover::after{{
  content:attr(title);position:fixed;background:#1f2937;color:#e5e7eb;
  padding:6px 10px;border-radius:6px;font-size:0.73rem;z-index:999;
  max-width:350px;word-break:break-all;pointer-events:none;
  border:1px solid var(--border);
}}
</style>
</head>
<body>
<header>
  <h1>🚗 Hyundai India — Website Audit Dashboard</h1>
  <p>Target: <strong>https://www.hyundai.com/in/en</strong></p>
  <span class="tag">🔒 Security</span>
  <span class="tag">♿ Accessibility</span>
  <span class="tag">🔍 SEO</span>
  <span class="tag">⚡ Performance</span>
  <span class="tag">📝 Content</span>
  <span class="tag">🛡️ Vulnerability</span>
  <span class="tag">✨ Before vs After</span>
  <p style="margin-top:14px;font-size:0.8rem;position:relative;">
    Generated: {datetime.now().strftime('%d %B %Y at %I:%M %p')}
  </p>
</header>

<div class="stats-bar">
  <div class="stat"><div class="num bad">{total_issues}</div><div class="lbl">Total Issues Found</div></div>
  <div class="stat"><div class="num bad">{count_issues(content_rows,'critical_vulns')}</div><div class="lbl">Critical Vulns</div></div>
  <div class="stat"><div class="num bad">{broken_total}</div><div class="lbl">Broken Links</div></div>
  <div class="stat"><div class="num warn">{missing_headers_total}</div><div class="lbl">Missing Sec Headers</div></div>
  <div class="stat"><div class="num warn">{unlabelled_btns}</div><div class="lbl">Unlabelled Buttons</div></div>
  <div class="stat"><div class="num warn">{blocking_scripts}</div><div class="lbl">Blocking Scripts</div></div>
  <div class="stat"><div class="num info">{len(perf_rows)}</div><div class="lbl">Pages Tested</div></div>
  <div class="stat"><div class="num {'good' if avg_ttfb < 800 else 'warn' if avg_ttfb < 1500 else 'bad'}">{avg_ttfb:.0f}ms</div><div class="lbl">Avg TTFB</div></div>
</div>

<nav>
  <a href="#before-after">✨ Before vs After</a>
  <span class="nav-sep">|</span>
  <a href="#security">🔒 Security</a>
  <a href="#accessibility">♿ Accessibility</a>
  <a href="#seo">🔍 SEO</a>
  <a href="#content">📝 Content & Vulns</a>
  <a href="#vulnerability">🛡️ Vulnerability</a>
  <a href="#performance">⚡ Performance</a>
  <a href="#broken">🔗 Broken Links</a>
</nav>

<main>

<!-- ══════════════════════════════════════════════════════ -->
<!-- BEFORE vs AFTER SECTION                               -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="section" id="before-after">
  <h2 style="border-left-color:#d29922">✨ Before vs After — Improvement Roadmap</h2>
  <p class="ba-subtitle">
    Based on automated audit data collected on {datetime.now().strftime('%d %B %Y')}.
    Each card shows the <strong style="color:var(--bad)">current broken state</strong> and the
    <strong style="color:var(--good)">projected state after fixes</strong>, ranked by effort vs impact.
    All fixes are passive improvements — no core product changes required.
  </p>
  <div class="ba-grid">
    {ba_section_html}
  </div>
</div>

<!-- ══════════════════════════════════════════════════════ -->
<!-- DATA TABLES                                            -->
<!-- ══════════════════════════════════════════════════════ -->
{make_table(security_rows, "🔒 Security Headers Audit", "#f85149", "security")}
{make_table(access_rows,   "♿ Accessibility Audit (WCAG 2.1)", "#a371f7", "accessibility")}
{make_table(seo_rows,      "🔍 SEO Analysis", "#d29922", "seo")}
{make_table(content_rows,  "📝 Content & Passive Vulnerability Audit", "#f0883e", "content")}
{make_table(vuln_rows,     "🛡️ Passive Vulnerability Audit", "#ff4d4f", "vulnerability")}
{make_table(perf_rows,     "⚡ Performance & Network Audit", "#3fb950", "performance")}
{make_table(broken_rows,   "🔗 Broken Links Report", "#58a6ff", "broken")}

</main>

<footer>
  🚗 Hyundai Autoever Internal QA Report &nbsp;|&nbsp; {datetime.now().year} &nbsp;|&nbsp;
  Do not distribute externally &nbsp;|&nbsp;
  {total_issues} total issues across {len(perf_rows)} pages
</footer>
</body>
</html>"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"✅ Dashboard saved: {html_path}")
print(f"   Open in browser to view the Before vs After comparison section.")
