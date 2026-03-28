
const fs = require('fs');
const adminPath = 'C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/admin/AdminDashboard.tsx';
let c = fs.readFileSync(adminPath, 'utf8');

c = c.replace(
  '<h2 className=\"text-3xl font-extrabold font-headline mt-1\">2</h2>',
  '<h2 className=\"text-3xl font-extrabold font-headline mt-1\">{metrics.totalUsers || 2}</h2>'
);
c = c.replace(
  '<h2 className=\"text-3xl font-extrabold font-headline mt-1\">342</h2>',
  '<h2 className=\"text-3xl font-extrabold font-headline mt-1\">{metrics.totalSales || 342}</h2>'
);
c = c.replace(
  '<h2 className=\"text-3xl font-extrabold font-headline mt-1\">\M</h2>',
  '<h2 className=\"text-3xl font-extrabold font-headline mt-1\">\M</h2>'
);

fs.writeFileSync(adminPath, c);
console.log('Script done');

