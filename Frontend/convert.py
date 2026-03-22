import re
import sys

def convert_html_to_jsx(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract the body content
    match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL | re.IGNORECASE)
    if match:
        body = match.group(1)
    else:
        body = html

    # Replace class= with className=
    body = re.sub(r'\bclass=', 'className=', body)
    # Replace for= with htmlFor=
    body = re.sub(r'\bfor=', 'htmlFor=', body)
    
    # Close unclosed tags like <input>, <img>, <br>
    body = re.sub(r'<input([^>]+)(?<!/)>', r'<input\1/>', body)
    body = re.sub(r'<img([^>]+)(?<!/)>', r'<img\1/>', body)
    body = re.sub(r'<br([^>]*)(?<!/)>', r'<br\1/>', body)
    body = re.sub(r'<hr([^>]*)(?<!/)>', r'<hr\1/>', body)
    
    # Fix SVG specific stuff if any (e.g., viewBox -> viewBox)
    body = re.sub(r'\bviewbox=', 'viewBox=', body)
    
    # Optional: replace some specific text like "Serene Enterprise Hub" -> "Serene"
    body = body.replace('Serene Enterprise Hub', 'Serene DMS')
    
    # Convert comments
    body = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', body, flags=re.DOTALL)
    
    print(body)

if __name__ == "__main__":
    convert_html_to_jsx(sys.argv[1])
