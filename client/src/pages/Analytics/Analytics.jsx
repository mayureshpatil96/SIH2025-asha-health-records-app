import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  ChartBarIcon,
  UsersIcon,
  HeartIcon,
  MapIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { analyticsAPI } from '../../services/api';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedChart, setSelectedChart] = useState('overview');

  // Fetch analytics data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    ['analytics', 'dashboard', selectedPeriod, selectedDistrict],
    () => analyticsAPI.getDashboardAnalytics({
      period: selectedPeriod,
      district: selectedDistrict
    })
  );

  const { data: healthTrends, isLoading: trendsLoading } = useQuery(
    ['analytics', 'health-trends', selectedPeriod],
    () => analyticsAPI.getHealthTrends({ period: selectedPeriod })
  );

  const { data: coverageData, isLoading: coverageLoading } = useQuery(
    ['analytics', 'coverage', selectedDistrict],
    () => analyticsAPI.getCoverageAnalytics({ district: selectedDistrict })
  );

  const { data: performanceData, isLoading: performanceLoading } = useQuery(
    ['analytics', 'performance', selectedPeriod],
    () => analyticsAPI.getPerformanceAnalytics({ period: selectedPeriod })
  );

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const districts = [
    { value: 'all', label: 'All Districts' },
    { value: 'district1', label: 'District 1' },
    { value: 'district2', label: 'District 2' },
    { value: 'district3', label: 'District 3' }
  ];

  const chartTypes = [
    { value: 'overview', label: 'Overview', icon: ChartBarIcon },
    { value: 'health', label: 'Health Trends', icon: HeartIcon },
    { value: 'coverage', label: 'Coverage', icon: MapIcon },
    { value: 'performance', label: 'Performance', icon: ArrowTrendingUpIcon }
  ];

  // Mock data for demonstration
  const mockData = {
    visitsOverTime: [
      { date: '2024-01-01', visits: 120, immunizations: 45, anc: 30, illness: 25 },
      { date: '2024-01-02', visits: 135, immunizations: 50, anc: 35, illness: 30 },
      { date: '2024-01-03', visits: 110, immunizations: 40, anc: 25, illness: 20 },
      { date: '2024-01-04', visits: 145, immunizations: 55, anc: 40, illness: 35 },
      { date: '2024-01-05', visits: 130, immunizations: 48, anc: 32, illness: 28 },
      { date: '2024-01-06', visits: 125, immunizations: 42, anc: 28, illness: 22 },
      { date: '2024-01-07', visits: 140, immunizations: 52, anc: 38, illness: 32 }
    ],
    patientDemographics: [
      { age: '0-5', count: 1250, percentage: 25 },
      { age: '6-18', count: 1000, percentage: 20 },
      { age: '19-45', count: 1750, percentage: 35 },
      { age: '46-60', count: 750, percentage: 15 },
      { age: '60+', count: 250, percentage: 5 }
    ],
    visitTypes: [
      { type: 'Immunization', count: 450, color: '#10B981' },
      { type: 'ANC', count: 320, color: '#F59E0B' },
      { type: 'PNC', count: 280, color: '#EF4444' },
      { type: 'Illness', count: 380, color: '#8B5CF6' },
      { type: 'Follow-up', count: 200, color: '#06B6D4' }
    ],
    coverageByBlock: [
      { block: 'Block A', coverage: 85, visits: 450, population: 12000 },
      { block: 'Block B', coverage: 92, visits: 380, population: 8500 },
      { block: 'Block C', coverage: 78, visits: 520, population: 15000 },
      { block: 'Block D', coverage: 88, visits: 420, population: 11000 },
      { block: 'Block E', coverage: 95, visits: 350, population: 7500 }
    ],
    performanceMetrics: [
      { asha: 'ASHA Worker 1', visits: 45, compliance: 95, satisfaction: 4.2 },
      { asha: 'ASHA Worker 2', visits: 38, compliance: 88, satisfaction: 4.0 },
      { asha: 'ASHA Worker 3', visits: 52, compliance: 92, satisfaction: 4.3 },
      { asha: 'ASHA Worker 4', visits: 41, compliance: 90, satisfaction: 4.1 },
      { asha: 'ASHA Worker 5', visits: 35, compliance: 85, satisfaction: 3.9 }
    ]
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const renderOverviewChart = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">5,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <HeartIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Visits</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,630</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Immunizations</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">450</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">High Risk Cases</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visits Over Time */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Visits Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData.visitsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="immunizations" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="anc" stroke="#F59E0B" strokeWidth={2} />
            <Line type="monotone" dataKey="illness" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Visit Types Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Visit Types Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mockData.visitTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ type, percentage }) => `${type} (${percentage}%)`}
              >
                {mockData.visitTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Patient Demographics
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockData.patientDemographics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderHealthTrendsChart = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Health Trends Analysis
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={mockData.visitsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="immunizations" stackId="1" stroke="#10B981" fill="#10B981" />
            <Area type="monotone" dataKey="anc" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
            <Area type="monotone" dataKey="illness" stackId="1" stroke="#EF4444" fill="#EF4444" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderCoverageChart = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Coverage by Block
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockData.coverageByBlock}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="block" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="coverage" fill="#3B82F6" name="Coverage %" />
            <Bar dataKey="visits" fill="#10B981" name="Total Visits" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.coverageByBlock.map((block, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{block.block}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Coverage:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {block.coverage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Visits:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {block.visits}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Population:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {block.population.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${block.coverage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceChart = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ASHA Worker Performance
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockData.performanceMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="asha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="visits" fill="#3B82F6" name="Visits" />
            <Bar dataKey="compliance" fill="#10B981" name="Compliance %" />
            <Bar dataKey="satisfaction" fill="#F59E0B" name="Satisfaction" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.performanceMetrics.map((worker, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{worker.asha}</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Visits</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {worker.visits}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(worker.visits / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compliance</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {worker.compliance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${worker.compliance}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {worker.satisfaction}/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${(worker.satisfaction / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive health data analytics and insights
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 lg:mt-0">
              {/* Chart Type Selector */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {chartTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedChart(type.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedChart === type.value
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {districts.map((district) => (
                  <option key={district.value} value={district.value}>
                    {district.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          {selectedChart === 'overview' && renderOverviewChart()}
          {selectedChart === 'health' && renderHealthTrendsChart()}
          {selectedChart === 'coverage' && renderCoverageChart()}
          {selectedChart === 'performance' && renderPerformanceChart()}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
