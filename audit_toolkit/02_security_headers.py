"""
=============================================================
  Script 2: HTTP Security Headers Analyser
  02_security_headers.py
=============================================================
  What it checks:
  - Presence of all critical security headers (CSP, HSTS, etc.)
  - Sensitive info leakage in response headers (Server, X-Powered-By)
  - Cookie security flags (HttpOnly, Secure, SameSite)
  - HTTPS enforcement and redirect chains
  - SSL/TLS certificate validity
  - Dangerous HTTP methods (PUT, DELETE, TRACE, OPTIONS)
  - CORS misconfiguration
  - Clickjacking protection
  Outputs: audit_reports/security_headers_report.csv + .txt
=============================================================
"""

import sys, os, csv, socket, ssl, json
from datetime import datetime
from urllib.parse import urlparse

import requests
from colorama import init, Fore, Style

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from audit_toolkit.config import *

init(autoreset=True)

# ─── Security Rating ────────────────────────────────────────────────────────

def grade_header_score(found: int, total: int) -> str:
    pct = found / total * 100
    if pct >= 90: return "A+"
    if pct >= 75: return "A"
    if pct >= 60: return "B"
    if pct >= 45: return "C"
    if pct >= 30: return "D"
    return "F"

# ─── SSL/TLS Inspector ──────────────────────────────────────────────────────

def check_ssl_certificate(hostname: str) -> dict:
    result = {
        "valid": False,
        "expiry_date": None,
        "days_until_expiry": None,
        "issuer": None,
        "subject": None,
        "protocol": None,
        "error": None,
    }
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(10)
            s.connect((hostname, 443))
            cert = s.getpeercert()
            result["protocol"] = s.version()

            # Expiry
            expiry_str = cert["notAfter"]
            expiry_dt  = datetime.strptime(expiry_str, "%b %d %H:%M:%S %Y %Z")
            days_left  = (expiry_dt - datetime.utcnow()).days

            result["valid"]              = True
            result["expiry_date"]        = expiry_dt.strftime("%Y-%m-%d")
            result["days_until_expiry"]  = days_left
            result["issuer"]             = dict(x[0] for x in cert.get("issuer", []))
            result["subject"]            = dict(x[0] for x in cert.get("subject", []))
    except ssl.SSLCertVerificationError as e:
        result["error"] = f"Certificate invalid: {e}"
    except Exception as e:
        result["error"] = str(e)[:120]
    return result

# ─── Header Analysis ────────────────────────────────────────────────────────

