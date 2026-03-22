const fs = require('fs');

const components = [
    { file: 'edash_body.temp.jsx', name: 'EmployeeDashboard', out: 'src/dashboards/employee/EmployeeDashboard.tsx' },
    { file: 'einq_body.temp.jsx', name: 'EmployeeInquiries', out: 'src/dashboards/employee/EmployeeInquiries.tsx' },
    { file: 'eassign_body.temp.jsx', name: 'EmployeeAssignment', out: 'src/dashboards/dealer/EmployeeAssignment.tsx' },
    { file: 'eperf_body.temp.jsx', name: 'EmployeePerformance', out: 'src/dashboards/dealer/EmployeePerformance.tsx' }
];

components.forEach(c => {
    let body = fs.readFileSync(c.file, 'utf8');
    body = body.replace(/href="#"/g, 'to="#"');
    body = body.replace(/<a /g, '<Link ');
    body = body.replace(/<\/a>/g, '</Link>');
    body = body.replace(/stroke-width/g, 'strokeWidth');
    body = body.replace(/stroke-linecap/g, 'strokeLinecap');
    body = body.replace(/stroke-linejoin/g, 'strokeLinejoin');
    body = body.replace(/stroke-dasharray/g, 'strokeDasharray');
    body = body.replace(/stroke-dashoffset/g, 'strokeDashoffset');
    body = body.replace(/fill-rule/g, 'fillRule');
    body = body.replace(/clip-rule/g, 'clipRule');
    
    // Add missing import for Link if needed
    const content = `import React from 'react';
import { Link } from 'react-router-dom';

export const ${c.name}: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen">
            ${body}
        </div>
    );
};
`;
    // Create directory if not exists
    const dir = c.out.substring(0, c.out.lastIndexOf('/'));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(c.out, content);
    console.log(`Wrote ${c.out}`);
});
