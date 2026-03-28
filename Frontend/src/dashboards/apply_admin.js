const fs = require('fs');
let code = fs.readFileSync('C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/admin/AdminDashboard.tsx', 'utf8');

code = code.replace(
  \"import { Link } from 'react-router-dom';\",
  \"import { Link } from 'react-router-dom';\nimport { useQuery } from '@tanstack/react-query';\nimport { analyticsService } from '@/services/analyticsService';\"
);

code = code.replace(
  \"export const AdminDashboard: React.FC = () => {\",
  \"export const AdminDashboard: React.FC = () => {\n  const { data: metricsResponse } = useQuery({\n    queryKey: ['adminMetrics'],\n    queryFn: () => analyticsService.getDashboardMetrics(),\n  });\n  const metrics = metricsResponse?.data || { totalCars: 5, totalUsers: 124, totalSales: 342, totalRevenue: 1200000 };\"
);

code = code.replace(
  /<p className=\"text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase\">Total Dealerships<\/p>\s*<h2 className=\"text-3xl font-extrabold font-headline mt-1\">5<\/h2>/g,
  '<p className=\"text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase\">Total Dealerships</p>\n<h2 className=\"text-3xl font-extrabold font-headline mt-1\">{metrics.totalCars || 5}</h2>'
);

code = code.replace(
  /<p className=\"text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase\">Active Users<\/p>\s*<h2 className=\"text-3xl font-extrabold font-headline mt-1\">124<\/h2>/g,
  '<p className=\"text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase\">Active Users</p>\n<h2 className=\"text-3xl font-extrabold font-headline mt-1\">{metrics.totalUsers || 124}</h2>'
);

code = code.replace(
  /<p className=\"text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase\">Total Revenue<\/p>\s*<h2 className=\"text-3xl font-extrabold font-headline mt-1\">\\.2M<\/h2>/g,
  '<p className=\"text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase\">Total Revenue</p>\n<h2 className=\"text-3xl font-extrabold font-headline mt-1\">\M</h2>'
);

fs.writeFileSync('C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/admin/AdminDashboard.tsx', code);
console.log('Admin metrics updated');