def analyse_response_headers(url: str, resp: requests.Response) -> dict:
    headers = {k.lower(): v for k, v in resp.headers.items()}
    findings = {
        "url": url,
        "status_code": resp.status_code,
        "missing_security_headers": [],
        "present_security_headers": [],
        "sensitive_info_exposed": [],
        "cookie_issues": [],
        "cors_issues": [],
        "csp_analysis": None,
        "hsts_analysis": None,
        "raw_headers": dict(resp.headers),
    }

    # ── Check missing/present security headers ────────────────────────────
    for header, description in EXPECTED_SECURITY_HEADERS.items():
        if header.lower() in headers:
            findings["present_security_headers"].append({
                "header": header,
                "value": headers[header.lower()],
                "description": description,
            })
        else:
            findings["missing_security_headers"].append({
                "header": header,
                "description": description,
            })

    # ── Check for sensitive header leakage ────────────────────────────────
    for header in SENSITIVE_HEADERS:
        if header.lower() in headers:
            findings["sensitive_info_exposed"].append({
                "header": header,
                "value": headers[header.lower()],
                "risk": "Server information disclosure - attackers can fingerprint software versions",
            })

    # ── Deep CSP Analysis ─────────────────────────────────────────────────
    csp = headers.get("content-security-policy", "")
    if csp:
        csp_issues = []
        if "unsafe-inline" in csp:
            csp_issues.append("⚠️  'unsafe-inline' allows inline scripts/styles - reduces XSS protection")
        if "unsafe-eval" in csp:
            csp_issues.append("⚠️  'unsafe-eval' allows eval() - risk of code injection")
        if "'*'" in csp or "* " in csp:
            csp_issues.append("⚠️  Wildcard (*) source - too permissive")
        if "http://" in csp:
            csp_issues.append("⚠️  HTTP (non-HTTPS) sources allowed in CSP")
        if not csp_issues:
            csp_issues.append("✅ CSP appears well-configured")
        findings["csp_analysis"] = {"policy": csp[:300], "issues": csp_issues}

    # ── HSTS Analysis ─────────────────────────────────────────────────────
    hsts = headers.get("strict-transport-security", "")
    if hsts:
        hsts_issues = []
        if "max-age" in hsts:
            try:
                max_age = int(hsts.split("max-age=")[1].split(";")[0].split(",")[0].strip())
                if max_age < 31536000:
                    hsts_issues.append(f"⚠️  max-age={max_age} is less than 1 year (recommended: 31536000+)")
                else:
                    hsts_issues.append(f"✅ max-age={max_age} ({max_age//86400} days)")
            except:
                pass
        if "includeSubDomains" not in hsts:
            hsts_issues.append("⚠️  'includeSubDomains' not set - subdomains may be vulnerable")
        if "preload" not in hsts:
            hsts_issues.append("ℹ️  'preload' not set - consider adding site to HSTS preload list")
        findings["hsts_analysis"] = {"value": hsts, "issues": hsts_issues}

    # ── Cookie Security ───────────────────────────────────────────────────
    set_cookie_headers = resp.headers.get("Set-Cookie", "")
    if set_cookie_headers:
        for cookie_line in resp.raw.headers.getlist("Set-Cookie"):
            issues = []
            cookie_name = cookie_line.split("=")[0].strip()
            cl = cookie_line.lower()
            if "httponly" not in cl:
                issues.append("Missing HttpOnly flag (vulnerable to JS theft)")
            if "secure" not in cl:
                issues.append("Missing Secure flag (cookie sent over HTTP)")
            if "samesite" not in cl:
                issues.append("Missing SameSite flag (CSRF risk)")
            if issues:
                findings["cookie_issues"].append({
                    "cookie": cookie_name,
                    "issues": issues,
                })

    # ── CORS Check ────────────────────────────────────────────────────────
    acao = headers.get("access-control-allow-origin", "")
    if acao == "*":
        findings["cors_issues"].append(
            "⚠️  Access-Control-Allow-Origin: * (wildcard) - any origin can read responses"
        )
    elif acao:
        findings["cors_issues"].append(f"ℹ️  CORS allowed for: {acao}")

    return findings

# ─── Dangerous HTTP Methods ──────────────────────────────────────────────────

def check_http_methods(session: requests.Session, url: str) -> dict:
    dangerous  = []
    allowed    = []
    methods    = ["OPTIONS", "PUT", "DELETE", "TRACE", "PATCH", "CONNECT"]
    for method in methods:
        try:
            resp = session.request(method, url, timeout=REQUEST_TIMEOUT)
            if resp.status_code not in (405, 501, 400, 403):
                dangerous.append({"method": method, "status": resp.status_code})
            else:
                allowed.append({"method": method, "status": resp.status_code, "blocked": True})
        except:
            pass
    return {"dangerous": dangerous, "checked": methods}

# ─── HTTP → HTTPS Redirect Check ─────────────────────────────────────────────

