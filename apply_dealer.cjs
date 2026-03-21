const fs = require('fs');
const path = require('path');

const mappings = [
    { html: 'premium_dealership_dashboard/code.html', tsx: 'DealerDashboard.tsx', name: 'DealerDashboard', replaces: [] },
    { html: 'inventory_management/code.html', tsx: 'InventoryManagement.tsx', name: 'InventoryManagement', replaces: [] },
    { html: 'customer_inquiries/code.html', tsx: 'CustomerInquiries.tsx', name: 'CustomerInquiries', replaces: [] },
    { html: 'sales_overview/code.html', tsx: 'SalesProcessing.tsx', name: 'SalesProcessing', replaces: [] },
    { html: 'reports_analytics/code.html', tsx: 'Analytics.tsx', name: 'Analytics', replaces: [] }, // New analytics page
    { 
        html: 'customer_inquiries/code.html', 
        tsx: 'TestDriveSchedule.tsx', 
        name: 'TestDriveSchedule', 
        replaces: [
            {f: 'Inquiries & Leads', t: 'Test Drive Schedule'},
            {f: 'Inquiries', t: 'Appointments'},
            {f: 'leads', t: 'appointments'},
            {f: 'Recent Activity', t: 'Upcoming Drives'},
            {f: 'Select an Inquiry', t: 'Select an Appointment'},
            {f: 'data-icon="leaderboard"', t: 'data-icon="calendar_month"'},
            {f: 'data-icon="chat_bubble"', t: 'data-icon="event"'},
            {f: 'Inquiry Received', t: 'Booking Confirmed'},
            {f: 'Lead Probability', t: 'Arrival Confidence'}
        ] 
    }
];

const sourceDir = path.join('new frontend', 'dealer');
const targetDir = path.join('src', 'dashboards', 'dealer');

function convertHtmlToJsx(html, replaces) {
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
    body = body.replace(/AeroDrive/g, 'Serene');
    body = body.replace(/stroke-width=/g, 'strokeWidth=');
    body = body.replace(/stroke-dasharray=/g, 'strokeDasharray=');
    body = body.replace(/xmlns:xlink=/g, 'xmlnsXlink=');
    body = body.replace(/disabled=""/g, 'disabled');

    // Clean common encoding artifacts (â€”, â€¢, etc.)
    body = body.replace(/â€”|â\x80\x94/g, '&mdash;');
    body = body.replace(/â€¢|â\x80\x92/g, '&bull;');
    body = body.replace(/â€™|â\x80\x99/g, "'");
    body = body.replace(/â€œ|â\x80\x9c/g, '“');
    body = body.replace(/â€\x9d|â\x80\x9d/g, '”');
    body = body.replace(/â€“|â\x80\x93/g, '&ndash;');
    
    // Color mapping to prevent clashes with root app colors
    const tailwindColors = [
        "tertiary-container", "on-surface", "tertiary-fixed-dim", "on-tertiary", "outline",
        "on-tertiary-fixed-variant", "primary", "on-primary-fixed-variant", "on-error",
        "secondary-fixed", "secondary-fixed-dim", "error", "on-secondary-fixed",
        "surface-container-low", "surface-tint", "surface-variant", "surface-container-lowest",
        "on-tertiary-fixed", "primary-fixed-dim", "inverse-primary", "surface-bright",
        "tertiary-dim", "surface-dim", "on-secondary", "surface-container", "tertiary",
        "on-background", "primary-dim", "surface-container-highest", "on-error-container",
        "on-secondary-fixed-variant", "secondary", "primary-container", "outline-variant",
        "on-surface-variant", "surface", "primary-fixed", "inverse-surface", "on-primary-fixed",
        "secondary-container", "on-primary-container", "on-secondary-container", "background",
        "on-primary", "on-tertiary-container", "tertiary-fixed", "error-container",
        "secondary-dim", "surface-container-high", "inverse-on-surface", "error-dim"
    ];

    tailwindColors.forEach(color => {
        const regex = new RegExp(`\\b(bg|text|border|ring|shadow|fill|stroke)-${color}\\b`, 'g');
        body = body.replace(regex, `$1-dealer-${color}`);
    });

    body = body.replace(/style="([^"]+)"/g, (match, p1) => {
        const rules = p1.split(';').filter(r => r.trim()).map(r => {
            let [k, ...vParts] = r.split(':');
            let v = vParts.join(':');
            if(!v) return '';
            k = k.trim().replace(/-([a-z])/g, (_, g) => g.toUpperCase());
            return `${k}: '${v.trim().replace(/'/g, "\\'")}'`;
        }).filter(Boolean);
        return `style={{${rules.join(', ')}}}`;
    });

    body = body.replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, '');
    body = body.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '');
    body = body.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');
    body = body.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');
    body = body.replace(/<div[^>]*className="[^"]*fixed bottom-6 right-6 md:hidden[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    body = body.replace(/<button[^>]*className="[^"]*md:hidden fixed bottom-20[^"]*"[^>]*>[\s\S]*?<\/button>/gi, '');
    body = body.replace(/\b(md:ml-64|min-h-[a-z]+|h-screen|pt-24|mt-16|pb-12)\b/g, '');

    for (const r of replaces) {
        body = body.replace(new RegExp(r.f, 'g'), r.t);
    }

    return body;
}

for (const map of mappings) {
    const htmlPath = path.join(sourceDir, map.html);
    if (fs.existsSync(htmlPath)) {
        const html = fs.readFileSync(htmlPath, 'utf8');
        const jsx = convertHtmlToJsx(html, map.replaces || []);
        const componentStr = `import React from 'react';
import { Link } from 'react-router-dom';

export const ${map.name}: React.FC = () => {
    return (
        <div className="new-dealer-frontend font-sans">
            ${jsx}
        </div>
    );
};
`;
        fs.writeFileSync(path.join(targetDir, map.tsx), componentStr);
        console.log('Converted ' + map.html + ' to ' + map.tsx);
    }
}
