
const fs = require('fs');
const files = [
  'src/dashboards/manager/ManagerDashboard.tsx',
  'src/dashboards/dealer/DealerDashboard.tsx',
  'src/dashboards/employee/EmployeeDashboard.tsx',
];
for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('useQuery')) {
      content = content.replace(\import { Link } from 'react-router-dom';\, 
        \import { Link } from 'react-router-dom';\nimport { useQuery } from '@tanstack/react-query';\nimport { analyticsService } from '@/services/analyticsService';\);
      content = content.replace(/export const \w+: React\.FC = \(\) => {/, 
        \$& \n  const { data: metricsResponse } = useQuery({\n    queryKey: ['dashboardMetrics'],\n    queryFn: () => analyticsService.getDashboardMetrics(),\n  });\n  const metrics = metricsResponse?.data || { totalCars: 12, totalUsers: 40, totalSales: 8, totalRevenue: 50000 };\);
      fs.writeFileSync(file, content);
      console.log('Updated imports and query for ' + file);
    }
  }
}

