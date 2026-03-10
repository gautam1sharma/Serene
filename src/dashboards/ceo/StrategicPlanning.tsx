import React from 'react';
import { Target, TrendingUp, Users, Building2, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StrategicPlanning: React.FC = () => {
  const goals = [
    { title: 'Increase Sales by 20%', progress: 65, target: '$4.2M', current: '$2.7M' },
    { title: 'Expand to 5 New Locations', progress: 40, target: '5', current: '2' },
    { title: 'Improve Customer Satisfaction', progress: 85, target: '4.8', current: '4.5' },
    { title: 'Reduce Operating Costs', progress: 30, target: '-15%', current: '-5%' }
  ];

  const initiatives = [
    { title: 'Digital Transformation', status: 'In Progress', priority: 'High' },
    { title: 'EV Fleet Expansion', status: 'Planning', priority: 'High' },
    { title: 'Staff Training Program', status: 'Active', priority: 'Medium' },
    { title: 'Customer Loyalty Program', status: 'Planning', priority: 'Medium' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategic Planning</h1>
          <p className="text-gray-600">Company goals and strategic initiatives</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Plus className="w-4 h-4" />
          New Initiative
        </Button>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Annual Goals</h2>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.title}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{goal.title}</span>
                <span className="text-sm text-gray-500">{goal.current} / {goal.target}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{goal.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>

      {/* Initiatives */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Strategic Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initiatives.map((initiative) => (
            <div key={initiative.title} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{initiative.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {initiative.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      initiative.priority === 'High' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {initiative.priority} Priority
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <Target className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-gray-500 text-sm">Goal Achievement</p>
          <p className="text-2xl font-bold text-gray-900">67%</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-gray-500 text-sm">Growth Rate</p>
          <p className="text-2xl font-bold text-gray-900">+18.5%</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <p className="text-gray-500 text-sm">Team Size</p>
          <p className="text-2xl font-bold text-gray-900">142</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <Building2 className="w-8 h-8 text-purple-600 mb-3" />
          <p className="text-gray-500 text-sm">Locations</p>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
      </div>
    </div>
  );
};
