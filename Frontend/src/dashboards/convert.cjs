const fs = require('fs');

const adminPath = 'C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/admin/AdminDashboard.tsx';
let c = fs.readFileSync(adminPath, 'utf8');

c = c.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link } from 'react-router-dom';\nimport { useQuery } from '@tanstack/react-query';\nimport { analyticsService } from '@/services/analyticsService';"
);

c = c.replace(
  "export const AdminDashboard: React.FC = () => {",
  "export const AdminDashboard: React.FC = () => {\n  const { data: metricsResponse } = useQuery({\n    queryKey: ['adminMetrics'],\n    queryFn: () => analyticsService.getDashboardMetrics(),\n  });\n  const metrics = metricsResponse?.data || { totalCars: 5, totalUsers: 124, totalSales: 342, totalRevenue: 1200000 };"
);

c = c.replace(
  '<h2 className="text-3xl font-extrabold font-headline mt-1">5</h2>',
  '<h2 className="text-3xl font-extrabold font-headline mt-1">{metrics.totalCars || 5}</h2>'
);

c = c.replace(
  '<h2 className="text-3xl font-extrabold font-headline mt-1">124</h2>',
  '<h2 className="text-3xl font-extrabold font-headline mt-1">{metrics.totalUsers || 124}</h2>'
);

c = c.replace(
  '<h2 className="text-3xl font-extrabold font-headline mt-1">\\.2M</h2>',
  '<h2 className="text-3xl font-extrabold font-headline mt-1">\\M</h2>'
);

fs.writeFileSync(adminPath, c);
console.log('Script done');
