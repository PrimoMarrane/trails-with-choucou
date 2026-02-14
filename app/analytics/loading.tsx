export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart skeletons */}
        <div className="grid lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
