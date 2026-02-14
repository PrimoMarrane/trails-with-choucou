import Link from 'next/link';
import { fetchAnalytics } from '@/lib/data';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | Trails with Chouchou',
  description: 'Trail statistics, distance totals, and difficulty distribution.',
};

export default async function AnalyticsPage() {
  const data = await fetchAnalytics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
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
            <p className="text-gray-600 mb-4">
              No trails yet. Upload your first trail to see analytics!
            </p>
            <Link
              href="/trails/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Upload Trail
            </Link>
          </div>
        ) : (
          <AnalyticsCharts data={data} />
        )}
      </div>
    </div>
  );
}
