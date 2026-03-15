const fs = require('fs');

let oldTsx = fs.readFileSync('src/dashboards/customer/CustomerDashboard.tsx', 'utf8');

// Find where the final return starts
const match = oldTsx.match(/return \(\s*<div className="space-y-8">[\s\S]*?\);\n\};/);
if (!match) {
  console.log("Could not find old return statement!");
  process.exit(1);
}

let newJsx = fs.readFileSync('test.tsx', 'utf8');
let mainContent = newJsx.match(/<main[\s\S]*<\/main>/)[0];

// Dynamic replacements
mainContent = mainContent.replace('Welcome back, John!', 'Welcome back, {user?.firstName}!');

// Change My Orders
mainContent = mainContent.replace(/<h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">My Orders<\/h3>\s*<p className="text-2xl font-semibold">1<\/p>/, '<h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">My Orders</h3>\n          <p className="text-2xl font-semibold">{recentOrders.length}</p>');

// Change Test Drives
mainContent = mainContent.replace(/<h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Test Drives<\/h3>\s*<p className="text-2xl font-semibold">01<\/p>/, '<h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Test Drives</h3>\n          <p className="text-2xl font-semibold">{upcomingTestDrives.length}</p>');

// Change Inquiries
mainContent = mainContent.replace(/<h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Inquiries<\/h3>\s*<p className="text-2xl font-semibold">04<\/p>/, '<h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">Inquiries</h3>\n          <p className="text-2xl font-semibold">{recentInquiries.length}</p>');

// Replace "Saved Cars" with a dynamic feature if needed, or leave it.

// Map feature cars (just taking the first product showcase card and turning it into a map)
// Honestly, a full map right now might break the new HTML because the HTML isn't built for iterating if there's specific layout (e.g., first item big, second item small).
// Let's just swap out the static UI for now, preserving the look so we don't accidentally ruin the user's specific new design.

const replaced = `return (\n${mainContent}\n  );\n};`;

const result = oldTsx.replace(match[0], replaced);

fs.writeFileSync('src/dashboards/customer/CustomerDashboard.tsx', result);
console.log("Successfully applied new dashboard!");