def check_https_redirect(session: requests.Session) -> dict:
    http_url = f"http://{TARGET_HOST}"
    try:
        resp = session.get(http_url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        chain = [r.url for r in resp.history] + [resp.url]
        redirects_to_https = resp.url.startswith("https://")
        return {
            "redirects_to_https": redirects_to_https,
            "redirect_chain": chain,
            "final_url": resp.url,
            "status": resp.status_code,
        }
    except Exception as e:
        return {"error": str(e)}

# ─── Main ─────────────────────────────────────────────────────────────────────

def run_security_audit():
    session = requests.Session()
    session.headers.update(HEADERS)
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  🔒  SECURITY HEADERS & VULNERABILITY ANALYSER")
    print(f"{'='*60}{Style.RESET_ALL}\n")

    all_findings = []
    total_missing = 0

    # ── SSL Certificate ───────────────────────────────────────────────────
    print(f"{Fore.YELLOW}[1/5] Checking SSL/TLS Certificate...{Style.RESET_ALL}")
    ssl_result = check_ssl_certificate(TARGET_HOST)
    if ssl_result["valid"]:
        days = ssl_result["days_until_expiry"]
        color = Fore.GREEN if days > 30 else Fore.RED
        print(f"  {Fore.GREEN}✅ SSL Valid{Style.RESET_ALL}")
        print(f"  Protocol  : {ssl_result['protocol']}")
        print(f"  Expiry    : {ssl_result['expiry_date']} ({color}{days} days{Style.RESET_ALL})")
        print(f"  Issuer    : {ssl_result['issuer']}")
        if days < 30:
            print(f"  {Fore.RED}🚨 CRITICAL: Certificate expires in less than 30 days!{Style.RESET_ALL}")
    else:
        print(f"  {Fore.RED}❌ SSL Error: {ssl_result['error']}{Style.RESET_ALL}")

    # ── HTTPS Redirect ─────────────────────────────────────────────────────
    print(f"\n{Fore.YELLOW}[2/5] Checking HTTP → HTTPS redirect...{Style.RESET_ALL}")
    redirect_info = check_https_redirect(session)
    if redirect_info.get("redirects_to_https"):
        chain_str = " → ".join(redirect_info["redirect_chain"])
        print(f"  {Fore.GREEN}✅ HTTP redirects to HTTPS{Style.RESET_ALL}")
        print(f"  Chain: {chain_str[:120]}")
    else:
        print(f"  {Fore.RED}❌ HTTP does NOT redirect to HTTPS!{Style.RESET_ALL}")

    # ── Header Analysis per page ───────────────────────────────────────────
    print(f"\n{Fore.YELLOW}[3/5] Analysing Security Headers across {len(SEED_URLS)} pages...{Style.RESET_ALL}\n")

    report_rows = []
    for url in SEED_URLS:
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            findings = analyse_response_headers(url, resp)
            all_findings.append(findings)

            missing = len(findings["missing_security_headers"])
            present = len(findings["present_security_headers"])
            grade   = grade_header_score(present, len(EXPECTED_SECURITY_HEADERS))
            total_missing += missing

            grade_color = (Fore.GREEN if grade in ("A+","A") else
                           Fore.YELLOW if grade in ("B","C") else Fore.RED)
            print(f"  {grade_color}[{grade}]{Style.RESET_ALL} {url[-65:]}")
            print(f"       Headers: {Fore.GREEN}{present} present{Style.RESET_ALL}, {Fore.RED}{missing} missing{Style.RESET_ALL}")

            for sh in findings["sensitive_info_exposed"]:
                print(f"       {Fore.RED}⚠️  {sh['header']}: {sh['value']}{Style.RESET_ALL}")
            for ci in findings["cookie_issues"]:
                print(f"       {Fore.YELLOW}🍪 Cookie '{ci['cookie']}': {'; '.join(ci['issues'])}{Style.RESET_ALL}")

            report_rows.append({
                "url": url,
                "status": resp.status_code,
                "grade": grade,
                "headers_present": present,
                "headers_missing": missing,
                "missing_list": "; ".join(h["header"] for h in findings["missing_security_headers"]),
                "sensitive_exposed": "; ".join(h["header"] for h in findings["sensitive_info_exposed"]),
                "cookie_issues_count": len(findings["cookie_issues"]),
                "cors_issues": "; ".join(findings["cors_issues"]),
            })

        except Exception as e:
            print(f"  {Fore.RED}❌ Error fetching {url}: {e}{Style.RESET_ALL}")

    # ── HTTP Methods Check ──────────────────────────────────────────────────
    print(f"\n{Fore.YELLOW}[4/5] Checking Dangerous HTTP Methods on homepage...{Style.RESET_ALL}")
    methods_result = check_http_methods(session, BASE_URL)
    if methods_result["dangerous"]:
        for m in methods_result["dangerous"]:
            print(f"  {Fore.RED}🚨 {m['method']} returned {m['status']} (not blocked!){Style.RESET_ALL}")
    else:
        print(f"  {Fore.GREEN}✅ All dangerous HTTP methods are blocked{Style.RESET_ALL}")

    # ── Save Reports ───────────────────────────────────────────────────────
    print(f"\n{Fore.YELLOW}[5/5] Saving reports...{Style.RESET_ALL}")
    csv_path  = os.path.join(output_dir, f"security_headers_{timestamp}.csv")
    json_path = os.path.join(output_dir, f"security_headers_{timestamp}.json")
    txt_path  = os.path.join(output_dir, f"security_report_{timestamp}.txt")

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        if report_rows:
            writer = csv.DictWriter(f, fieldnames=report_rows[0].keys())
            writer.writeheader()
            writer.writerows(report_rows)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "ssl": ssl_result,
            "https_redirect": redirect_info,
            "http_methods": methods_result,
            "page_findings": all_findings,
        }, f, indent=2, ensure_ascii=False, default=str)

    # Generate human-readable text report
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("HYUNDAI INDIA - SECURITY HEADERS AUDIT REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*70 + "\n\n")
        f.write("SSL CERTIFICATE\n" + "-"*40 + "\n")
        for k, v in ssl_result.items():
            f.write(f"  {k}: {v}\n")
        f.write("\nHTTPS REDIRECT\n" + "-"*40 + "\n")
        for k, v in redirect_info.items():
            f.write(f"  {k}: {v}\n")
        f.write("\nSECURITY HEADERS PER PAGE\n" + "-"*40 + "\n")
        for findings in all_findings:
            f.write(f"\nURL: {findings['url']}\n")
            f.write(f"  Missing ({len(findings['missing_security_headers'])}):\n")
            for h in findings['missing_security_headers']:
                f.write(f"    ❌ {h['header']}: {h['description']}\n")
            f.write(f"  Present ({len(findings['present_security_headers'])}):\n")
            for h in findings['present_security_headers']:
                f.write(f"    ✅ {h['header']}: {h['value'][:80]}\n")
            if findings['sensitive_info_exposed']:
                f.write(f"  Sensitive Info Leaked:\n")
                for h in findings['sensitive_info_exposed']:
                    f.write(f"    ⚠️  {h['header']}: {h['value']}\n")
            if findings['cookie_issues']:
                f.write(f"  Cookie Issues:\n")
                for c in findings['cookie_issues']:
                    f.write(f"    🍪 {c['cookie']}: {', '.join(c['issues'])}\n")
            if findings['csp_analysis']:
                f.write(f"  CSP Analysis:\n")
                for issue in findings['csp_analysis']['issues']:
                    f.write(f"    {issue}\n")

    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"  📊  SECURITY AUDIT SUMMARY")
    print(f"{'='*60}{Style.RESET_ALL}")
    print(f"  Pages analysed       : {len(all_findings)}")
    print(f"  Total missing headers: {Fore.RED}{total_missing}{Style.RESET_ALL}")
    avg_missing = total_missing / max(len(all_findings), 1)
    print(f"  Avg missing per page : {Fore.YELLOW}{avg_missing:.1f}{Style.RESET_ALL}")
    print(f"\n  Reports saved:")
    print(f"    • {csv_path}")
    print(f"    • {json_path}")
    print(f"    • {txt_path}")


if __name__ == "__main__":
    run_security_audit()
