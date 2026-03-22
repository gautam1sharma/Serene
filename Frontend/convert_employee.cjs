const fs = require('fs');
const path = require('path');

const filesToProcess = [
    { dir: 'employee_dashboard', prefix: 'edash', rawColorPrefix: 'emp-dash', out: 'src/dashboards/employee/EmployeeDashboard.tsx' },
    { dir: 'employee_inquiries', prefix: 'einq', rawColorPrefix: 'emp-inq', out: 'src/dashboards/employee/EmployeeInquiries.tsx' },
    { dir: 'dealer_employeeassignment', prefix: 'eassign', rawColorPrefix: 'dir-assign', out: 'src/dashboards/dealer/EmployeeAssignment.tsx' },
    { dir: 'dealerperformance', prefix: 'eperf', rawColorPrefix: 'dir-perf', out: 'src/dashboards/dealer/EmployeePerformance.tsx' }
];

let allNewColors = {};

for (const file of filesToProcess) {
    const htmlPath = path.join('new frontend', file.dir, 'code.html');
    if (!fs.existsSync(htmlPath)) continue;
    
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Extract colors
    const tailwindConfigMatch = html.match(/colors:\s*({[^}]+})/);
    let newColors = {};
    if (tailwindConfigMatch) {
        try {
            let colorsStr = tailwindConfigMatch[1].replace(/"/g, '"').replace(/'/g, '"');
            newColors = eval('(' + colorsStr + ')');
        } catch(e) { console.error('Error parsing colors for', file.dir, e); }
    }
    
    const tailwindColors = Object.keys(newColors);
    for (const [key, val] of Object.entries(newColors)) {
        if (typeof val === 'string') {
            allNewColors[`${file.prefix}-${key}`] = val;
        }
    }
    
    // Extract body
    let bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let body = bodyMatch ? bodyMatch[1] : html;
    
    // React conversion
    body = body.replace(/class=/g, 'className=');
    body = body.replace(/for=/g, 'htmlFor=');
    body = body.replace(/<input([^>]+)(?<!\/)>/g, '<input$1/>');
    body = body.replace(/<img([^>]+)(?<!\/)>/g, '<img$1/>');
    body = body.replace(/<hr([^>]*)(?<!\/)>/g, '<hr$1/>');
    body = body.replace(/<br([^>]*)(?<!\/)>/g, '<br$1/>');
    body = body.replace(/\bviewbox=/gi, 'viewBox=');
    body = body.replace(/<!--(.*?)-->/gs, '{/* $1 */}');
    body = body.replace(/style="width:\s*([^"]+)"/g, 'style={{ width: \'$1\' }}');
    body = body.replace(/style="font-variation-settings:\s*([^"]+)"/g, 'style={{ fontVariationSettings: `\'FILL\' 1` }}');
    
    // Prefix tailwind colors
    tailwindColors.forEach(color => {
        const regex = new RegExp(`\\b(bg|text|border|ring|shadow|fill|stroke)-${color}\\b`, 'g');
        body = body.replace(regex, `$1-${file.prefix}-${color}`);
    });
    
    // We will save raw body text in temp files for the agent to construct the final React components
    fs.mkdirSync(path.dirname(file.out), { recursive: true });
    fs.writeFileSync(`${file.prefix}_body.temp.jsx`, body);
}

// Update tailwind.config.js
let twConfig = fs.readFileSync('tailwind.config.js', 'utf8');
let appendColors = ',\n        // Employee Module Colors\n';
for (const [key, val] of Object.entries(allNewColors)) {
    appendColors += `        "${key}": "${val}",\n`;
}

// safe inject
if (!twConfig.includes('// Employee Module Colors')) {
    twConfig = twConfig.replace(/"serene-primary":/, appendColors + '        "serene-primary":');
    fs.writeFileSync('tailwind.config.js', twConfig);
    console.log('Updated tailwind with employee colors.');
} else {
    console.log('Tailwind already has employee colors.');
}

console.log('Done converting files to React body chunks.');
