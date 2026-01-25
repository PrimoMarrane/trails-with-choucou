'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  summary: {
    totalTrails: number;
    totalDistanceKm: number;
    totalElevationGainM: number;
    avgDistanceKm: number;
    avgElevationGainM: number;
  };
  difficultyDistribution: {
    difficulty: string;
    count: number;
  }[];
  monthlyStats: {
    month: string;
    count: number;
    distance: number;
  }[];
}

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data.summary.totalTrails === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No trails yet. Upload your first trail to see analytics!</p>
            <Link
              href="/trails/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Upload Trail
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Total Trails</p>
                <p className="text-3xl font-bold text-primary-600">{data.summary.totalTrails}</p>
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
              {/* Difficulty Distribution */}
              {data.difficultyDistribution.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-6">Difficulty Distribution</h2>
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
                        {data.difficultyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Monthly Trail Count */}
              {data.monthlyStats.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-6">Monthly Trail Count</h2>
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
                <h2 className="text-xl font-bold mb-6">Cumulative Distance Over Time</h2>
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
        )}
      </div>
    </div>
  );
}
