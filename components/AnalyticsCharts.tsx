'use client';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AnalyticsData } from '@/lib/data';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6'];

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Trails</p>
          <p className="text-3xl font-bold text-primary-600">
            {data.summary.totalTrails}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Distance</p>
          <p className="text-3xl font-bold text-primary-600">
            {data.summary.totalDistanceKm.toFixed(1)}
            <span className="text-lg ml-1">km</span>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Elevation</p>
          <p className="text-3xl font-bold text-primary-600">
            {data.summary.totalElevationGainM.toFixed(0)}
            <span className="text-lg ml-1">m</span>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Distance</p>
          <p className="text-3xl font-bold text-primary-600">
            {data.summary.avgDistanceKm.toFixed(1)}
            <span className="text-lg ml-1">km</span>
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {data.difficultyDistribution.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Difficulty Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.difficultyDistribution}
                  dataKey="count"
                  nameKey="difficulty"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.difficulty}: ${entry.count}`}
                >
                  {data.difficultyDistribution.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.monthlyStats.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Monthly Trail Count
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" name="Trails" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Distance Chart */}
      {data.monthlyStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Cumulative Distance Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Distance (km)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
