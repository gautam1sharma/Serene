const fs = require('fs');

const htmlPath = 'new frontend/customer_login/code.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const tailwindConfigMatch = html.match(/colors:\s*({[^}]+})/);
let newColors = {};
if (tailwindConfigMatch) {
    try {
        let colorsStr = tailwindConfigMatch[1].replace(/"/g, '"').replace(/'/g, '"');
        newColors = eval('(' + colorsStr + ')');
    } catch(e) { console.error(e); }
}

const tailwindColors = Object.keys(newColors);

let bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : html;

body = body.replace(/class=/g, 'className=');
body = body.replace(/for=/g, 'htmlFor=');
body = body.replace(/<input([^>]+)(?<!\/)>/g, '<input$1/>');
body = body.replace(/<img([^>]+)(?<!\/)>/g, '<img$1/>');
body = body.replace(/<hr([^>]*)(?<!\/)>/g, '<hr$1/>');
body = body.replace(/<br([^>]*)(?<!\/)>/g, '<br$1/>');
body = body.replace(/\bviewbox=/gi, 'viewBox=');
body = body.replace(/<!--(.*?)-->/gs, '{/* $1 */}');

tailwindColors.forEach(color => {
    const regex = new RegExp(`\\b(bg|text|border|ring|shadow|fill|stroke)-${color}\\b`, 'g');
    body = body.replace(regex, `$1-clogin-${color}`);
});

fs.writeFileSync('converted_login_body.tsx', body);

let twConfig = fs.readFileSync('tailwind.config.js', 'utf8');
let appendColors = ',\n        // Customer Login Colors\n';
for (const [key, val] of Object.entries(newColors)) {
    if (typeof val === 'string') {
        appendColors += `        "clogin-${key}": "${val}",\n`;
    }
}
twConfig = twConfig.replace(/"serene-primary":/, appendColors + '        "serene-primary":');
fs.writeFileSync('tailwind.config.js', twConfig);
console.log('Done');
